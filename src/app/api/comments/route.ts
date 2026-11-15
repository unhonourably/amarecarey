import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/comments/mutations";
import { listHomeComments, listNoteComments } from "@/lib/comments/queries";
import { getPublishedNoteBySlug } from "@/lib/notes/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("noteId");
    const home = searchParams.get("home");

    if (home === "1") {
      const comments = await listHomeComments();
      return NextResponse.json({ comments });
    }

    if (noteId) {
      const comments = await listNoteComments(noteId);
      return NextResponse.json({ comments });
    }

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load comments.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const commentBody = typeof body.body === "string" ? body.body : "";
    const anonymous = Boolean(body.anonymous);
    const displayName =
      typeof body.displayName === "string" ? body.displayName : undefined;
    const noteId =
      typeof body.noteId === "string" && body.noteId ? body.noteId : null;
    const slug = typeof body.slug === "string" ? body.slug : undefined;

    let resolvedNoteId = noteId;

    if (!resolvedNoteId && slug) {
      const note = await getPublishedNoteBySlug(slug);
      if (!note) {
        return NextResponse.json({ error: "Note not found." }, { status: 404 });
      }
      resolvedNoteId = note.id;
    }

    const comment = await createComment({
      body: commentBody,
      anonymous,
      displayName,
      noteId: resolvedNoteId,
    });

    revalidatePath("/");
    if (slug) {
      revalidatePath(`/notes/${slug}`);
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to post comment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
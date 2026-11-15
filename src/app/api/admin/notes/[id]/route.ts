import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin/guard";
import {
  deleteNote,
  setPublished,
  updateNote,
} from "@/lib/notes/mutations";
import { getNoteById } from "@/lib/notes/queries";
import type { TipTapDoc } from "@/lib/notes/types";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const note = await getNoteById(params.id);
    if (!note) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }
    return NextResponse.json({ note });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (typeof body.published === "boolean" && Object.keys(body).length === 1) {
      const note = await setPublished(params.id, body.published);
      revalidatePath(`/notes/${note.slug}`);
      return NextResponse.json({ ok: true, note });
    }

    const result = await updateNote(params.id, {
      first_name:
        typeof body.first_name === "string" ? body.first_name : undefined,
      last_name: typeof body.last_name === "string" ? body.last_name : undefined,
      content: body.content as TipTapDoc | undefined,
      published:
        typeof body.published === "boolean" ? body.published : undefined,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 409 });
    }

    revalidatePath(`/notes/${result.note.slug}`);
    if (result.previousSlug) {
      revalidatePath(`/notes/${result.previousSlug}`);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    await deleteNote(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

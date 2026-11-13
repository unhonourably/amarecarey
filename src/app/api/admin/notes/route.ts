import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { createNote } from "@/lib/notes/mutations";
import { getNoteStats, listNotes } from "@/lib/notes/queries";
import type { TipTapDoc } from "@/lib/notes/types";

export async function GET(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const [notes, stats] = await Promise.all([
      listNotes(search),
      getNoteStats(),
    ]);

    return NextResponse.json({ notes, stats });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load notes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const result = await createNote(
      {
        first_name: String(body.first_name ?? ""),
        last_name: String(body.last_name ?? ""),
        content: (body.content as TipTapDoc) ?? {
          type: "doc",
          content: [{ type: "paragraph" }],
        },
        published: Boolean(body.published),
      },
      body.replaceId ? { replaceId: String(body.replaceId) } : undefined
    );

    if (!result.ok) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

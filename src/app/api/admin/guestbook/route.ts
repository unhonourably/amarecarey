import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { deleteGuestbookEntry } from "@/lib/guestbook/mutations";
import { listGuestbookEntries } from "@/lib/guestbook/queries";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth) return auth;

  try {
    const entries = await listGuestbookEntries();
    return NextResponse.json({ entries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load guestbook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    await deleteGuestbookEntry(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete entry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
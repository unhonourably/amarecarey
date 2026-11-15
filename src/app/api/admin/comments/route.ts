import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { listCommentsForAdmin } from "@/lib/comments/queries";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const comments = await listCommentsForAdmin();
    return NextResponse.json({ comments });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load messages.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
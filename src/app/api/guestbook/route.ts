import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createGuestbookEntry } from "@/lib/guestbook/mutations";
import { listGuestbookEntries } from "@/lib/guestbook/queries";

export async function GET() {
  try {
    const entries = await listGuestbookEntries();
    return NextResponse.json({ entries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load guestbook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature =
      typeof body.signature === "string" ? body.signature : "";
    const message = typeof body.body === "string" ? body.body : "";
    const anonymous = Boolean(body.anonymous);

    const entry = await createGuestbookEntry({
      signature,
      body: message,
      anonymous,
    });

    revalidatePath("/guestbook");
    revalidatePath("/");

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sign guestbook.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
import { NextResponse } from "next/server";
import { createAmaQuestion } from "@/lib/ama/mutations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = typeof body.question === "string" ? body.question : "";
    const contactEmail =
      typeof body.contactEmail === "string" ? body.contactEmail : undefined;
    const contactPhone =
      typeof body.contactPhone === "string" ? body.contactPhone : undefined;
    const contactHandle =
      typeof body.contactHandle === "string" ? body.contactHandle : undefined;
    const anonymous = Boolean(body.anonymous);
    const displayName =
      typeof body.displayName === "string" ? body.displayName : undefined;

    const created = await createAmaQuestion({
      question,
      anonymous,
      displayName,
      contactEmail,
      contactPhone,
      contactHandle,
    });

    return NextResponse.json({ question: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send question.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
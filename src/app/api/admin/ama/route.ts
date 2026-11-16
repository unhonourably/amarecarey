import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { listAmaQuestions } from "@/lib/ama/queries";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth) return auth;

  try {
    const questions = await listAmaQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load questions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
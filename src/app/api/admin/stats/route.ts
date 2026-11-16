import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/guard";
import { getAmaQuestionCount } from "@/lib/ama/queries";
import { getGuestbookCount } from "@/lib/guestbook/queries";
import { getUniqueVisitorCount } from "@/lib/visitors/queries";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth) return auth;

  const supabase = createServiceClient();

  async function safeCount(
    loader: () => Promise<number>
  ): Promise<{ value: number; error: string | null }> {
    try {
      return { value: await loader(), error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unavailable";
      return { value: 0, error: message };
    }
  }

  const [visitors, guestbook, ama, messagesResult] = await Promise.all([
    safeCount(getUniqueVisitorCount),
    safeCount(getGuestbookCount),
    safeCount(getAmaQuestionCount),
    supabase.from("comments").select("*", { count: "exact", head: true }),
  ]);

  const messageCount = messagesResult.error ? 0 : messagesResult.count ?? 0;
  const errors = [visitors.error, guestbook.error, ama.error].filter(Boolean);

  return NextResponse.json({
    visitors: visitors.value,
    guestbook: guestbook.value,
    ama: ama.value,
    messages: messageCount,
    statsWarning:
      errors.length > 0
        ? "Some stats failed to load. Run migration 005 in Supabase if tables are missing."
        : null,
  });
}
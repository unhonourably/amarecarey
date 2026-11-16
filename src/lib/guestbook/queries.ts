import { createServiceClient } from "@/lib/supabase/server";
import type { GuestbookEntry } from "./types";

const PUBLIC_LIMIT = 200;

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(PUBLIC_LIMIT);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as GuestbookEntry[];
}

export async function getGuestbookCount(): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("guestbook_entries")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}
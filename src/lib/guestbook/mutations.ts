import { createServiceClient } from "@/lib/supabase/server";
import type { GuestbookEntry, GuestbookInput } from "./types";

const MAX_BODY = 1200;
const MAX_SIGNATURE = 80;

export async function createGuestbookEntry(
  input: GuestbookInput
): Promise<GuestbookEntry> {
  const signature = input.signature.trim();
  const body = input.body.trim();

  if (!signature) {
    throw new Error("Signature is required.");
  }
  if (signature.length > MAX_SIGNATURE) {
    throw new Error("Signature is too long.");
  }
  if (body.length > MAX_BODY) {
    throw new Error("Message is too long.");
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guestbook_entries")
    .insert({ signature, body })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as GuestbookEntry;
}

export async function deleteGuestbookEntry(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("guestbook_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
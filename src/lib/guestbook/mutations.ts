import { createServiceClient } from "@/lib/supabase/server";
import type { GuestbookEntry, GuestbookInput } from "./types";

const MAX_BODY = 1200;
const MAX_SIGNATURE = 80;

export async function createGuestbookEntry(
  input: GuestbookInput
): Promise<GuestbookEntry> {
  const anonymous = Boolean(input.anonymous);
  const body = input.body.trim();
  let signature = input.signature.trim();

  if (!anonymous) {
    if (!signature) {
      throw new Error("Signature is required unless you stay anonymous.");
    }
    if (signature.length > MAX_SIGNATURE) {
      throw new Error("Signature is too long.");
    }
  } else {
    signature = "";
  }
  if (body.length > MAX_BODY) {
    throw new Error("Message is too long.");
  }

  const supabase = createServiceClient();
  let anonymous_number: number | null = null;

  if (anonymous) {
    const { data: maxRow, error: maxError } = await supabase
      .from("guestbook_entries")
      .select("anonymous_number")
      .eq("is_anonymous", true)
      .order("anonymous_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxError) {
      throw new Error(maxError.message);
    }

    const currentMax =
      typeof maxRow?.anonymous_number === "number"
        ? maxRow.anonymous_number
        : 0;
    anonymous_number = currentMax + 1;
  }

  const { data, error } = await supabase
    .from("guestbook_entries")
    .insert({ signature, body, is_anonymous: anonymous, anonymous_number })
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
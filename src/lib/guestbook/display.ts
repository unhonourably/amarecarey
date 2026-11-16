import type { GuestbookEntry } from "./types";

export function guestbookDisplayName(entry: GuestbookEntry): string {
  if (!entry.is_anonymous) {
    return entry.signature;
  }
  if (entry.anonymous_number && entry.anonymous_number > 0) {
    return `Anonymous ${entry.anonymous_number}`;
  }
  return "Anonymous";
}
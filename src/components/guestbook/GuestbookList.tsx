import { formatDateCentral } from "@/lib/utils";
import type { GuestbookEntry } from "@/lib/guestbook/types";

type GuestbookListProps = {
  entries: GuestbookEntry[];
};

export function GuestbookList({ entries }: GuestbookListProps) {
  if (!entries.length) {
    return (
      <div className="border border-ink-600 px-5 py-12 text-center text-sm text-ink-400">
        No signatures yet. Be the first.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink-600 border border-ink-600">
      {entries.map((entry) => (
        <li key={entry.id} className="px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-display text-lg tracking-tight text-ink-50">
              {entry.signature}
            </p>
            <time
              dateTime={entry.created_at}
              className="text-[0.65rem] tracking-[0.1em] uppercase text-ink-500"
            >
              {formatDateCentral(entry.created_at)}
            </time>
          </div>
          {entry.body.trim() && (
            <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-relaxed text-ink-200">
              {entry.body}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
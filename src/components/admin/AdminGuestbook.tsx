"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GuestbookEntry } from "@/lib/guestbook/types";
import { formatDateCentral } from "@/lib/utils";

export function AdminGuestbook() {
  const router = useRouter();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/guestbook");
      const data = await response.json();
      if (response.status === 401) {
        router.replace("/canes/login");
        return;
      }
      if (!response.ok) {
        setError(data.error || "Failed to load guestbook.");
        return;
      }
      setEntries(data.entries ?? []);
    } catch {
      setError("Failed to load guestbook.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: string) {
    if (!window.confirm("Remove this guestbook entry?")) return;
    setBusyId(id);
    try {
      const response = await fetch(
        `/api/admin/guestbook?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete.");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div>
        <Link
          href="/canes"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200"
        >
          ← Dashboard
        </Link>
        <p className="section-label mt-4 sm:mt-6">Public</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
          Guestbook
        </h1>
      </div>

      {error && <p className="text-sm text-red-300/90">{error}</p>}

      {loading ? (
        <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
          Loading...
        </div>
      ) : entries.length === 0 ? (
        <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
          No entries yet.
        </div>
      ) : (
        <ul className="divide-y divide-ink-600 border border-ink-600">
          {entries.map((entry) => (
            <li key={entry.id} className="px-4 py-5 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-ink-50">
                    {entry.is_anonymous ? "Anonymous" : entry.signature}
                  </p>
                  <time
                    dateTime={entry.created_at}
                    className="mt-1 block text-xs text-ink-500"
                  >
                    {formatDateCentral(entry.created_at)}
                  </time>
                  {entry.body.trim() && (
                    <p className="mt-3 break-words whitespace-pre-wrap text-sm text-ink-200">
                      {entry.body}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busyId === entry.id}
                  onClick={() => onDelete(entry.id)}
                  className="admin-action shrink-0 text-xs text-red-300/80 hover:border-red-300/40"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
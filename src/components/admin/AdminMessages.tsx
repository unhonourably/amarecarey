"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminComment } from "@/lib/comments/types";
import { formatDateCentral } from "@/lib/utils";

type Filter = "all" | "home" | string;

export function AdminMessages() {
  const router = useRouter();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/comments");
      const data = await response.json();
      if (response.status === 401) {
        router.replace("/canes/login");
        return;
      }
      if (!response.ok) {
        setError(data.error || "Failed to load messages.");
        return;
      }
      setComments(data.comments ?? []);
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const noteOptions = useMemo(() => {
    const map = new Map<string, AdminComment>();
    for (const comment of comments) {
      if (!comment.note_id) continue;
      if (!map.has(comment.note_id)) {
        map.set(comment.note_id, comment);
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const aName = `${a.note_first_name ?? ""} ${a.note_last_name ?? ""}`;
      const bName = `${b.note_first_name ?? ""} ${b.note_last_name ?? ""}`;
      return aName.localeCompare(bName);
    });
  }, [comments]);

  const filtered = useMemo(() => {
    if (filter === "all") return comments;
    if (filter === "home") return comments.filter((item) => !item.note_id);
    return comments.filter((item) => item.note_id === filter);
  }, [comments, filter]);

  const homeCount = comments.filter((item) => !item.note_id).length;
  const noteCount = comments.length - homeCount;

  function locationLabel(comment: AdminComment) {
    if (!comment.note_id) {
      return "Home page";
    }
    if (comment.note_first_name && comment.note_last_name) {
      return `${comment.note_first_name} ${comment.note_last_name}`;
    }
    if (comment.note_slug) {
      return `/notes/${comment.note_slug}`;
    }
    return "Note";
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/canes"
            className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200 active:text-ink-100"
          >
            ← Notes
          </Link>
          <p className="section-label mt-4 sm:mt-6">Inbox</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
            Visitor messages
          </h1>
          <p className="mt-3 text-sm text-ink-300">
            Home: {homeCount} · On notes: {noteCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[12rem] flex-1">
          <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-400">
            Show
          </span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as Filter)}
            className="admin-control"
          >
            <option value="all">All ({comments.length})</option>
            <option value="home">Home page ({homeCount})</option>
            {noteOptions.map((item) => (
              <option key={item.note_id!} value={item.note_id!}>
                {locationLabel(item)}
                {item.note_slug ? ` · /notes/${item.note_slug}` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-red-300/90">{error}</p>}

      {loading ? (
        <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
          No messages for this filter.
        </div>
      ) : (
        <ul className="divide-y divide-ink-600 border border-ink-600">
          {filtered.map((comment) => (
            <li key={comment.id} className="px-4 py-5 sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-3">
                <div>
                  <p className="text-ink-50">
                    {comment.is_anonymous
                      ? "Anonymous"
                      : comment.display_name || "Anonymous"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-400">
                    {locationLabel(comment)}
                    {comment.note_slug && (
                      <span className="normal-case tracking-normal text-ink-500">
                        {" "}
                        · /notes/{comment.note_slug}
                      </span>
                    )}
                  </p>
                </div>
                <time
                  dateTime={comment.created_at}
                  className="text-xs text-ink-500"
                >
                  {formatDateCentral(comment.created_at)}
                </time>
              </div>
              <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-relaxed text-ink-200">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
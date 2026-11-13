"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotesList } from "@/components/admin/NotesList";
import type { NoteStats, PersonalNoteSummary } from "@/lib/notes/types";

export function AdminDashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<PersonalNoteSummary[]>([]);
  const [stats, setStats] = useState<NoteStats>({
    total: 0,
    published: 0,
    drafts: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (term?: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = term?.trim()
        ? `?search=${encodeURIComponent(term.trim())}`
        : "";
      const response = await fetch(`/api/admin/notes${query}`);
      const data = await response.json();
      if (response.status === 401) {
        router.replace("/canes/login");
        return;
      }
      if (!response.ok) {
        setError(data.error || "Failed to load notes.");
        return;
      }
      setNotes(data.notes ?? []);
      setStats(data.stats ?? { total: 0, published: 0, drafts: 0 });
    } catch {
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      load(search);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [search, load]);

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/canes/login");
    router.refresh();
  }

  async function onTogglePublish(id: string, published: boolean) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to update note.");
        return;
      }
      await load(search);
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: string) {
    const confirmed = window.confirm("Delete this note permanently?");
    if (!confirmed) return;

    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete note.");
        return;
      }
      await load(search);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-ink-50">
            Personal notes
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ink-300">
            Create, edit, publish, and manage private messages. This route is intentionally unlisted.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center border border-ink-600 px-4 py-2.5 text-sm text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
          >
            Lock
          </button>
          <Link
            href="/canes/new"
            className="inline-flex items-center justify-center border border-ink-50 bg-ink-50 px-4 py-2.5 text-sm text-canvas transition-opacity hover:opacity-90"
          >
            Create note
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Published", value: stats.published },
          { label: "Drafts", value: stats.drafts },
        ].map((item) => (
          <div key={item.label} className="border border-ink-600 px-5 py-5">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-400">
              {item.label}
            </p>
            <p className="mt-3 font-display text-3xl text-ink-50">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <label className="block max-w-md">
          <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-400">
            Search
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or slug"
            className="w-full border border-ink-600 bg-ink-800 px-4 py-3 text-ink-50 placeholder:text-ink-400"
          />
        </label>

        {error && <p className="text-sm text-red-300/90">{error}</p>}
        {loading ? (
          <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
            Loading notes...
          </div>
        ) : (
          <NotesList
            notes={notes}
            onTogglePublish={onTogglePublish}
            onDelete={onDelete}
            busyId={busyId}
          />
        )}
      </div>
    </div>
  );
}

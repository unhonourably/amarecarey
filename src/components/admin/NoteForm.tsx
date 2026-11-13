"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { createSlug } from "@/lib/utils";
import type { PersonalNote, TipTapDoc } from "@/lib/notes/types";

type NoteFormProps = {
  note?: PersonalNote;
};

const emptyDoc: TipTapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function NoteForm({ note }: NoteFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(note?.first_name ?? "");
  const [lastName, setLastName] = useState(note?.last_name ?? "");
  const [content, setContent] = useState<TipTapDoc>(note?.content ?? emptyDoc);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conflictId, setConflictId] = useState<string | null>(null);

  const slugPreview = useMemo(
    () => createSlug(firstName, lastName) || "first-last",
    [firstName, lastName]
  );

  async function save(published: boolean, replaceId?: string) {
    setSaving(true);
    setError(null);
    setStatus(null);

    try {
      const isEdit = Boolean(note?.id) && !replaceId;
      const endpoint = isEdit
        ? `/api/admin/notes/${note!.id}`
        : "/api/admin/notes";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          content,
          published,
          replaceId,
        }),
      });

      const data = await response.json();

      if (response.status === 409 && data.conflict && data.existing) {
        setConflictId(data.existing.id);
        setError(data.message);
        return;
      }

      if (!response.ok) {
        setError(data.error || "Unable to save note.");
        return;
      }

      setStatus(published ? "Published." : "Saved as draft.");
      setConflictId(null);

      const savedId = data.note?.id as string | undefined;
      if (savedId && savedId !== note?.id) {
        router.push(`/canes/${savedId}`);
        router.refresh();
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to save note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-400">
            First name
          </span>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full border border-ink-600 bg-ink-800 px-4 py-3 text-ink-50"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-400">
            Last name
          </span>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="w-full border border-ink-600 bg-ink-800 px-4 py-3 text-ink-50"
          />
        </label>
      </div>

      <p className="text-sm text-ink-400">
        Slug preview: <span className="text-ink-200">/notes/{slugPreview}</span>
      </p>

      <NoteEditor initialContent={note?.content ?? emptyDoc} onChange={setContent} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => save(false)}
          className="border border-ink-600 px-4 py-2.5 text-sm text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50 disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => save(true)}
          className="border border-ink-50 bg-ink-50 px-4 py-2.5 text-sm text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Publish
        </button>
        {conflictId && (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => router.push(`/canes/${conflictId}`)}
              className="border border-ink-600 px-4 py-2.5 text-sm text-ink-200"
            >
              Edit existing
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(true, conflictId)}
              className="border border-accent/40 px-4 py-2.5 text-sm text-accent"
            >
              Replace existing
            </button>
          </>
        )}
      </div>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {error && <p className="text-sm text-red-300/90">{error}</p>}
        {status && !error && <p className="text-sm text-ink-300">{status}</p>}
      </div>
    </div>
  );
}

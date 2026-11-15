"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  NoteEditor,
  type NoteEditorHandle,
} from "@/components/notes/NoteEditor";
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
  const editorRef = useRef<NoteEditorHandle>(null);
  const [firstName, setFirstName] = useState(note?.first_name ?? "");
  const [lastName, setLastName] = useState(note?.last_name ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conflictId, setConflictId] = useState<string | null>(null);

  const isPublished = note?.published ?? false;

  const slugPreview = useMemo(
    () => createSlug(firstName, lastName) || "first-last",
    [firstName, lastName]
  );

  async function save(
    options?: { published?: boolean; replaceId?: string }
  ) {
    setSaving(true);
    setError(null);
    setStatus(null);

    const content = editorRef.current?.getContent() ?? emptyDoc;
    const published =
      options?.published !== undefined
        ? options.published
        : note?.published ?? false;

    try {
      const isEdit = Boolean(note?.id) && !options?.replaceId;
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
          replaceId: options?.replaceId,
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

      if (published) {
        setStatus("Published and saved.");
      } else if (isEdit && note?.published && published === false) {
        setStatus("Saved. Note is now unpublished.");
      } else if (isEdit) {
        setStatus("Changes saved.");
      } else {
        setStatus("Saved as draft.");
      }
      setConflictId(null);

      const savedId = data.note?.id as string | undefined;
      const savedSlug = data.note?.slug as string | undefined;

      if (savedId && savedId !== note?.id) {
        router.push(`/canes/${savedId}`);
        router.refresh();
        return;
      }

      if (savedSlug && isEdit && savedSlug !== note?.slug) {
        setStatus(`Saved. Public URL is now /notes/${savedSlug}`);
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
            autoComplete="given-name"
            enterKeyHint="next"
            className="admin-control"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-400">
            Last name
          </span>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
            enterKeyHint="done"
            className="admin-control"
          />
        </label>
      </div>

      <p className="text-sm text-ink-400">
        Slug preview: <span className="text-ink-200">/notes/{slugPreview}</span>
        {isPublished && note?.slug && slugPreview !== note.slug && (
          <span className="mt-1 block text-amber-200/80">
            Saving will move this note from /notes/{note.slug}
          </span>
        )}
      </p>

      <NoteEditor
        ref={editorRef}
        editorKey={note?.id ?? "new"}
        initialContent={note?.content ?? emptyDoc}
      />

      <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-10 -mx-4 flex flex-col gap-2 border border-ink-600 bg-canvas/95 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button
          type="button"
          disabled={saving}
          onClick={() => save()}
          className="admin-action w-full sm:w-auto"
        >
          Save changes
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ published: true })}
          className="admin-action w-full border-ink-50 bg-ink-50 text-canvas hover:border-ink-50 hover:text-canvas sm:w-auto"
        >
          {isPublished ? "Save & keep published" : "Publish"}
        </button>
        {isPublished && (
          <button
            type="button"
            disabled={saving}
            onClick={() => save({ published: false })}
            className="admin-action w-full text-ink-400 hover:text-ink-300 sm:w-auto"
          >
            Unpublish
          </button>
        )}
        {conflictId && (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => router.push(`/canes/${conflictId}`)}
              className="admin-action w-full sm:w-auto"
            >
              Edit existing
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save({ published: true, replaceId: conflictId })}
              className="admin-action w-full border-accent/40 text-accent sm:w-auto"
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
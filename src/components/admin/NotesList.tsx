"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PersonalNoteSummary } from "@/lib/notes/types";

type NotesListProps = {
  notes: PersonalNoteSummary[];
  onTogglePublish: (id: string, published: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  busyId?: string | null;
};

export function NotesList({
  notes,
  onTogglePublish,
  onDelete,
  busyId,
}: NotesListProps) {
  if (!notes.length) {
    return (
      <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
        No notes yet. Create your first personal message.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink-600 border border-ink-600">
      {notes.map((note) => (
        <li
          key={note.id}
          className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-ink-50">
                {note.first_name} {note.last_name}
              </p>
              <span
                className={
                  note.published
                    ? "text-xs uppercase tracking-[0.14em] text-accent"
                    : "text-xs uppercase tracking-[0.14em] text-ink-400"
                }
              >
                {note.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mt-1 break-all text-sm text-ink-400">/{note.slug}</p>
            <p className="mt-2 text-xs text-ink-400">
              Created {formatDate(note.created_at)} · Updated{" "}
              {formatDate(note.updated_at)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Link href={`/canes/${note.id}`} className="admin-action text-xs">
              Edit
            </Link>
            <button
              type="button"
              disabled={busyId === note.id}
              onClick={() => onTogglePublish(note.id, !note.published)}
              className="admin-action text-xs"
            >
              {note.published ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              disabled={busyId === note.id}
              onClick={() => onDelete(note.id)}
              className="admin-action text-xs text-red-300/80 hover:border-red-300/40 hover:text-red-200"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

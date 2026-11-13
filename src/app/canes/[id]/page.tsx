import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteForm } from "@/components/admin/NoteForm";
import { requireAdminPage } from "@/lib/admin/guard";
import { getNoteById } from "@/lib/notes/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit note",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: { id: string };
};

export default async function EditNotePage({ params }: PageProps) {
  await requireAdminPage();

  let note = null;

  try {
    note = await getNoteById(params.id);
  } catch {
    notFound();
  }

  if (!note) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 sm:py-16">
      <div className="section-shell max-w-3xl">
        <Link
          href="/canes"
          className="text-sm text-ink-400 transition-colors hover:text-ink-200"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight text-ink-50">
          Edit note
        </h1>
        <p className="mt-3 text-sm text-ink-400">
          {note.first_name} {note.last_name} · /notes/{note.slug}
        </p>
        <div className="mt-10">
          <NoteForm note={note} />
        </div>
      </div>
    </main>
  );
}

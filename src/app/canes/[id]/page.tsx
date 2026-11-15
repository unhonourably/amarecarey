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
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden py-6 safe-x safe-t safe-b sm:py-16">
      <div className="section-shell max-w-3xl">
        <Link
          href="/canes"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200 active:text-ink-100"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:mt-6 sm:text-4xl">
          Edit note
        </h1>
        <p className="mt-3 break-all text-sm text-ink-400">
          {note.first_name} {note.last_name} · /notes/{note.slug}
        </p>
        <div className="mt-10">
          <NoteForm note={note} />
        </div>
      </div>
    </main>
  );
}

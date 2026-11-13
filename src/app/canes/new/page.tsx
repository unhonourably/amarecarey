import Link from "next/link";
import { NoteForm } from "@/components/admin/NoteForm";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata = {
  title: "New note",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewNotePage() {
  await requireAdminPage();

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
          New note
        </h1>
        <div className="mt-10">
          <NoteForm />
        </div>
      </div>
    </main>
  );
}

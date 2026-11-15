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
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden py-6 safe-x safe-t safe-b sm:py-16">
      <div className="section-shell max-w-3xl">
        <Link
          href="/canes"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200 active:text-ink-100"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:mt-6 sm:text-4xl">
          New note
        </h1>
        <div className="mt-10">
          <NoteForm />
        </div>
      </div>
    </main>
  );
}

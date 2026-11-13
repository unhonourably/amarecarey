import Link from "next/link";

export default function NoteNotFound() {
  return (
    <main className="section-shell flex min-h-[100dvh] min-h-screen flex-col items-start justify-center safe-x safe-t safe-b">
      <p className="section-label">Note</p>
      <h1 className="mt-4 font-display text-3xl text-ink-50 sm:text-4xl">Nothing here.</h1>
      <p className="mt-4 max-w-md text-sm text-ink-300 sm:text-base">
        This note doesn&apos;t exist or isn&apos;t available.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center text-sm text-ink-200 transition-colors hover:text-accent active:text-ink-50"
      >
        ← Return home
      </Link>
    </main>
  );
}

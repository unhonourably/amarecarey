import Link from "next/link";
import { GuestbookForm } from "@/components/guestbook/GuestbookForm";
import { GuestbookList } from "@/components/guestbook/GuestbookList";
import { listGuestbookEntries } from "@/lib/guestbook/queries";
import type { GuestbookEntry } from "@/lib/guestbook/types";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Guestbook",
  description: "Sign the guestbook.",
};

export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
  let entries: GuestbookEntry[] = [];
  try {
    entries = await listGuestbookEntries();
  } catch {}

  return (
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden safe-t safe-x safe-b pb-[max(5.75rem,env(safe-area-inset-bottom))] sm:pb-10">
      <div className="section-shell max-w-2xl py-6 sm:py-12">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200"
        >
          ← {siteConfig.shortName}
        </Link>
        <p className="section-label mt-6">Public</p>
        <h1 className="mt-3 font-display text-[1.65rem] leading-tight tracking-tight text-ink-50 sm:text-4xl">
          Guestbook
        </h1>
        <div className="mt-10 space-y-10">
          <GuestbookForm />
          <GuestbookList entries={entries} />
        </div>
      </div>
    </main>
  );
}
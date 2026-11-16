import Link from "next/link";
import { AskForm } from "@/components/ama/AskForm";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Ask me anything",
  description: "Send a question.",
};

export default function AskPage() {
  return (
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden safe-t safe-x safe-b pb-[max(5.75rem,env(safe-area-inset-bottom))] sm:pb-10">
      <div className="section-shell max-w-xl py-6 sm:py-12">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200"
        >
          ← {siteConfig.shortName}
        </Link>
        <p className="section-label mt-6">Private</p>
        <h1 className="mt-3 font-display text-[1.65rem] leading-tight tracking-tight text-ink-50 sm:text-4xl">
          Ask me anything
        </h1>
        <div className="mt-10">
          <AskForm />
        </div>
      </div>
    </main>
  );
}
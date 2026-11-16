"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function NoteLookup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const first = firstName.trim();
    const last = lastName.trim();

    if (!first || !last) {
      setError("first and last name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/notes/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: first, lastName: last }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("try again.");
        return;
      }

      if (data.found && data.slug) {
        router.push(`/notes/${data.slug}`);
        return;
      }

      setMessage("nothing here.");
    } catch {
      setError("try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="messages" className="px-5 pb-1 pt-2 sm:px-6 sm:pb-2 sm:pt-4">
      <Reveal immediate delay={0.26}>
        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-[22rem] flex-col items-stretch gap-4 sm:max-w-[19rem] sm:items-center sm:gap-3"
        >
          <div className="flex w-full flex-col gap-5 sm:flex-row sm:gap-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="note-first"
                className="mb-2 block text-center text-[0.65rem] tracking-[0.12em] uppercase text-ink-500"
              >
                First name
              </label>
              <input
                id="note-first"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                enterKeyHint="next"
                className="touch-target w-full border-0 border-b border-ink-600 bg-transparent px-2 py-2.5 text-center text-base text-ink-100 placeholder:text-ink-500 focus:border-ink-400 focus:outline-none sm:text-sm"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="note-last"
                className="mb-2 block text-center text-[0.65rem] tracking-[0.12em] uppercase text-ink-500"
              >
                Last name
              </label>
              <input
                id="note-last"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                enterKeyHint="go"
                className="touch-target w-full border-0 border-b border-ink-600 bg-transparent px-2 py-2.5 text-center text-base text-ink-100 placeholder:text-ink-500 focus:border-ink-400 focus:outline-none sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "mx-auto inline-flex min-h-11 min-w-[5.5rem] items-center justify-center px-4 py-2 text-[0.7rem] tracking-[0.18em] uppercase text-ink-500 transition-colors hover:text-ink-200 active:text-ink-100",
              loading && "opacity-50"
            )}
          >
            {loading ? "..." : "enter"}
          </button>

          <div aria-live="polite" className="min-h-[1.25rem]">
            {(error || message) && (
              <p className="text-center text-[0.7rem] tracking-wide text-ink-500">
                {error || message}
              </p>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
}

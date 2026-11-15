"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type CommentFormProps = {
  noteId?: string | null;
  slug?: string;
  onSuccess?: () => void;
};

export function CommentForm({ noteId, slug, onSuccess }: CommentFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const message = body.trim();
    if (!message) {
      setError("write something first.");
      return;
    }

    if (!anonymous && !displayName.trim()) {
      setError("add a name or choose anonymous.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: message,
          anonymous,
          displayName: displayName.trim(),
          noteId: noteId ?? null,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "couldn't send.");
        return;
      }

      setBody("");
      setSuccess(true);
      router.refresh();
      onSuccess?.();
    } catch {
      setError("couldn't send.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex min-h-11 cursor-pointer items-center justify-center gap-3 py-1 text-[0.68rem] tracking-[0.12em] uppercase text-ink-500 touch-manipulation">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(event) => setAnonymous(event.target.checked)}
          className="h-5 w-5 shrink-0 accent-white"
        />
        Stay anonymous
      </label>

      {!anonymous && (
        <label className="block">
          <span className="mb-2 block text-center text-[0.65rem] tracking-[0.12em] uppercase text-ink-500">
            Name
          </span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            autoComplete="name"
            className="touch-target w-full border-0 border-b border-ink-600 bg-transparent px-2 py-2.5 text-center text-base text-ink-100 placeholder:text-ink-500 focus:border-ink-400 focus:outline-none sm:text-sm"
            placeholder=""
          />
        </label>
      )}

      <label className="block">
        <span className="mb-2 block text-center text-[0.65rem] tracking-[0.12em] uppercase text-ink-500">
          Message
        </span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          maxLength={2000}
          className="touch-target min-h-[6.5rem] w-full resize-y border-0 border-b border-ink-600 bg-transparent px-2 py-2.5 text-center text-base leading-relaxed text-ink-100 placeholder:text-ink-500 focus:border-ink-400 focus:outline-none sm:min-h-[5.5rem] sm:resize-none sm:text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "mx-auto flex min-h-11 w-full items-center justify-center text-[0.7rem] tracking-[0.18em] uppercase text-ink-500 transition-colors hover:text-ink-200 active:text-ink-100",
          loading && "opacity-50"
        )}
      >
        {loading ? "..." : "Send"}
      </button>

      <div aria-live="polite" className="min-h-[1rem]">
        {error && (
          <p className="text-center text-[0.7rem] tracking-wide text-ink-500">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="text-center text-[0.7rem] tracking-wide text-ink-500">
            left.
          </p>
        )}
      </div>
    </form>
  );
}
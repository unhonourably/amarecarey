"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function GuestbookForm() {
  const router = useRouter();
  const [signature, setSignature] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, body, anonymous }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not sign.");
        return;
      }

      setSignature("");
      setAnonymous(false);
      setBody("");
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Could not sign.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="public-form space-y-5 border border-ink-600 p-4 sm:p-6"
    >
      <label className="flex min-h-11 cursor-pointer items-center gap-3 py-1 text-[0.68rem] tracking-[0.12em] uppercase text-ink-500 touch-manipulation">
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
          <span className="mb-2 block text-[0.65rem] tracking-[0.14em] uppercase text-ink-500">
            Signature (name)
          </span>
          <input
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
            maxLength={80}
            autoComplete="name"
            className="admin-control"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-2 block text-[0.65rem] tracking-[0.14em] uppercase text-ink-500">
          Message (optional)
        </span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          maxLength={1200}
          className="admin-control min-h-[6.5rem] resize-y"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "admin-action w-full border-ink-50 bg-ink-50 text-canvas hover:border-ink-50 hover:text-canvas",
          loading && "opacity-60"
        )}
      >
        {loading ? "..." : "Sign the book"}
      </button>
      <div aria-live="polite" className="min-h-[1rem]">
        {error && <p className="text-center text-sm text-red-300/90">{error}</p>}
        {success && !error && (
          <p className="text-center text-sm text-ink-400">You&apos;re on the wall.</p>
        )}
      </div>
    </form>
  );
}
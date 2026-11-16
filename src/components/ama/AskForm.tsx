"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

export function AskForm() {
  const [displayName, setDisplayName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [question, setQuestion] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactHandle, setContactHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/ama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          anonymous,
          displayName: displayName.trim(),
          contactEmail,
          contactPhone,
          contactHandle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not send.");
        return;
      }

      setDisplayName("");
      setAnonymous(false);
      setQuestion("");
      setContactEmail("");
      setContactPhone("");
      setContactHandle("");
      setSuccess(true);
    } catch {
      setError("Could not send.");
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
            Name
          </span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={80}
            autoComplete="name"
            className="admin-control"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-2 block text-[0.65rem] tracking-[0.14em] uppercase text-ink-500">
          Question
        </span>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={5}
          maxLength={2000}
          className="admin-control min-h-[8rem] resize-y"
        />
      </label>
      <div className="space-y-4 border-t border-ink-600 pt-5">
        <p className="text-[0.65rem] tracking-[0.14em] uppercase text-ink-500">
          How can I reach you? (at least one)
        </p>
        <label className="block">
          <span className="mb-2 block text-xs text-ink-400">Email</span>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            autoComplete="email"
            className="admin-control"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs text-ink-400">Phone</span>
          <input
            type="tel"
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            autoComplete="tel"
            className="admin-control"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs text-ink-400">
            Social or handle
          </span>
          <input
            value={contactHandle}
            onChange={(event) => setContactHandle(event.target.value)}
            placeholder="@username, Discord, etc."
            className="admin-control"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "admin-action w-full border-ink-50 bg-ink-50 text-canvas hover:border-ink-50 hover:text-canvas",
          loading && "opacity-60"
        )}
      >
        {loading ? "..." : "Send question"}
      </button>
      <div aria-live="polite" className="min-h-[1rem]">
        {error && <p className="text-center text-sm text-red-300/90">{error}</p>}
        {success && !error && (
          <p className="text-center text-sm text-ink-400">Sent.</p>
        )}
      </div>
    </form>
  );
}
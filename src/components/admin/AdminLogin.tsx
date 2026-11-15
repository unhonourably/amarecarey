"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to sign in.");
        return;
      }

      router.replace("/canes");
      router.refresh();
    } catch {
      setError("Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] min-h-screen py-12 safe-x safe-t safe-b sm:py-24">
      <div className="section-shell max-w-md">
        <p className="section-label">Admin</p>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
          Enter password
        </h1>
        <p className="mt-4 text-sm text-ink-300">
          This area is protected. Use the password stored in Supabase.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-400">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="admin-control"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full border border-ink-50 bg-ink-50 px-4 py-3 text-sm text-canvas transition-opacity",
              loading ? "opacity-60" : "hover:opacity-90"
            )}
          >
            {loading ? "Checking..." : "Unlock"}
          </button>

          <div aria-live="polite" className="min-h-[1.25rem]">
            {error && <p className="text-sm text-red-300/90">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}

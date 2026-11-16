"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AmaQuestion } from "@/lib/ama/types";
import { formatDateCentral } from "@/lib/utils";

export function AdminAma() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AmaQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/ama");
      const data = await response.json();
      if (response.status === 401) {
        router.replace("/canes/login");
        return;
      }
      if (!response.ok) {
        setError(data.error || "Failed to load questions.");
        return;
      }
      setQuestions(data.questions ?? []);
    } catch {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8 sm:space-y-10">
      <div>
        <Link
          href="/canes"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200"
        >
          ← Dashboard
        </Link>
        <p className="section-label mt-4 sm:mt-6">Inbox</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
          Ask me anything
        </h1>
      </div>

      {error && <p className="text-sm text-red-300/90">{error}</p>}

      {loading ? (
        <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
          Loading...
        </div>
      ) : questions.length === 0 ? (
        <div className="border border-ink-600 px-5 py-10 text-sm text-ink-400">
          No questions yet.
        </div>
      ) : (
        <ul className="divide-y divide-ink-600 border border-ink-600">
          {questions.map((item) => (
            <li key={item.id} className="px-4 py-5 sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-ink-50">
                  {item.is_anonymous
                    ? "Anonymous"
                    : item.display_name || "Anonymous"}
                </p>
                <time
                  dateTime={item.created_at}
                  className="text-xs text-ink-500"
                >
                  {formatDateCentral(item.created_at)}
                </time>
              </div>
              <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-relaxed text-ink-50">
                {item.question}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-ink-300">
                {item.contact_email && (
                  <li>
                    <span className="text-ink-500">Email · </span>
                    <a
                      href={`mailto:${item.contact_email}`}
                      className="text-ink-200 underline decoration-ink-600 underline-offset-2 hover:text-ink-50"
                    >
                      {item.contact_email}
                    </a>
                  </li>
                )}
                {item.contact_phone && (
                  <li>
                    <span className="text-ink-500">Phone · </span>
                    <a
                      href={`tel:${item.contact_phone.replace(/\s/g, "")}`}
                      className="text-ink-200 hover:text-ink-50"
                    >
                      {item.contact_phone}
                    </a>
                  </li>
                )}
                {item.contact_handle && (
                  <li>
                    <span className="text-ink-500">Handle · </span>
                    {item.contact_handle}
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
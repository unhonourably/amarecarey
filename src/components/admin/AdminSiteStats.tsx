"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SiteStats = {
  visitors: number;
  guestbook: number;
  ama: number;
  messages: number;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function AdminSiteStats() {
  const router = useRouter();
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/stats")
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 401) {
          router.replace("/canes/login");
          return;
        }
        if (!response.ok) {
          setError(data.error || "Failed to load stats.");
          return;
        }
        setStats({
          visitors: data.visitors ?? 0,
          guestbook: data.guestbook ?? 0,
          ama: data.ama ?? 0,
          messages: data.messages ?? 0,
        });
        setWarning(
          typeof data.statsWarning === "string" ? data.statsWarning : null
        );
      })
      .catch(() => setError("Failed to load stats."));
  }, [router]);

  if (error) {
    return <p className="text-sm text-red-300/90">{error}</p>;
  }

  if (!stats) {
    return (
      <div className="border border-ink-600 px-5 py-8 text-sm text-ink-400">
        Loading site stats...
      </div>
    );
  }

  const items = [
    { label: "Unique visitors", value: formatCount(stats.visitors) },
    { label: "Guestbook", value: formatCount(stats.guestbook) },
    { label: "AMA questions", value: formatCount(stats.ama) },
    { label: "Private messages", value: formatCount(stats.messages) },
  ];

  return (
    <div className="space-y-4">
      {warning && (
        <p className="text-sm text-amber-200/90">{warning}</p>
      )}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="border border-ink-600 px-5 py-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-400">
            {item.label}
          </p>
          <p className="mt-3 font-display text-3xl text-ink-50">{item.value}</p>
        </div>
      ))}
    </div>
    </div>
  );
}
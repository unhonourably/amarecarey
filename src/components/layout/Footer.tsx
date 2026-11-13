import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-ink-600">
      <div className="section-shell flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg text-ink-50">{siteConfig.name}</p>
        <p className="text-sm text-ink-400">
          © {new Date().getFullYear()} · Built with intention
        </p>
      </div>
    </footer>
  );
}

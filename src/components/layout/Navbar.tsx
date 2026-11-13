"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#achievements", label: "Achievements" },
  { href: "#socials", label: "Socials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      const sections = ["home", "about", "projects", "achievements", "interests", "socials", "messages"];
      let current = "home";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 120) current = id;
      }

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-canvas/90 backdrop-blur-md border-b border-ink-600" : "bg-transparent"
      )}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <a
          href="#home"
          className="font-display text-lg tracking-tight text-ink-50 transition-opacity hover:opacity-80"
        >
          {siteConfig.shortName}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const id = link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  active === id ? "text-ink-50" : "text-ink-300 hover:text-ink-50"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="md:hidden text-ink-200"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-600 bg-canvas md:hidden">
          <div className="section-shell flex flex-col gap-1 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 text-base text-ink-200"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="#messages"
              className="py-3 text-base text-ink-200"
              onClick={() => setOpen(false)}
            >
              Messages
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";

export function Socials() {
  const links = siteConfig.socials.filter((link) => Boolean(link.href));

  return (
    <section id="socials" className="border-t border-ink-600 py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <p className="section-label">Socials</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
            Find me elsewhere.
          </h2>
        </Reveal>

        <ul className="mt-12 divide-y divide-ink-600 border-y border-ink-600">
          {links.map((link, index) => (
            <Reveal key={`${link.platform}-${link.href}`} delay={index * 0.04}>
              <li>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"
                  }
                  className="group flex items-center justify-between py-5 transition-colors hover:text-accent"
                >
                  <span className="text-lg text-ink-50 group-hover:text-accent">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-ink-400 transition-colors group-hover:text-accent"
                  />
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

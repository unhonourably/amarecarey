import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";

export function Achievements() {
  return (
    <section id="achievements" className="border-t border-ink-600 py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <p className="section-label">Achievements</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
            Markers along the way.
          </h2>
        </Reveal>

        <ol className="mt-14">
          {siteConfig.achievements.map((item, index) => (
            <Reveal key={`${item.title}-${item.date}`} delay={index * 0.05}>
              <li className="grid gap-4 border-t border-ink-600 py-8 sm:grid-cols-[7rem_1fr] sm:gap-10">
                <p className="text-sm text-ink-400">{item.date}</p>
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-lg text-ink-50">{item.title}</h3>
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-ink-300 transition-colors hover:text-accent"
                      >
                        Link <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-300">
                    {item.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

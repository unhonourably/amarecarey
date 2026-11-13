import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section id="about" className="border-t border-ink-600 py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <p className="section-label">About</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
            A little context.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal delay={0.08}>
            <div className="space-y-6 text-lg leading-relaxed text-ink-300">
              {siteConfig.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal delay={0.12}>
              <div>
                <h3 className="text-sm uppercase tracking-[0.18em] text-ink-400">
                  Education
                </h3>
                <ul className="mt-5 space-y-5">
                  {siteConfig.about.education.map((item) => (
                    <li key={item.school} className="border-l border-ink-600 pl-4">
                      <p className="text-ink-50">{item.school}</p>
                      <p className="mt-1 text-sm text-ink-300">{item.detail}</p>
                      <p className="mt-1 text-xs text-ink-400">{item.years}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div>
                <h3 className="text-sm uppercase tracking-[0.18em] text-ink-400">
                  Details
                </h3>
                <dl className="mt-5 space-y-4">
                  {siteConfig.about.details.map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs uppercase tracking-[0.16em] text-ink-400">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm text-ink-200">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

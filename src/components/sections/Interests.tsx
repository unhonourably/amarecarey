import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";

export function Interests() {
  return (
    <section id="interests" className="border-t border-ink-600 py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <p className="section-label">Now</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
            Current interests.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {siteConfig.interests.map((interest, index) => (
            <Reveal key={interest.title} delay={index * 0.06}>
              <div className="border-t border-ink-600 pt-6">
                <h3 className="text-base text-ink-50">{interest.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {interest.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

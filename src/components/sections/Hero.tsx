import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  const links = siteConfig.socials.filter((link) => Boolean(link.href));

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-5 pb-6 pt-4 sm:px-6 sm:pb-10 sm:pt-8">
      <Reveal>
        <div className="relative mx-auto h-[9.5rem] w-[7.25rem] sm:h-44 sm:w-32">
          <div className="pfp-orbit pointer-events-none absolute inset-0" aria-hidden>
            <span className="pfp-orbit-glow" />
          </div>
          <div className="relative z-[1] h-full w-full">
            <Image
              src={siteConfig.profileImage}
              alt={siteConfig.name}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 116px, 128px"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h1 className="mt-6 text-center font-display text-[1.5rem] font-normal tracking-[-0.02em] text-ink-50 sm:mt-8 sm:text-3xl">
          {siteConfig.name}
        </h1>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-2.5 text-center sm:mt-3">
          <p className="max-w-[18rem] text-pretty text-[0.875rem] leading-relaxed text-ink-400 sm:max-w-xs sm:text-[0.8125rem]">
            {siteConfig.hero.tagline}
          </p>
          {siteConfig.hero.age && (
            <p className="mt-1.5 font-display text-[0.8125rem] tracking-wide text-ink-500 sm:text-sm">
              {siteConfig.hero.age}
            </p>
          )}
        </div>
      </Reveal>

      {links.length > 0 && (
        <Reveal delay={0.2}>
          <ul className="mt-7 flex max-w-[20rem] flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:mt-8 sm:max-w-none sm:gap-x-2">
            {links.map((link) => (
              <li key={`${link.platform}-${link.href}`}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 min-w-[2.75rem] items-center justify-center px-3 py-2 text-[0.6875rem] tracking-[0.12em] uppercase text-ink-500 transition-colors hover:text-ink-200 active:text-ink-100 sm:text-[0.7rem] sm:tracking-[0.14em]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </section>
  );
}

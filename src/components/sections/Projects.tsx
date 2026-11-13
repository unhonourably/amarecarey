import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";

const statusLabel = {
  "in-progress": "In progress",
  shipped: "Shipped",
  archived: "Archived",
  concept: "Placeholder",
};

export function Projects() {
  return (
    <section id="projects" className="border-t border-ink-600 py-24 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <p className="section-label">Projects</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-50 sm:text-4xl">
            Selected work.
          </h2>
          <p className="mt-4 max-w-xl text-ink-300">
            Editable placeholders live in <span className="text-ink-200">src/config/site.ts</span>.
            Replace them with real projects when you&apos;re ready.
          </p>
        </Reveal>

        <div className="mt-14 space-y-16">
          {siteConfig.projects.map((project, index) => (
            <Reveal key={project.name} delay={index * 0.06}>
              <article className="grid gap-8 border-t border-ink-600 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
                <div className="relative aspect-[16/10] overflow-hidden border border-ink-600 bg-ink-800">
                  <Image
                    src={project.image || "/images/project-placeholder.svg"}
                    alt={project.name}
                    fill
                    unoptimized={(project.image || "").endsWith(".svg") || !project.image}
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-2xl text-ink-50">
                      {project.name}
                    </h3>
                    {project.status && (
                      <span className="text-xs uppercase tracking-[0.16em] text-ink-400">
                        {statusLabel[project.status]}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-ink-300">
                    {project.description}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border border-ink-600 px-2.5 py-1 text-xs text-ink-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-5 text-sm">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-ink-50 transition-colors hover:text-accent"
                      >
                        Live site <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <span className="text-ink-400">Live URL pending</span>
                    )}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-ink-50 transition-colors hover:text-accent"
                      >
                        Repository <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <span className="text-ink-400">Repository pending</span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteViewer } from "@/components/notes/NoteViewer";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { getPublishedNoteBySlug } from "@/lib/notes/queries";
import { siteConfig } from "@/config/site";
import { formatDateCentral, formatNoteRecordTimestamps } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: "Personal note",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  let note = null;

  try {
    note = await getPublishedNoteBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!note) {
    notFound();
  }

  const timestamps = formatNoteRecordTimestamps(
    note.created_at,
    note.updated_at
  );

  return (
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden safe-t safe-x safe-b pb-[max(5.75rem,env(safe-area-inset-bottom))] sm:pb-10">
      <div className="section-shell pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-10 sm:pb-6">
        <Link
          href="/#messages"
          className="inline-flex min-h-11 items-center text-sm text-ink-400 transition-colors hover:text-ink-200 active:text-ink-100"
        >
          ← Back to {siteConfig.shortName}
        </Link>
      </div>

      <article className="section-shell pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:pb-24 sm:pt-10">
        <div className="mx-auto max-w-reading animate-fade-up">
          <p className="section-label">For</p>
          <h1 className="mt-3 break-words font-display text-[1.65rem] leading-tight tracking-tight text-ink-50 sm:mt-4 sm:text-5xl">
            {note.first_name} {note.last_name}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] tracking-[0.08em] uppercase text-ink-500">
            <time dateTime={timestamps.updatedAt}>
              {timestamps.updatedLabel}{" "}
              {formatDateCentral(timestamps.updatedAt)}
            </time>
            {timestamps.createdAt && timestamps.createdLabel && (
              <time dateTime={timestamps.createdAt}>
                {timestamps.createdLabel}{" "}
                {formatDateCentral(timestamps.createdAt)}
              </time>
            )}
          </p>
          <div className="mt-8 sm:mt-12">
            <NoteViewer content={note.content} />
          </div>
        </div>
      </article>
      <CommentsSection noteId={note.id} slug={note.slug} delay={0.12} />
    </main>
  );
}

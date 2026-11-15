"use client";

import { useState } from "react";
import { MessageModal } from "@/components/comments/MessageModal";
import { Reveal } from "@/components/motion/Reveal";

type CommentsSectionProps = {
  noteId?: string | null;
  slug?: string;
  delay?: number;
  compact?: boolean;
};

export function CommentsSection({
  noteId,
  slug,
  delay = 0.32,
  compact = false,
}: CommentsSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id={noteId ? "note-comments" : "comments"}
      className={
        compact
          ? "px-5 pb-2 pt-4 sm:px-6 sm:pb-20 sm:pt-8"
          : "px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pb-24 sm:pt-8"
      }
    >
      <Reveal immediate delay={delay}>
        <div className="mx-auto flex w-full max-w-[22rem] flex-col items-center sm:max-w-reading">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="touch-manipulation min-h-11 w-full max-w-[22rem] border border-ink-50/90 bg-ink-50 px-5 py-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.2em] text-canvas transition-all duration-300 hover:bg-transparent hover:text-ink-50 active:scale-[0.99] sm:max-w-none"
          >
            Leave a message
          </button>
        </div>
      </Reveal>
      <MessageModal
        open={open}
        onClose={() => setOpen(false)}
        noteId={noteId}
        slug={slug}
      />
    </section>
  );
}
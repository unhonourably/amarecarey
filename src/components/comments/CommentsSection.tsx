"use client";

import { useState } from "react";
import { MessageModal } from "@/components/comments/MessageModal";
import { Reveal } from "@/components/motion/Reveal";
import { homeActionClass, homeActionsShellClass } from "@/components/home/home-action";

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
          ? "px-5 pb-2 pt-3 sm:px-6 sm:pb-4 sm:pt-5"
          : "px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pb-24 sm:pt-8"
      }
    >
      <Reveal immediate delay={delay}>
        <div className={homeActionsShellClass}>
          <button type="button" onClick={() => setOpen(true)} className={homeActionClass}>
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
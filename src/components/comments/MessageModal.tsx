"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CommentForm } from "@/components/comments/CommentForm";

type MessageModalProps = {
  open: boolean;
  onClose: () => void;
  noteId?: string | null;
  slug?: string;
};

export function MessageModal({ open, onClose, noteId, slug }: MessageModalProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const duration = reduceMotion ? 0.01 : 0.38;
  const ease = [0.22, 1, 0.36, 1] as const;

  const shellVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration, ease, when: "beforeChildren", staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      transition: { duration, ease, when: "afterChildren", staggerChildren: 0.04 },
    },
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 20,
      scale: reduceMotion ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration, ease },
    },
    exit: {
      opacity: 0,
      y: reduceMotion ? 0 : 14,
      scale: reduceMotion ? 1 : 0.98,
      transition: { duration, ease },
    },
  };

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        "textarea, input:not([type='checkbox'])"
      );
      focusable?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="message-modal"
          className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-6 sm:py-8"
          role="presentation"
          variants={shellVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px] touch-manipulation"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            className="relative z-[1] max-h-[min(88dvh,32rem)] w-full max-w-md overflow-y-auto overscroll-contain border border-ink-600 bg-canvas px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)] [-webkit-overflow-scrolling:touch] sm:max-h-[min(90dvh,36rem)] sm:px-8 sm:py-8"
            variants={panelVariants}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center text-ink-500 transition-colors hover:text-ink-200 active:text-ink-100 touch-manipulation"
              aria-label="Close dialog"
            >
              <span className="text-xl leading-none">×</span>
            </button>
            <h2
              id="message-modal-title"
              className="px-8 text-center font-display text-xl tracking-tight text-ink-50 sm:text-2xl"
            >
              Leave a message
            </h2>
            <p className="mt-2 text-center text-[0.75rem] leading-relaxed text-ink-400">
              Say what you want. Use your name or stay anonymous.
            </p>
            <div className="mt-8">
              <CommentForm
                noteId={noteId}
                slug={slug}
                onSuccess={() => {
                  window.setTimeout(onClose, 900);
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
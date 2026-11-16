import { cn } from "@/lib/utils";

export const homeActionsShellClass = cn(
  "mx-auto flex w-full max-w-[min(100%,22rem)] flex-col gap-3"
);

export const homeActionClass = cn(
  "touch-manipulation box-border flex min-h-11 w-full items-center justify-center border border-ink-50/90 bg-ink-50 px-3 py-3.5 text-center text-pretty text-[0.65rem] font-medium uppercase leading-snug tracking-[0.16em] text-canvas transition-all duration-300 hover:bg-transparent hover:text-ink-50 active:scale-[0.99] sm:px-4 sm:text-[0.72rem] sm:tracking-[0.2em]"
);
"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageModal } from "@/components/comments/MessageModal";
import { Reveal } from "@/components/motion/Reveal";
import { homeActionClass, homeActionsShellClass } from "@/components/home/home-action";

export function HomeActionStack() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="comments"
      className="px-5 pb-2 pt-3 sm:px-6 sm:pb-4 sm:pt-5"
    >
      <Reveal immediate delay={0.3}>
        <div className={homeActionsShellClass}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={homeActionClass}
          >
            Leave a message
          </button>
          <Link href="/guestbook" className={homeActionClass}>
            Guestbook
          </Link>
          <Link href="/ask" className={homeActionClass}>
            Ask me anything
          </Link>
        </div>
      </Reveal>
      <MessageModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
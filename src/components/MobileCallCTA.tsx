"use client";

import { useEffect, useState } from "react";

export default function MobileCallCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex w-full max-w-md items-stretch gap-2 rounded-2xl border border-white/15 bg-neutral-900/95 p-2 shadow-2xl shadow-black/60 backdrop-blur">
        <a
          href="tel:+15302089290"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition active:bg-blue-600"
          aria-label="Call Blue Arc Networks"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2.25 6.75a.75.75 0 0 1 .75-.75h2.37a1.5 1.5 0 0 1 1.48 1.22l.44 2.2a1.5 1.5 0 0 1-.43 1.39l-1.1 1.1a12.06 12.06 0 0 0 5.82 5.82l1.1-1.1a1.5 1.5 0 0 1 1.39-.43l2.2.44a1.5 1.5 0 0 1 1.22 1.48v2.37a.75.75 0 0 1-.75.75h-1.5C8.41 21 3 15.59 3 9.75v-1.5z" />
          </svg>
          Call (530) 208-9290
        </a>
        <a
          href="#contact"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition active:bg-white/10"
          aria-label="Request a quote"
        >
          Quote
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

/**
 * Handles deep links to a section (e.g. a Google "Contact" result →
 * /#contact). Two things make a naive jump fail on this site:
 *   1. The preloader resets scroll to the top when it finishes.
 *   2. Lazy content below the fold (Instagram embeds, images) loads after
 *      paint and pushes the target's position down.
 * So we wait for the preloader, then re-align to the target a few times until
 * the layout settles — stopping the moment the visitor scrolls or clicks.
 */
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent((window.location.hash || "").slice(1));
    if (!id || !document.getElementById(id)) return;

    let cancelled = false;
    const timers: number[] = [];

    const scrollToTarget = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (!target) return;
      const navEl = document.querySelector("nav") as HTMLElement | null;
      const offset = -((navEl?.offsetHeight ?? 0) + 16);
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset, immediate: true });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo(0, y);
      }
    };

    const stop = () => {
      if (cancelled) return;
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("wheel", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("preloader:done", onReady);
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          e.key
        )
      ) {
        stop();
      }
    };

    // Re-align over a few seconds to track late-loading content, then settle.
    const schedule = () => {
      [0, 500, 1500, 3000, 5000].forEach((ms) =>
        timers.push(window.setTimeout(scrollToTarget, ms))
      );
    };

    const onReady = () => {
      window.removeEventListener("preloader:done", onReady);
      if (!cancelled) schedule();
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("keydown", onKey);

    if (document.documentElement.dataset.preloaded === "1") {
      schedule();
    } else {
      window.addEventListener("preloader:done", onReady);
      // Safety net in case the preloader never signals.
      timers.push(
        window.setTimeout(() => {
          window.removeEventListener("preloader:done", onReady);
          if (!cancelled) schedule();
        }, 3500)
      );
    }

    return stop;
  }, []);

  return null;
}

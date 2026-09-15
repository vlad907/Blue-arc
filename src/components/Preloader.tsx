"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, prefersReducedMotion } from "@/lib/lenis";

/**
 * First-load preloader: an animated counter climbs to 100 while the wordmark
 * reveals, then a set of vertical panels sweeps up to unveil the page.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Lock scroll during the intro.
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const finish = () => {
      document.body.style.overflow = "";
      getLenis()?.start();
      window.scrollTo(0, 0);
      setDone(true);
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("preloader:done"));
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const root = rootRef.current!;
    const countEl = countRef.current!;
    const bar = barRef.current!;
    const panels = root.querySelectorAll<HTMLElement>(".pl-panel");
    const num = { n: 0 };

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(
      num,
      {
        n: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          countEl.textContent = String(Math.round(num.n)).padStart(2, "0");
        },
      },
      0
    )
      .to(bar, { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(
        root.querySelectorAll(".pl-word .at-inner"),
        { yPercent: 120 },
        { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.08 },
        0.15
      )
      .to(
        [countEl.parentElement, root.querySelector(".pl-word"), bar.parentElement],
        { autoAlpha: 0, y: -20, duration: 0.5, ease: "power2.in" },
        "+=0.15"
      )
      .to(
        panels,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
          stagger: 0.08,
        },
        "-=0.1"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  const words = ["Blue", "Arc", "Networks"];

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      {/* Panels that sweep up on reveal */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="pl-panel h-full flex-1 bg-neutral-950" />
        ))}
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6">
        <div className="pl-word flex flex-wrap items-baseline justify-center gap-x-3 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="at-inner inline-block will-change-transform">
                {w === "Networks" ? (
                  <span className="text-blue-500">{w}</span>
                ) : (
                  w
                )}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-10 h-px w-56 overflow-hidden bg-white/15 sm:w-80">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-blue-500"
          />
        </div>

        <div className="mt-6 text-sm font-medium tracking-[0.3em] text-neutral-400">
          <span ref={countRef}>00</span>
          <span className="text-neutral-600"> / 100</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Thin blue progress bar fixed to the very top, tracking page scroll. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const quickScale = gsap.quickTo(bar, "scaleX", {
      duration: 0.3,
      ease: "power2.out",
    });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      quickScale(Math.min(1, Math.max(0, p)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600"
      />
    </div>
  );
}

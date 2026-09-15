"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis, prefersReducedMotion } from "@/lib/lenis";

/**
 * Initializes Lenis inertia scrolling and binds it to GSAP's ScrollTrigger so
 * every scroll-driven animation stays in perfect sync with the smoothed scroll
 * position. Disabled entirely when the user prefers reduced motion.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Reveal everything immediately; native scroll stays in charge.
      document.documentElement.classList.add("reduced-motion");
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });
    setLenis(lenis);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    document.documentElement.classList.add("lenis-active");

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Recompute triggers once fonts/images settle.
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 350);
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis-active");
    };
  }, []);

  return <>{children}</>;
}

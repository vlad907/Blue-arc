"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/lenis";

/**
 * Custom two-part cursor: a precise dot plus a lagging ring that grows and
 * shows a label over interactive / [data-cursor] elements. Desktop-only.
 *
 * The dot/ring are always rendered (invisible until the pointer moves) so their
 * refs are guaranteed to exist when the effect wires up GSAP — gating the JSX
 * behind state would leave the refs null when the listeners are attached.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let visible = false;
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const interactiveSel =
      'a, button, [role="button"], input, textarea, select, label, [data-cursor]';
    const setLabel = (text: string) => {
      if (labelEl) labelEl.textContent = text;
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(interactiveSel) as HTMLElement | null;
      if (!target) return;
      const custom = target.getAttribute("data-cursor");
      const hasLabel = !!custom && custom !== "true";
      setLabel(hasLabel ? custom! : "");
      gsap.to(ring, {
        scale: hasLabel ? 2.6 : 1.8,
        borderColor: "rgba(96,165,250,0.9)",
        backgroundColor: "rgba(96,165,250,0.12)",
        duration: 0.3,
      });
      gsap.to(dot, { scale: 0.4, duration: 0.3 });
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(interactiveSel) as HTMLElement | null;
      if (!target) return;
      setLabel("");
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(255,255,255,0.5)",
        backgroundColor: "rgba(255,255,255,0)",
        duration: 0.3,
      });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.2 });
    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 opacity-0 mix-blend-difference"
        style={{ willChange: "transform", visibility: "hidden" }}
        aria-hidden
      >
        <span
          ref={labelRef}
          className="text-[9px] font-semibold uppercase tracking-wider text-white"
        />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
        style={{ willChange: "transform", visibility: "hidden" }}
        aria-hidden
      />
    </>
  );
}

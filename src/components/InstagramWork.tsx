"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/lenis";
import { assetPath } from "@/lib/asset-path";
import { AnimatedText, Reveal, Magnetic } from "@/components/motion";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const IG_PROFILE = "https://www.instagram.com/bluearcnetworks/";
const IG_HANDLE = "@bluearcnetworks";

type IgItem = { code: string; type: "p" | "reel" };

/**
 * Instagram posts and reels, newest first.
 * To add one: open it on Instagram, copy the code from the URL
 * (instagram.com/p/<CODE>/ or instagram.com/reel/<CODE>/) and add it to the
 * top of this list with the matching type.
 */
const IG_ITEMS: IgItem[] = [
  // Most recent (pulled 2026-11-14)
  { code: "DftgPDoi7jf", type: "reel" },
  { code: "Dff8aIrD49a", type: "p" },
  { code: "De_-BwoG7SX", type: "p" },
  { code: "De3XvyQG_aH", type: "p" },
  { code: "DeuNk4diFHh", type: "reel" },
  { code: "DedWaaqFGy0", type: "p" },
  { code: "DeYWneiiEYo", type: "reel" },
  { code: "DeV0yi3C4BJ", type: "reel" },
  { code: "DeVMTEpkqrn", type: "p" },
  { code: "DeNrLiuiiIt", type: "reel" },
  { code: "DeLDoFtnYZ3", type: "p" },
  { code: "DeI6oSilNYp", type: "p" },
  { code: "DeA6JNFiKkp", type: "p" },
  { code: "DeA6CI8GxEP", type: "p" },
  // Earlier
  { code: "Dc49xwAlAOC", type: "p" },
  { code: "DcvLR5cCBZZ", type: "reel" },
  { code: "DcWHSeAG_0s", type: "p" },
  { code: "DcNBtqCm5j5", type: "p" },
  { code: "DcEsQ4ZEuti", type: "p" },
  { code: "Db4fL-SiE5r", type: "reel" },
  { code: "DbQ-lSVi9hq", type: "reel" },
  { code: "DbAVdU3lM8k", type: "p" },
  { code: "DZvhiqbyyZ5", type: "reel" },
  { code: "DY4j9XOlkeB", type: "p" },
  { code: "DX98ql8D07r", type: "p" },
  { code: "DX3FPaIlAH-", type: "p" },
];

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";
/** Auto-scroll speed in px per second. */
const DRIFT_SPEED = 45;

const permalink = (item: IgItem) => `https://www.instagram.com/${item.type}/${item.code}/`;

/** Load Instagram's embed script once, then render any pending blockquotes. */
function processEmbeds() {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return; // loading; onload will process
  const s = document.createElement("script");
  s.src = EMBED_SCRIPT;
  s.async = true;
  s.onload = () => window.instgrm?.Embeds.process();
  document.body.appendChild(s);
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

/**
 * One fixed-size tile. The embed is only mounted once the tile gets close to
 * the viewport, so a long strip doesn't load every Instagram iframe up front.
 * A transparent link covers the tile: click opens the post on Instagram, and
 * the strip stays draggable (iframes would otherwise swallow the pointer).
 */
function IgTile({ item }: { item: IgItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 700px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (show) processEmbeds();
  }, [show]);

  const isReel = item.type === "reel";

  return (
    <div
      ref={ref}
      className="group w-[min(84vw,360px)] shrink-0 rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-2 shadow-2xl shadow-black/50 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-blue-400/40"
    >
      <div data-ig-type={item.type} className="relative h-[560px] overflow-hidden rounded-xl bg-white">
        {/* Loading state shown until Instagram swaps in the post */}
        <div
          aria-hidden
          className="ig-skeleton absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-400"
        >
          <InstagramIcon className="h-8 w-8" />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">
            Loading {isReel ? "reel" : "post"}
          </span>
        </div>
        {show && (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={`${permalink(item)}?utm_source=ig_embed&utm_campaign=loading`}
            data-instgrm-version="14"
            data-instgrm-captioned=""
            style={{
              background: "transparent",
              border: 0,
              margin: 0,
              width: "100%",
              minWidth: "unset",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-white via-white/85 to-transparent" />
        {/* Our own header, covering Instagram's (which on reels also carries
            the audio/song credit). Same on every tile. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] flex h-[60px] items-center gap-3 border-b border-neutral-200 bg-white px-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath("/logos/Blue-arc-sm.png")}
              alt=""
              className="h-6 w-6 object-contain"
              draggable={false}
            />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-neutral-900">
              bluearcnetworks
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <InstagramIcon className="h-3 w-3" />
              {isReel ? "Reel" : "Post"}
            </span>
          </span>
          <span className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
            {isReel ? "Watch" : "View"}
          </span>
        </div>
        <a
          href={permalink(item)}
          target="_blank"
          rel="noreferrer noopener"
          draggable={false}
          data-cursor="View"
          aria-label={`View this ${isReel ? "reel" : "post"} on Instagram`}
          className="absolute inset-0 z-[4]"
        />
      </div>
    </div>
  );
}

export default function InstagramWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll: drift the strip sideways, pause on hover/touch/drag, rewind
  // at the end. Manual scrolling (swipe, trackpad, drag) always wins.
  useEffect(() => {
    const el = scrollerRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const maxScroll = () => el.scrollWidth - el.clientWidth;

    const onScroll = () => {
      const max = maxScroll();
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? el.scrollLeft / max : 0})`;
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- drag to browse with a mouse (touch + trackpad scroll natively) ---
    let dragging = false;
    let dragMoved = false;
    let startX = 0;
    let startLeft = 0;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      dragMoved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!dragMoved && Math.abs(dx) > 5) {
        dragMoved = true;
        el.setPointerCapture(e.pointerId);
      }
      if (dragMoved) el.scrollLeft = startLeft - dx;
    };
    const endDrag = () => {
      dragging = false;
    };
    // A drag shouldn't also open the post it started on.
    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    };
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    const cleanupBase = () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };

    if (prefersReducedMotion()) return cleanupBase;

    // --- drift ---
    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;
    let lastSet = el.scrollLeft;
    let inView = false;
    let hovered = false;
    let touchHold = false;
    let rewinding = false;
    let holdUntil = 0;
    let touchTimer: number | undefined;
    let rewindTimer: number | undefined;
    let rewindTween: gsap.core.Tween | undefined;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      if (!inView || hovered || touchHold || dragging || rewinding || now < holdUntil) {
        pos = el.scrollLeft;
        lastSet = pos;
        return;
      }
      // The visitor scrolled it themselves — pick up from where they left it.
      if (Math.abs(el.scrollLeft - lastSet) > 2) pos = el.scrollLeft;

      const max = maxScroll();
      if (max <= 0) return;

      if (pos >= max - 1) {
        rewinding = true;
        rewindTimer = window.setTimeout(() => {
          rewindTween = gsap.to(el, {
            scrollLeft: 0,
            duration: 1.8,
            ease: "power2.inOut",
            onComplete: () => {
              rewinding = false;
              holdUntil = performance.now() + 1200;
            },
          });
        }, 1800);
        return;
      }

      pos += DRIFT_SPEED * dt;
      el.scrollLeft = pos;
      lastSet = el.scrollLeft;
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver((entries) => {
      inView = !!entries[0]?.isIntersecting;
    });
    io.observe(section);

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = false;
    };
    const onTouchStart = () => {
      touchHold = true;
      window.clearTimeout(touchTimer);
    };
    const onTouchEnd = () => {
      window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(() => {
        touchHold = false;
      }, 3000);
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      cleanupBase();
      cancelAnimationFrame(raf);
      window.clearTimeout(touchTimer);
      window.clearTimeout(rewindTimer);
      rewindTween?.kill();
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  const reelCount = IG_ITEMS.filter((i) => i.type === "reel").length;

  return (
    <section
      ref={sectionRef}
      id="ourwork"
      className="relative isolate overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 py-20 sm:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-950/20 via-transparent to-neutral-950" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-display flex items-center gap-2 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
              02 — Our Work
            </span>
            <AnimatedText
              as="h2"
              text="Straight from the field"
              className="font-display mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl"
            />
            <Reveal
              as="p"
              className="mt-4 flex flex-wrap items-center gap-2 text-neutral-300/90"
            >
              <span>Real jobs, posted live to Instagram</span>
              <span aria-hidden className="text-neutral-600">
                ·
              </span>
              <a
                href={IG_PROFILE}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="true"
                className="inline-flex items-center gap-1.5 font-medium text-blue-300 transition hover:text-blue-200"
              >
                <InstagramIcon className="h-4 w-4" />
                {IG_HANDLE}
              </a>
            </Reveal>
          </div>

          <Magnetic strength={0.35} className="shrink-0">
            <a
              href={IG_PROFILE}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="Follow"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:brightness-110"
            >
              <InstagramIcon className="h-5 w-5" />
              Follow our work
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Full-bleed, auto-scrolling strip of posts and reels */}
      <div className="relative mt-10">
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Recent Instagram posts and reels"
          tabIndex={0}
          className="no-scrollbar flex gap-6 overflow-x-auto px-5 py-4 focus:outline-none sm:px-8 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
        >
          {IG_ITEMS.map((item) => (
            <IgTile key={item.code} item={item} />
          ))}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent sm:w-20" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <div ref={progressRef} className="h-full w-full origin-left scale-x-0 bg-blue-500" />
          </div>
          <p className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            {IG_ITEMS.length - reelCount} posts · {reelCount} reels
          </p>
        </div>

        <div className="mt-14 text-center">
          <Magnetic strength={0.4}>
            <a
              href="#contact"
              data-cursor="Get started"
              className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 font-semibold text-white transition hover:bg-blue-400"
            >
              Tell Us About Your Project
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

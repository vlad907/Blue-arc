"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";

const FADE_DURATION_MS = 400;

const VIDEO_SOURCES: { src: string; start: number; end: number }[] = [
  { src: assetPath("/hero.mp4"), start: 0, end: 2 },
  { src: assetPath("/jobs/pourhouse/PH2.mp4"), start: 1, end: 3 },
  { src: assetPath("/jobs/pourhouse/PH3.mp4"), start: 0, end: 2 },
];

/**
 * Hero: background (z-0) → overlay (z-10) → content (z-20).
 * Overlay never stacks above text; no opacity on the content wrapper.
 */
export default function Hero() {
  const video0Ref = useRef<HTMLVideoElement | null>(null);
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const sourceIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

  useEffect(() => {
    const prefersReducedData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedData || prefersReducedMotion) return;

    const videos = [video0Ref.current, video1Ref.current];
    const fadeStart = FADE_DURATION_MS / 1000;

    const triggerCrossfade = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const nextSourceIndex = (sourceIndexRef.current + 1) % VIDEO_SOURCES.length;
      const nextClip = VIDEO_SOURCES[nextSourceIndex];
      const inactiveEl = video0Ref.current && video1Ref.current
        ? (activeIndex === 0 ? video1Ref.current : video0Ref.current)
        : null;

      if (!inactiveEl) {
        isTransitioningRef.current = false;
        return;
      }

      const activeEl = activeIndex === 0 ? video0Ref.current : video1Ref.current;
      inactiveEl.src = nextClip.src;
      inactiveEl.muted = true;
      const onInactiveLoaded = () => {
        inactiveEl.removeEventListener("loadeddata", onInactiveLoaded);
        inactiveEl.currentTime = nextClip.start;
        activeEl?.pause();
        inactiveEl.play().catch(() => {});
        setActiveIndex((prev) => 1 - prev);
        sourceIndexRef.current = nextSourceIndex;
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, FADE_DURATION_MS);
      };
      inactiveEl.addEventListener("loadeddata", onInactiveLoaded);
      inactiveEl.load();
    };

    const onTimeUpdate = () => {
      const el = video0Ref.current && video1Ref.current
        ? (activeIndex === 0 ? video0Ref.current : video1Ref.current)
        : null;
      if (!el) return;
      const clip = VIDEO_SOURCES[sourceIndexRef.current];
      if (el.currentTime >= clip.end - fadeStart) {
        triggerCrossfade();
      }
    };

    const activeEl = videos[activeIndex];
    if (activeEl) {
      activeEl.addEventListener("timeupdate", onTimeUpdate);
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setCanPlayVideo(true);
          [video0Ref.current, video1Ref.current].forEach((v) => {
            if (v?.src) v.play().catch(() => {});
          });
        } else {
          [video0Ref.current, video1Ref.current].forEach((v) => v?.pause());
        }
      },
      { rootMargin: "200px 0px" }
    );

    const section = sectionRef.current;
    if (section) io.observe(section);

    return () => {
      videos.forEach((v) => v?.removeEventListener("timeupdate", onTimeUpdate));
      io.disconnect();
    };
  }, [activeIndex]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate flex min-h-[70vh] flex-col overflow-hidden bg-neutral-950 sm:min-h-[75vh] lg:min-h-[88vh]"
    >
      {/* Layer 1: background video only (z-0) */}
      <div className="absolute inset-0 z-0">
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={i === 0 ? video0Ref : video1Ref}
            className="absolute inset-0 h-full w-full object-cover transition-opacity"
            style={{
              transitionDuration: `${FADE_DURATION_MS}ms`,
              opacity: activeIndex === i ? 1 : 0,
              zIndex: activeIndex === i ? 1 : 0,
            }}
            poster={i === 0 ? assetPath("/hero-poster.jpg") : undefined}
            muted
            playsInline
            autoPlay={canPlayVideo && i === 0}
            preload="metadata"
            disablePictureInPicture
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            src={i === 0 ? VIDEO_SOURCES[0].src : undefined}
            onLoadedData={() => {
              if (canPlayVideo && i === 0 && video0Ref.current) {
                video0Ref.current.muted = true;
                video0Ref.current.play().catch(() => {});
              }
            }}
          />
        ))}
      </div>

      {/* Layer 2: darkening — only covers video; pointer-events none (z-10) */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <div className="absolute inset-0 bg-black/45" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 42%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 52%, rgba(0,0,0,0.25) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 42%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Layer 3: content — above overlay; no wrapper opacity / no backdrop on container (z-20) */}
      <div className="relative z-20 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hero-animate-in flex flex-col items-center gap-4 sm:gap-5">
            <Image
              src={assetPath("/logos/Blue-arc.png")}
              alt="Blue Arc Networks logo"
              width={200}
              height={80}
              className="h-16 w-auto sm:h-20 md:h-24"
              priority
            />
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Blue Arc <span className="text-blue-600 dark:text-blue-400">Networks</span>
            </h1>
          </div>
          <p className="hero-animate-in hero-animate-delay-1 mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-neutral-100 sm:mt-8 sm:text-xl">
            IT Support, Business Wi-Fi, Cabling & Surveillance in Chico, CA
          </p>
          <p className="hero-animate-in hero-animate-delay-1 mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            Reliable onsite service for businesses across Chico and Northern California — clean installations, fast troubleshooting, and infrastructure built to last.
          </p>
          <ul
            className="hero-animate-in hero-animate-delay-1 mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-wider text-neutral-300 sm:text-sm"
            aria-label="Why choose us"
          >
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden />
              Locally owned
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden />
              Same-day response
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden />
              Free quotes
            </li>
          </ul>
          <div className="hero-animate-in hero-animate-delay-2 mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-blue-500 px-8 py-3 text-center text-base font-semibold text-white shadow-lg shadow-black/40 transition hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Get a Quote
            </a>
            <a
              href="#ourwork"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/35 bg-white/10 px-8 py-3 text-center text-base font-semibold text-white transition hover:border-white/55 hover:bg-white/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              View Our Work
            </a>
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll to next section"
          onClick={() => {
            const sect = sectionRef.current;
            if (!sect) return;
            const next = sect.nextElementSibling as HTMLElement | null;
            if (next) {
              next.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="group absolute bottom-6 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-neutral-900/90 text-white transition hover:border-white/45 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:bottom-8"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M12 16a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 13.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16z" />
          </svg>
        </button>
      </div>
    </section>
  );
}

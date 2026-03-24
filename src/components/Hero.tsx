"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";

const FADE_DURATION_MS = 400;

const VIDEO_SOURCES: { src: string; start: number; end: number }[] = [
  { src: assetPath("/hero.mp4"), start: 0, end: 2 },
  { src: assetPath("/jobs/pourhouse/PH2.mp4"), start: 1, end: 3 },
  { src: assetPath("/jobs/pourhouse/PH3.mp4"), start: 0, end: 2 },
];

/**
 * Hero with lightweight background video overlay.
 * Plays three 2-second clips in sequence with crossfade transitions.
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
    <section id="home" ref={sectionRef} className="relative isolate overflow-hidden bg-neutral-950 min-h-[70vh] sm:min-h-[75vh] lg:min-h-[88vh]">
      {/* Background video layer - two videos for crossfade */}
      <div className="absolute inset-0">
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={i === 0 ? video0Ref : video1Ref}
            className="absolute inset-0 h-full w-full object-cover transition-opacity"
            style={{
              transitionDuration: `${FADE_DURATION_MS}ms`,
              opacity: activeIndex === i ? 1 : 0,
              zIndex: activeIndex === i ? 10 : 0,
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
        {/* Gradient overlay — darken background for readability */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.3) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-transparent to-black/35" />
      </div>

      {/* Content — light glass card, pure white text */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:py-24 lg:py-28 text-white flex flex-col justify-center min-h-[65vh]">
        <div className="max-w-3xl rounded-2xl border border-white/15 bg-black/65 px-6 py-8 shadow-xl backdrop-blur-md sm:px-8 sm:py-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Blue Arc <span className="text-blue-400">Networks</span>
          </h1>
          <p className="mt-5 max-w-none text-lg sm:text-xl text-white leading-loose font-medium">
            Reliable IT, networking, cabling, and surveillance for Chico businesses. Onsite infrastructure, Wi-Fi, low-voltage, and technical support across Northern California.
          </p>
          <p className="mt-4 text-sm sm:text-base text-neutral-100 leading-relaxed">
            Based in Chico, serving Northern California for onsite IT, network infrastructure, low-voltage, and field service work.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 w-full max-w-lg">
          <a
            href="#contact"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
          >
            Request Service
          </a>
          <a
            href="#services"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-white/20 bg-black/55 px-6 py-3 font-semibold text-white backdrop-blur-sm hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 transition"
          >
            View Services
          </a>
          <a
            href="#ourwork"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-white/20 bg-black/55 px-6 py-3 font-semibold text-white backdrop-blur-sm hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 transition"
          >
            View Our Work
          </a>
        </div>
      </div>

      {/* Scroll to next section button */}
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
        className="group absolute z-20 left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/55 backdrop-blur-md hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transition-transform group-hover:translate-y-0.5" aria-hidden="true">
          <path fill="currentColor" d="M12 16a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 13.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16z"/>
        </svg>
      </button>

      {/* Bottom shape divider */}
      
    </section>
  );
}

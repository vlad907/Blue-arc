"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";

/**
 * Hero with lightweight background video overlay.
 *
 * Performance notes:
 * - Keep the video short (≤5s), muted, looped, and compressed.
 * - Provide a static poster for fast first paint & LCP.
 * - Use preload="metadata" so the browser fetches only headers + keyframes initially.
 * - Lazy-play when in view (IntersectionObserver) to avoid decoding offscreen.
 * - Respect reduced data/motion preferences.
 */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

  useEffect(() => {
    const prefersReducedData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedData || prefersReducedMotion) return; // keep poster only

    const el = videoRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setCanPlayVideo(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative isolate overflow-hidden bg-neutral-950 min-h-[70vh] sm:min-h-[75vh] lg:min-h-[88vh]">
      {/* Background video layer */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          // Place your files in /public as /hero.mp4 and /hero.webm
          poster={assetPath("/hero-poster.jpg")}
          muted
          loop
          playsInline
          // Use autoPlay only when we've decided to play (avoids layout shift on iOS)
          autoPlay={canPlayVideo}
          preload="metadata"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          onLoadedData={() => {
            if (canPlayVideo && videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          }}
        >
          {/* Provide multiple sources and ensure absolute paths from /public */}
          <source src={assetPath("/hero.webm")} type="video/webm" />
          <source src={assetPath("/hero.mp4")} type="video/mp4" />
        </video>
        {/* Overlay gradient to increase text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/30 to-neutral-950/40" />
        {/* Dark blue tint for readability */}
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
        {/* Subtle radial vignette for extra contrast */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:py-24 lg:py-28 text-white flex flex-col justify-center min-h-[65vh]">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Blue Arc <span className="text-blue-400">Networks</span>
          </h1>
          <p className="mt-5 max-w-none text-lg sm:text-xl text-neutral-200/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Fast, reliable IT support, network installs, and audio video in Chico & beyond.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <a
            href="#contact"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-900/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-transparent transition"
          >
            Get a Quote
          </a>
          <a
            href="#services"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-white/20 px-6 py-3 font-semibold text-white/90 backdrop-blur-sm bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent transition"
          >
            Our Services
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
        className="group absolute z-20 left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transition-transform group-hover:translate-y-0.5" aria-hidden="true">
          <path fill="currentColor" d="M12 16a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 13.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16z"/>
        </svg>
      </button>

      {/* Bottom shape divider */}
      
    </section>
  );
}

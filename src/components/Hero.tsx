"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/lenis";
import { Magnetic } from "@/components/motion";

const FADE_DURATION_MS = 400;

const VIDEO_SOURCES: { src: string; start: number; end: number }[] = [
  { src: assetPath("/hero.mp4"), start: 0, end: 2 },
  { src: assetPath("/jobs/pourhouse/PH2.mp4"), start: 1, end: 3 },
  { src: assetPath("/jobs/pourhouse/PH3.mp4"), start: 0, end: 2 },
];

/** First word cycles via typewriter; the rest of the line stays fixed. */
const ROTATING_WORDS = ["Networks", "Computers", "Cameras", "Wi-Fi", "Servers", "POS"];

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoLayerRef = useRef<HTMLDivElement | null>(null);
  const rotatingRef = useRef<HTMLSpanElement | null>(null);
  const sourceIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

  useEffect(() => {
    const prefersReducedData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const prefersReducedMotionFlag = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedData || prefersReducedMotionFlag) return;

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

  /* Entrance timeline (after preloader) + scroll parallax + typewriter */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const rotating = rotatingRef.current;
    if (!section || !content) return;
    if (prefersReducedMotion()) return;

    // --- Typewriter that cycles the first word once the intro finishes ---
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const TYPE = 78;
    const DEL = 42;
    const HOLD_FULL = 1700;
    const HOLD_EMPTY = 320;
    let idx = 0; // index of the word currently shown ("Networks")

    const typeWord = (word: string, done: () => void) => {
      let i = 0;
      const step = () => {
        if (cancelled || !rotating) return;
        i += 1;
        rotating.textContent = word.slice(0, i);
        if (i >= word.length) return done();
        schedule(step, TYPE);
      };
      step();
    };
    const deleteWord = (done: () => void) => {
      const step = () => {
        if (cancelled || !rotating) return;
        const t = rotating.textContent ?? "";
        if (t.length === 0) return schedule(done, HOLD_EMPTY);
        rotating.textContent = t.slice(0, -1);
        schedule(step, DEL);
      };
      step();
    };
    const loop = () => {
      if (cancelled) return;
      deleteWord(() => {
        idx = (idx + 1) % ROTATING_WORDS.length;
        typeWord(ROTATING_WORDS[idx], () => schedule(loop, HOLD_FULL));
      });
    };
    const startTypewriter = () => {
      if (!cancelled && rotating) schedule(loop, HOLD_FULL);
    };

    const ctx = gsap.context(() => {
      // Set initial hidden state so nothing flashes before the intro plays.
      gsap.set(".hero-word-inner", { yPercent: 120 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });

      const playIntro = () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: startTypewriter,
        });
        tl.to(".hero-word-inner", {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.09,
        })
          .to(
            ".hero-fade",
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
            "-=0.6"
          );
      };

      // Wait for the preloader, with a fallback in case it's absent.
      let played = false;
      const start = () => {
        if (played) return;
        played = true;
        playIntro();
      };
      window.addEventListener("preloader:done", start, { once: true });
      const fallback = window.setTimeout(start, 3200);

      // Parallax on scroll
      gsap.to(content, {
        yPercent: 26,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      if (videoLayerRef.current) {
        gsap.to(videoLayerRef.current, {
          scale: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      return () => {
        window.removeEventListener("preloader:done", start);
        window.clearTimeout(fallback);
      };
    }, section);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate flex min-h-[92vh] flex-col overflow-hidden bg-neutral-950"
    >
      {/* Layer 1: background video only (z-0) */}
      <div ref={videoLayerRef} className="absolute inset-0 z-0 will-change-transform">
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
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 42%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 52%, rgba(0,0,0,0.25) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950" />
      </div>

      {/* Layer 3: content (z-20) */}
      <div className="relative z-20 flex min-h-0 flex-1 flex-col justify-center px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        <div ref={contentRef} className="mx-auto w-full max-w-6xl">
          <div className="hero-fade flex items-center gap-3">
            <Image
              src={assetPath("/logos/Blue-arc.png")}
              alt="Blue Arc Networks logo"
              width={120}
              height={48}
              className="h-9 w-auto sm:h-11"
              priority
            />
            <span className="font-display text-sm font-medium uppercase tracking-[0.28em] text-neutral-200">
              Blue Arc Networks
            </span>
          </div>

          <h1
            className="font-display mt-6 text-[15vw] font-semibold leading-[0.95] tracking-tight text-white sm:text-[12vw] lg:text-[9.5vw]"
            aria-label="Networks, computers, cameras and POS that just work."
          >
            <span className="block">
              <span className="inline-block overflow-hidden pb-[0.16em] -mb-[0.16em] align-bottom">
                <span className="hero-word-inner inline-block whitespace-nowrap will-change-transform">
                  <span ref={rotatingRef} className="text-blue-500">
                    Networks
                  </span>
                  <span className="hero-caret" aria-hidden />
                </span>
              </span>
            </span>
            <span className="block" aria-hidden>
              {["that", "just", "work."].map((word, wi) => (
                <span
                  key={wi}
                  className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
                >
                  <span className="hero-word-inner inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="hero-fade text-lg font-medium leading-relaxed text-neutral-100 sm:text-xl">
                IT Support, Business Wi-Fi, Cabling &amp; Surveillance in Chico, CA.
              </p>
              <p className="hero-fade mt-3 max-w-lg text-sm leading-relaxed text-neutral-300 sm:text-base">
                Reliable onsite service for businesses across Chico and Northern
                California — clean installations, fast troubleshooting, and
                infrastructure built to last.
              </p>
              <ul
                className="hero-fade mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-wider text-neutral-300 sm:text-sm"
                aria-label="Why choose us"
              >
                {["Locally owned", "Same-day response", "Free quotes"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-fade flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Magnetic strength={0.4}>
                <a
                  href="#contact"
                  data-cursor="Get a quote"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-blue-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/40 transition hover:bg-blue-400"
                >
                  Get a Quote
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="#ourwork"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition hover:border-white/55 hover:bg-white/20"
                >
                  View Our Work
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll to next section"
          onClick={() => {
            const sect = sectionRef.current;
            const next = sect?.nextElementSibling as HTMLElement | null;
            next?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="hero-fade group absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white sm:bottom-8"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-300">
            Scroll
          </span>
          <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30">
            <span className="mt-1.5 h-2 w-1 animate-bounce rounded-full bg-white/80" />
          </span>
        </button>
      </div>
    </section>
  );
}

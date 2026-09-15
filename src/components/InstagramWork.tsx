"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { smoothScrollTo } from "@/lib/lenis";
import { AnimatedText, Reveal, Magnetic } from "@/components/motion";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const IG_PROFILE = "https://www.instagram.com/bluearcnetworks/";
const IG_HANDLE = "@bluearcnetworks";

/**
 * Instagram post shortcodes (feed posts only — reels excluded), newest first.
 * To add a new post: open it on Instagram, copy the code from the URL
 * (instagram.com/p/<CODE>/) and add it to the top of this list.
 */
const POST_CODES = [
  "Dc49xwAlAOC",
  "DcWHSeAG_0s",
  "DcNBtqCm5j5",
  "DcEsQ4ZEuti",
  "DbAVdU3lM8k",
  "DY4j9XOlkeB",
  "DX98ql8D07r",
  "DX3FPaIlAH-",
];

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";
const POSTS_PER_PAGE = 3;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

export default function InstagramWork() {
  const [page, setPage] = useState(1);
  const isFirstRender = useRef(true);

  const totalPages = Math.max(1, Math.ceil(POST_CODES.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pagePosts = POST_CODES.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  // Render the current page's embeds whenever the page changes.
  useEffect(() => {
    const process = () => window.instgrm?.Embeds.process();

    // Layout shifts as each embed swaps its blockquote for a sized iframe;
    // refresh ScrollTrigger a few times so sections below stay aligned.
    const refreshes = [1200, 2500, 4500].map((ms) =>
      window.setTimeout(() => ScrollTrigger.refresh(), ms)
    );

    if (window.instgrm) {
      process();
    } else if (!document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) {
      const s = document.createElement("script");
      s.src = EMBED_SCRIPT;
      s.async = true;
      s.onload = process;
      document.body.appendChild(s);
    } else {
      // Script tag exists but may still be loading.
      const t = window.setTimeout(process, 800);
      refreshes.push(t);
    }

    return () => refreshes.forEach((id) => window.clearTimeout(id));
  }, [safePage]);

  // Jump back to the top of the section on page change (not on first load).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    smoothScrollTo("#ourwork");
  }, [safePage]);

  return (
    <section
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

        {/* Masonry wall of live Instagram posts (current page) */}
        <div
          key={safePage}
          className="mt-12 gap-6 [column-fill:_balance] columns-1 md:columns-2 xl:columns-3"
        >
          {pagePosts.map((code) => (
            <div key={code} className="mb-6 break-inside-avoid">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`https://www.instagram.com/p/${code}/?utm_source=ig_embed&utm_campaign=loading`}
                data-instgrm-version="14"
                data-instgrm-captioned=""
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: 12,
                  margin: 0,
                  width: "100%",
                  minWidth: "unset",
                }}
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              data-cursor="true"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  data-cursor="true"
                  aria-current={p === safePage ? "page" : undefined}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                    p === safePage
                      ? "border border-blue-400/50 bg-blue-500/20 text-blue-200"
                      : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              data-cursor="true"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

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

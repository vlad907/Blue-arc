"use client";
import React, { useEffect, useRef } from "react";

export type TrustedLogo = {
  name: string;
  src: string; // path in /public or absolute URL
  href?: string; // optional link to the company site/case study
  className?: string; // optional per-logo tweaks
};

type Props = {
  title?: string;
  subtitle?: string;
};

/**
 * TrustedBy Section
 *
 * Features
 * - Uniform sizing: each logo is auto-fitted into a fixed-height box using object-contain
 * - Responsive grid: 2–5 columns depending on viewport
 * - Optional links: wrap logos in anchors when `href` is provided
 * - Accessible: alt text from `name`, names displayed below each logo
 */

export default function TrustedBy({
  title = "Trusted By",
  subtitle = "A few of the teams we support and keep online",
}: Props) {
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const resolveLogoSrc = (src: string) => {
    if (/^(?:https?:)?\/\//.test(src)) {
      return src;
    }

    const normalized = src.startsWith("/") ? src : `/${src}`;

    if (!basePath) {
      return normalized;
    }

    if (normalized.startsWith(`${basePath}/`)) {
      return normalized;
    }

    return `${basePath}${normalized}`;
  };

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-speed]"));
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      for (const el of items) {
        const speed = parseFloat(el.dataset.speed || "0");
        // translate on Y axis with a gentle clamp
        const ty = Math.max(-200, Math.min(200, y * speed));
        el.style.transform = `translate3d(0, ${ty}px, 0)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logos: TrustedLogo[] = [
    { name: "Pour House", src: "/logos/PourHouse.png" },
    { name: "Schuster Homes", src: "/logos/schuster-homes.png" },
    { name: "COMP", src: "/logos/complogo.avif" },
    { name: "Snider Services", src: "logos/imgl-ss-footer.jpg"},
    { name: "NCR Voyix", src: "logos/ncr_voyix.svg"},
  ];

  return (
    <section id="trustedby" className="relative isolate bg-neutral-950 py-12 sm:py-16">
        {/* Base gradient + subtle grid to differentiate from hero */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, #08101e 0%, #0a1324 40%, #0b1426 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.18]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px, 48px 48px",
            backgroundPosition: "0 0, 0 0",
          }}
        />
        {/* Animated background bubbles */}
        <div
          ref={parallaxRef}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          {/* Layer 1 - slow large blobs */}
          <div
            data-speed="0.15"
            className="absolute aspect-square rounded-full opacity-[0.18] blur-3xl will-change-transform animate-float-slow"
            style={{
              width: "42rem",
              background:
                "radial-gradient(45% 45% at 50% 50%, rgba(56, 189, 248, 0.55) 0%, rgba(2, 6, 23, 0.0) 70%)",
              top: "-10rem",
              left: "-10rem",
            }}
          />
          <div
            data-speed="-0.12"
            className="absolute aspect-square rounded-full opacity-[0.18] blur-3xl will-change-transform animate-float-slow-2"
            style={{
              width: "36rem",
              background:
                "radial-gradient(45% 45% at 50% 50%, rgba(12, 74, 110, 0.85) 0%, rgba(2, 6, 23, 0.0) 70%)",
              bottom: "-8rem",
              right: "-8rem",
            }}
          />
          {/* Layer 2 - medium drifting bubbles */}
          <div
            data-speed="0.25"
            className="absolute aspect-square rounded-full opacity-[0.22] blur-2xl will-change-transform animate-float-med"
            style={{
              width: "18rem",
              background:
                "radial-gradient(40% 40% at 50% 50%, rgba(34, 197, 94, 0.75) 0%, rgba(2, 6, 23, 0.0) 70%)",
              top: "30%",
              left: "-5rem",
              mixBlendMode: "screen",
            }}
          />
          <div
            data-speed="0.20"
            className="absolute aspect-square rounded-full opacity-[0.22] blur-2xl will-change-transform animate-float-med-2"
            style={{
              width: "16rem",
              background:
                "radial-gradient(40% 40% at 50% 50%, rgba(56, 189, 248, 0.75) 0%, rgba(2, 6, 23, 0.0) 70%)",
              top: "10%",
              right: "15%",
              mixBlendMode: "screen",
            }}
          />
          {/* Layer 3 - small, a bit faster */}
          <div
            data-speed="0.35"
            className="absolute aspect-square rounded-full opacity-[0.3] blur-xl will-change-transform animate-float-fast"
            style={{
              width: "10rem",
              background:
                "radial-gradient(45% 45% at 50% 50%, rgba(56, 189, 248, 1) 0%, rgba(2, 6, 23, 0.0) 75%)",
              bottom: "12%",
              left: "25%",
            }}
          />
          <div
            data-speed="0.30"
            className="absolute aspect-square rounded-full opacity-[0.28] blur-xl will-change-transform animate-float-fast-2"
            style={{
              width: "12rem",
              background:
                "radial-gradient(45% 45% at 50% 50%, rgba(21, 128, 61, 0.95) 0%, rgba(2, 6, 23, 0.0) 75%)",
              top: "55%",
              right: "30%",
            }}
          />
        </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-neutral-300/90">{subtitle}</p>
          )}
        </div>

        {/* Grid of logos */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {logos.map((item: TrustedLogo) => (
            item.href ? (
              <a key={item.name} href={item.href} target="_blank" rel="noreferrer noopener">
                <div className="group flex flex-col items-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md p-4 sm:p-5 hover:border-white/20 transition">
                  <div className="relative flex h-12 sm:h-14 w-full items-center justify-center">
                    <img
                      src={resolveLogoSrc(item.src)}
                      alt={item.name}
                      loading="lazy"
                      className={(item.className ? item.className + " " : "") + "max-h-full max-w-[160px] object-contain opacity-90 group-hover:opacity-100 transition"}
                    />
                  </div>
                  <div className="mt-3 text-center text-sm font-medium text-neutral-200/95">{item.name}</div>
                </div>
              </a>
            ) : (
              <div key={item.name}>
                <div className="group flex flex-col items-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md p-4 sm:p-5 hover:border-white/20 transition">
                  <div className="relative flex h-12 sm:h-14 w-full items-center justify-center">
                    <img
                      src={resolveLogoSrc(item.src)}
                      alt={item.name}
                      loading="lazy"
                      className={(item.className ? item.className + " " : "") + "max-h-full max-w-[160px] object-contain opacity-90 group-hover:opacity-100 transition"}
                    />
                  </div>
                  <div className="mt-3 text-center text-sm font-medium text-neutral-200/95">{item.name}</div>
                </div>
              </div>
            )
          ))}
        </div>

      </div>
    </section>
  );
}

/**
 * Example usage:
 *
 * import TrustedBy, { TrustedLogo } from "./components/trustedby";
 * const logos: TrustedLogo[] = [
 *   { name: "Chico Diner", src: "/logos/chico-diner.svg", href: "https://example.com" },
 *   { name: "Sierra Clinic", src: "/logos/sierra-clinic.png" },
 *   { name: "North Valley Storage", src: "/logos/nv-storage.svg" },
 *   { name: "Butte Coffee", src: "/logos/butte-coffee.png" },
 *   { name: "Township Hotel", src: "/logos/township-hotel.svg" },
 * ];
 *
 * <TrustedBy />
 */

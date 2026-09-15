"use client";
import React, { useEffect, useRef } from "react";
import { assetPath } from "@/lib/asset-path";
import type { TrustedLogo } from "@/lib/trusted";
import { AnimatedText, Marquee } from "@/components/motion";

export type { TrustedLogo };

type Props = {
  logos?: TrustedLogo[];
  title?: string;
  subtitle?: string;
};

function LogoTile({ item }: { item: TrustedLogo }) {
  const inner = (
    <div className="group mx-3 flex h-28 w-56 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 backdrop-blur transition hover:border-white/25 hover:bg-white/[0.07]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath(item.src)}
        alt={`${item.name} logo`}
        loading="lazy"
        className={
          (item.className ? item.className + " " : "") +
          "max-h-14 max-w-[150px] w-auto object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        }
      />
    </div>
  );
  return item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer noopener" data-cursor="true">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default function TrustedBy({
  logos: logosProp,
  title = "Trusted By",
  subtitle = "Teams and businesses we've supported through direct service and field deployments.",
}: Props) {
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-speed]"));
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      for (const el of items) {
        const speed = parseFloat(el.dataset.speed || "0");
        const ty = Math.max(-200, Math.min(200, y * speed));
        el.style.transform = `translate3d(0, ${ty}px, 0)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logos: TrustedLogo[] =
    logosProp && logosProp.length > 0
      ? logosProp
      : [
          { name: "Pour House", src: "/logos/PourHouse.png" },
          { name: "Schuster Homes", src: "/logos/schuster-homes.png" },
          { name: "COMP", src: "/logos/complogo.avif" },
          { name: "Snider Services", src: "/logos/imgl-ss-footer.jpg" },
          { name: "NCR Voyix", src: "/logos/ncr_voyix.svg" },
        ];

  // Split into two rows for the dual marquee, then repeat each row so a single
  // marquee copy comfortably exceeds the viewport width (seamless, gapless loop).
  const mid = Math.ceil(logos.length / 2);
  const baseA = logos.length > 3 ? logos.slice(0, mid) : logos;
  const baseB = logos.length > 3 ? logos.slice(mid) : logos;
  const fill = (arr: TrustedLogo[]) => {
    if (arr.length === 0) return arr;
    const times = Math.max(1, Math.ceil(8 / arr.length));
    return Array.from({ length: times }).flatMap(() => arr);
  };
  const rowA = fill(baseA);
  const rowB = fill(baseB);

  return (
    <section id="trustedby" className="relative isolate overflow-hidden py-24 sm:py-28">
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: "linear-gradient(180deg, #08101e 0%, #0a1324 40%, #0b1426 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.18]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
        }}
      />
      {/* Animated background bubbles */}
      <div
        ref={parallaxRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          data-speed="0.15"
          className="animate-float-slow absolute aspect-square rounded-full opacity-20 blur-3xl will-change-transform"
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
          className="animate-float-slow-2 absolute aspect-square rounded-full opacity-20 blur-3xl will-change-transform"
          style={{
            width: "36rem",
            background:
              "radial-gradient(45% 45% at 50% 50%, rgba(12, 74, 110, 0.85) 0%, rgba(2, 6, 23, 0.0) 70%)",
            bottom: "-8rem",
            right: "-8rem",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
            05 — Trusted By
          </span>
          <AnimatedText
            as="h2"
            text={title}
            className="font-display mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          />
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-neutral-300/90">{subtitle}</p>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-5">
          <Marquee direction={-1} baseSpeed={30}>
            {rowA.map((item, i) => (
              <LogoTile key={(item.id ?? item.name) + i} item={item} />
            ))}
          </Marquee>
          <Marquee direction={1} baseSpeed={34}>
            {rowB.map((item, i) => (
              <LogoTile key={(item.id ?? item.name) + i} item={item} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

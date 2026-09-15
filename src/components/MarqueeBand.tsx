"use client";

import React from "react";
import { Marquee } from "@/components/motion";

const KEYWORDS = [
  "IT Support",
  "Business Wi-Fi",
  "Surveillance",
  "Structured Cabling",
  "Network Design",
  "Server Infrastructure",
  "Commercial AV",
];

function Row({
  direction,
  variant,
}: {
  direction: 1 | -1;
  variant: "solid" | "outline";
}) {
  return (
    <Marquee direction={direction} baseSpeed={28}>
      {KEYWORDS.map((word) => (
        <span key={word} className="flex items-center">
          <span
            className={`font-display px-6 text-4xl font-semibold uppercase tracking-tight sm:px-8 sm:text-6xl md:text-7xl ${
              variant === "outline" ? "text-stroke" : "text-white"
            }`}
          >
            {word}
          </span>
          <span className="text-blue-500 text-3xl sm:text-5xl" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </Marquee>
  );
}

export default function MarqueeBand() {
  return (
    <section
      aria-hidden
      className="relative isolate overflow-hidden border-y border-white/10 bg-neutral-950 py-6 sm:py-10"
    >
      <div className="flex flex-col gap-2 sm:gap-4">
        <Row direction={-1} variant="solid" />
        <Row direction={1} variant="outline" />
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent sm:w-40" />
    </section>
  );
}

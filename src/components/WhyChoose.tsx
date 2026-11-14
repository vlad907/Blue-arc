"use client";

import React from "react";
import { AnimatedText, Reveal } from "@/components/motion";

type IconName = "onsite" | "clean" | "business" | "clear";

const VALUE_PROPS: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "onsite",
    title: "Reliable Onsite Service",
    description:
      "We come to you. Onsite support for IT, networking, cabling, and surveillance across Chico and Northern California.",
  },
  {
    icon: "clean",
    title: "Clean, Professional Installs",
    description:
      "Organized cable routing, clear labeling, and installations built to last. No shortcuts.",
  },
  {
    icon: "business",
    title: "Business-Focused Solutions",
    description:
      "Solutions designed for commercial environments — offices, retail, job sites, and modern workspaces.",
  },
  {
    icon: "clear",
    title: "Fast, Clear Communication",
    description:
      "We diagnose issues quickly, explain what we find, and get systems back online without the jargon.",
  },
];

function Icon({ name }: { name: IconName }) {
  const common = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "onsite":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
    case "clean":
      return (
        <svg {...common}>
          <path d="M4 7h10a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h12" />
          <path d="M4 5v4M20 17v4" />
        </svg>
      );
    case "business":
      return (
        <svg {...common}>
          <path d="M4 21V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M14 10h5a1 1 0 0 1 1 1v10M3 21h18" />
          <path d="M8 9h2M8 13h2M8 17h2" />
        </svg>
      );
    case "clear":
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

export default function WhyChoose() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-900/40 py-24 sm:py-28">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
          04 — Why Blue Arc
        </span>
        <AnimatedText
          as="h2"
          text="Built to keep working."
          className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl"
        />

        <Reveal as="div" stagger={0.12} y={50} className="mt-16 grid gap-5 sm:grid-cols-2">
          {VALUE_PROPS.map((item, i) => (
            <div
              key={item.title}
              className="spotlight group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 transition-[border-color] duration-300 hover:border-blue-400/40 sm:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/30 transition duration-300 group-hover:bg-blue-500 group-hover:text-white">
                  <Icon name={item.icon} />
                </span>
                <span className="font-display bg-gradient-to-b from-white/25 to-white/[0.03] bg-clip-text text-5xl font-semibold leading-none text-transparent">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display mt-8 text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

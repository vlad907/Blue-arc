"use client";

import React from "react";
import { AnimatedText, Reveal } from "@/components/motion";

const VALUE_PROPS = [
  {
    title: "Reliable Onsite Service",
    description:
      "We come to you. Onsite support for IT, networking, cabling, and surveillance across Chico and Northern California.",
  },
  {
    title: "Clean, Professional Installs",
    description:
      "Organized cable routing, clear labeling, and installations built to last. No shortcuts.",
  },
  {
    title: "Business-Focused Solutions",
    description:
      "Solutions designed for commercial environments — offices, retail, job sites, and modern workspaces.",
  },
  {
    title: "Fast, Clear Communication",
    description:
      "We diagnose issues quickly, explain what we find, and get systems back online without the jargon.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-900/40 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
          04 — Why Blue Arc
        </span>
        <AnimatedText
          as="h2"
          text="Built to keep working."
          className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl"
        />

        <Reveal
          as="div"
          stagger={0.12}
          y={50}
          className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2"
        >
          {VALUE_PROPS.map((item, i) => (
            <div
              key={item.title}
              className="group relative bg-neutral-950 p-8 transition-colors duration-300 hover:bg-neutral-900 sm:p-10"
            >
              <span className="font-display text-sm font-medium text-blue-400/70">
                0{i + 1}
              </span>
              <h3 className="font-display mt-4 text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

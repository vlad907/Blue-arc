"use client";

import React from "react";

const VALUE_PROPS = [
  {
    title: "Reliable Onsite Service",
    description: "We come to you. Onsite support for IT, networking, cabling, and surveillance across Chico and Northern California.",
  },
  {
    title: "Clean, Professional Installations",
    description: "Organized cable routing, clear labeling, and installations built to last. No shortcuts.",
  },
  {
    title: "Business-Focused Solutions",
    description: "Solutions designed for commercial environments—offices, retail, job sites, and modern workspaces.",
  },
  {
    title: "Fast Troubleshooting & Clear Communication",
    description: "We diagnose issues quickly, explain what we find, and get your systems back online without the jargon.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative isolate bg-neutral-900/50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Why Choose Blue Arc
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

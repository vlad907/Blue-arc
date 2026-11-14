"use client";
import React from "react";
import { AnimatedText, ScrubText, Reveal, Counter } from "@/components/motion";

const STATS: { label: string; value: React.ReactNode }[] = [
  { label: "Based in", value: "Chico, CA" },
  { label: "Service area", value: "Northern CA" },
  {
    label: "Core services",
    value: <Counter value={6} suffix="" />,
  },
  { label: "Response", value: "Same-day" },
];

const SERVICE_AREAS = ["Chico", "Paradise", "Oroville", "Durham", "Magalia", "Butte County"];

/** Concentric arcs radiating from the right edge — a signal / "blue arc" motif. */
function SignalArcs() {
  const radii = [90, 170, 250, 330, 410, 490, 570];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 1200"
      className="pointer-events-none absolute right-0 top-1/2 -z-10 hidden h-[72rem] max-h-[140%] w-auto -translate-y-1/2 lg:block"
      fill="none"
    >
      <defs>
        <linearGradient id="arc-fade" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {radii.map((r, i) => (
        <circle
          key={r}
          cx="600"
          cy="600"
          r={r}
          stroke="url(#arc-fade)"
          strokeWidth={i === 0 ? 2 : 1.25}
          className="signal-arc"
          style={
            {
              animationDelay: `${i * 0.32}s`,
              "--arc-max": `${0.6 - i * 0.07}`,
              "--arc-min": `${0.14 - i * 0.015}`,
            } as React.CSSProperties
          }
        />
      ))}
      <circle cx="600" cy="600" r="10" fill="#60a5fa" />
    </svg>
  );
}

const About = () => {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-neutral-950 py-24 sm:py-32"
    >
      <div
        className="absolute inset-0 -z-10 opacity-90"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(80rem 40rem at 10% 10%, rgba(56,189,248,0.08) 0%, rgba(2,6,23,0) 60%), radial-gradient(60rem 40rem at 100% 50%, rgba(37,99,235,0.14) 0%, rgba(2,6,23,0) 65%)",
        }}
      />
      <SignalArcs />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
          03 — Who we are
        </span>
        <AnimatedText
          as="h2"
          text="About Blue Arc Networks"
          className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
        />

        <ScrubText
          as="p"
          text="Blue Arc Networks is a locally owned IT and low-voltage company based in Chico, California, led by Vlad Avdeev. We provide hands-on IT support, network design, structured cabling, and surveillance camera installation for offices, retail, and job sites across Butte County and Northern California."
          className="font-display mt-12 max-w-4xl text-2xl font-medium leading-snug text-white sm:text-4xl"
        />

        <Reveal as="p" className="mt-8 max-w-2xl text-base leading-7 text-neutral-400">
          Our focus is simple: reliable systems, clean installs, and clear
          communication. From a single workstation issue to a full network and
          camera deployment, we treat every project like it has to keep working
          long after we leave.
        </Reveal>

        <div className="mt-10">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>
            Onsite across
          </p>
          <Reveal as="ul" stagger={0.06} y={14} duration={0.6} className="mt-4 flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-neutral-200 backdrop-blur transition-colors hover:border-blue-400/50 hover:text-white"
              >
                {area}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal
          as="dl"
          stagger={0.1}
          y={40}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs uppercase tracking-wider text-neutral-500">
                {stat.label}
              </dt>
              <dd className="font-display mt-2 text-3xl font-semibold text-white sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default About;

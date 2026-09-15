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
            "radial-gradient(80rem 40rem at 10% 10%, rgba(56,189,248,0.08) 0%, rgba(2,6,23,0) 60%), radial-gradient(70rem 35rem at 90% 90%, rgba(34,197,94,0.05) 0%, rgba(2,6,23,0) 60%)",
        }}
      />
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
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

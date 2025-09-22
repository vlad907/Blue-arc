"use client";
import React from "react";

const About = () => {
  return (
    <section id="about" className="relative isolate bg-gradient-to-b from-neutral-950 to-neutral-900 py-16 sm:py-20">
      <div
        className="absolute inset-0 -z-10 opacity-[0.9]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(80rem 40rem at 10% 10%, rgba(56,189,248,0.08) 0%, rgba(2,6,23,0) 60%), radial-gradient(70rem 35rem at 90% 90%, rgba(34,197,94,0.06) 0%, rgba(2,6,23,0) 60%)",
        }}
      />
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center">
          About Me
        </h2>
        <p className="mt-6 text-lg leading-8 text-neutral-300 text-center">
          I am Vlad Avdeev, founder of Blue Arc Networks. I combine years of IT support,
          network engineering, and repair experience with a strong background in software
          and systems to deliver professional, reliable solutions.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Technical Background</h3>
            <p className="mt-2 text-neutral-300">
              I have extensive experience in IT support, computer repair, and network infrastructure. My work includes building VPN servers and firewalls, deploying and optimizing Unifi networks, configuring smart switches, and integrating authentication systems such as Windows Domain Radius. I also specialize in data recovery, server maintenance, and end‑to‑end network design.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Entrepreneurship</h3>
            <p className="mt-2 text-neutral-300">
              Through Blue Arc Networks, I provide comprehensive IT services across Chico and Northern California. My focus is on delivering reliable IT repair, network solutions, and smart technology integrations for businesses and consumers. I also partner with subcontracting platforms like Field Nation and WorkMarket, building a strong track record of successful projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
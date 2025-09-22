"use client";
import React from "react";

const Pricing = () => {
  return (
    <section id="pricing" className="relative isolate bg-neutral-950 py-16 sm:py-20">
      {/* Base gradient + subtle grid to match Trusted By */}
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
      {/* Gentle animated bubbles (same palette as Trusted By) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute aspect-square rounded-full opacity-[0.18] blur-3xl will-change-transform animate-float-slow"
          style={{
            width: "40rem",
            background:
              "radial-gradient(45% 45% at 50% 50%, rgba(56, 189, 248, 0.55) 0%, rgba(2, 6, 23, 0.0) 70%)",
            top: "-10rem",
            left: "-12rem",
          }}
        />
        <div
          className="absolute aspect-square rounded-full opacity-[0.18] blur-3xl will-change-transform animate-float-slow-2"
          style={{
            width: "34rem",
            background:
              "radial-gradient(45% 45% at 50% 50%, rgba(12, 74, 110, 0.85) 0%, rgba(2, 6, 23, 0.0) 70%)",
            bottom: "-8rem",
            right: "-10rem",
          }}
        />
        <div
          className="absolute aspect-square rounded-full opacity-[0.28] blur-xl will-change-transform animate-float-fast"
          style={{
            width: "12rem",
            background:
              "radial-gradient(45% 45% at 50% 50%, rgba(56, 189, 248, 1) 0%, rgba(2, 6, 23, 0.0) 75%)",
            top: "50%",
            left: "20%",
          }}
        />
      </div>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center">
          Pricing
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300 text-center">
          Transparent, straightforward pricing for IT support and repair services.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur shadow-lg shadow-black/20">
            <h3 className="text-xl font-semibold text-white">Hourly Rate</h3>
            <p className="mt-2 text-neutral-300">
              Our standard rate for all IT support, repair, and networking services.
            </p>
            <p className="mt-6 text-3xl font-bold text-sky-400">$60<span className="text-lg text-neutral-400"> / hr</span></p>
            <ul className="mt-4 space-y-2 text-neutral-200">
              <li>Charged after the initial 2‑hour minimum</li>
              <li>Covers all standard IT support services</li>
              <li>Remote or on‑site work included</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-6 backdrop-blur shadow-lg shadow-black/20 ring-1 ring-inset ring-sky-400/30">
            <h3 className="text-xl font-semibold text-white">2‑Hour Minimum</h3>
            <p className="mt-2 text-neutral-300">
              Every service call begins with a flat 2‑hour minimum charge to cover travel and setup.
            </p>
            <p className="mt-6 text-3xl font-bold text-white">$120<span className="text-lg text-neutral-400"> minimum</span></p>
            <ul className="mt-4 space-y-2 text-neutral-200">
              <li>Covers the first 2 hours, even if the job takes less time</li>
              <li>Ensures availability and dedicated on‑site service</li>
              <li>Applies to all service categories</li>
            </ul>
          </div>

        </div>
          <div className="mt-12 flex justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 px-6 py-3 text-base font-medium text-sky-200 hover:bg-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            >
              Contact Us
            </a>
          </div>
      </div>
    </section>
  );
};

export default Pricing;
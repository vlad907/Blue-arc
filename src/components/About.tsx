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
          About Blue Arc
        </h2>
        <p className="mt-6 text-lg leading-8 text-neutral-300 text-center max-w-3xl mx-auto">
          Blue Arc Networks is led by Vlad Avdeev, providing hands-on IT, networking, cabling, and surveillance support for businesses across Chico and Northern California. With experience spanning troubleshooting, infrastructure deployments, Wi-Fi optimization, and onsite technical field work, Blue Arc focuses on reliable solutions that are built cleanly and work the way they should.
        </p>
      </div>
    </section>
  );
};

export default About;
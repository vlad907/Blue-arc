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
          About Blue Arc Networks
        </h2>
        <p className="mt-6 text-lg leading-8 text-neutral-300 text-center max-w-3xl mx-auto">
          Blue Arc Networks is a locally owned IT and low-voltage company based in Chico, California, led by Vlad Avdeev. We provide hands-on IT support, network design, structured cabling, and surveillance camera installation for offices, retail, and job sites across Butte County and Northern California.
        </p>
        <p className="mt-4 text-base leading-7 text-neutral-400 text-center max-w-3xl mx-auto">
          Our focus is simple: reliable systems, clean installs, and clear communication. From a single workstation issue to a full network and camera deployment, we treat every project like it has to keep working long after we leave.
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-3xl mx-auto text-center">
          <div>
            <dt className="text-sm uppercase tracking-wider text-neutral-400">Based in</dt>
            <dd className="mt-1 text-xl font-semibold text-white">Chico, CA</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-wider text-neutral-400">Service area</dt>
            <dd className="mt-1 text-xl font-semibold text-white">Northern CA</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-wider text-neutral-400">Response</dt>
            <dd className="mt-1 text-xl font-semibold text-white">Same-day</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-wider text-neutral-400">Quotes</dt>
            <dd className="mt-1 text-xl font-semibold text-white">Free</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default About;


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
          Hi, I’m Vlad Avdeev — founder of Blue Arc Networks and a Computer Science
          student at Chico State. I bring together years of hands-on IT support,
          network engineering, and repair experience with a strong academic foundation
          in software and systems.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Technical Background</h3>
            <p className="mt-2 text-neutral-300">
              I’ve spent years working in IT support and computer repair, providing
              services for both small businesses and individual clients. I’ve built
              VPN servers and firewalls, deployed and optimized Unifi networks,
              configured smart switches, and integrated authentication systems like
              Windows Domain Radius. I also work on data recovery, server maintenance,
              and end‑to‑end network design.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Entrepreneurship</h3>
            <p className="mt-2 text-neutral-300">
              Through Blue Arc Networks, I’ve been building a professional IT services
              business around Chico and Northern California. My focus is on delivering
              reliable IT repair, smart home integrations, and network solutions for
              both businesses and consumers. I also work with subcontracting platforms
              like Field Nation and WorkMarket, gaining consistent project experience.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Academic Focus</h3>
            <p className="mt-2 text-neutral-300">
              At Chico State, I’m studying Computer Science with an emphasis on
              algorithms, networking, cloud technologies, and systems design. My
              projects range from encryption algorithms to cloud deployments using
              Docker and Kubernetes, as well as hands‑on assignments in C++, Python,
              and functional programming.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Beyond Tech</h3>
            <p className="mt-2 text-neutral-300">
              When I’m not working on IT projects or coursework, I enjoy weightlifting,
              fishing, snowboarding, and playing guitar. These activities keep me
              balanced and fuel my creativity, which I bring back into my professional
              and academic work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AnimatedText, Reveal, Magnetic } from "@/components/motion";

type IconName = "computer" | "wifi" | "server" | "camera" | "cabling" | "av";

const Icon = ({ name }: { name: IconName }) => {
  const common = "h-7 w-7 shrink-0";
  switch (name) {
    case "computer":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm6 12h4a1 1 0 1 1 0 2H10a1 1 0 1 1 0-2Z" />
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-7-7a11 11 0 0 1 14 0 1 1 0 1 0 1.41-1.41 13 13 0 0 0-16.82 0A1 1 0 0 0 5 13Zm3.5-3.5a7 7 0 0 1 7 0A1 1 0 1 0 16.91 8 9 9 0 0 0 7.09 8 1 1 0 1 0 8.5 9.5Z" />
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm0 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3Z" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M9 4a1 1 0 0 0-.8.4L6.5 6H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-1.5L15.8 4.4A1 1 0 0 0 15 4H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 11Z" />
        </svg>
      );
    case "cabling":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm0 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Zm7-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4Zm0 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Zm7-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4Zm0 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z" />
        </svg>
      );
    case "av":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm4 3a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z" />
        </svg>
      );
  }
};

type Service = {
  icon: IconName;
  title: string;
  blurb: string;
  bullets: string[];
};

const SERVICES: Service[] = [
  {
    icon: "computer",
    title: "Managed IT & Computer Support",
    blurb:
      "Onsite IT support and troubleshooting for business workstations, desktops, and peripherals — stable systems and reduced downtime.",
    bullets: [
      "Workstation setup, repair, and maintenance",
      "Virus removal & security hardening",
      "Software configuration and troubleshooting",
      "Printer, scanner, and peripheral setup",
    ],
  },
  {
    icon: "wifi",
    title: "Network Design & Wi-Fi",
    blurb:
      "Onsite network design and Wi-Fi deployment for offices, retail, and job sites with properly placed access points and secure segmentation.",
    bullets: [
      "Wi-Fi surveys, design, and AP deployment",
      "Router, switch, and firewall configuration",
      "Secure networks and VLAN segmentation",
      "Remote access and VPN setup",
    ],
  },
  {
    icon: "server",
    title: "Server & Infrastructure",
    blurb:
      "Onsite server setup, management, and troubleshooting — stable infrastructure with Active Directory, file shares, and backups.",
    bullets: [
      "Windows Server and Linux server setup",
      "Active Directory & group policies",
      "File server and network share config",
      "Backup, disaster recovery, monitoring",
    ],
  },
  {
    icon: "camera",
    title: "Surveillance Systems",
    blurb:
      "Onsite IP and analog camera installation with NVR/DVR recording and remote viewing — clean installs for site monitoring.",
    bullets: [
      "IP and analog camera installation",
      "NVR/DVR setup and remote viewing",
      "Site survey and camera placement",
      "Integration with existing security",
    ],
  },
  {
    icon: "cabling",
    title: "Structured Cabling",
    blurb:
      "Onsite Cat6 and fiber installations for workstations, PoE devices, and network infrastructure with clean termination and labeling.",
    bullets: [
      "Cat6 and fiber cable runs",
      "Patch panels and rack installation",
      "Cable organization and labeling",
      "PoE and low-voltage drops",
    ],
  },
  {
    icon: "av",
    title: "Audio / Video & Smart",
    blurb:
      "Onsite commercial display and video wall installation for conference rooms, lobbies, and retail — clean, stable AV systems.",
    bullets: [
      "Commercial display & video wall installs",
      "Meeting room and conference AV",
      "HDMI, streaming, signal troubleshooting",
      "Smart building & control integrations",
    ],
  },
];

function ServiceCardBody({ service, index }: { service: Service; index: number }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/30">
          <Icon name={service.icon} />
        </span>
        <span className="font-display text-5xl font-semibold text-white/10">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-display mt-6 text-2xl font-semibold leading-tight text-white">
        {service.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-300">{service.blurb}</p>
      <ul className="mt-5 space-y-2 text-sm text-neutral-200">
        {service.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/80" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      const st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Pinned triggers must refresh before the triggers that follow them,
        // otherwise the first section after the pin computes a wrong start.
        refreshPriority: 1,
        animation: tween,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });

      return () => {
        st.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative isolate bg-neutral-950"
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />

      {/* Desktop: pinned horizontal scroll */}
      <div ref={pinRef} className="relative hidden h-screen overflow-hidden lg:block">
        <div className="flex h-full items-center">
          <div ref={trackRef} className="flex h-full items-center gap-8 pl-[8vw] pr-[8vw]">
            {/* Intro panel */}
            <div className="flex h-[62vh] w-[42vw] shrink-0 flex-col justify-center pr-8">
              <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                01 — What we do
              </span>
              <AnimatedText
                as="h2"
                text="Our Services"
                className="font-display mt-4 text-6xl font-semibold tracking-tight text-white xl:text-7xl"
              />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-300">
                Professional IT, networking, cabling, and surveillance solutions for
                businesses, job sites, and modern commercial spaces.
              </p>
              <p className="mt-8 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
                Scroll to explore
                <svg className="h-4 w-8" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M0 8h30M24 2l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
            </div>

            {/* Service cards */}
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                data-cursor="true"
                className="group flex h-[62vh] w-[30vw] max-w-[440px] shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md transition-colors duration-300 hover:border-blue-400/40 hover:bg-white/[0.06] xl:p-10"
              >
                <ServiceCardBody service={service} index={i} />
              </article>
            ))}
          </div>
        </div>

        {/* progress bar */}
        <div className="absolute bottom-10 left-[8vw] right-[8vw] h-px bg-white/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-blue-500"
          />
        </div>
      </div>

      {/* Mobile / tablet: stacked grid with reveals */}
      <div className="px-4 py-20 lg:hidden">
        <span className="font-display block text-center text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
          01 — What we do
        </span>
        <AnimatedText
          as="h2"
          text="Our Services"
          className="font-display mt-3 text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        />
        <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-300/90">
          Professional IT, networking, cabling, and surveillance solutions for
          businesses, job sites, and modern commercial spaces.
        </p>

        <Reveal
          as="div"
          stagger={0.1}
          y={50}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {SERVICES.map((service, i) => (
            <article
              key={service.title}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md sm:p-8"
            >
              <ServiceCardBody service={service} index={i} />
            </article>
          ))}
        </Reveal>
      </div>

      <div className="pb-20 text-center lg:pb-28">
        <Magnetic strength={0.4}>
          <a
            href="#contact"
            data-cursor="Get started"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 font-semibold text-white transition hover:bg-blue-400"
          >
            Request Service
          </a>
        </Magnetic>
      </div>
    </section>
  );
}

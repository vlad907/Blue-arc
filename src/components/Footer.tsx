"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { smoothScrollTo } from "@/lib/lenis";
import { AnimatedText, Magnetic } from "@/components/motion";


const Footer = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const onClick = (e: Event) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (href.length <= 1) return;
      e.preventDefault();
      smoothScrollTo(href);
      history.pushState(null, '', href);
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="relative overflow-hidden bg-neutral-950 border-t border-white/10">
      {/* Oversized kinetic CTA */}
      <div className="relative mx-auto max-w-7xl px-6 pt-20 sm:pt-28">
        <p className="font-display text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
          Let&apos;s work together
        </p>
        <AnimatedText
          as="h2"
          text="Ready to build something reliable?"
          className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        />
        <div className="mt-10">
          <Magnetic strength={0.5}>
            <a
              href="#contact"
              data-cursor="Let's talk"
              className="group inline-flex items-center gap-3 rounded-full bg-blue-500 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-400"
            >
              Start a project
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </Magnetic>
        </div>
        <div className="mt-20 h-px w-full bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-8 pb-20 pt-16 sm:pb-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-base sm:text-sm">
          <div>
            <Image
              src={assetPath("/logos/Blue-arc-networks.png")}
              alt="Blue Arc Networks"
              width={256}
              height={64}
              className="h-20 w-auto mx-auto sm:mx-0"
            />
            <p className="mt-4 text-neutral-400 text-sm leading-relaxed text-center sm:text-left">
              Locally owned IT, networking, cabling, and surveillance for businesses across Chico and Northern California.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2 text-neutral-400 text-sm">
              <li><a href="#services" className="hover:text-sky-400">Managed IT Support</a></li>
              <li><a href="#services" className="hover:text-sky-400">Business Wi-Fi &amp; Networking</a></li>
              <li><a href="#services" className="hover:text-sky-400">Structured Cabling</a></li>
              <li><a href="#services" className="hover:text-sky-400">Surveillance Cameras</a></li>
              <li><a href="#services" className="hover:text-sky-400">Server &amp; Infrastructure</a></li>
              <li><a href="#services" className="hover:text-sky-400">Commercial AV</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-neutral-400 text-sm">
              <li><a href="#home" className="hover:text-sky-400">Home</a></li>
              <li><a href="#services" className="hover:text-sky-400">Services</a></li>
              <li><a href="#ourwork" className="hover:text-sky-400">Our Work</a></li>
              <li><a href="#about" className="hover:text-sky-400">About</a></li>
              <li><a href="#contact" className="hover:text-sky-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <address className="mt-4 space-y-2 text-neutral-400 text-sm not-italic">
              <div>Chico, California</div>
              <div>Serving Butte County &amp; Northern CA</div>
              <div>
                <a href="tel:+15302089290" className="hover:text-sky-400">(530) 208-9290</a>
              </div>
              <div>
                <a href="mailto:info@bluearcnetworks.com" className="hover:text-sky-400">info@bluearcnetworks.com</a>
              </div>
              <div className="pt-2 text-neutral-500">Mon–Fri · 9am–5pm PT</div>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Blue Arc Networks · IT &amp; Network Services in Chico, CA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

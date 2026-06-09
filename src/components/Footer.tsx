"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";


const Footer = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const navEl = document.querySelector('nav') as HTMLElement | null;

    const smoothScrollTo = (hash: string) => {
      const id = hash.replace('#', '');
      const target = document.getElementById(id);
      if (!target) return;
      const headerH = navEl?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - (headerH + 16);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

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
    <footer ref={footerRef} id="footer" className="bg-neutral-950 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-8 py-20 sm:py-24">
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

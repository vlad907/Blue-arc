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
    <footer ref={footerRef} className="bg-neutral-950 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-8 py-24 sm:py-28">
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-4 text-base sm:text-sm">
          <div>
            <Image
            src={assetPath("/logos/Blue-arc-networks.png")}
            alt="Blue Arc Networks"
            width={256}   // pick real intrinsic size
            height={64}   // keep aspect ratio correct
            className="h-24 w-auto mx-auto sm:mx-0"
            />
          </div>
          <div>
            <h3 className="text-2xl sm:text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-neutral-400 text-lg sm:text-sm">
              <li><a href="#home" className="hover:text-sky-400">Home</a></li>
              <li><a href="#services" className="hover:text-sky-400">Services</a></li>
              <li><a href="#about" className="hover:text-sky-400">About</a></li>
              <li><a href="#pricing" className="hover:text-sky-400">Pricing</a></li>
              <li><a href="#gallery" className="hover:text-sky-400">Gallery</a></li>
              <li><a href="#contact" className="hover:text-sky-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl sm:text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-neutral-400 text-lg sm:text-sm">
              <li><a href="tel:+15302089290" className="hover:text-sky-400">(530) 208-9290</a></li>
              <li><a href="mailto:info@bluearcnetworks.com" className="hover:text-sky-400">info@bluearcnetworks.com</a></li>
              <li>Chico, CA</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-base text-neutral-500">
          © {new Date().getFullYear()} Blue Arc Networks. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

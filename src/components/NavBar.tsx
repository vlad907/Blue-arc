"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

export default function NavBar() {
  const [activeId, setActiveId] = useState<string>("home");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const navEl = document.querySelector('nav');
    if (!navEl) return;
  
    const smoothScrollTo = (hash: string) => {
      const id = hash.replace('#', '');
      const target = document.getElementById(id);
      if (!target) return;
      const headerH = (navEl as HTMLElement).offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - (headerH + 16); // 16px breathing room
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
  
    // Click handler for in-page anchor links within the navbar
    const onClick = (e: Event) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (href.length <= 1) return;
      e.preventDefault();
      smoothScrollTo(href);
      // Update URL hash without page jump
      history.pushState(null, '', href);
      setOpen(false);
    };
  
    navEl.addEventListener('click', onClick);
  
    // If page loads with a hash, apply the offset scroll on mount
    const onLoadHash = () => {
      if (location.hash) {
        smoothScrollTo(location.hash);
      }
    };
    // Handle browser back/forward navigating hashes
    const onHashChange = () => {
      if (location.hash) {
        smoothScrollTo(location.hash);
      }
    };
  
    // Run after initial paint
    setTimeout(onLoadHash, 0);
    window.addEventListener('hashchange', onHashChange);

    const sections = ["home", "services", "about", "trustedby", "contact", "pricing", "gallery", "footer"];
    const onScrollSpy = () => {
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const offset = el.getBoundingClientRect().top - (navEl as HTMLElement).offsetHeight - 40;
          if (offset <= 0) {
            current = id;
          }
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScrollSpy, { passive: true });
    onScrollSpy();

    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      navEl.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", onScrollSpy);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <nav className="sticky top-0 z-50 relative border-b border-white/10 bg-gray-900/80 backdrop-blur">
      <div className="max-w-screen-xl flex flex-nowrap items-center justify-between mx-auto p-4">
        <a href="#home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
          src={assetPath("/logos/Blue-arc.png")}
          alt="Blue Arc Logo"
          width={160}   // adjust to your logo's real size
          height={64}
          className="h-10 md:h-16 w-auto"
        />
          <span className="self-center text-2xl md:text-3xl font-semibold whitespace-nowrap truncate text-white">
            Blue Arc <span className="text-blue-600 dark:text-blue-400">Networks</span>
          </span>
        </a>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-controls="navbar-default"
          aria-expanded={open}
          className="ml-2 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-300 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full w-full md:static md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col mx-4 mt-3 rounded-xl border border-transparent bg-transparent p-3 shadow-none md:mx-0 md:mt-0 md:flex-row md:space-x-6 md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <li>
              <a
                href="#home"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "home"
                    ? "text-blue-400 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#services"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "services"
                    ? "text-blue-400 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "about"
                    ? "text-blue-400 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "contact"
                    ? "text-blue-400 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "pricing"
                    ? "text-blue-400 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "gallery" ? "text-blue-400 font-semibold" : "text-white/80 hover:text-white"
                }`}
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="tel:+15302089290"
                className="block px-4 py-3 md:px-0 md:py-2 text-white/90 hover:text-white"
              >
                (530) 208-9290
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

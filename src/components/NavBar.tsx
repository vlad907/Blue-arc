"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { smoothScrollTo } from "@/lib/lenis";

/** Scroll distance (px) over which nav fully transitions from hero → solid */
const SCROLL_TRANSITION_RANGE = 160;
/** Wide enough for logo + “Blue Arc Networks” without clipping (md text-3xl) */
const BRAND_MAX_WIDTH_PX = 400;
const NAV_H_PADDING = 16;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export default function NavBar() {
  const [activeId, setActiveId] = useState<string>("home");
  const [open, setOpen] = useState<boolean>(false);
  /** 0 = hero (transparent, centered links), 1 = solid bar with brand */
  const [scrollT, setScrollT] = useState(0);
  const [navInnerW, setNavInnerW] = useState(0);
  const [ulW, setUlW] = useState(0);
  const [isMd, setIsMd] = useState(false);

  const navInnerRef = useRef<HTMLDivElement | null>(null);
  const ulRef = useRef<HTMLUListElement | null>(null);
  const rafScroll = useRef<number | null>(null);

  const updateScrollT = useCallback(() => {
    const y = window.scrollY;
    const t = clamp01(y / SCROLL_TRANSITION_RANGE);
    setScrollT(t);
  }, []);

  useLayoutEffect(() => {
    const inner = navInnerRef.current;
    const ul = ulRef.current;
    if (!inner) return;

    const ro = new ResizeObserver(() => {
      setNavInnerW(inner.clientWidth);
      if (ul) setUlW(ul.offsetWidth);
    });
    ro.observe(inner);
    if (ul) ro.observe(ul);
    setNavInnerW(inner.clientWidth);
    if (ul) setUlW(ul.offsetWidth);

    return () => ro.disconnect();
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsMd(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const navEl = document.querySelector("nav");
    if (!navEl) return;

    const onClick = (e: Event) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.length <= 1) return;
      e.preventDefault();
      smoothScrollTo(href);
      history.pushState(null, "", href);
      setOpen(false);
    };

    navEl.addEventListener("click", onClick);

    const onLoadHash = () => {
      if (location.hash) {
        smoothScrollTo(location.hash);
      }
    };
    const onHashChange = () => {
      if (location.hash) {
        smoothScrollTo(location.hash);
      }
    };

    setTimeout(onLoadHash, 0);
    window.addEventListener("hashchange", onHashChange);

    const sections = ["home", "services", "ourwork", "about", "trustedby", "contact", "footer"];
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

    const onScroll = () => {
      if (rafScroll.current != null) cancelAnimationFrame(rafScroll.current);
      rafScroll.current = requestAnimationFrame(() => {
        rafScroll.current = null;
        updateScrollT();
        onScrollSpy();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    onScrollSpy();

    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
      updateScrollT();
    };
    window.addEventListener("resize", onResize);

    return () => {
      navEl.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafScroll.current != null) cancelAnimationFrame(rafScroll.current);
    };
  }, [updateScrollT]);

  const t = scrollT;
  // On mobile, cap the brand area so the hamburger button always stays on-screen.
  // 56px leaves room for the 40px button + the row's 16px padding/gap.
  const brandMaxW = isMd
    ? BRAND_MAX_WIDTH_PX
    : Math.max(0, Math.min(BRAND_MAX_WIDTH_PX, navInnerW - 56));
  const brandW = t * brandMaxW;

  /**
   * Desktop: links sit in a flex-1 + justify-end region (flush right at t=1).
   * At t=0 we translate left so the cluster reads centered; at t=1 translate is 0 (right-aligned).
   */
  const navMid = navInnerW > 0 ? navInnerW / 2 : 0;
  const ulMidWhenRightAligned =
    navInnerW > 0 && ulW > 0 ? navInnerW - NAV_H_PADDING - ulW / 2 : 0;
  const centerOffset = navInnerW > 0 && ulW > 0 ? navMid - ulMidWhenRightAligned : 0;
  const linkTranslateX = isMd ? centerOffset * (1 - t) : 0;

  const bgAlpha = 0.85 * t;
  const borderAlpha = 0.1 * t;
  const blurPx = 12 * t;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `rgba(17, 24, 39, ${bgAlpha})`,
        borderBottom: `1px solid rgba(255, 255, 255, ${borderAlpha})`,
        backdropFilter: blurPx > 0.5 ? `blur(${blurPx}px)` : "none",
        WebkitBackdropFilter: blurPx > 0.5 ? `blur(${blurPx}px)` : "none",
        transition: "background-color 0.05s linear, border-color 0.05s linear",
      }}
    >
      <div
        ref={navInnerRef}
        className="relative mx-auto flex max-w-screen-xl flex-nowrap items-center gap-3 p-4"
      >
        <div
          className="shrink-0 overflow-hidden"
          style={{
            width: `${brandW}px`,
            maxWidth: brandMaxW,
          }}
        >
          <a
            href="#home"
            className="flex items-center space-x-3 rtl:space-x-reverse"
            style={{
              opacity: t,
              pointerEvents: t < 0.08 ? "none" : "auto",
              width: brandMaxW,
              minWidth: brandMaxW,
            }}
          >
            <Image
              src={assetPath("/logos/Blue-arc.png")}
              alt="Blue Arc Logo"
              width={160}
              height={64}
              className="h-10 w-auto shrink-0 md:h-16"
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-white md:text-3xl">
              Blue Arc <span className="text-blue-600 dark:text-blue-400">Networks</span>
            </span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-controls="navbar-default"
          aria-expanded={open}
          aria-label={open ? "Close main menu" : "Open main menu"}
          className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 md:hidden"
        >
          <span className="sr-only">{open ? "Close main menu" : "Open main menu"}</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M6 18L18 6" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>

        <div
          className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full w-full md:static md:ml-0 md:flex md:min-w-0 md:flex-1 md:justify-end md:overflow-visible`}
          id="navbar-default"
        >
          <ul
            ref={ulRef}
            className={`font-medium mx-4 mt-3 flex shrink-0 flex-col rounded-xl border p-3 shadow-xl shadow-black/40 md:mx-0 md:mt-0 md:flex-row md:items-center md:space-x-6 md:rounded-none md:border-0 md:p-0 md:shadow-none ${
              open
                ? "border-white/10 bg-neutral-950/95 backdrop-blur-md md:border-transparent md:bg-transparent md:backdrop-blur-0"
                : "border-transparent bg-transparent md:bg-transparent"
            }`}
            style={{
              transform: isMd ? `translateX(${linkTranslateX}px)` : undefined,
              transition: isMd ? "transform 0.04s linear" : undefined,
            }}
          >
            <li>
              <a
                href="#home"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "home" ? "font-semibold text-blue-400" : "text-white/80 hover:text-white"
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
                  activeId === "services" ? "font-semibold text-blue-400" : "text-white/80 hover:text-white"
                }`}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#ourwork"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "ourwork" ? "font-semibold text-blue-400" : "text-white/80 hover:text-white"
                }`}
              >
                Our Work
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "about" ? "font-semibold text-blue-400" : "text-white/80 hover:text-white"
                }`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`block px-4 py-3 md:px-0 md:py-2 ${
                  activeId === "contact" ? "font-semibold text-blue-400" : "text-white/80 hover:text-white"
                }`}
              >
                Contact
              </a>
            </li>
            <li>
              <a href="tel:+15302089290" className="block px-4 py-3 text-white/90 hover:text-white md:px-0 md:py-2">
                (530) 208-9290
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

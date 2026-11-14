"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { smoothScrollTo, getLenis } from "@/lib/lenis";

/** Scroll distance (px) over which nav fully transitions from hero → solid */
const SCROLL_TRANSITION_RANGE = 160;
/** Wide enough for logo + “Blue Arc Networks” without clipping (md text-3xl) */
const BRAND_MAX_WIDTH_PX = 400;
const NAV_H_PADDING = 16;

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#ourwork", label: "Our Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

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
  }, []);

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
      setOpen(false);
      smoothScrollTo(href);
      history.pushState(null, "", href);
    };

    navEl.addEventListener("click", onClick);

    // Note: the initial page-load hash (deep links from search results) is
    // handled by <HashScroll>, which re-aligns after lazy content settles.
    const onHashChange = () => {
      if (location.hash) {
        smoothScrollTo(location.hash);
      }
    };

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

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const t = scrollT;
  const brandMaxW = BRAND_MAX_WIDTH_PX;
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

  // On mobile the bar stays legible over the hero even at the top.
  const mobileBgAlpha = open ? 0 : Math.max(0.35, 0.85 * t);
  const bgAlpha = isMd ? 0.85 * t : mobileBgAlpha;
  const borderAlpha = 0.1 * t;
  const blurPx = (isMd ? 12 : 10) * (open ? 0 : Math.max(t, isMd ? 0 : 0.5));

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
        className="relative z-50 mx-auto flex max-w-screen-xl flex-nowrap items-center gap-3 p-4"
      >
        {/* Desktop animated brand (reveals on scroll) */}
        <div
          className="hidden shrink-0 overflow-hidden md:block"
          style={{ width: `${brandW}px`, maxWidth: brandMaxW }}
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
              src={assetPath("/logos/Blue-arc-sm.png")}
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

        {/* Mobile brand — always visible so the bar is never just a lone button */}
        <a
          href="#home"
          className="flex items-center gap-2.5 md:hidden"
          aria-label="Blue Arc Networks home"
        >
          <Image
            src={assetPath("/logos/Blue-arc-sm.png")}
            alt="Blue Arc Networks logo"
            width={120}
            height={48}
            className="h-8 w-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          />
          <span className="whitespace-nowrap text-base font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            Blue Arc <span className="text-blue-400">Networks</span>
          </span>
        </a>

        {/* Hamburger / close */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Close main menu" : "Open main menu"}
          className="relative z-10 ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white backdrop-blur transition hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 md:hidden"
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

        {/* Desktop links */}
        <div className="hidden md:ml-0 md:flex md:min-w-0 md:flex-1 md:justify-end md:overflow-visible">
          <ul
            ref={ulRef}
            className="flex flex-row items-center space-x-6 font-medium"
            style={{
              transform: isMd ? `translateX(${linkTranslateX}px)` : undefined,
              transition: isMd ? "transform 0.04s linear" : undefined,
            }}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`block py-2 ${
                    activeId === link.href.slice(1)
                      ? "font-semibold text-blue-400"
                      : "text-white/80 hover:text-white"
                  }`}
                  {...(link.href === "#home" ? { "aria-current": "page" as const } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="tel:+15302089290" className="block py-2 text-white/90 hover:text-white">
                (530) 208-9290
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile full-screen overlay menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transition: "opacity 0.3s ease" }}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-neutral-950/97 backdrop-blur-xl"
        />
        <div
          className="relative flex h-full flex-col px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-24"
          style={{
            transform: open ? "translateY(0)" : "translateY(-8px)",
            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.href.slice(1);
              return (
                <li key={link.href} className="border-b border-white/10">
                  <a
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                    className={`font-display flex items-center justify-between py-4 text-3xl font-semibold tracking-tight transition ${
                      active ? "text-blue-400" : "text-white hover:text-blue-300"
                    }`}
                  >
                    {link.label}
                    {active && <span className="h-2 w-2 rounded-full bg-blue-400" aria-hidden />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto space-y-3 pt-8">
            <a
              href="#contact"
              tabIndex={open ? 0 : -1}
              className="flex min-h-[52px] items-center justify-center rounded-full bg-blue-500 px-6 text-base font-semibold text-white transition active:bg-blue-600"
            >
              Get a Quote
            </a>
            <a
              href="tel:+15302089290"
              tabIndex={open ? 0 : -1}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-base font-semibold text-white transition active:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2.25 6.75a.75.75 0 0 1 .75-.75h2.37a1.5 1.5 0 0 1 1.48 1.22l.44 2.2a1.5 1.5 0 0 1-.43 1.39l-1.1 1.1a12.06 12.06 0 0 0 5.82 5.82l1.1-1.1a1.5 1.5 0 0 1 1.39-.43l2.2.44a1.5 1.5 0 0 1 1.22 1.48v2.37a.75.75 0 0 1-.75.75h-1.5C8.41 21 3 15.59 3 9.75v-1.5z" />
              </svg>
              Call (530) 208-9290
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

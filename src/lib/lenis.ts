import type Lenis from "lenis";

/**
 * Global Lenis singleton so non-provider modules (NavBar, Footer, modals) can
 * drive the smooth-scroll instance without prop drilling or context.
 */
let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Smoothly scroll to an element by hash ("#id") or element, honoring the fixed
 * navbar height as an offset. Uses Lenis when available, native scroll otherwise.
 */
export function smoothScrollTo(hashOrEl: string | HTMLElement) {
  const navEl = document.querySelector("nav") as HTMLElement | null;
  const headerH = navEl?.offsetHeight ?? 0;
  const offset = -(headerH + 16);

  let target: HTMLElement | null = null;
  if (typeof hashOrEl === "string") {
    const id = hashOrEl.replace("#", "");
    target = document.getElementById(id);
  } else {
    target = hashOrEl;
  }
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

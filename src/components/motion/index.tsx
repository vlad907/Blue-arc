"use client";

import React, {
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/lenis";

/* -------------------------------------------------------------------------- */
/*  Reveal — fade/slide an element (or stagger its children) in on scroll      */
/* -------------------------------------------------------------------------- */

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** vertical travel in px */
  y?: number;
  delay?: number;
  duration?: number;
  /** when set, animates direct children with this stagger instead of the wrapper */
  stagger?: number;
  /** scale start (subtle pop) */
  scaleFrom?: number;
  start?: string;
  id?: string;
};

export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 44,
  delay = 0,
  duration = 1,
  stagger,
  scaleFrom = 1,
  start = "top 85%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets =
        stagger != null ? (Array.from(el.children) as HTMLElement[]) : el;
      // fromTo (not from) so React StrictMode's double effect-invoke can't
      // record the already-hidden value as the tween's end state.
      gsap.fromTo(
        targets,
        { opacity: 0, y, scale: scaleFrom },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          stagger: stagger ?? undefined,
          scrollTrigger: { trigger: el, start },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, duration, stagger, scaleFrom, start]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      id={id}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  AnimatedText — masked, word-by-word headline reveal                         */
/* -------------------------------------------------------------------------- */

type AnimatedTextProps = {
  text: string;
  className?: string;
  as?: ElementType;
  stagger?: number;
  delay?: number;
  start?: string;
};

export function AnimatedText({
  text,
  className,
  as: Tag = "div",
  stagger = 0.08,
  delay = 0,
  start = "top 88%",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll<HTMLElement>(".at-inner"),
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, start, text]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="at-mask inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <span className="at-inner inline-block will-change-transform">
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  ScrubText — words brighten from dim to full as the block scrolls through   */
/* -------------------------------------------------------------------------- */

type ScrubTextProps = {
  text: string;
  className?: string;
  as?: ElementType;
};

export function ScrubText({ text, className, as: Tag = "p" }: ScrubTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll<HTMLElement>(".scrub-word"), {
        opacity: 1,
        stagger: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 55%",
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="scrub-word opacity-25 transition-none">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Magnetic — child element eases toward the cursor while hovered              */
/* -------------------------------------------------------------------------- */

export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Marquee — infinite scroll that reacts to scroll velocity + direction       */
/* -------------------------------------------------------------------------- */

export function Marquee({
  children,
  baseSpeed = 24,
  direction = 1,
  className,
}: {
  children: ReactNode;
  /** seconds for one full loop; smaller = faster */
  baseSpeed?: number;
  direction?: 1 | -1;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const baseTimeScale = direction;
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: baseSpeed,
        ease: "none",
        repeat: -1,
      });
      tween.timeScale(baseTimeScale);

      let resetTimer: number | undefined;
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (!v) return;
          const dir = v < 0 ? -1 : 1;
          const boost = Math.min(Math.abs(v) / 250, 6);
          gsap.to(tween, {
            timeScale: dir * (1 + boost),
            duration: 0.2,
            overwrite: true,
          });
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            gsap.to(tween, {
              timeScale: baseTimeScale,
              duration: 0.8,
              overwrite: true,
            });
          }, 140);
        },
      });

      return () => {
        window.clearTimeout(resetTimer);
        st.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [baseSpeed, direction]);

  return (
    <div ref={rootRef} className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex w-max flex-nowrap">
        <div className="flex flex-nowrap items-center">{children}</div>
        <div className="flex flex-nowrap items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Counter — counts up from 0 when scrolled into view                          */
/* -------------------------------------------------------------------------- */

export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }

    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${obj.n.toFixed(decimals)}${suffix}`;
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, prefix, suffix, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Parallax — translate an element as it moves through the viewport            */
/* -------------------------------------------------------------------------- */

export function Parallax({
  children,
  className,
  speed = 0.2,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** positive = moves up as you scroll down */
  speed?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </Tag>
  );
}

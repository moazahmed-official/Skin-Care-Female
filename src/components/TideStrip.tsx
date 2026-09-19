"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A scroll-scrubbed tide: the contour stack drifts and the horizon fills as
 * the section crosses the viewport. This is the one effect that genuinely
 * needs GSAP — it is scrubbed to scroll position rather than triggered once,
 * which ScrollTrigger does far better than an IntersectionObserver.
 */
let registered = false;

const LINES = 16;

export function TideStrip({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll<SVGPathElement>("[data-line]");
      gsap.to(lines, {
        xPercent: (i) => -6 - i * 1.4,
        ease: "none",
        stagger: 0.01,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.fromTo(
        el.querySelector("[data-fill]"),
        { scaleY: 0.25 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "bottom",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "center center",
            scrub: 0.6,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-40 overflow-hidden bg-ink md:h-56"
    >
      <div
        data-fill
        className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-brine/45 to-transparent"
      />
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {Array.from({ length: LINES }).map((_, i) => {
          const y = 14 + i * 13;
          return (
            <path
              key={i}
              data-line
              d={`M-200 ${y} C 160 ${y - 12}, 420 ${y + 14}, 720 ${y} S 1240 ${y - 16}, 1640 ${y + 5}`}
              stroke="#a8d0c6"
              strokeWidth="1"
              fill="none"
              opacity={0.5 - i * 0.024}
            />
          );
        })}
      </svg>
      <p className="eyebrow absolute bottom-5 left-1/2 -translate-x-1/2 text-salt/40">
        {label}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP ScrollTrigger wrapper used for the homepage's longer-form sections,
 * where scroll position drives the reveal rather than simple viewport entry.
 * Registration happens once, client-side only.
 */
let registered = false;

export function ScrollReveal({
  children,
  /** Stagger children matching this selector instead of the container. */
  selector,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  selector?: string;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const targets = selector
      ? Array.from(el.querySelectorAll<HTMLElement>(selector))
      : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: selector ? 0.09 : 0,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [selector, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

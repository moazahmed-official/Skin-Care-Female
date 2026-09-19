"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { Vessel } from "@/components/Vessel";

/**
 * SIGNATURE INTERACTION — "The Tide Line"
 *
 * The hero is a single horizon rule with the wordline above it and the
 * water below. Pointer movement (or scroll, or the arrow keys) drags the
 * tide across three formulations; as it moves, the water band's height,
 * the stack of contour lines, and the bottle beneath all respond, and the
 * copy under the line crossfades to that product's own claim.
 *
 * Everything is driven by one normalised value, `t` (0–1), so pointer,
 * keyboard, touch and reduced-motion fallbacks all feed the same model.
 */

const featured = ["cold-current", "long-night", "noon-mineral"]
  .map((s) => products.find((p) => p.slug === s)!)
  .filter(Boolean);

const CONTOURS = 13;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const bottleRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0.5);
  const currentRef = useRef(0.5);
  const rafRef = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // The animation loop. Reduced motion skips the loop entirely and the
  // component behaves as a static, fully legible composition.
  useEffect(() => {
    if (reduced) return;

    let mounted = true;

    const render = () => {
      if (!mounted) return;
      // Critically-damped follow: the tide never snaps, it settles.
      currentRef.current += (targetRef.current - currentRef.current) * 0.075;
      const t = currentRef.current;

      if (waterRef.current) {
        waterRef.current.style.transform = `translate3d(0, ${(0.5 - t) * 14}%, 0)`;
      }

      pathRefs.current.forEach((p, i) => {
        if (!p) return;
        const depth = i / CONTOURS;
        const drift = (t - 0.5) * (30 + depth * 90);
        const lift = Math.sin((t * Math.PI * 2) + depth * 2.4) * (2 + depth * 5);
        p.setAttribute("transform", `translate(${drift} ${lift})`);
      });

      if (bottleRef.current) {
        bottleRef.current.style.transform = `translate3d(${(t - 0.5) * -26}px, ${(0.5 - t) * 12}px, 0) rotate(${(t - 0.5) * 2.4}deg)`;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  // Pointer drives the tide; it also selects which formulation is shown.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      targetRef.current = Math.min(Math.max(x, 0), 1);
      const idx = Math.min(Math.floor(x * featured.length), featured.length - 1);
      setActive((prev) => (prev === idx ? prev : idx));
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  const select = (i: number) => {
    setActive(i);
    targetRef.current = (i + 0.5) / featured.length;
    if (reduced) currentRef.current = targetRef.current;
  };

  const product = featured[active];

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-salt"
    >
      {/* ---- The water field --------------------------------------- */}
      <div
        ref={waterRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] will-change-transform sm:top-[46%]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brine/12 via-brine/22 to-ink/85" />
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {Array.from({ length: CONTOURS }).map((_, i) => {
            const y = 24 + i * 30;
            return (
              <path
                key={i}
                ref={(node) => {
                  pathRefs.current[i] = node;
                }}
                d={`M-120 ${y} C 180 ${y - 16}, 420 ${y + 18}, 720 ${y} S 1260 ${y - 20}, 1560 ${y + 6}`}
                fill="none"
                stroke={i < 5 ? "#1f5a5c" : "#a8d0c6"}
                strokeWidth={i < 4 ? 1 : 0.9}
                opacity={0.42 - i * 0.022}
                className="will-change-transform"
              />
            );
          })}
        </svg>
      </div>

      {/* ---- The horizon rule -------------------------------------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-ink/25 sm:top-[46%]"
      />

      <div className="shell relative flex min-h-[86svh] flex-col justify-between pb-10 pt-14 sm:min-h-[92svh] sm:pt-20">
        {/* ---- Above the line ------------------------------------- */}
        <div className="max-w-4xl">
          <p className="eyebrow text-ink/50">Kirkwall, Orkney · 59°N</p>
          <h1 id="hero-heading" className="display-xl mt-6">
            Cold water
            <br />
            <span className="italic text-brine">makes better</span>
            <br />
            skin.
          </h1>
          <p className="prose-body mt-7 max-w-md">
            Sixteen products. Every concentration printed on the carton, because
            a percentage you cannot read is a percentage that is not there.
          </p>
        </div>

        {/* ---- Below the line ------------------------------------- */}
        <div className="relative mt-16 grid gap-8 text-salt md:mt-24 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5" aria-live="polite">
            <p className="eyebrow text-brine-light/70">
              {String(active + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
            </p>
            <h2 className="display-md mt-3">
              <Link href={`/product/${product.slug}`} className="link-underline">
                {product.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-salt/60">{product.descriptor}</p>
            <p
              key={product.slug}
              className="prose-body mt-4 max-w-sm text-salt/75"
              style={{ animation: reduced ? undefined : "heroFade 0.6s var(--ease-tide)" }}
            >
              {product.shelfLine}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/product/${product.slug}`}
                className="bg-salt px-7 py-3.5 text-sm text-ink transition-colors hover:bg-copper-light"
              >
                Read the formula
              </Link>
              <Link href="/routines" className="link-underline text-sm text-salt/80">
                Or start with a sequence
              </Link>
            </div>
          </div>

          {/* The bottle, riding the tide. */}
          <div className="md:col-span-4 md:col-start-9">
            <div
              ref={bottleRef}
              className="mx-auto w-40 will-change-transform sm:w-48 md:ml-auto md:mr-0"
            >
              <Vessel
                vessel={product.vessel}
                uid={`hero-${product.slug}`}
                mark={product.name.slice(0, 1)}
                className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </div>

        {/* ---- Tide control: keyboard-operable, not decorative ----- */}
        {/* Not a tablist: there are no tabpanels. It is a group of toggles
            that swap the featured formulation shown above. */}
        <div
          role="group"
          aria-label="Featured formulations"
          className="relative mt-10 flex items-center gap-1 border-t border-salt/20 pt-4"
        >
          {featured.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-pressed={active === i}
              onClick={() => select(i)}
              onFocus={() => select(i)}
              className={`flex-1 border-t-2 pt-3 text-left transition-colors ${
                active === i
                  ? "border-copper-light text-salt"
                  : "border-transparent text-salt/45 hover:text-salt/75"
              }`}
            >
              <span className="eyebrow block truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

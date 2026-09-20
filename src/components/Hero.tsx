"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { Vessel } from "@/components/Vessel";

/**
 * SIGNATURE INTERACTION — "The Tide Line"
 *
 * The hero is built around a single cinematic plate: real footage of cold
 * North Atlantic water, shot close to the surface. No synthetic geometry,
 * no shader standing in for water — the realism comes from the footage
 * itself, graded to the brand's tidal-ink palette. The site's job is to
 * compose around it, not to fake it.
 *
 * The tide value `t` (0–1) still ties pointer, keyboard and product
 * selection together, but its job changed with the medium: rather than
 * deforming a wave mesh, it makes a restrained, cinematographer's set of
 * adjustments — a slow parallax drift on the plate, a soft vignette
 * breathing with intent, and the crossfade between the three featured
 * formulations. Nothing "plays" the water like an instrument; it stays
 * a real, continuous, gently observed body of water throughout.
 *
 * The video is muted, loops, and autoplays only past a readiness gate so
 * the poster frame — extracted from the same encode, so grade and crop
 * always match exactly — is what reduced-motion visitors, slow
 * connections, and the very first paint see. Nothing about legibility
 * depends on the video loading.
 *
 * There is exactly one encoded source and one `<section>`. Every
 * viewport renders the same shot with `object-cover`; nothing swaps a
 * different "mobile" composition or stacks a second hero underneath —
 * the frame is simply cropped by however much of it the viewport shows,
 * the way a photograph would be.
 *
 * As the visitor scrolls past the hero, the plate recedes and softens —
 * a handoff into the next section rather than a hard cut.
 */

const featured = ["cold-current", "long-night", "noon-mineral"]
  .map((s) => products.find((p) => p.slug === s)!)
  .filter(Boolean);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const scrollFxRef = useRef<HTMLDivElement>(null);
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

  // The animation loop: a restrained, cinematographer's set of moves —
  // slow parallax drift on the plate and the bottle, nothing that reads
  // as "driving" the water itself.
  useEffect(() => {
    if (reduced) return;

    let mounted = true;

    const render = () => {
      if (!mounted) return;
      // Critically-damped follow: the tide never snaps, it settles.
      currentRef.current += (targetRef.current - currentRef.current) * 0.06;
      const t = currentRef.current;

      if (plateRef.current) {
        const dx = (t - 0.5) * 14;
        const dy = (0.5 - t) * 6;
        const scale = 1.06 + Math.abs(t - 0.5) * 0.02;
        plateRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      }

      if (bottleRef.current) {
        bottleRef.current.style.transform = `translate3d(${(t - 0.5) * -18}px, ${(0.5 - t) * 8}px, 0) rotate(${(t - 0.5) * 1.6}deg)`;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  // Pointer drags the tide sideways across three formulations — the same
  // gesture the site has always used, now reading as a slow reframe of
  // the shot rather than a control surface for the water.
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

  // Scroll choreography: the plate recedes and softens as the visitor
  // scrolls into the next section — a handoff, not a hard cut. The video
  // is paused once fully off-intensity to save decode cost.
  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    const fx = scrollFxRef.current;
    if (!el || !fx) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const h = rect.height || 1;
      const progress = Math.min(Math.max(-rect.top / h, 0), 1);
      fx.style.transform = `translate3d(0, ${progress * 30}px, 0) scale(${1 - progress * 0.03})`;
      fx.style.opacity = String(1 - progress * 0.55);

      const v = videoRef.current;
      if (v && v.readyState >= 2) {
        if (progress > 0.97 && !v.paused) v.pause();
        else if (progress <= 0.97 && v.paused) v.play().catch(() => {});
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

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
      className="relative isolate overflow-hidden bg-ink text-salt"
    >
      {/* A CSS grid with one track: water plate and content column are
          stacked in the same cell, so the content column's natural
          height (it's the only thing that actually has intrinsic
          height — the plate is just told to fill whatever that turns
          out to be) is what sizes the whole hero on every viewport.
          This is what keeps the video/poster and the text column
          exactly the same height as each other, on mobile and desktop
          alike — no more plate ending early and a second panel showing
          through beneath it, and no separate background-image layer
          left visible at the edges once the video is playing. */}
      <div
        ref={scrollFxRef}
        className="grid min-h-140 will-change-transform sm:min-h-[92svh]"
      >
        {/* ---- The water plate ------------------------------------ */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative col-start-1 row-start-1 h-full w-full overflow-hidden"
        >
          {/* One image, one video, nothing else. The <video> carries its
              own native `poster` for the pre-decode frame and the
              reduced-motion fallback — there is no separate background-
              image layer sitting underneath it. */}
          <div
            ref={plateRef}
            className="absolute inset-0 h-full w-full will-change-transform"
          >
            {reduced ? (
              <div
                className="absolute inset-0 h-full w-full bg-cover bg-center"
                style={{ backgroundImage: "url(/hero-water/poster.jpg)" }}
              />
            ) : (
              // One file, one crop, everywhere. object-cover fills the
              // section edge-to-edge on every viewport from the same
              // source — there is no separate "mobile version" with a
              // different composition; the water reads as the same
              // single shot at every size, only reframed by how much of
              // it the viewport happens to show.
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                poster="/hero-water/poster.jpg"
                src="/hero-water/ocean.mp4"
              />
            )}
          </div>

          {/* A single graded depth pass over the plate: it darkens the
              lower two-thirds toward ink (where the wordline and copy
              sit) without touching the footage's own tonal range near
              the top, where the water is already doing the work. */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-ink/15 to-ink/55" />
          <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-transparent" />
        </div>

        <div className="shell relative col-start-1 row-start-1 flex flex-col justify-between gap-12 pb-8 pt-14 sm:gap-0 sm:pb-10 sm:pt-20">
          {/* ---- Above the line ------------------------------------- */}
          <div className="max-w-4xl">
            <p className="eyebrow text-salt/60">Kirkwall, Orkney · 59°N</p>
            <h1 id="hero-heading" className="display-xl mt-5 text-salt sm:mt-6">
              Cold water
              <br />
              <span className="italic text-brine-light">makes better</span>
              <br />
              skin.
            </h1>
            <p className="prose-body mt-6 max-w-md text-salt/80 sm:mt-7">
              Sixteen products. Every concentration printed on the carton, because
              a percentage you cannot read is a percentage that is not there.
            </p>
          </div>

          {/* ---- Below the line ------------------------------------- */}
          <div className="relative mt-10 grid gap-7 text-salt sm:mt-16 md:mt-24 md:grid-cols-12 md:items-end md:gap-8">
            {/* The bottle — a quiet presence in its own region of the
                frame, not a centred hero object competing with the water. */}
            <div className="order-1 md:order-2 md:col-span-4 md:col-start-9">
              <div
                ref={bottleRef}
                className="mx-auto w-24 will-change-transform sm:w-40 md:ml-auto md:mr-0"
              >
                <Vessel
                  vessel={product.vessel}
                  uid={`hero-${product.slug}`}
                  mark={product.name.slice(0, 1)}
                  className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <div className="order-2 md:order-1 md:col-span-5" aria-live="polite">
              <p className="eyebrow text-brine-light/80">
                {String(active + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
              </p>
              <h2 className="display-md mt-2.5 sm:mt-3">
                <Link href={`/product/${product.slug}`} className="link-underline">
                  {product.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-salt/70">{product.descriptor}</p>
              <p
                key={product.slug}
                className="prose-body mt-3 max-w-sm text-salt/85 sm:mt-4"
                style={{ animation: reduced ? undefined : "heroFade 0.6s var(--ease-tide)" }}
              >
                {product.shelfLine}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-8">
                <Link
                  href={`/product/${product.slug}`}
                  className="inline-flex h-12 items-center bg-salt px-7 text-sm text-ink transition-colors hover:bg-copper-light"
                >
                  Read the formula
                </Link>
                <Link href="/routines" className="link-underline text-sm text-salt/85">
                  Or start with a sequence
                </Link>
              </div>
            </div>
          </div>

          {/* ---- Tide control: keyboard-operable, not decorative ----- */}
          {/* Not a tablist: there are no tabpanels. It is a group of toggles
              that swap the featured formulation shown above. */}
          <div
            role="group"
            aria-label="Featured formulations"
            className="relative mt-8 flex items-center gap-1 border-t border-salt/25 pt-4 sm:mt-10"
          >
            {featured.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-pressed={active === i}
                onClick={() => select(i)}
                onFocus={() => select(i)}
                className={`flex-1 border-t-2 py-3 text-left transition-colors ${
                  active === i
                    ? "border-copper-light text-salt"
                    : "border-transparent text-salt/50 hover:text-salt/80"
                }`}
              >
                <span className="eyebrow block truncate">{p.name}</span>
              </button>
            ))}
          </div>

          {/* ---- Scroll cue: leads the eye into the next section ----- */}
          <button
            type="button"
            aria-label="Scroll to see what Lumen & Salt stands behind"
            onClick={() => {
              const bottom = rootRef.current?.getBoundingClientRect().bottom ?? 0;
              window.scrollTo({
                top: bottom + window.scrollY - 1,
                behavior: reduced ? "auto" : "smooth",
              });
            }}
            className="group absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          >
            <span className="eyebrow text-salt/45 transition-colors group-hover:text-salt/75">
              Scroll
            </span>
            <svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              aria-hidden="true"
              className={reduced ? "" : "animate-[tideBob_2.2s_ease-in-out_infinite]"}
            >
              <path
                d="M5 0v14M1 10l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.1"
                className="text-salt/50 transition-colors group-hover:text-salt/80"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes tideBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}</style>
    </section>
  );
}

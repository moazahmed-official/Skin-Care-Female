"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * THE HERO — a single cinematic plate: real footage of cold North
 * Atlantic water, shot close to the surface. No synthetic geometry, no
 * shader standing in for water — the realism comes from the footage
 * itself, graded to the brand's tidal-ink palette. The site's job is to
 * compose around it, not to fake it.
 *
 * The composition borrows the brand's own device rather than inventing
 * a hero-specific one: everywhere else on the site, a claim sits next
 * to a number (16 products, SPF 50, 0% fragrance) instead of an
 * adjective. The hero is the one place that device was missing — it
 * read as a generic "headline over video" pattern because it was one.
 * The headline now sits low and left, asymmetric rather than centred,
 * with a thin rule and the same three-figure evidence strip used on
 * the homepage running beside it — specific, not decorative.
 *
 * Contrast is enforced, not hoped for: every line of text sits on top of
 * a scrim weighted toward the lower third, where the whole composition
 * now lives, so it reads clearly regardless of what the footage is
 * doing underneath it at that moment.
 *
 * The video is muted, loops, and autoplays; the poster frame — extracted
 * from the same encode, so grade and crop always match exactly — is
 * what reduced-motion visitors, slow connections, and the very first
 * paint see. Nothing about legibility depends on the video loading.
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

const evidence = [
  { figure: "16", label: "Products. No plans for a seventeenth." },
  { figure: "SPF 50", label: "The one thing we'd tell you to buy first." },
  { figure: "0%", label: "Fragrance added for the smell of it." },
];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollFxRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0.5);
  const currentRef = useRef(0.5);
  const rafRef = useRef<number | null>(null);

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // The animation loop: a restrained, cinematographer's set of moves —
  // slow parallax drift on the plate, nothing that reads as "driving"
  // the water itself.
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

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  // Pointer drifts the plate very slightly — an atmospheric response,
  // not a control surface. Kept subtle on purpose: this hero's job is
  // to read clearly, not to demonstrate interactivity.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      targetRef.current = Math.min(Math.max(x, 0), 1);
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

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-ink text-salt"
    >
      {/* A CSS grid with one track: water plate and content column are
          stacked in the same cell, so the content column's natural
          height is what sizes the whole hero on every viewport. This is
          what keeps the video/poster and the text column exactly the
          same height as each other, on mobile and desktop alike. */}
      <div
        ref={scrollFxRef}
        className="grid min-h-160 will-change-transform sm:min-h-[92svh] sm:max-h-260"
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

          {/* Contrast scrim: one clean gradient, darkest at the very
              bottom edge where the composition lives, easing to a
              light touch at the top. Kept to a single layer — two
              stacked gradients here previously compounded into a soft
              bloom low in the frame that read as an unwanted glow
              rather than a tonal shift. */}
          <div className="absolute inset-0 bg-linear-to-b from-ink/20 to-ink/75" />
        </div>

        <div className="shell relative col-start-1 row-start-1 flex flex-col justify-end pb-14 pt-14 sm:pb-16 sm:pt-20">
          {/* Eyebrow sits high and alone — a quiet establishing line,
              not part of the main block below it. */}
          <p className="eyebrow text-salt drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Kirkwall, Orkney · 59°N
          </p>

          {/* The composition: headline held left and low against the
              frame — asymmetric, editorial, the way the rest of the
              site sets a claim next to evidence rather than floating
              text in the centre of a canvas. The evidence strip below
              it borrows the brand's own device (a figure standing in
              for an adjective) straight from the homepage, so the hero
              reads as this brand's opening line rather than a generic
              "headline over video" pattern. */}
          <div className="mt-auto grid gap-10 sm:grid-cols-12 sm:items-end sm:gap-8">
            <div className="sm:col-span-8 lg:col-span-7">
              <h1
                id="hero-heading"
                className="display-xl text-salt drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
              >
                Cold water
                <br />
                <span className="italic text-brine-light">makes better</span>
                <br />
                skin.
              </h1>
              <p className="prose-body mt-6 max-w-md text-salt drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]">
                Every concentration printed on the carton, because a
                percentage you cannot read is a percentage that is not there.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center bg-salt px-7 text-sm text-ink transition-colors hover:bg-copper-light"
                >
                  Shop the catalogue
                </Link>
                <Link
                  href="/routines"
                  className="link-underline text-sm text-salt drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
                >
                  Or start with a sequence
                </Link>
              </div>
            </div>

            {/* The evidence strip — three figures, borrowed from the
                homepage's own claim-plus-number device. Runs beside the
                headline on wide screens, drops below it on narrow ones. */}
            <dl className="grid grid-cols-3 gap-5 border-t border-salt/25 pt-5 sm:col-span-4 sm:col-start-9 sm:grid-cols-1 sm:gap-6 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0 lg:col-span-5 lg:col-start-8">
              {evidence.map((e) => (
                <div key={e.figure}>
                  <dt className="font-display text-2xl text-copper-light drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] sm:text-3xl">
                    {e.figure}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-salt/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-sm">
                    {e.label}
                  </dd>
                </div>
              ))}
            </dl>
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
            <span className="eyebrow text-salt/80 transition-colors group-hover:text-salt">
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
                className="text-salt/75 transition-colors group-hover:text-salt"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tideBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}</style>
    </section>
  );
}

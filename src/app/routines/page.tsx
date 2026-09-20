import type { Metadata } from "next";
import Link from "next/link";
import { routines } from "@/data/routines";
import { productBySlug } from "@/data/products";
import { concernLabels } from "@/data/routines";
import { RoutineFinder } from "@/components/RoutineFinder";
import { TideStrip } from "@/components/TideStrip";
import { Vessel } from "@/components/Vessel";
import { formatPrice } from "@/lib/format";
import type { RoutineStep } from "@/data/types";

export const metadata: Metadata = {
  title: "Routines",
  description:
    "Five sequences, from a three-product minimum to a full retinal protocol. Answer four questions and we will tell you which one to run.",
};

function StepList({ steps, label }: { steps: RoutineStep[]; label: string }) {
  return (
    <div>
      <h4 className="eyebrow text-ink/45">{label}</h4>
      <ol className="mt-5 space-y-6">
        {steps.map((step, i) => {
          const p = productBySlug.get(step.productSlug);
          if (!p) return null;
          return (
            <li key={`${step.productSlug}-${i}`} className="flex gap-4">
              <span className="eyebrow w-6 shrink-0 pt-1.5 tabular-nums text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link
                href={`/product/${p.slug}`}
                className="grid h-16 w-14 shrink-0 place-items-center bg-haze/45 transition-colors hover:bg-haze/70"
              >
                <Vessel vessel={p.vessel} uid={`rt-${label}-${p.slug}-${i}`} className="h-14 w-11" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${p.slug}`}
                  className="font-display text-lg leading-tight hover:text-copper"
                >
                  {p.name}
                </Link>
                <p className="mt-0.5 text-xs text-ink/50">{p.descriptor}</p>
                <p className="prose-body mt-1.5 text-[0.85rem]">{step.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function RoutinesPage() {
  return (
    <>
      <header className="shell pb-12 pt-14 md:pb-16 md:pt-20">
        <p className="eyebrow text-ink/45">Sequences</p>
        <h1 className="display-lg mt-4 max-w-3xl">
          The order is the product.
        </h1>
        <p className="prose-body mt-6 max-w-xl">
          You can own every correct product and get nothing from them by applying
          them in the wrong order, on the wrong nights, at a strength your barrier
          is not ready for. Below are the five sequences we recommend. One of them
          is three products long, and for a lot of people that is the right one.
        </p>
      </header>

      {/* ---- The finder --------------------------------------------- */}
      <section
        aria-labelledby="finder-heading"
        className="border-y border-ink/12 bg-kelp/10"
      >
        <div className="shell py-16 md:py-24">
          <h2 id="finder-heading" className="display-md max-w-xl">
            Four questions, then a straight answer.
          </h2>
          <div className="mt-12">
            <RoutineFinder />
          </div>
        </div>
      </section>

      <TideStrip label="The five sequences" />

      {/* ---- The five sequences ------------------------------------- */}
      <div className="shell py-20 md:py-28">
        <div className="space-y-24 md:space-y-36">
          {routines.map((routine, idx) => {
            const unique = Array.from(
              new Set([...routine.morning, ...routine.evening].map((s) => s.productSlug)),
            );
            const total = unique.reduce(
              (sum, s) => sum + (productBySlug.get(s)?.price ?? 0),
              0,
            );

            return (
              <section
                key={routine.slug}
                id={routine.slug}
                aria-labelledby={`${routine.slug}-heading`}
                className="scroll-mt-28"
              >
                <div className="grid gap-10 border-t border-ink/20 pt-8 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="eyebrow tabular-nums text-ink/35">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h3 id={`${routine.slug}-heading`} className="display-md mt-3">
                      {routine.name}
                    </h3>
                    <p className="mt-2 text-ink/60">{routine.subtitle}</p>
                    <p className="prose-body mt-5">{routine.builtFor}</p>

                    <dl className="mt-8 space-y-3 border-t border-ink/15 pt-5 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-ink/55">Time on skin</dt>
                        <dd className="tabular-nums">{routine.minutes} min</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-ink/55">Products</dt>
                        <dd className="tabular-nums">{unique.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-ink/55">Full sequence</dt>
                        <dd className="tabular-nums">{formatPrice(total)}</dd>
                      </div>
                    </dl>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {routine.concerns.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink/65"
                        >
                          {concernLabels[c]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-12 md:col-span-7 md:col-start-6 md:grid-cols-2 md:gap-10">
                    <StepList steps={routine.morning} label="Morning" />
                    <StepList steps={routine.evening} label="Evening" />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ---- Closing ------------------------------------------------ */}
      <section className="border-t border-ink/12 bg-ink text-salt">
        <div className="shell-narrow py-24 text-center md:py-32">
          <h2 className="display-md">Six weeks, then judge it.</h2>
          <p className="prose-body mx-auto mt-6 max-w-lg text-salt/70">
            Skin turns over in roughly a month, and most of what a formula does is
            not visible before the second cycle. If you change your routine every
            fortnight you will never find out what works.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-block bg-salt px-8 py-4 text-sm text-ink transition-colors hover:bg-copper-light"
          >
            See all sixteen products
          </Link>
        </div>
      </section>
    </>
  );
}

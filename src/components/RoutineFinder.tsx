"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { concernQuestions, routinesForConcerns } from "@/data/routines";
import { productBySlug } from "@/data/products";
import { Vessel } from "@/components/Vessel";
import { formatPrice, useCart } from "@/lib/cart";
import type { SkinConcern } from "@/data/types";

/**
 * The discovery mechanism: a short, honest questionnaire. Multi-select,
 * no scoring theatre, no "quiz" framing — it filters five sequences down
 * to the one or two that match what you said.
 */
export function RoutineFinder() {
  const [selected, setSelected] = useState<SkinConcern[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { add } = useCart();

  const matches = useMemo(() => routinesForConcerns(selected), [selected]);
  const best = matches[0];

  const toggle = (c: SkinConcern) =>
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const addRoutine = () => {
    if (!best) return;
    const slugs = new Set(
      [...best.morning, ...best.evening].map((s) => s.productSlug),
    );
    slugs.forEach((s) => add(s, 1));
  };

  const routineTotal = best
    ? Array.from(
        new Set([...best.morning, ...best.evening].map((s) => s.productSlug)),
      ).reduce((sum, s) => sum + (productBySlug.get(s)?.price ?? 0), 0)
    : 0;

  return (
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-6">
        <fieldset>
          <legend className="eyebrow text-ink/45">
            Select everything that sounds like your skin
          </legend>
          <ul className="mt-6 space-y-px">
            {concernQuestions.map((q) => {
              const on = selected.includes(q.id);
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => {
                      toggle(q.id);
                      setSubmitted(true);
                    }}
                    aria-pressed={on}
                    className={`group flex w-full items-start gap-4 border-t border-ink/15 py-5 text-left transition-colors ${
                      on ? "text-ink" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1 grid h-5 w-5 shrink-0 place-items-center border transition-colors ${
                        on ? "border-ink bg-ink text-salt" : "border-ink/30"
                      }`}
                    >
                      {on && (
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path
                            d="M1.5 5.6 4.2 8.2 9.5 2.6"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg leading-snug">
                        {q.prompt}
                      </span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            className="block overflow-hidden"
                          >
                            <span className="mt-1.5 block text-sm text-copper">
                              {q.detail}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              setSubmitted(false);
            }}
            className="mt-6 text-sm text-ink/50 underline underline-offset-4 hover:text-copper"
          >
            Start again
          </button>
        )}
      </div>

      {/* ---- Result ------------------------------------------------ */}
      <div className="md:col-span-5 md:col-start-8">
        <div className="md:sticky md:top-28">
          <AnimatePresence mode="wait">
            {!submitted || !best ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-dashed border-ink/25 p-8 text-center"
              >
                <p className="font-display text-xl">Nothing selected yet.</p>
                <p className="prose-body mt-2 text-sm">
                  Pick whatever is true. If all of it is true, pick all of it and
                  we will send you to The Reset, which is where that starts.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={best.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                className="bg-ink p-8 text-salt"
              >
                <p className="eyebrow text-copper-light">We would start you on</p>
                <h3 className="display-md mt-3">{best.name}</h3>
                <p className="mt-2 text-sm text-salt/65">{best.subtitle}</p>
                <p className="prose-body mt-5 text-salt/75">{best.builtFor}</p>

                {/* The products, as a shelf line. */}
                <div className="mt-8 flex items-end gap-1 border-b border-salt/20 pb-4">
                  {Array.from(
                    new Set([...best.morning, ...best.evening].map((s) => s.productSlug)),
                  ).map((s) => {
                    const p = productBySlug.get(s);
                    if (!p) return null;
                    return (
                      <Link
                        key={s}
                        href={`/product/${p.slug}`}
                        title={p.name}
                        className="flex-1 transition-transform hover:-translate-y-1"
                      >
                        <Vessel vessel={p.vessel} uid={`rf-${p.slug}`} className="h-16 w-full" />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-baseline justify-between text-sm">
                  <span className="text-salt/60">
                    {best.minutes} minutes, morning and night
                  </span>
                  <span className="tabular-nums">{formatPrice(routineTotal)}</span>
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={addRoutine}
                    className="bg-salt px-6 py-3.5 text-sm text-ink transition-colors hover:bg-copper-light"
                  >
                    Add the whole sequence
                  </button>
                  <Link
                    href={`#${best.slug}`}
                    className="link-underline self-start text-sm text-salt/75"
                  >
                    Read it step by step
                  </Link>
                </div>

                {matches.length > 1 && (
                  <p className="mt-6 border-t border-salt/15 pt-4 text-xs text-salt/55">
                    Also a fit:{" "}
                    {matches.slice(1, 3).map((r, i) => (
                      <span key={r.slug}>
                        {i > 0 && ", "}
                        <Link href={`#${r.slug}`} className="underline underline-offset-4">
                          {r.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

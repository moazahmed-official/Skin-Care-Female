"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { concernLabels } from "@/data/routines";
import { formatPrice } from "@/lib/cart";
import { Vessel } from "@/components/Vessel";
import type { Product } from "@/data/types";

function score(product: Product, q: string): number {
  const query = q.toLowerCase();
  const name = product.name.toLowerCase();
  if (name === query) return 100;
  if (name.startsWith(query)) return 80;
  if (name.includes(query)) return 60;
  if (product.descriptor.toLowerCase().includes(query)) return 45;
  if (product.category.includes(query)) return 35;
  if (product.concerns.some((c) => concernLabels[c].toLowerCase().includes(query))) return 30;
  if (product.keyIngredients.some((i) => i.name.toLowerCase().includes(query))) return 25;
  if (product.shelfLine.toLowerCase().includes(query)) return 15;
  if (product.story.toLowerCase().includes(query)) return 8;
  return 0;
}

const suggestions = [
  "retinal",
  "barrier",
  "niacinamide",
  "sunscreen",
  "unfragranced",
  "dehydration",
];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return products
      .map((p) => ({ p, s: score(p, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.p);
  }, [query]);

  // Query changes reset the highlighted row; both are driven from the one
  // handler so no effect is needed to keep them in step.
  const updateQuery = (next: string) => {
    setQuery(next);
    setCursor(0);
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape to close, arrows to walk results — a real keyboard surface.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, Math.max(results.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, results.length]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative mx-auto max-h-[86vh] w-full max-w-3xl overflow-y-auto bg-salt shadow-2xl sm:mt-[9vh] sm:rounded-sm"
          >
            <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-ink/12 bg-salt px-5 py-5 sm:px-8">
              <svg width="19" height="19" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="shrink-0 text-ink/45">
                <circle cx="7.4" cy="7.4" r="5.1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M11.3 11.3 L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="A product, an ingredient, a problem…"
                aria-label="Search products"
                className="w-full bg-transparent font-display text-xl outline-none placeholder:text-ink/30 sm:text-2xl"
              />
              <button
                type="button"
                onClick={onClose}
                className="eyebrow shrink-0 text-ink/50 transition-colors hover:text-ink"
              >
                Esc
              </button>
            </div>

            <div className="px-5 pb-8 pt-6 sm:px-8">
              {query.trim().length < 2 ? (
                <div>
                  <p className="eyebrow text-ink/45">Try</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateQuery(s)}
                        className="rounded-full border border-ink/18 px-3.5 py-1.5 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <p className="eyebrow mt-9 text-ink/45">Browse</p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/shop/${c.slug}`}
                          onClick={onClose}
                          className="block border-b border-ink/10 py-2.5 text-sm text-ink/70 transition-colors hover:text-copper"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-display text-xl">Nothing under that name.</p>
                  <p className="prose-body mt-2">
                    We keep a deliberately short catalogue — sixteen products in all.{" "}
                    <Link href="/shop" onClick={onClose} className="text-copper underline underline-offset-4">
                      See everything
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <ul className="-mx-2">
                  {results.map((p, i) => (
                    <li key={p.slug}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setCursor(i)}
                        className={`flex items-center gap-4 rounded-sm px-2 py-3 transition-colors ${
                          cursor === i ? "bg-ink/6" : "hover:bg-ink/4"
                        }`}
                      >
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-sm bg-haze/50">
                          <Vessel vessel={p.vessel} uid={`s-${p.slug}`} className="h-11 w-11" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-lg leading-tight">{p.name}</span>
                          <span className="block truncate text-sm text-ink/55">{p.descriptor}</span>
                        </span>
                        <span className="eyebrow shrink-0 tabular-nums text-ink/60">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

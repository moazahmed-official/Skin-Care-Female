"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProductCard } from "@/components/ProductCard";
import { concernLabels } from "@/data/routines";
import type { Category, Product, SkinConcern, TimeOfDay } from "@/data/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "step";

const sorts: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "step", label: "Order of use" },
  { key: "price-asc", label: "Price, low first" },
  { key: "price-desc", label: "Price, high first" },
];

const times: { key: TimeOfDay | "all"; label: string }[] = [
  { key: "all", label: "Any time" },
  { key: "morning", label: "Morning" },
  { key: "evening", label: "Evening" },
];

export function ShopBrowser({
  products,
  categories,
  heading,
  eyebrow,
  intro,
  activeCategory,
}: {
  products: Product[];
  categories: Category[];
  heading: string;
  eyebrow: string;
  intro: string;
  activeCategory?: string;
}) {
  const params = useSearchParams();

  // A ?concern= link (from a product page) pre-applies that filter and opens
  // the panel, so arriving from a PDP lands on a visibly filtered grid.
  const seeded = useMemo(() => {
    const raw = params.get("concern");
    return raw && raw in concernLabels ? [raw as SkinConcern] : [];
  }, [params]);

  const [concerns, setConcerns] = useState<SkinConcern[]>(seeded);
  const [time, setTime] = useState<TimeOfDay | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(seeded.length > 0);

  const availableConcerns = useMemo(() => {
    const set = new Set<SkinConcern>();
    products.forEach((p) => p.concerns.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      const concernOk =
        concerns.length === 0 || concerns.some((c) => p.concerns.includes(c));
      const timeOk = time === "all" || p.timeOfDay === time || p.timeOfDay === "either";
      return concernOk && timeOk;
    });

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "step":
        list.sort((a, b) => a.routineStep - b.routineStep || a.price - b.price);
        break;
      default:
        list.sort(
          (a, b) =>
            Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)) ||
            Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
        );
    }
    return list;
  }, [products, concerns, time, sort]);

  const toggleConcern = (c: SkinConcern) =>
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const filtered = concerns.length > 0 || time !== "all";

  return (
    <>
      {/* ---- Masthead ---------------------------------------------- */}
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-20">
        <p className="eyebrow text-ink/45">{eyebrow}</p>
        <h1 className="display-lg mt-4 max-w-3xl">{heading}</h1>
        <p className="prose-body mt-6 max-w-xl">{intro}</p>
      </header>

      {/* ---- Category rail ----------------------------------------- */}
      <nav aria-label="Product categories" className="relative border-y border-ink/12 bg-haze/25">
        <div className="shell">
          <ul className="rail-scroll -mx-1 flex items-center gap-2 overflow-x-auto py-4 pr-8">
            <li>
              <Link
                href="/shop"
                aria-current={!activeCategory ? "page" : undefined}
                className={`block shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "border-ink bg-ink text-salt"
                    : "border-ink/15 text-ink/65 hover:border-ink/40 hover:text-ink"
                }`}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/shop/${c.slug}`}
                  aria-current={activeCategory === c.slug ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === c.slug
                      ? "border-ink bg-ink text-salt"
                      : "border-ink/15 text-ink/65 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Edge fade — signals the rail keeps going off-screen on mobile. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-haze/70 to-transparent md:hidden"
        />
      </nav>

      {/* ---- Filter bar -------------------------------------------- */}
      <div className="sticky top-[4.25rem] z-30 border-b border-ink/12 bg-salt/92 backdrop-blur-md md:top-20">
        <div className="shell flex items-center justify-between gap-4 py-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            className="flex items-center gap-2.5 text-sm text-ink/75 transition-colors hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 3.5h12M3 7h8M5 10.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Filter
            {filtered && (
              <span className="grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-copper px-1 text-[0.62rem] text-salt">
                {concerns.length + (time !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <p className="hidden text-xs tabular-nums text-ink/45 sm:block" aria-live="polite">
              {visible.length} {visible.length === 1 ? "product" : "products"}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer border-0 bg-transparent py-1 pr-6 text-sm text-ink/75 outline-none hover:text-ink"
              >
                {sorts.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              id="filter-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden border-t border-ink/10"
            >
              <div className="shell grid gap-8 py-7 sm:grid-cols-2">
                <fieldset>
                  <legend className="eyebrow text-ink/45">What your skin is doing</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {availableConcerns.map((c) => {
                      const on = concerns.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleConcern(c)}
                          aria-pressed={on}
                          className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                            on
                              ? "border-ink bg-ink text-salt"
                              : "border-ink/20 text-ink/70 hover:border-ink"
                          }`}
                        >
                          {concernLabels[c]}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="eyebrow text-ink/45">When you use it</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {times.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setTime(t.key)}
                        aria-pressed={time === t.key}
                        className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                          time === t.key
                            ? "border-ink bg-ink text-salt"
                            : "border-ink/20 text-ink/70 hover:border-ink"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {filtered && (
                    <button
                      type="button"
                      onClick={() => {
                        setConcerns([]);
                        setTime("all");
                      }}
                      className="mt-6 text-sm text-ink/55 underline underline-offset-4 hover:text-copper"
                    >
                      Clear all filters
                    </button>
                  )}
                </fieldset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- Grid --------------------------------------------------- */}
      <div className="shell py-12 md:py-16">
        {visible.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="font-display text-2xl">Nothing matches that combination.</h2>
            <p className="prose-body mx-auto mt-3 max-w-sm">
              With a catalogue this small that happens. Loosen one filter and
              something will turn up.
            </p>
            <button
              type="button"
              onClick={() => {
                setConcerns([]);
                setTime("all");
              }}
              className="mt-7 border border-ink px-7 py-3 text-sm transition-colors hover:bg-ink hover:text-salt"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4"
          >
            {visible.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

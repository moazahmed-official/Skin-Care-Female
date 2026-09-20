"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import { concernLabels } from "@/data/routines";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/types";

/** Where a match was found, so results can explain themselves. */
type MatchKind = "name" | "descriptor" | "ingredient" | "concern" | "text";

function match(p: Product, q: string): { score: number; kind: MatchKind } | null {
  const query = q.toLowerCase();
  const name = p.name.toLowerCase();
  if (name.includes(query)) return { score: name.startsWith(query) ? 90 : 70, kind: "name" };
  if (p.descriptor.toLowerCase().includes(query)) return { score: 55, kind: "descriptor" };
  const ing = p.keyIngredients.find((i) => i.name.toLowerCase().includes(query));
  if (ing) return { score: 48, kind: "ingredient" };
  const concern = p.concerns.find((c) => concernLabels[c].toLowerCase().includes(query));
  if (concern) return { score: 40, kind: "concern" };
  if (p.category.includes(query)) return { score: 36, kind: "descriptor" };
  if (
    p.shelfLine.toLowerCase().includes(query) ||
    p.story.toLowerCase().includes(query) ||
    p.fullIngredients.toLowerCase().includes(query)
  )
    return { score: 18, kind: "text" };
  return null;
}

const explain: Record<MatchKind, string> = {
  name: "Name",
  descriptor: "Product type",
  ingredient: "Key ingredient",
  concern: "Formulated for",
  text: "Mentioned in the formula notes",
};

export function SearchPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  // The URL seeds the field once; from then on the input is the source of
  // truth and the URL follows it (see the effect below).
  const [query, setQuery] = useState(() => params.get("q") ?? "");

  // Reflect the query in the URL so a search is shareable and back works.
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = query.trim();
      const current = params.get("q") ?? "";
      if (trimmed === current) return;
      router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search", {
        scroll: false,
      });
    }, 350);
    return () => clearTimeout(t);
  }, [query, router, params]);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return products
      .flatMap((p) => {
        const m = match(p, q);
        return m ? [{ p, ...m }] : [];
      })
      .sort((a, b) => b.score - a.score);
  }, [query]);

  const q = query.trim();

  return (
    <div className="shell py-14 md:py-20">
      <p className="eyebrow text-ink/45">The full catalogue, indexed</p>
      <h1 className="display-lg mt-3">Search</h1>

      <div className="mt-8 max-w-2xl">
        <label htmlFor="search-input" className="sr-only">
          Search products
        </label>
        <div className="flex items-center gap-4 border-b border-ink/30 focus-within:border-ink">
          <svg width="20" height="20" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="shrink-0 text-ink/40">
            <circle cx="7.4" cy="7.4" r="5.1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11.3 11.3 L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            id="search-input"
            type="search"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A product, an ingredient, a problem…"
            className="w-full bg-transparent py-4 font-display text-2xl outline-none placeholder:text-ink/25 md:text-3xl"
          />
        </div>
      </div>

      {q.length < 2 ? (
        <div className="mt-14">
          <p className="eyebrow text-ink/45">Common searches</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["retinal", "niacinamide", "SPF", "barrier", "unfragranced", "ceramide", "congestion"].map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-ink/20 px-4 py-2 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  {s}
                </button>
              ),
            )}
          </div>

          <div className="mt-16">
            <p className="eyebrow border-b border-ink/15 pb-4 text-ink/45">
              Or the whole catalogue
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-7">
              {products.slice(0, 8).map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
            <Link
              href="/shop"
              className="mt-12 inline-block border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
            >
              See all sixteen
            </Link>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-20 max-w-md">
          <h2 className="display-md">No match for &ldquo;{q}&rdquo;.</h2>
          <p className="prose-body mt-4">
            We keep sixteen products, so the catalogue is easy to exhaust. Try an
            ingredient name, or tell us what your skin is doing and we will pick.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="bg-ink px-7 py-3.5 text-sm text-salt transition-colors hover:bg-brine"
            >
              Browse everything
            </Link>
            <Link
              href="/routines"
              className="border border-ink px-7 py-3.5 text-sm transition-colors hover:bg-ink hover:text-salt"
            >
              Find my sequence
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-14">
          <p className="eyebrow border-b border-ink/15 pb-4 text-ink/45" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4">
            {results.map(({ p, kind }, i) => (
              <div key={p.slug}>
                <ProductCard product={p} index={i} />
                <p className="eyebrow mt-2 text-ink/35">{explain[kind]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

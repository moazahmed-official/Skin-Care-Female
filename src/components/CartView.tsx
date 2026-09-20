"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart, formatPrice, freeShippingThreshold } from "@/lib/cart";
import { Vessel } from "@/components/Vessel";
import { QuantityStepper } from "@/components/QuantityStepper";
import { products, productBySlug } from "@/data/products";

export function CartView() {
  const { resolved, subtotal, shipping, total, setQty, remove, add, hydrated, count } =
    useCart();

  // Suggest something the bag is missing, chosen from what is already in it.
  const suggestion = (() => {
    const owned = new Set(resolved.map((l) => l.product.slug));
    const candidates = resolved
      .flatMap((l) => l.product.pairsWith)
      .filter((s) => !owned.has(s));
    const pick = candidates[0] ?? "noon-mineral";
    return owned.has(pick) ? null : productBySlug.get(pick) ?? null;
  })();

  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  if (!hydrated) {
    return (
      <div className="shell py-32">
        <p className="eyebrow text-ink/40">Loading your bag…</p>
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="shell py-24 md:py-32">
        <h1 className="display-lg">Your bag is empty.</h1>
        <p className="prose-body mt-6 max-w-md">
          Sixteen products, five sequences, and one of them is only three products
          long. The routine finder is the fastest way in if you are not sure.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="bg-ink px-8 py-4 text-sm text-salt transition-colors hover:bg-brine"
          >
            See all sixteen products
          </Link>
          <Link
            href="/routines"
            className="border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
          >
            Find my sequence
          </Link>
        </div>

        <section aria-labelledby="popular-heading" className="mt-24">
          <h2 id="popular-heading" className="eyebrow border-b border-ink/15 pb-4 text-ink/45">
            Most reordered
          </h2>
          <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((p) => p.bestSeller)
              .map((p) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} className="group flex items-center gap-4">
                    <span className="grid h-20 w-16 shrink-0 place-items-center bg-haze/45">
                      <Vessel vessel={p.vessel} uid={`empty-${p.slug}`} className="h-16 w-12" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg group-hover:text-copper">
                        {p.name}
                      </span>
                      <span className="block text-sm text-ink/55">
                        {formatPrice(p.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="shell py-14 md:py-20">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/15 pb-6">
        <h1 className="display-lg">Your bag</h1>
        <p className="text-sm tabular-nums text-ink/50">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-12">
        {/* ---- Lines ------------------------------------------------ */}
        <div className="lg:col-span-7">
          <ul>
            <AnimatePresence initial={false}>
            {resolved.map(({ product, qty, lineTotal }) => (
              <motion.li
                key={product.slug}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-ink/12"
              >
                <div className="flex gap-5 py-7 sm:gap-7">
                  <Link
                    href={`/product/${product.slug}`}
                    className="grid h-32 w-24 shrink-0 place-items-center bg-haze/45 sm:h-40 sm:w-32"
                    style={{
                      backgroundImage: `radial-gradient(90% 70% at 40% 16%, ${product.vessel.fill}2b 0%, transparent 64%)`,
                    }}
                  >
                    <Vessel
                      vessel={product.vessel}
                      uid={`cart-${product.slug}`}
                      mark={product.name.slice(0, 1)}
                      className="h-28 w-20 sm:h-36 sm:w-24"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-display text-xl leading-tight hover:text-copper sm:text-2xl"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-sm text-ink/55">{product.descriptor}</p>
                        <p className="mt-0.5 text-xs text-ink/40">{product.size}</p>
                      </div>
                      <p className="shrink-0 tabular-nums">{formatPrice(lineTotal)}</p>
                    </div>

                    <p className="prose-body mt-3 hidden text-[0.85rem] sm:block">
                      {product.shelfLine}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                      <QuantityStepper
                        value={qty}
                        onChange={(n) => setQty(product.slug, n)}
                        label={`Quantity of ${product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        className="text-sm text-ink/45 underline underline-offset-4 transition-colors hover:text-copper"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
            </AnimatePresence>
          </ul>

          <div className="pt-8">
            <Link href="/shop" className="link-underline text-sm text-ink/65">
              Continue browsing
            </Link>
          </div>
        </div>

        {/* ---- Summary ---------------------------------------------- */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            {suggestion && (
              <div className="mb-8 border border-ink/15 p-5">
                <p className="eyebrow text-ink/45">Formulated to go with this</p>
                <div className="mt-4 flex items-center gap-4">
                  <Link
                    href={`/product/${suggestion.slug}`}
                    className="grid h-20 w-16 shrink-0 place-items-center bg-haze/45"
                  >
                    <Vessel
                      vessel={suggestion.vessel}
                      uid={`sugg-${suggestion.slug}`}
                      className="h-16 w-12"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${suggestion.slug}`}
                      className="block truncate font-display text-lg hover:text-copper"
                    >
                      {suggestion.name}
                    </Link>
                    <p className="text-sm text-ink/55">{formatPrice(suggestion.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => add(suggestion.slug, 1)}
                    className="eyebrow shrink-0 border border-ink px-3 py-2 transition-colors hover:bg-ink hover:text-salt"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="bg-ink p-7 text-salt">
              <h2 className="font-display text-2xl">Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-salt/60">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-salt/60">Delivery</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                {remaining > 0 && (
                  <p className="text-xs text-copper-light">
                    {formatPrice(remaining)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between border-t border-salt/20 pt-4 text-lg">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPrice(total)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-7 block bg-salt px-6 py-4 text-center text-sm text-ink transition-colors hover:bg-copper-light"
              >
                Checkout
              </Link>

              <ul className="mt-6 space-y-2 border-t border-salt/15 pt-5 text-xs text-salt/55">
                <li>90 days to change your mind, opened or not</li>
                <li>Batch certificate on the base of every bottle</li>
                <li>Recyclable glass, plastic-free outer</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

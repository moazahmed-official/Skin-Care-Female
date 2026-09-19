"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, formatPrice, freeShippingThreshold } from "@/lib/cart";
import { Vessel } from "@/components/Vessel";
import { QuantityStepper } from "@/components/QuantityStepper";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, resolved, subtotal, shipping, total, setQty, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
      // Trap focus inside the drawer while it is open.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  const remaining = Math.max(freeShippingThreshold - subtotal, 0);
  const progress = Math.min(subtotal / freeShippingThreshold, 1);

  return (
    <AnimatePresence>
      {drawerOpen ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close bag"
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[26.5rem] flex-col bg-salt shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-ink/12 px-6 py-5">
              <h2 className="font-display text-2xl">Your bag</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeDrawer}
                className="eyebrow rounded-full px-3 py-2 text-ink/55 transition-colors hover:bg-ink/6 hover:text-ink"
              >
                Close
              </button>
            </header>

            {resolved.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <svg viewBox="0 0 120 80" className="h-24 w-32 text-ink/20" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <path
                      key={i}
                      d={`M4 ${28 + i * 16} C 32 ${18 + i * 16}, 60 ${40 + i * 16}, 88 ${28 + i * 16} S 112 ${20 + i * 16}, 116 ${26 + i * 16}`}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      fill="none"
                    />
                  ))}
                </svg>
                <p className="mt-6 font-display text-xl">Nothing in it yet.</p>
                <p className="prose-body mt-2 text-sm">
                  If you are not sure where to start, the routine finder asks four
                  questions and gets it about right.
                </p>
                <div className="mt-7 flex flex-col gap-3 self-stretch">
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="bg-ink px-6 py-3.5 text-center text-sm text-salt transition-colors hover:bg-brine"
                  >
                    Browse everything
                  </Link>
                  <Link
                    href="/routines"
                    onClick={closeDrawer}
                    className="border border-ink/25 px-6 py-3.5 text-center text-sm transition-colors hover:border-ink"
                  >
                    Find my sequence
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-ink/10 px-6 py-4">
                  {remaining > 0 ? (
                    <p className="text-xs text-ink/65">
                      <strong className="font-medium text-ink">{formatPrice(remaining)}</strong> more
                      for free delivery
                    </p>
                  ) : (
                    <p className="text-xs text-brine">Free delivery applied</p>
                  )}
                  <div className="mt-2.5 h-px w-full bg-ink/12" aria-hidden="true">
                    <motion.div
                      className="h-px bg-copper"
                      initial={false}
                      animate={{ scaleX: progress }}
                      style={{ transformOrigin: "left" }}
                      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                    />
                  </div>
                </div>

                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {resolved.map(({ product, qty, lineTotal }) => (
                      <motion.li
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden border-b border-ink/10"
                      >
                        <div className="flex gap-4 py-5">
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={closeDrawer}
                            className="grid h-24 w-20 shrink-0 place-items-center bg-haze/45"
                          >
                            <Vessel vessel={product.vessel} uid={`d-${product.slug}`} className="h-20 w-16" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  href={`/product/${product.slug}`}
                                  onClick={closeDrawer}
                                  className="block truncate font-display text-lg leading-tight hover:text-copper"
                                >
                                  {product.name}
                                </Link>
                                <p className="mt-0.5 truncate text-xs text-ink/55">{product.size}</p>
                              </div>
                              <p className="shrink-0 text-sm tabular-nums">{formatPrice(lineTotal)}</p>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <QuantityStepper
                                value={qty}
                                onChange={(n) => setQty(product.slug, n)}
                                label={`Quantity of ${product.name}`}
                              />
                              <button
                                type="button"
                                onClick={() => remove(product.slug)}
                                className="text-xs text-ink/45 underline underline-offset-4 transition-colors hover:text-copper"
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

                <footer className="border-t border-ink/12 px-6 py-5">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink/60">Subtotal</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink/60">Delivery</dt>
                      <dd className="tabular-nums">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-ink/12 pt-2.5 text-base">
                      <dt>Total</dt>
                      <dd className="tabular-nums">{formatPrice(total)}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className="bg-ink px-6 py-4 text-center text-sm text-salt transition-colors hover:bg-brine"
                    >
                      Checkout · {formatPrice(total)}
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="py-2 text-center text-xs text-ink/55 underline underline-offset-4 hover:text-ink"
                    >
                      View the full bag
                    </Link>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

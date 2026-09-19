"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Vessel } from "@/components/Vessel";
import { AddToBag } from "@/components/AddToBag";
import { formatPrice } from "@/lib/cart";
import type { Product } from "@/data/types";

/**
 * Each card generates its own backdrop from the product's own vessel
 * colours, so a grid reads as a set of related but distinct compositions
 * rather than a row of identical tiles.
 */
function cardField(product: Product, index: number) {
  const { glass, fill } = product.vessel;
  const angle = 145 + ((index * 37) % 60);
  return {
    backgroundImage: `radial-gradient(120% 90% at ${28 + ((index * 23) % 44)}% 12%, ${fill}2e 0%, transparent 62%), linear-gradient(${angle}deg, ${glass}18 0%, transparent 58%)`,
  };
}

export function ProductCard({
  product,
  index = 0,
  priority = false,
}: {
  product: Product;
  index?: number;
  /** When true the card renders at a larger scale in an editorial slot. */
  priority?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 0.61, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
        <div
          className="grain relative isolate overflow-hidden bg-haze/40"
          style={cardField(product, index)}
        >
          {/* tide-line texture behind the vessel */}
          <svg
            aria-hidden="true"
            viewBox="0 0 300 300"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]"
            preserveAspectRatio="none"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={i}
                d={`M0 ${196 + i * 13} C 75 ${188 + i * 13}, 150 ${206 + i * 13}, 225 ${196 + i * 13} S 285 ${190 + i * 13}, 300 ${194 + i * 13}`}
                stroke={product.vessel.glass}
                strokeWidth="1.2"
                fill="none"
              />
            ))}
          </svg>

          <div className={`relative flex items-end justify-center ${priority ? "aspect-4/5" : "aspect-square"}`}>
            <Vessel
              vessel={product.vessel}
              uid={`c-${product.slug}`}
              mark={product.name.slice(0, 1)}
              className="h-[82%] w-auto transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.035]"
            />
          </div>

          {(product.isNew || product.bestSeller) && (
            <span className="eyebrow absolute left-4 top-4 bg-salt/85 px-2.5 py-1.5 text-ink backdrop-blur-sm">
              {product.isNew ? "New" : "Best seller"}
            </span>
          )}

          {/* Quick add — revealed on hover, always reachable by keyboard. */}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 max-sm:translate-y-0 max-sm:opacity-100">
            <AddToBag product={product} variant="quiet" />
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-copper">
              {product.name}
            </h3>
            <p className="shrink-0 text-sm tabular-nums text-ink/70">{formatPrice(product.price)}</p>
          </div>
          <p className="mt-1 text-sm text-ink/55">{product.descriptor}</p>
          <p className="prose-body mt-2.5 text-[0.85rem] leading-relaxed">{product.shelfLine}</p>
          <p className="eyebrow mt-auto pt-4 text-ink/35">{product.size}</p>
        </div>
      </Link>
    </motion.article>
  );
}

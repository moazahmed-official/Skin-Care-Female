"use client";

import { useCart, formatPrice } from "@/lib/cart";
import type { Product } from "@/data/types";

/**
 * Two presentations of the same action. `quiet` is the card-level control
 * that appears on hover/focus; `full` is the PDP's primary button.
 */
export function AddToBag({
  product,
  qty = 1,
  variant = "full",
  className = "",
}: {
  product: Product;
  qty?: number;
  variant?: "full" | "quiet";
  className?: string;
}) {
  const { add, lastAdded } = useCart();
  const justAdded = lastAdded === product.slug;

  if (variant === "quiet") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          add(product.slug, qty);
        }}
        className={`w-full bg-ink/90 px-4 py-3 text-xs tracking-wide text-salt backdrop-blur-sm transition-colors hover:bg-ink ${className}`}
      >
        {justAdded ? "Added to bag" : `Add · ${formatPrice(product.price)}`}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(product.slug, qty)}
      className={`relative w-full overflow-hidden bg-ink px-8 py-[1.15rem] text-sm text-salt transition-colors hover:bg-brine ${className}`}
    >
      <span className="relative z-10">
        {justAdded ? "Added to your bag" : `Add to bag · ${formatPrice(product.price * qty)}`}
      </span>
    </button>
  );
}

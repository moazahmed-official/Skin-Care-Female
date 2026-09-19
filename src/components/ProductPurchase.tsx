"use client";

import { useState } from "react";
import { QuantityStepper } from "@/components/QuantityStepper";
import { AddToBag } from "@/components/AddToBag";
import { formatPrice, freeShippingThreshold } from "@/lib/cart";
import type { Product } from "@/data/types";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-8">
      <div className="flex items-baseline gap-4">
        <p className="font-display text-3xl tabular-nums">{formatPrice(product.price)}</p>
        <p className="text-sm text-ink/50">{product.size}</p>
      </div>

      <div className="mt-6 flex items-stretch gap-3">
        <div className="flex items-center">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            label={`Quantity of ${product.name}`}
          />
        </div>
        <div className="flex-1">
          <AddToBag product={product} qty={qty} />
        </div>
      </div>

      <p className="mt-4 text-xs text-ink/50">
        Free delivery over {formatPrice(freeShippingThreshold)} · 90 days to change
        your mind, opened or not
      </p>
    </div>
  );
}

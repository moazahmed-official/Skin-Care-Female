import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ShopBrowser } from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "The complete Lumen & Salt catalogue — sixteen products across serums, cleansers, moisturisers, sun, masks, lip, body and sets.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopBrowser
        products={products}
        categories={categories}
        heading="Everything we make"
        eyebrow="The full catalogue"
        intro="Sixteen products. Each one exists because there was a job nothing else in the range could do. Filter by what your skin is doing, or sort by the order things go on."
      />
    </Suspense>
  );
}

function ShopFallback() {
  return (
    <div className="shell py-24">
      <p className="eyebrow text-ink/40">Loading the catalogue…</p>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { products, productsByCategory } from "@/data/products";
import { ShopBrowser } from "@/components/ShopBrowser";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/shop/[category]">,
): Promise<Metadata> {
  const { category } = await props.params;
  const found = getCategory(category);
  if (!found) return { title: "Not found" };
  return {
    title: found.name,
    description: found.intro,
  };
}

export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;
  const found = getCategory(category);
  if (!found) notFound();

  const list = productsByCategory(found.slug);

  return (
    <Suspense
      fallback={
        <div className="shell py-24">
          <p className="eyebrow text-ink/40">Loading {found.name.toLowerCase()}…</p>
        </div>
      }
    >
      <ShopBrowser
        products={list}
        categories={categories}
        activeCategory={found.slug}
        eyebrow={`${list.length} of ${products.length} products`}
        heading={found.name}
        intro={found.intro}
      />
    </Suspense>
  );
}

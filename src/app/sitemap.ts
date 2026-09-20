import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lemonsalt.digiwaytec.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/shop", "/routines", "/about", "/search"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    }),
  );

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/shop/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

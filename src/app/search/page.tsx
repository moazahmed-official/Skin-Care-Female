import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Lumen & Salt catalogue by product, ingredient or concern.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-24">
          <p className="eyebrow text-ink/40">Loading search…</p>
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}

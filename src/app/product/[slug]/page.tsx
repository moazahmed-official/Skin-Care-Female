import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, productBySlug, relatedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { concernLabels } from "@/data/routines";
import { routines } from "@/data/routines";
import { Vessel } from "@/components/Vessel";
import { ProductCard } from "@/components/ProductCard";
import { ProductPurchase } from "@/components/ProductPurchase";
import { Accordion } from "@/components/Accordion";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} — ${product.descriptor}`,
    description: product.shelfLine,
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = relatedProducts(product);
  // Sequences that actually contain this product — a real cross-link.
  const inRoutines = routines.filter((r) =>
    [...r.morning, ...r.evening].some((s) => s.productSlug === product.slug),
  );

  return (
    <article>
      {/* ---- Breadcrumb ------------------------------------------- */}
      <nav aria-label="Breadcrumb" className="shell pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
          <li>
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop/${product.category}`} className="hover:text-ink">
              {category?.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink/80">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ---- Hero: artwork + purchase ------------------------------ */}
      <div className="shell grid gap-10 pb-16 pt-8 md:grid-cols-12 md:gap-12 md:pb-24">
        <div className="md:col-span-7">
          <div
            className="grain relative isolate flex aspect-4/5 items-end justify-center overflow-hidden bg-haze/45 md:sticky md:top-28"
            style={{
              backgroundImage: `radial-gradient(110% 80% at 34% 14%, ${product.vessel.fill}33 0%, transparent 62%), linear-gradient(160deg, ${product.vessel.glass}1f 0%, transparent 60%)`,
            }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 400 500"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <path
                  key={i}
                  d={`M0 ${330 + i * 17} C 100 ${320 + i * 17}, 200 ${344 + i * 17}, 300 ${330 + i * 17} S 380 ${322 + i * 17}, 400 ${328 + i * 17}`}
                  stroke={product.vessel.glass}
                  strokeWidth="1.3"
                  fill="none"
                />
              ))}
            </svg>

            {/* Size printed into the composition, like a spec sheet. */}
            <p className="eyebrow absolute left-6 top-6 text-ink/45">{product.size}</p>
            <p className="eyebrow absolute right-6 top-6 text-ink/45">
              {product.timeOfDay === "either" ? "AM / PM" : product.timeOfDay === "morning" ? "AM" : "PM"}
            </p>

            <Vessel
              vessel={product.vessel}
              uid={`pdp-${product.slug}`}
              mark={product.name.slice(0, 1)}
              className="relative h-[78%] w-auto drop-shadow-[0_26px_55px_rgba(14,29,36,0.25)]"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <p className="eyebrow text-copper">{category?.name}</p>
          <h1 className="display-lg mt-3">{product.name}</h1>
          <p className="mt-2 text-lg text-ink/60">{product.descriptor}</p>

          <p className="prose-body mt-6 text-[1.05rem]">{product.shelfLine}</p>

          <ProductPurchase product={product} />

          {/* Quick spec — the facts people scan for. */}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/15 pt-6 text-sm">
            <div>
              <dt className="eyebrow text-ink/45">Texture</dt>
              <dd className="mt-1.5 text-ink/80">{product.texture}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink/45">Scent</dt>
              <dd className="mt-1.5 text-ink/80">{product.scent}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow text-ink/45">Formulated for</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {product.concerns.map((c) => (
                  <Link
                    key={c}
                    href={`/shop?concern=${c}`}
                    className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink/70 transition-colors hover:border-ink hover:text-ink"
                  >
                    {concernLabels[c]}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ---- The story --------------------------------------------- */}
      <section aria-labelledby="story-heading" className="border-y border-ink/12 bg-ink text-salt">
        <div className="shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <h2 id="story-heading" className="eyebrow text-salt/45 md:col-span-3">
            Why it is made this way
          </h2>
          <p className="display-md md:col-span-9">{product.story}</p>
        </div>
      </section>

      {/* ---- Formula & usage --------------------------------------- */}
      <div className="shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <section aria-labelledby="actives-heading" className="md:col-span-7">
          <h2 id="actives-heading" className="display-md">
            What is in it
          </h2>
          <p className="prose-body mt-4 max-w-lg">
            Concentrations below are the real inclusion rates, printed here and on
            the carton.
          </p>

          <ul className="mt-9 divide-y divide-ink/12 border-y border-ink/12">
            {product.keyIngredients.map((ing) => (
              <li key={ing.name} className="flex gap-5 py-5">
                <span className="w-16 shrink-0 font-display text-lg tabular-nums text-copper">
                  {ing.percentage ?? "—"}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{ing.name}</span>
                  <span className="mt-1 block text-sm text-ink/60">{ing.role}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Accordion
              items={[
                {
                  id: "inci",
                  title: "Full ingredient list (INCI)",
                  body: (
                    <p className="text-sm leading-relaxed text-ink/70">
                      {product.fullIngredients}
                    </p>
                  ),
                },
                {
                  id: "benefits",
                  title: "What to expect",
                  body: (
                    <ul className="space-y-2.5">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex gap-3 text-sm text-ink/75">
                          <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-copper" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section aria-labelledby="usage-heading" className="md:col-span-4 md:col-start-9">
          <h2 id="usage-heading" className="display-md">
            How to use it
          </h2>
          <ol className="mt-8 space-y-7">
            {product.howToUse.map((step, i) => (
              <li key={step} className="flex gap-5">
                <span className="eyebrow shrink-0 pt-1 tabular-nums text-ink/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="prose-body text-[0.95rem]">{step}</p>
              </li>
            ))}
          </ol>

          <p className="mt-9 border-t border-ink/15 pt-5 text-sm text-ink/55">
            Step {product.routineStep} in a full sequence.{" "}
            {inRoutines.length > 0 && (
              <>
                Appears in{" "}
                {inRoutines.map((r, i) => (
                  <span key={r.slug}>
                    {i > 0 && (i === inRoutines.length - 1 ? " and " : ", ")}
                    <Link
                      href={`/routines#${r.slug}`}
                      className="text-copper underline underline-offset-4"
                    >
                      {r.name}
                    </Link>
                  </span>
                ))}
                .
              </>
            )}
          </p>
        </section>
      </div>

      {/* ---- Pairings ---------------------------------------------- */}
      <section aria-labelledby="pairs-heading" className="border-t border-ink/12">
        <div className="shell py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-6">
            <div>
              <p className="eyebrow text-ink/45">Formulated to sit beside</p>
              <h2 id="pairs-heading" className="display-md mt-3">
                What goes with it
              </h2>
            </div>
            <Link href="/shop" className="link-underline eyebrow text-copper">
              All products
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-7">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Vessel } from "@/components/Vessel";
import { products, productBySlug } from "@/data/products";
import { categories } from "@/data/categories";
import { routines } from "@/data/routines";

const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

/** The three claims the house is prepared to defend, in its own words. */
const positions = [
  {
    figure: "16",
    title: "Sixteen products, and no plans for a seventeenth",
    body: "A range grows because growth is easy to sell, not because skin developed new requirements. We make the products a face needs and we stop. If something new arrives, something old leaves.",
  },
  {
    figure: "0",
    title: "Nothing added for the smell of it",
    body: "Fragrance is the leading cause of contact allergy in cosmetics, and it exists to make a product feel expensive at the moment of use. Ours smell of what is in them, which is mostly nothing.",
  },
  {
    figure: "%",
    title: "Every concentration on the carton",
    body: "Not 'contains niacinamide' — five percent, printed where you can read it before you buy. A percentage you cannot check is a claim, not a formula.",
  },
];

export default function HomePage() {
  const hero = productBySlug.get("noon-mineral")!;

  return (
    <>
      <Hero />

      {/* ---- The position statements ------------------------------- */}
      <section aria-labelledby="positions-heading" className="bg-ink pb-24 pt-20 text-salt md:pb-32">
        <div className="shell">
          <h2 id="positions-heading" className="sr-only">
            What we stand behind
          </h2>
          <ScrollReveal selector="[data-position]" className="grid gap-px md:grid-cols-3">
            {positions.map((p) => (
              <article
                key={p.title}
                data-position
                className="border-t border-salt/20 pt-6 md:pr-8"
              >
                <p className="font-display text-6xl text-copper-light md:text-7xl">{p.figure}</p>
                <h3 className="mt-5 font-display text-xl leading-snug md:text-2xl">{p.title}</h3>
                <p className="prose-body mt-3 text-salt/65">{p.body}</p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Editorial feature: the SPF argument ------------------- */}
      <section
        aria-labelledby="spf-heading"
        className="grain relative isolate overflow-hidden bg-copper/10"
      >
        <div className="shell grid items-center gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-6 md:col-start-1">
            <p className="eyebrow text-copper">The one that matters most</p>
            <h2 id="spf-heading" className="display-lg mt-5">
              If you buy one thing from us, buy the sunscreen.
            </h2>
            <p className="prose-body mt-6 max-w-lg">
              It is not the most interesting product we make and it is not the one
              with the best story. It is simply the only product on this site with
              strong evidence that it changes how skin ages. The serums are worth
              their money. This is worth more than all of them together, and we
              would rather say so than sell you a ritual.
            </p>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-6 border-t border-ink/15 pt-6">
              {[
                ["SPF", "50"],
                ["UVA-PF", "18"],
                ["Zinc", "18%"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-ink/45">{k}</dt>
                  <dd className="mt-1.5 font-display text-3xl">{v}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/product/${hero.slug}`}
              className="mt-10 inline-block bg-ink px-8 py-4 text-sm text-salt transition-colors hover:bg-brine"
            >
              Noon, Mineral Fluid SPF 50 — £58
            </Link>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="relative mx-auto max-w-xs">
              {/* Sun disc built from concentric rules, not a photograph. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 320 320"
                className="absolute inset-0 -z-10 h-full w-full opacity-60"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <circle
                    key={i}
                    cx="160"
                    cy="150"
                    r={40 + i * 15}
                    fill="none"
                    stroke="#b4653a"
                    strokeWidth="1"
                    opacity={0.5 - i * 0.045}
                  />
                ))}
                <circle cx="160" cy="150" r="34" fill="#d9a441" opacity="0.28" />
              </svg>
              <Vessel
                vessel={hero.vessel}
                uid="home-spf"
                mark="N"
                className="h-auto w-full drop-shadow-[0_24px_50px_rgba(14,29,36,0.22)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Best sellers ------------------------------------------ */}
      <section aria-labelledby="bestsellers-heading" className="shell py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-6">
          <div>
            <p className="eyebrow text-ink/45">Most reordered</p>
            <h2 id="bestsellers-heading" className="display-md mt-3">
              What people come back for
            </h2>
          </div>
          <Link href="/shop" className="link-underline eyebrow text-copper">
            All sixteen products
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-7">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ---- Routine finder entry ---------------------------------- */}
      <section
        aria-labelledby="routines-heading"
        className="border-y border-ink/12 bg-kelp/12"
      >
        <div className="shell grid gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-5">
            <p className="eyebrow text-kelp-deep">Sequences</p>
            <h2 id="routines-heading" className="display-lg mt-5">
              Order matters more than quantity.
            </h2>
            <p className="prose-body mt-6 max-w-md">
              Most people own the right products and use them in the wrong order,
              at the wrong strength, on the wrong nights. Answer four questions
              and we will tell you which of our five sequences to run — including
              the one that is only three products long.
            </p>
            <Link
              href="/routines"
              className="mt-9 inline-block border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
            >
              Find my sequence
            </Link>
          </div>

          <ScrollReveal selector="[data-routine]" className="md:col-span-6 md:col-start-7">
            <ul className="divide-y divide-ink/12 border-y border-ink/12">
              {routines.map((r) => (
                <li key={r.slug} data-routine>
                  <Link
                    href={`/routines#${r.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-copper"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl leading-tight">{r.name}</h3>
                      <p className="mt-1 text-sm text-ink/55">{r.subtitle}</p>
                    </div>
                    <span className="eyebrow shrink-0 tabular-nums text-ink/40">
                      {r.minutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Category index ---------------------------------------- */}
      <section aria-labelledby="categories-heading" className="shell py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-7">
          <div>
            <p className="eyebrow text-ink/45">The catalogue</p>
            <h2 id="categories-heading" className="display-md mt-3 max-w-2xl">
              Eight categories. Nothing in any of them that we would not use.
            </h2>
          </div>
          <Link href="/shop" className="link-underline eyebrow shrink-0 text-copper">
            Shop everything
          </Link>
        </div>

        <ScrollReveal
          selector="[data-cat]"
          className="mt-10 grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-4 md:gap-x-6"
        >
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const accentVar = `var(--color-${c.accent}${c.accent === "copper" || c.accent === "brine" ? "-light" : ""})`;
            return (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                data-cat
                className="group relative isolate flex aspect-4/5 flex-col justify-between overflow-hidden border border-ink/12 bg-haze/35 p-5 transition-colors duration-500 hover:border-ink/25"
              >
                {/* generated field, unique per category via its accent + index */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-70 transition-transform duration-700 ease-tide group-hover:scale-[1.06]"
                  style={{
                    backgroundImage: `radial-gradient(120% 85% at ${20 + ((i * 27) % 55)}% 8%, ${accentVar}33 0%, transparent 60%)`,
                  }}
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 240"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
                >
                  {Array.from({ length: 6 }).map((_, j) => {
                    const y = 30 + j * 26 + (i % 3) * 6;
                    return (
                      <path
                        key={j}
                        d={`M-20 ${y} C 40 ${y - 12}, 80 ${y + 14}, 140 ${y} S 190 ${y - 10}, 220 ${y + 4}`}
                        stroke={accentVar}
                        strokeWidth="1"
                        fill="none"
                      />
                    );
                  })}
                </svg>

                <span className="eyebrow relative w-fit bg-salt/80 px-2 py-1 tabular-nums text-ink/50 backdrop-blur-sm">
                  {String(count).padStart(2, "0")}
                </span>

                <div className="relative">
                  <span className="font-display text-[1.6rem] leading-[1.05] transition-colors group-hover:text-copper sm:text-3xl">
                    {c.name}
                  </span>
                  <span className="mt-2 flex items-center gap-2 text-xs text-ink/50">
                    <span className="link-underline">Shop the line</span>
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M0.5 4.5h9.5M6.5 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </ScrollReveal>
      </section>

      {/* ---- Closing statement ------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brine text-salt">
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-20"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${20 + i * 24} C 300 ${6 + i * 24}, 620 ${38 + i * 24}, 900 ${20 + i * 24} S 1280 ${4 + i * 24}, 1440 ${24 + i * 24}`}
              stroke="#f2ede4"
              strokeWidth="1"
              fill="none"
              opacity={1 - i * 0.07}
            />
          ))}
        </svg>
        <div className="shell-narrow relative py-28 text-center md:py-36">
          <blockquote className="display-md mx-auto max-w-3xl">
            &ldquo;Skin does not need much. It needs the right few things, applied
            in the right order, for longer than you think.&rdquo;
          </blockquote>
          <p className="eyebrow mt-8 text-salt/60">
            The house position, in one line
          </p>
          <Link
            href="/about"
            className="link-underline mt-10 inline-block text-sm text-salt/85"
          >
            What else we will not do
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lumen & Salt formulates on the Orkney coast. Sixteen products, published concentrations, and a refusal to grow the range for its own sake.",
};

const principles = [
  {
    n: "01",
    title: "We publish the number",
    body: "Every active concentration appears on the carton and on the product page. It is the cheapest form of honesty available to a cosmetics company and almost nobody does it, because a vague claim is easier to defend than a specific one.",
  },
  {
    n: "02",
    title: "We will tell you not to buy something",
    body: "Our sunscreen has better evidence behind it than our serums. Our three-product sequence works for most people, and it is the cheapest thing we sell. Saying so costs us money in the short term and is the only reason to trust anything else on this site.",
  },
  {
    n: "03",
    title: "The range does not grow",
    body: "Sixteen products. When we add one, we retire one. A range that expands every quarter is solving a revenue problem, not a skin problem, and the customer pays for the difference in confusion.",
  },
  {
    n: "04",
    title: "Unfragranced unless there is a reason",
    body: "Fragrance is the leading cause of cosmetic contact allergy and exists almost entirely to make the moment of application feel more expensive. Nothing in the range carries added fragrance. Some of it smells faintly of what is in it.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ---- Opening ------------------------------------------------ */}
      <header className="relative isolate overflow-hidden bg-ink text-salt">
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-[0.18]"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <path
              key={i}
              d={`M-100 ${40 + i * 30} C 260 ${18 + i * 30}, 520 ${62 + i * 30}, 780 ${40 + i * 30} S 1280 ${14 + i * 30}, 1540 ${46 + i * 30}`}
              stroke="#a8d0c6"
              strokeWidth="1"
              fill="none"
              opacity={1 - i * 0.04}
            />
          ))}
        </svg>

        <div className="shell relative py-28 md:py-40">
          <p className="eyebrow text-brine-light/70">Kirkwall, Orkney · 58.98°N</p>
          <h1 className="display-xl mt-7 max-w-4xl">
            We formulate
            <br />
            <span className="italic text-brine-light">where the water</span>
            <br />
            is cold.
          </h1>
          <p className="prose-body mt-9 max-w-lg text-salt/70">
            Not as a metaphor. We work on a harbour sixteen degrees south of the
            Arctic Circle, and the sea outside it is where three of our
            ingredients come from.
          </p>
        </div>
      </header>

      {/* ---- The argument ------------------------------------------- */}
      <section aria-labelledby="story-heading" className="shell py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <h2 id="story-heading" className="eyebrow text-ink/45 md:col-span-3">
            Why the house exists
          </h2>
          <div className="md:col-span-8 md:col-start-5">
            <p className="display-md">
              Most skincare is built to a price, then described in a way that
              makes the price sound like a formula.
            </p>
            <div className="prose-body mt-8 space-y-5 text-[1.05rem]">
              <p>
                The usual order of work is backwards. A concept comes first, then
                a cost ceiling, and the active ends up at whatever concentration
                survives both — enough to appear on the ingredient list, rarely
                enough to do anything measurable. None of that is fraud. It is
                ordinary, legal practice, and it is the reason so much skincare
                does very little.
              </p>
              <p>
                Lumen &amp; Salt is a refusal of one part of that. If a formula
                contains niacinamide, the carton says five percent. If the
                evidence behind a product is thin, we say so on the page you buy
                it from. And when a cheaper thing in the range would serve you
                better than an expensive one, we point at the cheaper one, which
                is what the homepage does about the sunscreen.
              </p>
              <p>
                Everything else follows. A short range, because a long one hides
                weak products among strong ones. No fragrance, because the
                allergy risk buys nothing but a nicer thirty seconds. One price,
                held, because a discount tells you what the first number was
                worth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Principles --------------------------------------------- */}
      <section
        aria-labelledby="principles-heading"
        className="border-y border-ink/12 bg-copper/8"
      >
        <div className="shell py-24 md:py-32">
          <h2 id="principles-heading" className="display-md max-w-xl">
            Four things we will not trade away.
          </h2>
          <ScrollReveal
            selector="[data-principle]"
            className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2"
          >
            {principles.map((p) => (
              <article key={p.n} data-principle className="border-t border-ink/20 pt-6">
                <p className="eyebrow tabular-nums text-copper">{p.n}</p>
                <h3 className="mt-4 font-display text-2xl leading-snug">{p.title}</h3>
                <p className="prose-body mt-3">{p.body}</p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Where the work happens ---------------------------------- */}
      <section className="border-t border-ink/12 bg-brine text-salt">
        <div className="shell grid gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-6">
            <p className="eyebrow text-salt/55">Where the work happens</p>
            <h2 className="display-md mt-4">
              A harbour building, and a very short walk to the water.
            </h2>
            <p className="prose-body mt-6 text-salt/75">
              Small batches, made close to where they are shipped from. Every
              batch carries a number, and the number is printed on the base of
              the bottle rather than filed somewhere you would have to ask for
              it.
            </p>
          </div>

          {/* Elevation drawing of the building, in rules. */}
          <div className="md:col-span-5 md:col-start-8">
            <svg viewBox="0 0 360 260" className="h-auto w-full" aria-hidden="true">
              <g stroke="#f2ede4" fill="none" strokeWidth="1" opacity="0.55">
                <path d="M30 220 h300" />
                <path d="M60 220 v-110 l70 -46 l70 46 v110" />
                <path d="M60 110 h140" />
                <rect x="84" y="132" width="34" height="42" />
                <rect x="142" y="132" width="34" height="42" />
                <rect x="108" y="186" width="30" height="34" />
                <path d="M200 220 v-70 h100 v70" />
                <path d="M200 150 h100" />
                <rect x="220" y="168" width="26" height="30" />
                <rect x="258" y="168" width="26" height="30" />
                <path d="M130 64 v-22" />
              </g>
              {/* waterline in front of the elevation */}
              {Array.from({ length: 4 }).map((_, i) => (
                <path
                  key={i}
                  d={`M10 ${232 + i * 7} C 90 ${228 + i * 7}, 170 ${238 + i * 7}, 250 ${232 + i * 7} S 330 ${228 + i * 7}, 350 ${233 + i * 7}`}
                  stroke="#a8d0c6"
                  strokeWidth="1"
                  fill="none"
                  opacity={0.5 - i * 0.1}
                />
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* ---- Close --------------------------------------------------- */}
      <section className="shell-narrow py-24 text-center md:py-32">
        <h2 className="display-md">Start with the sunscreen.</h2>
        <p className="prose-body mx-auto mt-5 max-w-md">
          We mean it. If you take one thing from this page, take that one. If you
          want the rest, the sequences page will tell you what order to put it in.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/product/noon-mineral"
            className="bg-ink px-8 py-4 text-sm text-salt transition-colors hover:bg-brine"
          >
            Noon, SPF 50
          </Link>
          <Link
            href="/routines"
            className="border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
          >
            Find my sequence
          </Link>
        </div>
      </section>
    </>
  );
}

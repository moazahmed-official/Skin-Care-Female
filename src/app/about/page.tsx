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

const timeline = [
  ["2019", "Iona Reid leaves a contract formulation lab in Edinburgh after eleven years of making other companies' claims work."],
  ["2021", "The first four formulas are made in a converted net store in Kirkwall. Three of them are still in the range."],
  ["2023", "Noon launches — the mineral SPF that took two years to get past the cast problem on deeper skin tones."],
  ["2025", "Sixteen products. Two retired. No plans for a seventeenth."],
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
            Not as a metaphor. The lab sits on a working harbour sixteen degrees
            south of the Arctic Circle, and the sea outside it is where three of
            our ingredients come from.
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
              Iona Reid spent eleven years making other companies&rsquo; claims
              stand up in a lab, and left because she could no longer do it.
            </p>
            <div className="prose-body mt-8 space-y-5 text-[1.05rem]">
              <p>
                The work was formulation-for-hire: a brand would arrive with a
                marketing concept and a price ceiling, and the lab would build
                something that met both. The active was usually present at a
                concentration chosen by the cost model rather than the evidence
                — enough to appear on the ingredient list, not enough to do
                anything measurable. This is not fraud. It is standard practice,
                and it is legal, and it is why so little skincare works.
              </p>
              <p>
                Lumen &amp; Salt started as a refusal of that one thing. If a
                formula contains niacinamide, the carton says five percent. If
                the evidence for a product is thin, we say the evidence is thin.
                And if a cheaper product in the range would serve you better than
                an expensive one, we point at the cheaper one — which we do, on
                the homepage, about the sunscreen.
              </p>
              <p>
                The rest follows from that. A short range, because a long one
                hides weak products among strong ones. No fragrance, because it
                is the most common allergen and buys nothing but a nicer moment.
                And a refusal to run a sale, because a discount is an admission
                that the original number was invented.
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

      {/* ---- Timeline ------------------------------------------------ */}
      <section aria-labelledby="timeline-heading" className="shell py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <h2 id="timeline-heading" className="eyebrow text-ink/45 md:col-span-3">
            How it got here
          </h2>
          <ol className="md:col-span-8 md:col-start-5">
            {timeline.map(([year, text]) => (
              <li key={year} className="flex gap-8 border-t border-ink/15 py-7">
                <span className="w-16 shrink-0 font-display text-2xl tabular-nums text-copper">
                  {year}
                </span>
                <p className="prose-body">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- The lab ------------------------------------------------- */}
      <section className="border-t border-ink/12 bg-brine text-salt">
        <div className="shell grid gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-6">
            <p className="eyebrow text-salt/55">The building</p>
            <h2 className="display-md mt-4">
              A net store with a nitrogen line and very good windows.
            </h2>
            <p className="prose-body mt-6 text-salt/75">
              Small-batch compounding, an anhydrous room for the vitamin C, and
              stability testing that runs the full twelve weeks rather than the
              accelerated four that the industry accepts. Batches are numbered and
              the certificate for yours is on the base of the bottle.
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
          We mean it. If you take one thing from this page, take that one — and if
          you want the rest, the sequences page will tell you what order to put it in.
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

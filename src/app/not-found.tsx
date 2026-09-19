import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M-80 ${50 + i * 32} C 280 ${28 + i * 32}, 560 ${72 + i * 32}, 820 ${50 + i * 32} S 1300 ${24 + i * 32}, 1520 ${56 + i * 32}`}
            stroke="#1f5a5c"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      <div className="shell-narrow relative py-32 text-center md:py-44">
        <p className="eyebrow text-ink/45">404</p>
        <h1 className="display-lg mt-5">This one went out with the tide.</h1>
        <p className="prose-body mx-auto mt-6 max-w-md">
          The page is not here. It may have been a product we retired — the range
          stays at sixteen, so when something new arrives, something leaves.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="bg-ink px-8 py-4 text-sm text-salt transition-colors hover:bg-brine"
          >
            Browse the catalogue
          </Link>
          <Link
            href="/search"
            className="border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}

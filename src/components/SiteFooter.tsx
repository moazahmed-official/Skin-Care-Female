import Link from "next/link";
import { categories } from "@/data/categories";
import { routines } from "@/data/routines";
import { Wordmark } from "@/components/Wordmark";

const help = [
  { href: "/about", label: "About the house" },
  { href: "/routines", label: "Find your sequence" },
  { href: "/shop/sets", label: "Sets & value" },
  { href: "/search", label: "Search the catalogue" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-px overflow-hidden bg-ink text-salt">
      {/* Horizon rule — the tide line motif, repeated from the hero. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brine-light/25" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full opacity-[0.16]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${18 + i * 20} C 240 ${4 + i * 20}, 480 ${34 + i * 20}, 720 ${18 + i * 20} S 1200 ${2 + i * 20}, 1440 ${20 + i * 20}`}
            stroke="#a8d0c6"
            strokeWidth="1"
            fill="none"
            opacity={1 - i * 0.12}
          />
        ))}
      </svg>

      <div className="shell relative pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Wordmark className="h-5 w-auto text-salt" />
            <p className="prose-body mt-6 max-w-sm text-salt/65">
              Formulated in Kirkwall, Orkney. Short ingredient lists, published
              concentrations, and nothing added for the smell of it.
            </p>

            {/* Static demo: no back end is wired to this form. */}
            <form className="mt-10 max-w-sm" action="/about">
              <label htmlFor="footer-email" className="eyebrow text-salt/50">
                Four letters a year
              </label>
              <p className="mt-2 text-sm text-salt/55">
                Formulation notes when something changes. Not a discount channel.
              </p>
              <div className="mt-4 flex items-center border-b border-salt/25 focus-within:border-copper-light">
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 text-sm text-salt outline-none placeholder:text-salt/35"
                />
                <button
                  type="submit"
                  className="eyebrow shrink-0 px-2 py-3 text-copper-light transition-colors hover:text-salt"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          <nav className="md:col-span-7" aria-label="Footer">
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <h2 className="eyebrow text-salt/45">Catalogue</h2>
                <ul className="mt-5 space-y-2.5">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/shop/${c.slug}`}
                        className="link-underline text-sm text-salt/75 hover:text-salt"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="eyebrow text-salt/45">Sequences</h2>
                <ul className="mt-5 space-y-2.5">
                  {routines.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/routines#${r.slug}`}
                        className="link-underline text-sm text-salt/75 hover:text-salt"
                      >
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="eyebrow text-salt/45">Elsewhere</h2>
                <ul className="mt-5 space-y-2.5">
                  {help.map((h) => (
                    <li key={h.href}>
                      <Link
                        href={h.href}
                        className="link-underline text-sm text-salt/75 hover:text-salt"
                      >
                        {h.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-salt/12 pt-7 text-xs text-salt/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lumen &amp; Salt Ltd. A fictional house, built as a design exercise.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>Unfragranced unless stated</span>
            <span>Never tested on animals</span>
            <span>Recyclable glass</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

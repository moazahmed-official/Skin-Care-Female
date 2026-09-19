"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { categories } from "@/data/categories";
import { Wordmark } from "@/components/Wordmark";
import { SearchOverlay } from "@/components/SearchOverlay";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/routines", label: "Routines" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, openDrawer, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile menu closes on navigation. Deriving it from the pathname that
  // was current when it opened avoids a setState-in-effect cascade.
  const [menuPath, setMenuPath] = useState(pathname);
  const menuVisible = menuOpen && menuPath === pathname;

  // Cmd/Ctrl-K opens search, as expected of a catalogue this size.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuVisible]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? "border-b border-ink/12 bg-salt/88 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[4.25rem] items-center justify-between gap-4 md:h-20">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              aria-label="Lumen and Salt, home"
              className="shrink-0 text-ink transition-opacity hover:opacity-70"
            >
              <Wordmark className="h-[1.05rem] w-auto md:h-[1.2rem]" />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {nav.map((item) => {
                  const active =
                    item.href === "/shop"
                      ? pathname.startsWith("/shop") || pathname.startsWith("/product")
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`eyebrow link-underline py-2 transition-colors ${
                          active ? "text-copper" : "text-ink/75 hover:text-ink"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 rounded-full px-3 py-2 text-ink/75 transition-colors hover:bg-ink/6 hover:text-ink"
              aria-label="Search products"
            >
              <SearchIcon />
              <span className="eyebrow hidden xl:inline">Search</span>
              <kbd className="eyebrow hidden rounded border border-ink/18 px-1.5 py-1 text-[0.58rem] text-ink/50 xl:inline">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={openDrawer}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-ink/75 transition-colors hover:bg-ink/6 hover:text-ink"
              aria-label={`Open bag${hydrated && count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ", empty"}`}
            >
              <BagIcon />
              <span
                className={`eyebrow tabular-nums transition-opacity ${
                  hydrated && count > 0 ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              >
                {hydrated ? count : 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuPath(pathname);
                setMenuOpen(!menuVisible);
              }}
              aria-expanded={menuVisible}
              aria-controls="mobile-menu"
              className="-mr-1 ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/6 lg:hidden"
              aria-label={menuVisible ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                    menuVisible ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                    menuVisible ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu ------------------------------------------ */}
      <div
        id="mobile-menu"
        hidden={!menuVisible}
        className="fixed inset-0 z-40 bg-salt lg:hidden"
      >
        <div className="shell flex h-full flex-col pt-24 pb-10">
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block border-b border-ink/10 py-4 font-display text-3xl text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8">
            <p className="eyebrow mb-4 text-ink/45">By category</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="block py-1 text-sm text-ink/75"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
            className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-6 text-sm text-ink/70"
          >
            <SearchIcon />
            Search the catalogue
          </button>
        </div>
      </div>

      {/* Keyed on each open so the panel always starts from an empty query. */}
      <SearchOverlay
        key={searchOpen ? "search-open" : "search-closed"}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="7.4" cy="7.4" r="5.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11.3 11.3 L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M3.4 5.2h10.2l-.85 9.1a1.1 1.1 0 0 1-1.1 1H5.35a1.1 1.1 0 0 1-1.1-1z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6.3 7V4.5a2.2 2.2 0 0 1 4.4 0V7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

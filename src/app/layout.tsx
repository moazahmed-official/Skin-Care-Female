import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { CartDrawer } from "@/components/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumenandsalt.com"),
  title: {
    default: "Lumen & Salt — Cold-water skincare",
    template: "%s · Lumen & Salt",
  },
  description:
    "Mineral-led skincare formulated on the North Atlantic coast. Short ingredient lists, published concentrations, and nothing added for the smell of it.",
  openGraph: {
    title: "Lumen & Salt",
    description:
      "Cold-water skincare. Short ingredient lists, published concentrations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-salt focus:text-sm"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <ConditionalFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

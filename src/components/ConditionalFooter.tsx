"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Checkout suppresses the full site footer — a newsletter form and the
 * entire catalogue nav are the last thing someone paying should be offered.
 * Everywhere else the footer renders as normal.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;
  return <SiteFooter />;
}

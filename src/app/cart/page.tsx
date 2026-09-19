import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review your Lumen & Salt order.",
};

export default function CartPage() {
  return <CartView />;
}

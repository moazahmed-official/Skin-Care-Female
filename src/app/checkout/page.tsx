import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Lumen & Salt order.",
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}

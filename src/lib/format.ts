/**
 * Pure formatting helpers, deliberately kept outside the client-only cart
 * module so server components can use them too.
 */

export const freeShippingThreshold = 60;
export const shippingCost = 5;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

import type { Routine, SkinConcern } from "./types";

export const concernLabels: Record<SkinConcern, string> = {
  dehydration: "Dehydration",
  dullness: "Dullness",
  texture: "Rough texture",
  redness: "Redness & reactivity",
  barrier: "Damaged barrier",
  "fine-lines": "Fine lines",
  congestion: "Congestion",
};

export const concernQuestions: {
  id: SkinConcern;
  prompt: string;
  detail: string;
}[] = [
  {
    id: "barrier",
    prompt: "It stings when I apply things it never used to sting with.",
    detail: "A barrier problem. Everything else waits until this is fixed.",
  },
  {
    id: "dehydration",
    prompt: "It feels tight by mid-morning, whatever I put on it.",
    detail: "Dehydration — a water problem, not an oil problem.",
  },
  {
    id: "congestion",
    prompt: "My pores clog, and my T-zone is shining by lunch.",
    detail: "Sebum regulation and gentle pore clearing.",
  },
  {
    id: "dullness",
    prompt: "It looks grey. Uneven tone, marks that won't fade.",
    detail: "Antioxidant and pigment work, over months not weeks.",
  },
  {
    id: "fine-lines",
    prompt: "I can see lines now that I couldn't two years ago.",
    detail: "A retinoid, and the sunscreen that makes it worth doing.",
  },
  {
    id: "texture",
    prompt: "It feels rough — bumps, flaking, never quite smooth.",
    detail: "Controlled exfoliation with the lipids to follow it.",
  },
  {
    id: "redness",
    prompt: "I flush easily and it takes a long time to settle.",
    detail: "Minimal, unfragranced, anti-inflammatory. Nothing clever.",
  },
];

export const routines: Routine[] = [
  {
    slug: "the-reset",
    name: "The Reset",
    subtitle: "Six weeks to a barrier that works again",
    builtFor:
      "Skin that has been over-exfoliated, over-treated, or put through a bad winter. If products sting that never used to, start here and add nothing else for six weeks.",
    concerns: ["barrier", "redness", "dehydration"],
    timeOfDay: "either",
    minutes: 4,
    morning: [
      { productSlug: "tidewash", note: "Water alone is also fine in the morning. Do not use both." },
      { productSlug: "ebb", note: "Two drops. Niacinamide is doing the barrier work here." },
      { productSlug: "cold-current", note: "On damp skin, pressed in. This is the layer people skip." },
      { productSlug: "salt-flat", note: "Generously. You cannot over-apply this during a reset." },
      { productSlug: "noon-mineral", note: "Two fingers. Non-negotiable, even in cloud." },
    ],
    evening: [
      { productSlug: "tidewash", note: "Thirty seconds of contact, tepid water." },
      { productSlug: "cold-current", note: "Damp skin again." },
      { productSlug: "salt-flat", note: "The last thing on, every night, for six weeks." },
    ],
  },
  {
    slug: "long-game",
    name: "The Long Game",
    subtitle: "Retinal, vitamin C, and the sunscreen that makes both worth it",
    builtFor:
      "Skin with intact barrier function that is ready for actives. Fine lines, texture, uneven tone. This takes twelve weeks to judge and it is worth the twelve weeks.",
    concerns: ["fine-lines", "dullness", "texture"],
    timeOfDay: "either",
    minutes: 6,
    morning: [
      { productSlug: "tidewash", note: "Quick pass — the work happened overnight." },
      { productSlug: "shoal-light", note: "Four drops on dry skin, before anything water-based." },
      { productSlug: "still-water", note: "Light layer; the vitamin C base is already occlusive." },
      { productSlug: "noon-mineral", note: "The other half of the vitamin C. Reapply at two hours." },
    ],
    evening: [
      { productSlug: "first-light-oil", note: "Dry hands, dry face, sixty seconds." },
      { productSlug: "tidewash", note: "Second cleanse to clear the emulsified oil." },
      { productSlug: "long-night", note: "Pea-sized. Two nights a week for the first month." },
      { productSlug: "salt-flat", note: "Every night, including the nights without retinal." },
    ],
  },
  {
    slug: "low-tide",
    name: "Low Tide",
    subtitle: "Three products, four minutes, no decisions",
    builtFor:
      "People who will not do a ten-step routine and should not be sold one. This is the minimum that still changes something — and for most skin, it is enough.",
    concerns: ["dehydration", "barrier"],
    timeOfDay: "either",
    minutes: 2,
    morning: [
      { productSlug: "tidewash", note: "Or water. Genuinely." },
      { productSlug: "salt-flat", note: "One step does hydration and barrier together." },
      { productSlug: "noon-mineral", note: "If you only ever buy one thing from us, buy this." },
    ],
    evening: [
      { productSlug: "tidewash", note: "This one matters more than the morning wash." },
      { productSlug: "salt-flat", note: "Done." },
    ],
  },
  {
    slug: "clear-water",
    name: "Clear Water",
    subtitle: "Congestion and shine, without stripping anything",
    builtFor:
      "Oily or combination skin that has been fighting itself with harsh cleansers. The oil calms down when you stop declaring war on it.",
    concerns: ["congestion", "texture", "dullness"],
    timeOfDay: "either",
    minutes: 4,
    morning: [
      { productSlug: "tidewash", note: "No scrub, no foam, no squeak." },
      { productSlug: "ebb", note: "Zinc PCA is what blunts the midday shine." },
      { productSlug: "still-water", note: "Oily skin is often dehydrated skin. Do not skip this." },
      { productSlug: "noon-mineral", note: "Fluid texture; it will not add to the shine." },
    ],
    evening: [
      { productSlug: "first-light-oil", note: "Oil dissolves oil. This is the counterintuitive part." },
      { productSlug: "tidewash", note: "Follow through." },
      { productSlug: "drawdown", note: "Twice a week, T-zone only, fifteen minutes." },
      { productSlug: "still-water", note: "On the nights you do not mask, go straight here." },
    ],
  },
  {
    slug: "after-hours",
    name: "After Hours",
    subtitle: "The night you overdid it",
    builtFor:
      "A rescue sequence, not a routine. Too much acid, too much sun, a week without sleep. Run this for two or three nights and then go back to whatever you were doing.",
    concerns: ["redness", "barrier", "dehydration"],
    timeOfDay: "evening",
    minutes: 3,
    morning: [
      { productSlug: "cold-current", note: "Skip cleansing entirely. Rinse with cool water." },
      { productSlug: "salt-flat", note: "Thick layer." },
      { productSlug: "noon-mineral", note: "Compromised skin burns faster. This matters more, not less." },
    ],
    evening: [
      { productSlug: "tidewash", note: "The mildest wash we make, and nothing after it but the mask." },
      { productSlug: "slack-tide", note: "A thick layer, left on. No actives tonight." },
      { productSlug: "leeward", note: "Lips take the damage too and nobody remembers them." },
    ],
  },
];

export const routineBySlug = new Map(routines.map((r) => [r.slug, r]));

export function routinesForConcerns(selected: SkinConcern[]): Routine[] {
  if (selected.length === 0) return routines;
  return [...routines]
    .map((r) => ({
      r,
      score: r.concerns.filter((c) => selected.includes(c)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.r.minutes - b.r.minutes)
    .map((x) => x.r);
}

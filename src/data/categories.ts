import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "serums",
    name: "Serums",
    line: "serums",
    intro:
      "Thin fluids that carry one idea each. We keep the actives separated so you can decide what your skin gets on a given night, rather than buying a decision someone else made.",
    accent: "brine",
  },
  {
    slug: "cleansers",
    name: "Cleansers",
    line: "cleansers",
    intro:
      "Washing is the step most likely to damage a barrier, so ours are built around what they leave behind — not how much they strip.",
    accent: "kelp",
  },
  {
    slug: "moisturisers",
    name: "Moisturisers",
    line: "moisturisers",
    intro:
      "Three weights, because skin in February is not skin in August. Each one seals water in with a lipid profile close to what skin makes on its own.",
    accent: "copper",
  },
  {
    slug: "sun",
    name: "Sun",
    line: "sun care",
    intro:
      "Mineral filters, ground fine enough to disappear on deeper skin. The single product here that changes how your face ages.",
    accent: "copper",
  },
  {
    slug: "masks",
    name: "Masks",
    line: "masks",
    intro:
      "Short, deliberate interventions. Twenty minutes, once or twice a week, doing something a leave-on product cannot.",
    accent: "kelp",
  },
  {
    slug: "lip",
    name: "Lip",
    line: "lip care",
    intro:
      "Lip skin has no oil glands and a stratum corneum a fraction the thickness of cheek skin. It needs occlusion, not flavour.",
    accent: "copper",
  },
  {
    slug: "body",
    name: "Body",
    line: "body care",
    intro:
      "Formulated at face-grade concentrations, sized for the surface area you actually have to cover.",
    accent: "brine",
  },
  {
    slug: "sets",
    name: "Sets",
    line: "sets",
    intro:
      "Complete sequences at a lower price than their parts. Built for people starting over, or starting at all.",
    accent: "ink",
  },
];

const bySlug = new Map<string, Category>(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export const categoryBySlug = bySlug;

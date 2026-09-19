export type CategorySlug =
  | "serums"
  | "cleansers"
  | "moisturisers"
  | "sun"
  | "masks"
  | "lip"
  | "body"
  | "sets";

export type SkinConcern =
  | "dehydration"
  | "dullness"
  | "texture"
  | "redness"
  | "barrier"
  | "fine-lines"
  | "congestion";

export type TimeOfDay = "morning" | "evening" | "either";

export type VesselKind =
  | "dropper"
  | "pump"
  | "jar"
  | "tube"
  | "stick"
  | "flask"
  | "sachet"
  | "duo";

/** Drives the generated SVG artwork for each product. */
export interface Vessel {
  kind: VesselKind;
  /** Primary glass/packaging tint. */
  glass: string;
  /** Liquid or cream fill colour. */
  fill: string;
  /** Cap / collar colour. */
  cap: string;
  /** Label paper colour. */
  label: string;
  /** Relative height 0.7 – 1 for shelf-line variation. */
  scale: number;
}

export interface Ingredient {
  name: string;
  percentage?: string;
  role: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Short qualifier printed under the name, e.g. "Marine Hydrating Serum". */
  descriptor: string;
  category: CategorySlug;
  price: number;
  size: string;
  /** One-line shelf statement. */
  shelfLine: string;
  /** 2–3 sentence editorial body. */
  story: string;
  benefits: string[];
  keyIngredients: Ingredient[];
  fullIngredients: string;
  howToUse: string[];
  texture: string;
  scent: string;
  concerns: SkinConcern[];
  timeOfDay: TimeOfDay;
  vessel: Vessel;
  /** Step position when used inside a routine (1 = first on skin). */
  routineStep: number;
  isNew?: boolean;
  bestSeller?: boolean;
  /** Products this one is formulated to sit beside. */
  pairsWith: string[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Plural noun used in running copy. */
  line: string;
  intro: string;
  /** Accent token name from the palette. */
  accent: "brine" | "copper" | "kelp" | "ink";
}

export interface RoutineStep {
  productSlug: string;
  note: string;
}

export interface Routine {
  slug: string;
  name: string;
  subtitle: string;
  /** Who it is built for, in plain language. */
  builtFor: string;
  concerns: SkinConcern[];
  timeOfDay: TimeOfDay;
  minutes: number;
  morning: RoutineStep[];
  evening: RoutineStep[];
}

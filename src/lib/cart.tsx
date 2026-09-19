"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { productBySlug } from "@/data/products";
import type { Product } from "@/data/types";

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  /** Set once the stored cart has been read, so SSR and client agree. */
  hydrated: boolean;
}

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; slug: string; qty: number }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

import { freeShippingThreshold, shippingCost } from "@/lib/format";

const STORAGE_KEY = "lumen-salt-cart-v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const existing = state.lines.find((l) => l.slug === action.slug);
      const lines = existing
        ? state.lines.map((l) =>
            l.slug === action.slug ? { ...l, qty: Math.min(l.qty + action.qty, 12) } : l,
          )
        : [...state.lines, { slug: action.slug, qty: action.qty }];
      return { ...state, lines };
    }
    case "setQty": {
      if (action.qty <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.slug === action.slug ? { ...l, qty: Math.min(action.qty, 12) } : l,
        ),
      };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "clear":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

export interface ResolvedLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

interface CartValue {
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  hydrated: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** Drawer state lives with the cart so any component can open it. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Slug of the most recent addition, used for the confirmation flash. */
  lastAdded: string | null;
}

const CartContext = createContext<CartValue | null>(null);

const FREE_SHIPPING_AT = freeShippingThreshold;
const SHIPPING_COST = shippingCost;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read persisted cart after mount so server and first client render match.
  useEffect(() => {
    let lines: CartLine[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          lines = parsed.filter(
            (l): l is CartLine =>
              typeof l === "object" &&
              l !== null &&
              typeof (l as CartLine).slug === "string" &&
              typeof (l as CartLine).qty === "number" &&
              productBySlug.has((l as CartLine).slug),
          );
        }
      }
    } catch {
      // Private mode or corrupted value — start empty, never throw.
    }
    dispatch({ type: "hydrate", lines });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage unavailable; the cart still works for this session.
    }
  }, [state.lines, state.hydrated]);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    dispatch({ type: "add", slug, qty });
    setLastAdded(slug);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setLastAdded(null), 2400);
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    dispatch({ type: "setQty", slug, qty });
  }, []);

  const remove = useCallback((slug: string) => {
    dispatch({ type: "remove", slug });
  }, []);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartValue>(() => {
    const resolved: ResolvedLine[] = state.lines.flatMap((line) => {
      const product = productBySlug.get(line.slug);
      if (!product) return [];
      return [{ product, qty: line.qty, lineTotal: product.price * line.qty }];
    });
    const subtotal = resolved.reduce((sum, l) => sum + l.lineTotal, 0);
    const count = resolved.reduce((sum, l) => sum + l.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_COST;
    return {
      lines: state.lines,
      resolved,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      hydrated: state.hydrated,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      lastAdded,
    };
  }, [state.lines, state.hydrated, add, setQty, remove, clear, drawerOpen, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

// Re-exported so client components can keep a single import.
export { formatPrice, freeShippingThreshold } from "@/lib/format";

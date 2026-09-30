"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartSelection = { groupId: string; label: string; value: string; valueLabel: string };

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  selections: CartSelection[];
  file: { status: "selected"; name: string; size: number } | { status: "not-ready"; note: string } | { status: "none" };
  assistance: boolean;
  notes: string;
  addedAt: number;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  add: (item: Omit<CartItem, "id" | "addedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pi-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable */
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "id" | "addedAt">) => {
    setItems((prev) => [
      ...prev,
      { ...item, id: `${item.slug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, addedAt: Date.now() },
    ]);
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, ready, add, remove, clear }), [items, ready, add, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

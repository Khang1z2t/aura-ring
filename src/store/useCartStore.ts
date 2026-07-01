import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { buildCartItemKey, getCartItemCount, getCartSubtotal } from '@/lib/cart'
import type { CartItem } from '@/types/cart'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

function clampQuantity(quantity: number) {
  return Math.max(1, quantity)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = buildCartItemKey(item)
          const existing = state.items.find((entry) => buildCartItemKey(entry) === key)

          if (!existing) {
            return {
              items: [...state.items, { ...item, quantity: clampQuantity(item.quantity) }],
            }
          }

          return {
            items: state.items.map((entry) =>
              buildCartItemKey(entry) === key
                ? { ...entry, quantity: entry.quantity + clampQuantity(item.quantity) }
                : entry
            ),
          }
        }),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((entry) =>
            buildCartItemKey(entry) === key ? { ...entry, quantity: clampQuantity(quantity) } : entry
          ),
        })),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((entry) => buildCartItemKey(entry) !== key),
        })),
      clearCart: () => set({ items: [] }),
      itemCount: () => getCartItemCount(get().items),
      subtotal: () => getCartSubtotal(get().items),
    }),
    {
      name: 'aurora-cart',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)

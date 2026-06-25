import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Cake } from '@/types'

type CartStore = {
  items: CartItem[]
  addItem: (cake: Cake, customizations: Record<string, string>, extraPrice: number) => void
  removeItem: (cakeId: string) => void
  clearCart: () => void
  totalPrice: () => number
  totalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (cake, customizations, extraPrice) =>
        set((state) => ({
          items: [
            ...state.items,
            { cake, customizations, extraPrice, quantity: 1 },
          ],
        })),

      removeItem: (cakeId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cake.id !== cakeId),
        })),

      clearCart: () => set({ items: [] }),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.cake.price + item.extraPrice,
          0
        ),

      totalItems: () => get().items.length,
    }),
    { name: 'cart-storage' }
  )
)
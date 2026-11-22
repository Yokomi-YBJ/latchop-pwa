import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/product';
import { CartStoreState, AddToCartResult } from '../types/cart';

export const MAX_QUANTITE_PAR_PRODUIT = 4;

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (produit: Product): AddToCartResult => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id_produit === produit.id_produit);
        const currentQty = existingItem ? existingItem.quantite : 0;

        // Plafond strict de 4 unités par produit
        if (currentQty >= MAX_QUANTITE_PAR_PRODUIT) {
          return {
            success: false,
            message: `Vous ne pouvez pas commander plus de ${MAX_QUANTITE_PAR_PRODUIT} unités de ce plat.`,
          };
        }

        // Validation par rapport au stock réel
        if (produit.stock !== undefined && produit.stock !== null && currentQty >= produit.stock) {
          return {
            success: false,
            message: `Stock insuffisant. Seulement ${produit.stock} unité(s) disponible(s).`,
          };
        }

        set((state) => {
          const itemExists = state.cart.some((item) => item.id_produit === produit.id_produit);
          if (itemExists) {
            return {
              cart: state.cart.map((item) =>
                item.id_produit === produit.id_produit
                  ? { ...item, quantite: item.quantite + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { ...produit, quantite: 1 }],
          };
        });

        return { success: true };
      },

      removeFromCart: (id_produit: number) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id_produit !== id_produit),
        }));
      },

      incrementQuantite: (id_produit: number): AddToCartResult => {
        const { cart } = get();
        const item = cart.find((i) => i.id_produit === id_produit);
        if (!item) return { success: false, message: 'Article non trouvé dans le panier.' };

        const currentQty = item.quantite;
        const stockLimit = item.stock !== undefined && item.stock !== null ? item.stock : MAX_QUANTITE_PAR_PRODUIT;
        const maxAllowed = Math.min(MAX_QUANTITE_PAR_PRODUIT, stockLimit);

        if (currentQty >= maxAllowed) {
          const reason =
            item.stock !== undefined && item.stock !== null && item.stock <= MAX_QUANTITE_PAR_PRODUIT
              ? `Stock maximum atteint (${stockLimit} unité(s)).`
              : `Plafond de ${MAX_QUANTITE_PAR_PRODUIT} unités atteint par commande.`;
          return { success: false, message: reason };
        }

        set((state) => ({
          cart: state.cart.map((cartItem) =>
            cartItem.id_produit === id_produit
              ? { ...cartItem, quantite: cartItem.quantite + 1 }
              : cartItem
          ),
        }));

        return { success: true };
      },

      decrementQuantite: (id_produit: number) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id_produit === id_produit) {
                return { ...item, quantite: item.quantite - 1 };
              }
              return item;
            })
            .filter((item) => item.quantite > 0),
        }));
      },

      viderPanier: () => {
        set({ cart: [] });
      },

      totalPrix: () => {
        return get().cart.reduce((sum, item) => sum + item.Prix * item.quantite, 0);
      },

      totalArticles: () => {
        return get().cart.reduce((sum, item) => sum + item.quantite, 0);
      },
    }),
    {
      name: 'latchop_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

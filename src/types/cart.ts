import { Product } from './product';

export interface CartItem extends Product {
  quantite: number;
}

export interface AddToCartResult {
  success: boolean;
  message?: string;
}

export interface CartStoreState {
  cart: CartItem[];
  addToCart: (produit: Product) => AddToCartResult;
  removeFromCart: (id_produit: number) => void;
  incrementQuantite: (id_produit: number) => AddToCartResult;
  decrementQuantite: (id_produit: number) => void;
  viderPanier: () => void;
  totalPrix: () => number;
  totalArticles: () => number;
}

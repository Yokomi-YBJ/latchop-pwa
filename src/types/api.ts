export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface OrderItemPayload {
  id: number;
  quantite: number;
}

export interface CreateOrderPayload {
  produits: OrderItemPayload[];
  avec_livraison: boolean;
}

export interface Order {
  id_commande: number;
  id_user: number;
  date_commande: string;
  statut: 'en_attente' | 'en_cours' | 'livree' | 'annulee';
  avec_livraison: number | boolean;
  total?: number;
  lignes?: Array<{
    id_produit: number;
    nom_produit: string;
    quantite: number;
    prix_unitaire: number;
  }>;
}

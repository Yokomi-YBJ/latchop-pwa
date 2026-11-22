export interface Product {
  id_produit: number;
  nom_produit: string;
  description: string;
  img_produit: string;
  img_url?: string;
  Prix: number;
  stock?: number | null;
  categorie?: string;
  disponible?: number;
}

export interface ProductsResponse {
  status: 'success' | 'error';
  produits: Product[];
  version?: string;
  message?: string;
}

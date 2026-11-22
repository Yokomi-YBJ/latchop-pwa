import { apiClient } from './client';
import { Product, ProductsResponse } from '../types/product';
import { cacheProductsLocally, getCachedProducts, getCachedVersion } from '../db';

export const productsApi = {
  getProducts: async (): Promise<{ produits: Product[]; fromCache?: boolean; version?: string }> => {
    try {
      const cachedVersion = await getCachedVersion();
      const headers: Record<string, string> = {};
      if (cachedVersion) {
        headers['If-None-Match'] = cachedVersion;
      }

      const response = await apiClient.get<ProductsResponse>('/produits', {
        headers,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
      });

      if (response.status === 304) {
        // Rien n'a changé sur le serveur, on sert Dexie IndexedDB
        const localData = await getCachedProducts();
        if (localData && localData.length > 0) {
          return { produits: localData, fromCache: true, version: cachedVersion || undefined };
        }
      }

      if (response.data && response.data.status === 'success') {
        const remoteProducts = response.data.produits || [];
        const serverVersion = response.data.version || response.headers['etag'];
        
        // Mise en cache locale IndexedDB
        await cacheProductsLocally(remoteProducts, serverVersion);
        return { produits: remoteProducts, fromCache: false, version: serverVersion };
      }

      // Si format inattendu, fallback Dexie
      const cached = await getCachedProducts();
      return { produits: cached, fromCache: true };
    } catch (error) {
      // Si hors-ligne ou erreur réseau, fallback Dexie
      console.warn('[ProductsApi] Réseau inaccessible, lecture du catalogue dans IndexedDB:', error);
      const fallbackProducts = await getCachedProducts();
      if (fallbackProducts && fallbackProducts.length > 0) {
        return { produits: fallbackProducts, fromCache: true };
      }
      throw error;
    }
  },
};

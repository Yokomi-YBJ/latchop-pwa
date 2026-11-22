import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';

export const PRODUCTS_QUERY_KEY = ['products', 'list'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const result = await productsApi.getProducts();
      return result;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24h
    networkMode: 'offlineFirst',
  });
}

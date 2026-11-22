import { apiClient } from './client';
import { CreateOrderPayload, Order } from '../types/api';

export interface CreateOrderResponse {
  status: 'success' | 'error';
  message: string;
  id_commande?: number;
  ajustements?: string[];
}

export interface WaitingCountResponse {
  status: 'success' | 'error';
  nb_en_attente: number;
}

export const ordersApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/commandes', payload);
    return response.data;
  },

  getMyOrders: async (): Promise<{ status: string; commandes: Order[] }> => {
    const response = await apiClient.get<{ status: string; commandes: Order[] }>('/commandes/mes-commandes');
    return response.data;
  },

  getWaitingCount: async (): Promise<WaitingCountResponse> => {
    const response = await apiClient.get<WaitingCountResponse>('/commandes/nb-en-attente');
    return response.data;
  },
};

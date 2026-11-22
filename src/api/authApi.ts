import { apiClient } from './client';
import { AuthResponse, LoginCredentials, RegisterPayload, User } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/connexion', credentials);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/inscription', payload);
    return response.data;
  },

  getMe: async (): Promise<{ status: string; user: User }> => {
    const response = await apiClient.get<{ status: string; user: User }>('/profil');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<{ status: string; user: User }> => {
    const response = await apiClient.put<{ status: string; user: User }>('/profil', data);
    return response.data;
  },
};

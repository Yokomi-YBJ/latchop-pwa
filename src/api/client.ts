import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const getDeviceId = (): string => {
  let id = localStorage.getItem('latchop_device_id');
  if (!id) {
    id = 'pwa_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('latchop_device_id', id);
  }
  return id;
};

export const API_BASE_URL ='https://cycyfood-backend.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Device-Id': getDeviceId(),
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('latchop_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Déconnexion propre si la session est expirée ou invalidée par une autre connexion
      const currentToken = localStorage.getItem('latchop_token');
      if (currentToken) {
        localStorage.removeItem('latchop_token');
        localStorage.removeItem('latchop_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

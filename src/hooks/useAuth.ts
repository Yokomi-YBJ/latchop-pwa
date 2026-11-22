import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/authApi';
import { LoginCredentials, RegisterPayload, User } from '../types/auth';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    user,
    token,
    isAuthenticated,
    isAdminBlocked,
    setSession,
    clearSession,
    setAdminBlocked,
    updateUser,
  } = useAuthStore();

  // Écoute de l'événement de déconnexion 401 déclenché par l'intercepteur Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearSession, queryClient]);

  // Synchronisation avec /profil (me) quand un token est présent
  const profileQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const data = await authApi.getMe();
      if (data.status === 'success' && data.user) {
        updateUser(data.user);
        return data.user;
      }
      return null;
    },
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Mutation Connexion
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await authApi.login(credentials);
      return data;
    },
    onSuccess: (data) => {
      // SÉCURITÉ ADMIN : Interception et blocage strict si le compte connecté est un administrateur
      if (data.user?.role === 'admin') {
        // 1. Détruire immédiatement toute trace de la session
        clearSession();
        queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
        
        // 2. Activer l'écran bloquant 'Interface client uniquement'
        setAdminBlocked(true);

        throw new Error('ACCES_ADMIN_REFUSE');
      }

      if (data.status === 'success' && data.token && data.user) {
        setSession(data.token, data.user);
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
    },
  });

  // Mutation Inscription
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await authApi.register(payload);
      return data;
    },
    onSuccess: (data) => {
      if (data.status === 'success' && data.token && data.user) {
        setSession(data.token, data.user);
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
    },
  });

  // Déconnexion
  const logout = () => {
    clearSession();
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
  };

  const dismissAdminBlock = () => {
    setAdminBlocked(false);
  };

  return {
    user: (profileQuery.data as User | undefined) || user,
    token,
    isAuthenticated,
    isAdminBlocked,
    isLoading: profileQuery.isLoading || loginMutation.isPending || registerMutation.isPending,
    isProfileLoading: profileQuery.isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    dismissAdminBlock,
  };
}

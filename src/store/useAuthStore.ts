import { create } from 'zustand';
import { User, AuthState } from '../types/auth';

interface AuthStoreState extends AuthState {
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
  setAdminBlocked: (blocked: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('latchop_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('latchop_token');
};

const initialToken = getStoredToken();
const initialUser = getStoredUser();

export const useAuthStore = create<AuthStoreState>((set) => ({
  token: initialToken,
  user: initialUser,
  isAuthenticated: Boolean(initialToken && initialUser),
  isAdminBlocked: false,

  setSession: (token: string, user: User) => {
    localStorage.setItem('latchop_token', token);
    localStorage.setItem('latchop_user', JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
      isAdminBlocked: false,
    });
  },

  clearSession: () => {
    localStorage.removeItem('latchop_token');
    localStorage.removeItem('latchop_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setAdminBlocked: (blocked: boolean) => {
    set({ isAdminBlocked: blocked });
  },

  updateUser: (newFields: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...newFields };
      localStorage.setItem('latchop_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));

export interface User {
  id_user: number;
  nom_user: string;
  prenom_user: string;
  adresse_user: string;
  telephone: number | string;
  role?: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdminBlocked: boolean;
}

export interface LoginCredentials {
  telephone: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  password: string;
  copassword: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  token?: string;
  user?: User;
}

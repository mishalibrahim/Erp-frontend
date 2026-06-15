export interface User {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MeResponse {
  userId: string;
  isSuperAdmin: boolean;
  tenantId: string;
}


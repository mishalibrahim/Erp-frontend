export interface User {
  id: string;
  firstName: string;
  lastName: string;
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenantId: string;
}


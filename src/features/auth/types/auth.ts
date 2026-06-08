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

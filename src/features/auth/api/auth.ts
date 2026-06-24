import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import type { AuthResponse, LoginCredentials, MeResponse } from "../types/auth";
import type { TenantListItemDto } from "../types/tenant";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await axiosClient.get<MeResponse>(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

export const getMyTenants = async (): Promise<TenantListItemDto[]> => {
  const response = await axiosClient.get<TenantListItemDto[]>(API_ENDPOINTS.AUTH.MY_TENANTS);
  return response.data;
};

export const switchTenant = async (targetTenantId: string): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SWITCH_TENANT, { targetTenantId });
  return response.data;
};

import { axiosClient } from "@/lib/axiosClient";
import type { AuthResponse, LoginCredentials, MeResponse } from "../types/auth";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/api/auth/login", credentials);
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await axiosClient.get<MeResponse>("/api/auth/me");
  return response.data;
};

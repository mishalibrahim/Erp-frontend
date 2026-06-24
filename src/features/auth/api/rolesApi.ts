import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
}

export const rolesApi = {
  getRoles: async (): Promise<Role[]> => {
    const { data } = await axiosClient.get<Role[]>(API_ENDPOINTS.ROLES.GET_ALL);
    return data;
  },
};

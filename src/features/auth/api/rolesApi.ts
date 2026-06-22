import { axiosClient } from "@/lib/axiosClient";

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
}

export const rolesApi = {
  getRoles: async (): Promise<Role[]> => {
    const { data } = await axiosClient.get<Role[]>("api/roles");
    return data;
  },
};

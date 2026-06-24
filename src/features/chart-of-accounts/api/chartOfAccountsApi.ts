import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import type {
  GlAccountDto,
  GlAccountTreeNodeDto,
  CreateGlAccountDto,
  UpdateGlAccountDto,
} from "../types";

export const chartOfAccountsApi = {
  getAll: async (): Promise<GlAccountDto[]> => {
    const { data } = await axiosClient.get<GlAccountDto[]>(
      API_ENDPOINTS.CHART_OF_ACCOUNTS.BASE,
    );
    return data;
  },

  getTree: async (): Promise<GlAccountTreeNodeDto[]> => {
    const { data } = await axiosClient.get<GlAccountTreeNodeDto[]>(
      API_ENDPOINTS.CHART_OF_ACCOUNTS.TREE,
    );
    return data;
  },

  getNextNumber: async (category?: number, parentId?: string): Promise<string> => {
    const { data } = await axiosClient.get<{ nextAccountNumber: string }>(
      API_ENDPOINTS.CHART_OF_ACCOUNTS.NEXT_NUMBER(category, parentId),
    );
    return data.nextAccountNumber;
  },

  getById: async (id: string): Promise<GlAccountDto> => {
    const { data } = await axiosClient.get<GlAccountDto>(
      API_ENDPOINTS.CHART_OF_ACCOUNTS.BY_ID(id),
    );
    return data;
  },

  create: async (payload: CreateGlAccountDto): Promise<GlAccountDto> => {
    const { data } = await axiosClient.post<GlAccountDto>(
      API_ENDPOINTS.CHART_OF_ACCOUNTS.BASE,
      payload,
    );
    return data;
  },

  update: async (
    id: string,
    payload: UpdateGlAccountDto,
  ): Promise<GlAccountDto> => {
    const { data } = await axiosClient.put<GlAccountDto>(
      API_ENDPOINTS.CHART_OF_ACCOUNTS.BY_ID(id),
      payload,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.CHART_OF_ACCOUNTS.BY_ID(id));
  },
};

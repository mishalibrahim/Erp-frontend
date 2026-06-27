import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import type {
  GlTransactionDto,
  GlLedgerFilterParams,
  GlPeriodOption,
  GlCostCenterOption,
  GlAccountOption,
} from "../types";

export const generalLedgerApi = {
  getTransactions: async (
    filters: GlLedgerFilterParams
  ): Promise<GlTransactionDto[]> => {
    const params = new URLSearchParams();
    if (filters.accountId) params.append("accountId", filters.accountId);
    if (filters.periodValue) params.append("periodValue", filters.periodValue);
    if (filters.costCenter) params.append("costCenter", filters.costCenter);
    if (filters.type) params.append("type", filters.type);

    const query = params.toString();
    const { data } = await axiosClient.get<GlTransactionDto[]>(
      `${API_ENDPOINTS.GENERAL_LEDGER.TRANSACTIONS}${query ? `?${query}` : ""}`
    );
    return data;
  },

  getOpeningBalance: async (
    accountId?: string,
    periodValue?: string
  ): Promise<number> => {
    if (!accountId) return 0;

    const params = new URLSearchParams();
    params.append("accountId", accountId);
    if (periodValue) params.append("periodValue", periodValue);

    const query = params.toString();
    const { data } = await axiosClient.get<number>(
      `${API_ENDPOINTS.GENERAL_LEDGER.OPENING_BALANCE}?${query}`
    );
    return data;
  },

  getPeriods: async (): Promise<GlPeriodOption[]> => {
    const { data } = await axiosClient.get<GlPeriodOption[]>(
      API_ENDPOINTS.GENERAL_LEDGER.PERIODS
    );
    return data;
  },

  getCostCenters: async (): Promise<GlCostCenterOption[]> => {
    const { data } = await axiosClient.get<GlCostCenterOption[]>(
      API_ENDPOINTS.GENERAL_LEDGER.COST_CENTERS
    );
    return data;
  },

  getAccounts: async (): Promise<GlAccountOption[]> => {
    const { data } = await axiosClient.get<GlAccountOption[]>(
      "/api/general-ledger/accounts"
    );
    return data;
  },
};

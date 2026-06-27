import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import type {
  GlTransactionDto,
  GlLedgerFilterParams,
  GlPeriodOption,
  GlCostCenterOption,
  GlAccountOption,
} from "../types";
import type { TrialBalanceSummaryDto, PeriodLockDto } from "../types/extraTypes";

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
    const { data } = await axiosClient.get<number>(
      `${API_ENDPOINTS.GENERAL_LEDGER.OPENING_BALANCE}?${params.toString()}`
    );
    return data;
  },

  getClosingBalance: async (
    accountId?: string,
    periodValue?: string
  ): Promise<number> => {
    if (!accountId) return 0;
    const params = new URLSearchParams();
    params.append("accountId", accountId);
    if (periodValue) params.append("periodValue", periodValue);
    const { data } = await axiosClient.get<number>(
      `/api/general-ledger/closing-balance?${params.toString()}`
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

  getTrialBalance: async (periodValue?: string): Promise<TrialBalanceSummaryDto> => {
    const params = periodValue ? `?periodValue=${encodeURIComponent(periodValue)}` : "";
    const { data } = await axiosClient.get<TrialBalanceSummaryDto>(
      `/api/general-ledger/trial-balance${params}`
    );
    return data;
  },

  exportCsv: async (filters: GlLedgerFilterParams): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.accountId) params.append("accountId", filters.accountId);
    if (filters.periodValue) params.append("periodValue", filters.periodValue);
    if (filters.costCenter) params.append("costCenter", filters.costCenter);
    if (filters.type) params.append("type", filters.type);

    const response = await axiosClient.get(`/api/general-ledger/export?${params.toString()}`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    link.href = url;
    link.download = `GL_Ledger_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  getPeriodLocks: async (): Promise<PeriodLockDto[]> => {
    const { data } = await axiosClient.get<PeriodLockDto[]>(
      "/api/general-ledger/period-locks"
    );
    return data;
  },

  lockPeriod: async (periodValue: string): Promise<PeriodLockDto> => {
    const { data } = await axiosClient.put<PeriodLockDto>(
      `/api/general-ledger/period-locks/${encodeURIComponent(periodValue)}/lock`
    );
    return data;
  },

  unlockPeriod: async (periodValue: string): Promise<PeriodLockDto> => {
    const { data } = await axiosClient.put<PeriodLockDto>(
      `/api/general-ledger/period-locks/${encodeURIComponent(periodValue)}/unlock`
    );
    return data;
  },
};

import { useQuery } from "@tanstack/react-query";
import { generalLedgerApi } from "../api/generalLedgerApi";
import type { GlLedgerFilterParams } from "../types";

export const GL_QUERY_KEYS = {
  transactions: (filters: GlLedgerFilterParams) =>
    ["gl-transactions", filters] as const,
  openingBalance: (accountId?: string, periodValue?: string) =>
    ["gl-opening-balance", accountId, periodValue] as const,
  periods: ["gl-periods"] as const,
  costCenters: ["gl-cost-centers"] as const,
  accounts: ["gl-accounts"] as const,
};

/**
 * Fetch GL transactions with the active filter set.
 */
export function useGetGlTransactions(filters: GlLedgerFilterParams) {
  return useQuery({
    queryKey: GL_QUERY_KEYS.transactions(filters),
    queryFn: () => generalLedgerApi.getTransactions(filters),
  });
}

/**
 * Fetch the opening balance for a specific account + period.
 */
export function useGetOpeningBalance(
  accountId?: string,
  periodValue?: string
) {
  return useQuery({
    queryKey: GL_QUERY_KEYS.openingBalance(accountId, periodValue),
    queryFn: () => generalLedgerApi.getOpeningBalance(accountId, periodValue),
  });
}

/**
 * Fetch available accounting periods.
 */
export function useGetPeriods() {
  return useQuery({
    queryKey: GL_QUERY_KEYS.periods,
    queryFn: generalLedgerApi.getPeriods,
  });
}

/**
 * Fetch cost center options.
 */
export function useGetCostCenters() {
  return useQuery({
    queryKey: GL_QUERY_KEYS.costCenters,
    queryFn: generalLedgerApi.getCostCenters,
  });
}

/**
 * Fetch GL accounts for the filter dropdown.
 */
export function useGetGlAccounts() {
  return useQuery({
    queryKey: GL_QUERY_KEYS.accounts,
    queryFn: generalLedgerApi.getAccounts,
  });
}

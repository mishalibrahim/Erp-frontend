import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chartOfAccountsApi } from "../api/chartOfAccountsApi";
import type { CreateGlAccountDto, UpdateGlAccountDto } from "../types";

export const QUERY_KEYS = {
  chartOfAccounts: ["chartOfAccounts"] as const,
  chartOfAccountsTree: ["chartOfAccountsTree"] as const,
  chartOfAccountDetails: (id: string) => ["chartOfAccounts", id] as const,
  nextAccountNumber: (category?: number, parentId?: string) => 
    ["chartOfAccounts", "nextNumber", category, parentId] as const,
};

export const useGetAccounts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.chartOfAccounts,
    queryFn: chartOfAccountsApi.getAll,
  });
};

export const useGetAccountTree = () => {
  return useQuery({
    queryKey: QUERY_KEYS.chartOfAccountsTree,
    queryFn: chartOfAccountsApi.getTree,
  });
};

export const useGetNextNumber = (category?: number, parentId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.nextAccountNumber(category, parentId),
    queryFn: () => chartOfAccountsApi.getNextNumber(category, parentId),
    enabled: category !== undefined || !!parentId, // Enable if we have at least one criteria
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGlAccountDto) => chartOfAccountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccountsTree });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGlAccountDto }) => 
      chartOfAccountsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccountsTree });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccountDetails(variables.id) });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => chartOfAccountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chartOfAccountsTree });
    },
  });
};

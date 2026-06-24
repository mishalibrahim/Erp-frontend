import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companySetupApi } from "../api/companySetupApi";

export const QUERY_KEYS = {
  companies: ["companies"] as const,
  companyDetails: (id: string) => ["company", id] as const,
};

export const useGetCompanies = () => {
  return useQuery({
    queryKey: QUERY_KEYS.companies,
    queryFn: companySetupApi.getAll,
  });
};

export const useGetCompanyById = (id: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.companyDetails(id as string),
    queryFn: () => companySetupApi.getById(id as string),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companySetupApi.createDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companies });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companySetupApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companies });
    },
  });
};

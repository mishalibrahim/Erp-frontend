import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "../api/rolesApi";

export const QUERY_KEYS = {
  roles: ["roles"] as const,
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.roles,
    queryFn: rolesApi.getRoles,
    staleTime: 1000 * 60 * 60, // 1 hour, since roles rarely change
  });
};

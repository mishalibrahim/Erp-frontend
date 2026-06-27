import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generalLedgerApi } from "../api/generalLedgerApi";
import type { GlLedgerFilterParams } from "../types";

export function useGetTrialBalance(periodValue?: string) {
  return useQuery({
    queryKey: ["gl-trial-balance", periodValue],
    queryFn: () => generalLedgerApi.getTrialBalance(periodValue),
    enabled: true,
  });
}

export function useGetPeriodLocks() {
  return useQuery({
    queryKey: ["gl-period-locks"],
    queryFn: generalLedgerApi.getPeriodLocks,
  });
}

export function useLockPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periodValue: string) => generalLedgerApi.lockPeriod(periodValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gl-period-locks"] });
      toast.success("Period locked successfully.");
    },
    onError: () => {
      toast.error("Failed to lock period.");
    },
  });
}

export function useUnlockPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periodValue: string) => generalLedgerApi.unlockPeriod(periodValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gl-period-locks"] });
      toast.success("Period unlocked successfully.");
    },
    onError: () => {
      toast.error("Failed to unlock period.");
    },
  });
}

export function useExportGlCsv() {
  return useMutation({
    mutationFn: (filters: GlLedgerFilterParams) => generalLedgerApi.exportCsv(filters),
    onSuccess: () => toast.success("Ledger exported successfully."),
    onError: () => toast.error("Export failed. Please try again."),
  });
}

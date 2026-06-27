import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { journalEntriesApi } from "../api/journalEntriesApi";
import type { JournalVoucherDto, CreateJournalVoucherDto } from "../types";

export const JOURNAL_ENTRIES_KEYS = {
  all: ["journal-entries"] as const,
  lists: () => [...JOURNAL_ENTRIES_KEYS.all, "list"] as const,
  detail: (id: string) => [...JOURNAL_ENTRIES_KEYS.all, "detail", id] as const,
};

export function useGetJournalEntries() {
  return useQuery({
    queryKey: JOURNAL_ENTRIES_KEYS.lists(),
    queryFn: journalEntriesApi.getAll,
  });
}

export function useGetJournalEntry(id: string) {
  return useQuery({
    queryKey: JOURNAL_ENTRIES_KEYS.detail(id),
    queryFn: () => journalEntriesApi.getById(id),
    enabled: !!id,
  });
}

export function useSaveJournalVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalVoucherDto | JournalVoucherDto) =>
      journalEntriesApi.save(data),
    onSuccess: (savedVoucher) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(savedVoucher.id),
      });
      // Invalidate General Ledger queries to sync updates there
      queryClient.invalidateQueries({ queryKey: ["gl-transactions"] });
    },
  });
}

export function useDeleteJournalVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalEntriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
    },
  });
}

export function useValidateJournalVoucher() {
  return useMutation({
    mutationFn: (voucher: JournalVoucherDto) => journalEntriesApi.validate(voucher),
  });
}

export function useSimulateJournalVoucher() {
  return useMutation({
    mutationFn: (voucher: JournalVoucherDto) => journalEntriesApi.simulate(voucher),
  });
}

export function useSendForApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalEntriesApi.sendForApproval(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(id),
      });
    },
  });
}

export function useApproveJournalVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) =>
      journalEntriesApi.approve(id, remarks),
    onSuccess: (voucher) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(voucher.id),
      });
      // GL queries might need invalidating if bypasses straight to Posted (e.g. Finance review <= 50k)
      queryClient.invalidateQueries({ queryKey: ["gl-transactions"] });
    },
  });
}

export function useRejectJournalVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) =>
      journalEntriesApi.reject(id, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(variables.id),
      });
    },
  });
}

export function usePostJournalVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalEntriesApi.post(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: ["gl-transactions"] });
    },
  });
}

export function useReverseJournalVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalEntriesApi.reverse(id),
    onSuccess: (reversingVoucher) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(reversingVoucher.id),
      });
      queryClient.invalidateQueries({ queryKey: ["gl-transactions"] });
    },
  });
}

export function useAddAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: { name: string; size: number; type: string } }) =>
      journalEntriesApi.addAttachment(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(variables.id),
      });
    },
  });
}

export function useRemoveAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName: string }) =>
      journalEntriesApi.removeAttachment(id, fileName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(variables.id),
      });
    },
  });
}

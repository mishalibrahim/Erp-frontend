import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { journalEntriesApi } from "../api/journalEntriesApi";
import type { CreateJournalEntryDto } from "../types";

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

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalEntryDto) => journalEntriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
    },
  });
}

export function usePostJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalEntriesApi.postDraft(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: JOURNAL_ENTRIES_KEYS.detail(variables),
      });
    },
  });
}

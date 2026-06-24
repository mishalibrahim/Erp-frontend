import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import type { CreateJournalEntryDto, JournalEntryDto } from "../types";

export const journalEntriesApi = {
  getAll: async (): Promise<JournalEntryDto[]> => {
    const { data } = await axiosClient.get<JournalEntryDto[]>(
      API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL
    );
    return data;
  },

  getById: async (id: string): Promise<JournalEntryDto> => {
    const { data } = await axiosClient.get<JournalEntryDto>(
      API_ENDPOINTS.JOURNAL_ENTRIES.GET_BY_ID(id)
    );
    return data;
  },

  create: async (dto: CreateJournalEntryDto): Promise<JournalEntryDto> => {
    const { data } = await axiosClient.post<JournalEntryDto>(
      API_ENDPOINTS.JOURNAL_ENTRIES.CREATE,
      dto
    );
    return data;
  },

  postDraft: async (id: string): Promise<void> => {
    await axiosClient.put(API_ENDPOINTS.JOURNAL_ENTRIES.POST_DRAFT(id));
  },
};

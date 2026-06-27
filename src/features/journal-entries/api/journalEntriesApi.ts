import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import type {
  JournalVoucherDto,
  CreateJournalVoucherDto,
} from "../types";

export const journalEntriesApi = {
  getAll: async (): Promise<JournalVoucherDto[]> => {
    const { data } = await axiosClient.get<JournalVoucherDto[]>(
      API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL
    );
    return data;
  },

  getById: async (id: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.get<JournalVoucherDto>(
      API_ENDPOINTS.JOURNAL_ENTRIES.GET_BY_ID(id)
    );
    return data;
  },

  save: async (
    dto: CreateJournalVoucherDto | JournalVoucherDto
  ): Promise<JournalVoucherDto> => {
    if ("id" in dto && dto.id) {
      const { data } = await axiosClient.put<JournalVoucherDto>(
        `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${dto.id}`,
        dto
      );
      return data;
    } else {
      const { data } = await axiosClient.post<JournalVoucherDto>(
        API_ENDPOINTS.JOURNAL_ENTRIES.CREATE,
        dto
      );
      return data;
    }
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}`);
  },

  copy: async (id: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.post<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/copy`
    );
    return data;
  },

  validate: async (
    voucher: JournalVoucherDto
  ): Promise<{ success: boolean; errors: string[] }> => {
    const { data } = await axiosClient.post<{ success: boolean; errors: string[] }>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${voucher.id}/validate`
    );
    return data;
  },

  simulate: async (voucher: JournalVoucherDto): Promise<any[]> => {
    const { data } = await axiosClient.post<any[]>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${voucher.id}/simulate`
    );
    return data;
  },

  sendForApproval: async (id: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.put<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/submit`
    );
    return data;
  },

  approve: async (id: string, remarks?: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.put<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/approve`,
      { remarks }
    );
    return data;
  },

  reject: async (id: string, remarks?: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.put<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/reject`,
      { remarks }
    );
    return data;
  },

  post: async (id: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.put<JournalVoucherDto>(
      API_ENDPOINTS.JOURNAL_ENTRIES.POST_DRAFT(id)
    );
    return data;
  },

  reverse: async (id: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.put<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/reverse`
    );
    return data;
  },

  addAttachment: async (
    id: string,
    file: { name: string; size: number; type: string }
  ): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.post<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/attachments`,
      file
    );
    return data;
  },

  removeAttachment: async (id: string, fileName: string): Promise<JournalVoucherDto> => {
    const { data } = await axiosClient.delete<JournalVoucherDto>(
      `${API_ENDPOINTS.JOURNAL_ENTRIES.GET_ALL}/${id}/attachments/${encodeURIComponent(
        fileName
      )}`
    );
    return data;
  },
};

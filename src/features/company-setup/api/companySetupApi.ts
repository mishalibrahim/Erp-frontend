import { axiosClient } from "@/lib/axiosClient";

export interface CreateCompanyResponse {
  id: string;
  message: string;
}

export interface UpdateCompanyResponse {
  message: string;
}

export interface CompanyListItem {
  id: string;
  companyName: string;
  tradeName?: string;
  companyCode: string;
  licenseNumber: string;
  licenseType: string;
  country: string;
  emirate?: string;
  status: "Draft" | "Active" | "Inactive";
  registrationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const companySetupApi = {
  /** GET all companies/tenants */
  getAll: async (): Promise<CompanyListItem[]> => {
    const response = await axiosClient.get("/api/CompanySetup");
    return response.data;
  },

  /** GET single company by id */
  getById: async (id: string): Promise<CompanyListItem> => {
    const response = await axiosClient.get(`/api/CompanySetup/${id}`);
    return response.data;
  },

  /** POST create a new draft */
  createDraft: async (data: any): Promise<CreateCompanyResponse> => {
    const response = await axiosClient.post("/api/CompanySetup", data);
    return response.data;
  },

  /** PUT partial update */
  updateDraft: async (id: string, data: any): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(`/api/CompanySetup/${id}`, data);
    return response.data;
  },

  /** DELETE a company */
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/CompanySetup/${id}`);
  },
};

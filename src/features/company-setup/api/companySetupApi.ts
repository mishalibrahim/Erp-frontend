import { axiosClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";

export interface CreateCompanyResponse {
  id: string;
  message: string;
}

export interface UpdateCompanyResponse {
  message: string;
  rowVersion: string;
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

import {
  type Step1FormData,
  type Step2FormData,
  type Step3FormData,
  type Step4FormData,
  type Step5FormData,
  type Step6FormData,
  type Step7FormData,
  type Step8FormData,
} from "../schemas/companySetupSchemas";

type WithRowVersion<T> = Partial<T> & { rowVersion?: string };

export interface CompanyDetailsDto extends Partial<Step1FormData> {
  id?: string;
  rowVersion?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;

  financials?: Partial<Step2FormData>;
  localization?: Partial<Step3FormData>;
  registeredAddress?: Step4FormData["registeredAddress"];
  billingAddress?: Step4FormData["billingAddress"];
  
  vatDetails?: Partial<{
    vatRegistered: boolean;
    trnLabel: string;
    trnNumber: string;
    vatScheme: string;
    filingFrequency: string;
    vatRegistrationDate: string;
    firstVatPeriod: string;
    vatReturnStartPeriod: string;
    vatDeregistrationDate: string;
  }>;
  corporateTax?: Partial<{
    ctRegistered: boolean;
    corporateTaxTrn: string;
    firstTaxPeriodStart: string;
    freeZonePerson: boolean;
    qfzpStatus: boolean;
    smallBusinessRelief: boolean;
  }>;
  defaultVatRateId?: string | null;
  inputVatAccountId?: string;
  outputVatAccountId?: string;
  controls?: Partial<{
    multiCompanyEnable: boolean;
    auditTrailEnable: boolean;
    approvalWorkflow: boolean;
  }>;
  
  bankAccounts?: Step7FormData["bankAccounts"];
  taxGroups?: Step5FormData["taxGroups"];
  documentNumberSeries?: Step6FormData["documentNumberSeries"];
  postingGroups?: Step6FormData["postingGroups"];
  userTenantAccesses?: Step8FormData["userTenantAccess"];
}

export const companySetupApi = {
  /** GET all companies/tenants */
  getAll: async (): Promise<CompanyListItem[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.COMPANY_SETUP.BASE);
    return response.data;
  },

  /** GET single company by id (Full CompanyDetailsDto with RowVersion) */
  getById: async (id: string): Promise<CompanyDetailsDto> => {
    const response = await axiosClient.get(API_ENDPOINTS.COMPANY_SETUP.BY_ID(id));
    return response.data;
  },

  /** POST create a new draft */
  createDraft: async (data: Step1FormData): Promise<CreateCompanyResponse> => {
    const response = await axiosClient.post(API_ENDPOINTS.COMPANY_SETUP.BASE, data);
    return response.data;
  },

  /** PUT step-specific updates */
  updateGeneral: async (id: string, data: WithRowVersion<Step1FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_GENERAL(id), data);
    return response.data;
  },
  updateFinancials: async (id: string, data: WithRowVersion<Step2FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_FINANCIALS(id), data);
    return response.data;
  },
  updateLocalization: async (id: string, data: WithRowVersion<Step3FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_LOCALIZATION(id), data);
    return response.data;
  },
  updateAddresses: async (id: string, data: WithRowVersion<Step4FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_ADDRESSES(id), data);
    return response.data;
  },
  updateTaxes: async (id: string, data: WithRowVersion<Step5FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_TAXES(id), data);
    return response.data;
  },
  updateControls: async (id: string, data: WithRowVersion<Step6FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_SYSTEM_CONTROLS(id), data);
    return response.data;
  },
  updateBankAccounts: async (id: string, data: WithRowVersion<Step7FormData>): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_BANK_ACCOUNTS(id), data);
    return response.data;
  },
  updateUsers: async (id: string, data: WithRowVersion<Step8FormData> & { status?: string }): Promise<UpdateCompanyResponse> => {
    const response = await axiosClient.put(API_ENDPOINTS.COMPANY_SETUP.UPDATE_USERS(id), data);
    return response.data;
  },

  /** DELETE a company */
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.COMPANY_SETUP.BY_ID(id));
  },
};

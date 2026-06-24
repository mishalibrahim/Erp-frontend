export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
    MY_TENANTS: "/api/auth/my-tenants",
    SWITCH_TENANT: "/api/auth/switch-tenant",
  },
  ROLES: {
    GET_ALL: "/api/roles",
  },
  COMPANY_SETUP: {
    BASE: "/api/CompanySetup",
    BY_ID: (id: string) => `/api/CompanySetup/${id}`,
    UPDATE_GENERAL: (id: string) => `/api/CompanySetup/${id}/general`,
    UPDATE_FINANCIALS: (id: string) => `/api/CompanySetup/${id}/financials`,
    UPDATE_LOCALIZATION: (id: string) => `/api/CompanySetup/${id}/localization`,
    UPDATE_ADDRESSES: (id: string) => `/api/CompanySetup/${id}/addresses`,
    UPDATE_TAXES: (id: string) => `/api/CompanySetup/${id}/taxes`,
    UPDATE_SYSTEM_CONTROLS: (id: string) =>
      `/api/CompanySetup/${id}/system-controls`,
    UPDATE_BANK_ACCOUNTS: (id: string) =>
      `/api/CompanySetup/${id}/bank-accounts`,
    UPDATE_USERS: (id: string) => `/api/CompanySetup/${id}/users`,
  },
  CHART_OF_ACCOUNTS: {
    BASE: "/api/glaccounts",
    BY_ID: (id: string) => `/api/glaccounts/${id}`,
    TREE: "/api/glaccounts/tree",
    NEXT_NUMBER: (category?: number, parentId?: string) => {
      const params = new URLSearchParams();
      if (category !== undefined) params.append("category", category.toString());
      if (parentId) params.append("parentId", parentId);
      const query = params.toString();
      return `/api/glaccounts/next-number${query ? `?${query}` : ""}`;
    },
  },
  JOURNAL_ENTRIES: {
    GET_ALL: "/api/journal-entries",
    GET_BY_ID: (id: string) => `/api/journal-entries/${id}`,
    CREATE: "/api/journal-entries",
    POST_DRAFT: (id: string) => `/api/journal-entries/${id}/post`,
  },
} as const;

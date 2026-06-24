export const GlAccountCategory = {
  Asset: 0,
  Liability: 1,
  Equity: 2,
  Income: 3,
  Expense: 4,
} as const;
export type GlAccountCategory = typeof GlAccountCategory[keyof typeof GlAccountCategory];

export const GlAccountType = {
  Ledger: 0,
  Customer: 1,
  Vendor: 2,
} as const;
export type GlAccountType = typeof GlAccountType[keyof typeof GlAccountType];

export const GlPostingType = {
  Header: 0,
  Posting: 1,
} as const;
export type GlPostingType = typeof GlPostingType[keyof typeof GlPostingType];

export interface GlAccountDto {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: GlAccountType;
  accountCategory: GlAccountCategory;
  postingType: GlPostingType;
  allowManualEntry: boolean;
  mandatoryDimensions: boolean;
  parentAccountId: string | null;
  isActive: boolean;
}

export interface GlAccountTreeNodeDto extends GlAccountDto {
  children: GlAccountTreeNodeDto[];
}

export interface CreateGlAccountDto {
  accountNumber: string;
  accountName: string;
  accountType: GlAccountType;
  accountCategory: GlAccountCategory;
  postingType: GlPostingType;
  allowManualEntry: boolean;
  mandatoryDimensions: boolean;
  parentAccountId: string | null;
}

export interface UpdateGlAccountDto {
  accountName: string;
  accountType: GlAccountType;
  accountCategory: GlAccountCategory;
  postingType: GlPostingType;
  allowManualEntry: boolean;
  mandatoryDimensions: boolean;
  parentAccountId: string | null;
  isActive: boolean;
}

// Helpers for human readable labels
export const getGlAccountCategoryLabel = (value: GlAccountCategory) => {
  switch (value) {
    case GlAccountCategory.Asset: return "Asset";
    case GlAccountCategory.Liability: return "Liability";
    case GlAccountCategory.Equity: return "Equity";
    case GlAccountCategory.Income: return "Income";
    case GlAccountCategory.Expense: return "Expense";
    default: return "Unknown";
  }
};

export const getGlAccountTypeLabel = (value: GlAccountType) => {
  switch (value) {
    case GlAccountType.Ledger: return "Ledger";
    case GlAccountType.Customer: return "Customer";
    case GlAccountType.Vendor: return "Vendor";
    default: return "Unknown";
  }
};

export const getGlPostingTypeLabel = (value: GlPostingType) => {
  switch (value) {
    case GlPostingType.Header: return "Header";
    case GlPostingType.Posting: return "Posting";
    default: return "Unknown";
  }
};

import { z } from "zod";

export const step1Schema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  tradeName: z.string().optional(),
  companyCode: z.string().min(1, "Company Code is required"),
  licenseNumber: z.string().min(1, "License Number is required"),
  licenseType: z.string().min(1, "License Type is required"),
  registrationDate: z.string().min(1, "Registration Date is required"),
  licenseExpiryDate: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  emirate: z.string().optional(),
  isFreeZoneEntity: z.boolean(),
  isDesignatedZone: z.boolean(),
  placeOfIncorporation: z.string().optional(),
});

export const step2Schema = z.object({
  financialYearStart: z.string().min(1, "Financial Year Start is required"),
  booksStartDate: z.string().min(1, "Books Start Date is required"),
  accountingMethod: z.string().min(1, "Accounting Method is required"),
  fiscalYear: z.string().min(1, "Fiscal Year is required"),
  baseCurrency: z.string().min(1, "Base Currency is required"),
  reportingCurrency: z.string().optional(),
  financialYearEnd: z.string().optional(),
  defaultCostCenterId: z.string().optional(),
  defaultProjectId: z.string().optional(),
});

export const step3Schema = z.object({
  organizationLanguage: z.string().min(1, "Organization Language is required"),
  invoiceLanguage: z.string().min(1, "Invoice Language is required"),
  timeZone: z.string().min(1, "Time Zone is required"),
  dateFormat: z.string().min(1, "Date Format is required"),
  communicationLanguages: z.array(z.string()).optional(),
});

export const addressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  emirate: z.string().optional(),
  poBox: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxNumber: z.string().optional(),
});

export const step4Schema = z.object({
  registeredAddress: addressSchema,
  billingAddress: addressSchema,
});

export const step5Schema = z.object({
  // VAT Details
  vatRegistered: z.boolean(),
  trnLabel: z.string().optional(),
  trnNumber: z.string().optional(),
  vatScheme: z.string().optional(),
  filingFrequency: z.string().optional(),
  vatRegistrationDate: z.string().optional(),
  firstVatPeriod: z.string().optional(),
  vatReturnStartPeriod: z.string().optional(),
  vatDeregistrationDate: z.string().optional(),
  // Corporate Tax
  ctRegistered: z.boolean(),
  corporateTaxTrn: z.string().optional(),
  firstTaxPeriodStart: z.string().optional(),
  freeZonePerson: z.boolean(),
  qfzpStatus: z.boolean(),
  smallBusinessRelief: z.boolean(),
  // Tax config
  defaultVatRateId: z.string().nullable().optional(),
  inputVatAccountId: z.string().optional(),
  outputVatAccountId: z.string().optional(),
  taxGroups: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
    isActive: z.boolean(),
    taxRates: z.array(z.object({
      id: z.string().optional(),
      ratePercentage: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
      effectiveFrom: z.string().optional(),
      effectiveTo: z.string().nullable().optional(),
      isActive: z.boolean(),
    })).optional(),
  })).optional(),
});

export const step6Schema = z.object({
  multiCompanyEnable: z.boolean(),
  auditTrailEnable: z.boolean(),
  approvalWorkflow: z.boolean(),
  postingGroups: z.array(z.object({
    id: z.string().optional(),
    groupName: z.string().min(1, "Group name is required"),
    type: z.string().min(1, "Type is required"),
    receivablesAccountId: z.string().nullable().optional(),
    payablesAccountId: z.string().nullable().optional(),
    inventoryAccountId: z.string().nullable().optional(),
    cogsAccountId: z.string().nullable().optional(),
    isActive: z.boolean(),
  })).optional(),
  documentNumberSeries: z.array(z.object({
    id: z.string().optional(),
    documentType: z.string().min(1, "Document type is required"),
    prefix: z.string().min(1, "Prefix is required"),
    currentNumber: z.preprocess((val) => Number(val), z.number().min(1)),
    suffix: z.string().nullable().optional(),
    isActive: z.boolean(),
  })).optional(),
});

export const step7Schema = z.object({
  bankAccounts: z.array(z.object({
    id: z.string().optional(),
    bankName: z.string().min(1, "Bank name is required"),
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    iban: z.string().optional(),
    swiftCode: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    isPrimary: z.boolean().optional(),
  })).min(1, "At least one bank account is required"),
});

export const step8Schema = z.object({
  userTenantAccess: z.array(z.object({
    id: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    password: z.string().optional().refine(val => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
  })).optional(),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type Step6FormData = z.infer<typeof step6Schema>;
export type Step7FormData = z.infer<typeof step7Schema>;
export type Step8FormData = z.infer<typeof step8Schema>;

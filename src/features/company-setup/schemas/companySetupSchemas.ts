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
});

export const step2Schema = z.object({
  financialYearStart: z.string().min(1, "Financial Year Start is required"),
  booksStartDate: z.string().min(1, "Books Start Date is required"),
  accountingMethod: z.string().min(1, "Accounting Method is required"),
  fiscalYear: z.string().min(1, "Fiscal Year is required"),
  baseCurrency: z.string().min(1, "Base Currency is required"),
  reportingCurrency: z.string().optional(),
});

export const step3Schema = z.object({
  organizationLanguage: z.string().min(1, "Organization Language is required"),
  invoiceLanguage: z.string().min(1, "Invoice Language is required"),
  timeZone: z.string().min(1, "Time Zone is required"),
  dateFormat: z.string().min(1, "Date Format is required"),
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
  vatRegistered: z.boolean(),
  trnLabel: z.string().optional(),
  trnNumber: z.string().optional(),
  vatScheme: z.string().optional(),
  filingFrequency: z.string().optional(),
  vatRegistrationDate: z.string().optional(),
});

export const step6Schema = z.object({
  ctRegistered: z.boolean(),
  corporateTaxTrn: z.string().optional(),
  firstTaxPeriodStart: z.string().optional(),
  freeZonePerson: z.boolean(),
  qfzpStatus: z.boolean(),
  smallBusinessRelief: z.boolean(),
});

export const step7Schema = z.object({
  multiCompanyEnable: z.boolean(),
  auditTrailEnable: z.boolean(),
  approvalWorkflow: z.boolean(),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type Step6FormData = z.infer<typeof step6Schema>;
export type Step7FormData = z.infer<typeof step7Schema>;

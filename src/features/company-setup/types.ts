import { z } from "zod";

// ─── Bank Account ────────────────────────────────────────────────────────────
export const bankAccountSchema = z.object({
  id: z.string().optional(),
  bankName: z.string().min(1, "Bank name is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  iban: z
    .string()
    .min(1, "IBAN is required")
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "Invalid IBAN format"),
  swiftCode: z.string().min(1, "SWIFT code is required"),
  currency: z.string().min(1, "Currency is required"),
  isPrimary: z.boolean().default(false),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;

// ─── Document Upload ─────────────────────────────────────────────────────────
export const companyDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Document type is required"),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  uploadedAt: z.string().optional(),
});

export type CompanyDocument = z.infer<typeof companyDocumentSchema>;

// ─── User Role Assignment ────────────────────────────────────────────────────
export const userRoleSchema = z.object({
  id: z.string().optional(),
  userName: z.string().min(1, "User name is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
  companyAccess: z.boolean().default(true),
});

export type UserRole = z.infer<typeof userRoleSchema>;

// ─── Tax Rate Row ────────────────────────────────────────────────────────────
export const taxRateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tax name is required"),
  rate: z.coerce.number().min(0, "Rate must be ≥ 0").max(100, "Rate must be ≤ 100"),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type TaxRate = z.infer<typeof taxRateSchema>;

// ─── Number Series Row ───────────────────────────────────────────────────────
export const numberSeriesSchema = z.object({
  id: z.string().optional(),
  documentType: z.string().min(1, "Document type is required"),
  prefix: z.string().min(1, "Prefix is required"),
  startNumber: z.coerce.number().min(1, "Start must be ≥ 1"),
  currentNumber: z.coerce.number().optional(),
});

export type NumberSeries = z.infer<typeof numberSeriesSchema>;

// ─── Brand Identity ──────────────────────────────────────────────────────────
export const brandIdentitySchema = z.object({
  brandName: z.string().optional().default(""),
  brandTagline: z.string().optional().default(""),
  brandColor: z.string().optional().default("#0f172a"),
  logoUrl: z.string().optional().default(""),
  faviconUrl: z.string().optional().default(""),
  // Company ID format
  companyIdPrefix: z.string().optional().default(""),
  companyIdDigits: z.coerce.number().int().min(3).max(10).default(5),
  companyIdSeparator: z.string().optional().default("-"),
  companyIdPreview: z.string().optional().default(""),
});

export type BrandIdentity = z.infer<typeof brandIdentitySchema>;

// ─── Master Form Schema ──────────────────────────────────────────────────────
export const companySetupSchema = z
  .object({
    // ── 1. General Information ───────────────────────────────────────────
    companyName: z.string().min(1, "Company name is required"),
    tradeName: z.string().optional().default(""),
    companyCode: z.string().optional().default(""), // auto-generated
    licenseNumber: z.string().min(1, "License number is required"),
    licenseType: z.string().min(1, "License type is required"),
    registrationDate: z.string().min(1, "Registration date is required"),
    licenseExpiryDate: z.string().optional().default(""),
    country: z.string().default("UAE"),
    emirate: z.string().min(1, "Emirate is required"),
    placeOfIncorporation: z.string().min(1, "Place of incorporation is required"),
    isFreeZoneEntity: z.boolean().default(false),
    isDesignatedZone: z.boolean().default(false),

    // ── 2. Financial Setup ───────────────────────────────────────────────
    financialYearStart: z.string().min(1, "Financial year start is required"),
    financialYearEnd: z.string().optional().default(""), // auto-calculated
    booksStartDate: z.string().min(1, "Books start date is required"),
    accountingMethod: z.string().min(1, "Accounting method is required"),
    fiscalYear: z.string().min(1, "Fiscal year is required"),
    baseCurrency: z.string().min(1, "Base currency is required"),
    reportingCurrency: z.string().optional().default(""),

    // ── 3. Localization & Language ────────────────────────────────────────
    organizationLanguage: z.string().min(1, "Organization language is required"),
    communicationLanguages: z.array(z.string()).default([]),
    invoiceLanguage: z.string().min(1, "Invoice language is required"),
    timeZone: z.string().min(1, "Time zone is required"),
    dateFormat: z.string().min(1, "Date format is required"),

    // ── 4. Address Details ───────────────────────────────────────────────
    registeredAddressLine1: z.string().min(1, "Address Line 1 is required"),
    registeredAddressLine2: z.string().optional().default(""),
    registeredCity: z.string().min(1, "City is required"),
    registeredEmirate: z.string().min(1, "Emirate is required"),
    registeredPoBox: z.string().optional().default(""),
    registeredCountry: z.string().default("UAE"),
    registeredPhone: z.string().min(1, "Phone number is required"),
    registeredFax: z.string().optional().default(""),

    sameAsRegistered: z.boolean().default(true),

    billingAddressLine1: z.string().optional().default(""),
    billingAddressLine2: z.string().optional().default(""),
    billingCity: z.string().optional().default(""),
    billingEmirate: z.string().optional().default(""),
    billingPoBox: z.string().optional().default(""),
    billingCountry: z.string().optional().default(""),
    billingPhone: z.string().optional().default(""),
    billingFax: z.string().optional().default(""),

    // ── 5. VAT Setup ─────────────────────────────────────────────────────
    vatRegistered: z.boolean().default(false),
    trnLabel: z.string().optional().default("TRN"),
    trnNumber: z.string().optional().default(""),
    vatRegistrationDate: z.string().optional().default(""),
    vatScheme: z.string().optional().default(""),
    vatFilingFrequency: z.string().optional().default(""),
    firstVatPeriod: z.string().optional().default(""), // auto
    vatReturnStartPeriod: z.string().optional().default(""), // auto
    vatDeregistrationDate: z.string().optional().default(""),

    // ── 6. Corporate Tax ─────────────────────────────────────────────────
    ctRegistered: z.boolean().default(false),
    corporateTaxTrn: z.string().optional().default(""),
    firstTaxPeriodStartDate: z.string().optional().default(""),
    ctFinancialYearEnd: z.string().optional().default(""), // linked
    freeZonePerson: z.boolean().default(false),
    qfzpStatus: z.boolean().default(false),
    smallBusinessRelief: z.boolean().default(false),

    // ── 7. Tax Configuration ─────────────────────────────────────────────
    taxRates: z.array(taxRateSchema).default([]),
    defaultVatRate: z.coerce.number().default(5),
    inputVatGlAccount: z.string().optional().default(""),
    outputVatGlAccount: z.string().optional().default(""),
    taxGroups: z.string().optional().default(""),

    // ── 8. System Controls ───────────────────────────────────────────────
    numberSeries: z.array(numberSeriesSchema).default([]),
    postingGroupsMapping: z.string().optional().default(""),
    defaultDimensions: z.string().optional().default(""),
    multiCompanyEnabled: z.boolean().default(false),
    auditTrailEnabled: z.boolean().default(true),
    approvalWorkflowEnabled: z.boolean().default(false),

    // ── 9. Bank Details ──────────────────────────────────────────────────
    bankAccounts: z.array(bankAccountSchema).default([]),

    // ── 10. Users & Roles ────────────────────────────────────────────────
    users: z.array(userRoleSchema).default([]),
    approvalHierarchyEnabled: z.boolean().default(false),

    // ── 11. Document Management ──────────────────────────────────────────
    documents: z.array(companyDocumentSchema).default([]),

    // ── 12. Brand Identity & ID Format ───────────────────────────────────
    brandName: z.string().optional().default(""),
    brandTagline: z.string().optional().default(""),
    brandColor: z.string().optional().default("#0f172a"),
    logoUrl: z.string().optional().default(""),
    faviconUrl: z.string().optional().default(""),
    companyIdPrefix: z.string().optional().default(""),
    companyIdDigits: z.coerce.number().int().min(3).max(10).default(5),
    companyIdSeparator: z.string().optional().default("-"),
    companyIdPreview: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    // Designated Zone only required when Free Zone is Yes
    if (data.isFreeZoneEntity && !data.isDesignatedZone) {
      // Not an error — just conditional visibility
    }

    // VAT TRN must be 15 digits if VAT registered
    if (data.vatRegistered) {
      if (!data.trnNumber || data.trnNumber.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "TRN Number is required when VAT registered",
          path: ["trnNumber"],
        });
      } else if (!/^\d{15}$/.test(data.trnNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "TRN must be exactly 15 digits",
          path: ["trnNumber"],
        });
      }

      if (!data.vatRegistrationDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "VAT registration date is required",
          path: ["vatRegistrationDate"],
        });
      }
      if (!data.vatScheme) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "VAT scheme is required",
          path: ["vatScheme"],
        });
      }
      if (!data.vatFilingFrequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Filing frequency is required",
          path: ["vatFilingFrequency"],
        });
      }
    }

    // Corporate Tax TRN required if CT registered
    if (data.ctRegistered) {
      if (!data.corporateTaxTrn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Corporate Tax TRN is required",
          path: ["corporateTaxTrn"],
        });
      }
      if (!data.firstTaxPeriodStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "First tax period start date is required",
          path: ["firstTaxPeriodStartDate"],
        });
      }
    }

    // Billing address required if not same as registered
    if (!data.sameAsRegistered) {
      if (!data.billingAddressLine1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing address Line 1 is required",
          path: ["billingAddressLine1"],
        });
      }
      if (!data.billingCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing city is required",
          path: ["billingCity"],
        });
      }
    }
  });

export type CompanySetupFormValues = z.infer<typeof companySetupSchema>;

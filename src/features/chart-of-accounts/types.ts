import { z } from "zod";

// ─── Enums / Unions ──────────────────────────────────────────────────────────
export const ACCOUNT_CATEGORIES = [
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
] as const;
export type AccountCategory = (typeof ACCOUNT_CATEGORIES)[number];

export const POSTING_TYPES = ["header", "posting"] as const;
export type PostingType = (typeof POSTING_TYPES)[number];

export const ACCOUNT_TYPES = ["ledger", "customer", "vendor"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const TAX_CODE_TYPES = ["input", "output", "exempt"] as const;
export type TaxCodeType = (typeof TAX_CODE_TYPES)[number];

// ─── Account Number Range Helpers ────────────────────────────────────────────
export const ACCOUNT_NUMBER_RANGES: Record<
  AccountCategory,
  [number, number]
> = {
  asset: [100000, 199999],
  liability: [200000, 299999],
  equity: [300000, 399999],
  income: [400000, 499999],
  expense: [500000, 599999],
};

export function getCategoryFromAccountNumber(
  accountNumber: string,
): AccountCategory | null {
  const num = parseInt(accountNumber, 10);
  if (isNaN(num)) return null;
  for (const [category, [min, max]] of Object.entries(ACCOUNT_NUMBER_RANGES)) {
    if (num >= min && num <= max) return category as AccountCategory;
  }
  return null;
}

// ─── GL Account Interface ────────────────────────────────────────────────────
export interface GLAccount {
  accountNumber: string;
  accountName: string;
  accountType: AccountType;
  accountCategory: AccountCategory;
  postingType: PostingType;
  parentAccountNumber: string | null;
  allowManualEntry: boolean;
  mandatoryDimensions: boolean;
  linkedDimensions: string[];
  isActive: boolean;
}

// ─── GL Account Tree Node (computed) ─────────────────────────────────────────
export interface GLAccountTreeNode extends GLAccount {
  level: number;
  children: GLAccountTreeNode[];
}

// ─── Tax Code Interface ──────────────────────────────────────────────────────
export interface TaxCode {
  id: string;
  code: string;
  name: string;
  rate: number;
  type: TaxCodeType;
  inputVatAccount: string;
  outputVatAccount: string;
  isActive: boolean;
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const glAccountSchema = z
  .object({
    accountNumber: z
      .string()
      .min(1, "Account number is required")
      .regex(/^\d{6}$/, "Account number must be exactly 6 digits")
      .refine(
        (val) => {
          const num = parseInt(val, 10);
          return num >= 100000 && num <= 599999;
        },
        { message: "Account number must be between 100000 and 599999" },
      ),
    accountName: z.string().min(1, "Account name is required"),
    accountType: z.enum(["ledger", "customer", "vendor"], {
      required_error: "Account type is required",
    }),
    accountCategory: z.enum(
      ["asset", "liability", "equity", "income", "expense"],
      {
        required_error: "Account category is required",
      },
    ),
    postingType: z.enum(["header", "posting"], {
      required_error: "Posting type is required",
    }),
    parentAccountNumber: z.string().nullable().default(null),
    allowManualEntry: z.boolean().default(true),
    mandatoryDimensions: z.boolean().default(false),
    linkedDimensions: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    // Header accounts cannot allow manual entry
    if (data.postingType === "header" && data.allowManualEntry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Header accounts cannot allow manual entry",
        path: ["allowManualEntry"],
      });
    }

    // Validate category matches account number range
    const detectedCategory = getCategoryFromAccountNumber(data.accountNumber);
    if (detectedCategory && detectedCategory !== data.accountCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Account number ${data.accountNumber} belongs to "${detectedCategory}" category`,
        path: ["accountCategory"],
      });
    }
  });

export type GLAccountFormValues = z.infer<typeof glAccountSchema>;

export const taxCodeSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Tax code is required"),
  name: z.string().min(1, "Tax name is required"),
  rate: z.coerce
    .number()
    .min(0, "Rate must be ≥ 0")
    .max(100, "Rate must be ≤ 100"),
  type: z.enum(["input", "output", "exempt"], {
    required_error: "Tax type is required",
  }),
  inputVatAccount: z.string().default(""),
  outputVatAccount: z.string().default(""),
  isActive: z.boolean().default(true),
});

export type TaxCodeFormValues = z.infer<typeof taxCodeSchema>;

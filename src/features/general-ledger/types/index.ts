// ─── Transaction Type Enum ──────────────────────────────────────────────────
export const GlTransactionType = {
  Journal: "JV",
  Receipt: "RV",
  Payment: "PV",
  SalesInvoice: "INV",
  PurchaseInvoice: "PINV",
  OpeningBalance: "OB",
} as const;
export type GlTransactionType =
  (typeof GlTransactionType)[keyof typeof GlTransactionType];

export const GL_TRANSACTION_TYPE_LABELS: Record<GlTransactionType, string> = {
  JV: "Journal",
  RV: "Receipt",
  PV: "Payment",
  INV: "Sales Invoice",
  PINV: "Purchase Invoice",
  OB: "Opening Balance",
};

// ─── Transaction Status ─────────────────────────────────────────────────────
export const GlTransactionStatus = {
  Posted: "Posted",
  Draft: "Draft",
} as const;
export type GlTransactionStatus =
  (typeof GlTransactionStatus)[keyof typeof GlTransactionStatus];

// ─── Transaction Row ────────────────────────────────────────────────────────
export interface GlTransactionDto {
  id: string;
  date: string; // ISO date string
  voucherNo: string;
  type: GlTransactionType;
  narration: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  costCenter: string;
  debit: number;
  credit: number;
  postedBy: string;
  status: GlTransactionStatus;
}

// ─── Filter Params ──────────────────────────────────────────────────────────
export interface GlLedgerFilterParams {
  accountId?: string;
  periodValue?: string; // e.g. "2026-05", "YTD-2026", "FY-2026"
  costCenter?: string;
  type?: GlTransactionType;
}

// ─── Summary ────────────────────────────────────────────────────────────────
export interface GlLedgerSummary {
  openingBalance: number;
  periodDebit: number;
  periodCredit: number;
  closingBalance: number;
}

// ─── Period Option ──────────────────────────────────────────────────────────
export interface GlPeriodOption {
  label: string;
  value: string; // "2026-05", "YTD-2026", "FY-2026"
  startDate: string;
  endDate: string;
}

// ─── Cost Center Option ─────────────────────────────────────────────────────
export interface GlCostCenterOption {
  label: string;
  value: string;
}

// ─── Account Option (for dropdown) ─────────────────────────────────────────
export interface GlAccountOption {
  id: string;
  accountNumber: string;
  accountName: string;
  category: string; // "ASSETS" | "LIABILITIES" | "REVENUE" | "EXPENSES" | "EQUITY"
}

// ─── Segment Option ─────────────────────────────────────────────────────────
export interface GlSegmentOption {
  label: string;
  value: string;
}

export const GL_SEGMENTS: GlSegmentOption[] = [
  { label: "All Segments", value: "all" },
  { label: "Passport Services", value: "passport-services" },
  { label: "Travel & Tourism", value: "travel-tourism" },
  { label: "Business Lounge", value: "business-lounge" },
];

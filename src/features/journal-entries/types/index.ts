export type JournalVoucherStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Posted"
  | "Rejected"
  | "Reversed";

export type JournalVoucherType =
  | "General"
  | "Adjusting"
  | "Accrual"
  | "Reversing"
  | "Opening";

export type AccountTypeOption = "Ledger" | "Customer" | "Vendor" | "Bank";

export interface JournalVoucherLineDto {
  id: string;
  accountType: AccountTypeOption;
  accountId: string;
  accountNumber: string;
  accountName: string;
  description?: string;
  costCenter?: string;
  debit: number;
  credit: number;
  offsetType?: "Ledger" | "Bank";
  offsetAccountId?: string;
  offsetAccountNumber?: string;
  offsetAccountName?: string;
}

export interface JournalVoucherAttachment {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export type JournalVoucherApprovalStage =
  | "Initiator"
  | "Finance Review"
  | "CFO Approve"
  | "Posted";

export interface JournalVoucherApprovalHistoryItem {
  stage: string;
  action: string;
  actor: string;
  timestamp: string;
  remarks?: string;
}

export interface JournalVoucherDto {
  id: string;
  voucherNo: string;
  journalName: string;
  date: string;
  currency: string;
  journalType: JournalVoucherType;
  costCenter?: string;
  department?: string;
  exchangeRate: number;
  description: string;
  status: JournalVoucherStatus;
  lines: JournalVoucherLineDto[];
  attachments: JournalVoucherAttachment[];
  internalNotes: string;
  approvalRemarks: string;
  currentApprovalStage: JournalVoucherApprovalStage;
  approvalHistory: JournalVoucherApprovalHistoryItem[];
  reversedVoucherId?: string;
  reversingVoucherId?: string;
}

// For form submissions / payload creation
export interface CreateJournalVoucherLineDto {
  accountType: AccountTypeOption;
  accountId: string;
  description?: string;
  costCenter?: string;
  debit: number;
  credit: number;
  offsetType?: "Ledger" | "Bank";
  offsetAccountId?: string;
}

export interface CreateJournalVoucherDto {
  journalName: string;
  date: string;
  currency: string;
  journalType: JournalVoucherType;
  costCenter?: string;
  department?: string;
  exchangeRate: number;
  description: string;
  lines: CreateJournalVoucherLineDto[];
  internalNotes?: string;
}

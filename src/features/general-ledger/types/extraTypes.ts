// Extra types for new features (Trial Balance + Period Locking)

export interface TrialBalanceLineDto {
  accountNumber: string;
  accountName: string;
  category: string; // ASSETS, LIABILITIES, EQUITY, REVENUE, EXPENSES
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface TrialBalanceSummaryDto {
  periodValue: string;
  periodLabel: string;
  lines: TrialBalanceLineDto[];
  totalOpeningDebit: number;
  totalOpeningCredit: number;
  totalPeriodDebit: number;
  totalPeriodCredit: number;
  totalClosingDebit: number;
  totalClosingCredit: number;
}

export interface PeriodLockDto {
  periodValue: string;
  periodLabel: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

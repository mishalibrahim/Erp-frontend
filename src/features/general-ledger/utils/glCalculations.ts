import type { GlTransactionDto, GlLedgerSummary } from "../types";

/**
 * Shared calculation module for all GL balance computations.
 *
 * Per NFR §9.2 — All monetary figures must be calculated from a single
 * shared utility so the page header badges, table running balances,
 * and summary footer can never diverge.
 */

// ─── Running Balance ────────────────────────────────────────────────────────

/**
 * Compute the running balance for each row, starting from the opening balance.
 * Returns an array of balance values aligned with the input rows.
 */
export function computeRunningBalances(
  rows: GlTransactionDto[],
  openingBalance: number
): number[] {
  const balances: number[] = [];
  let running = openingBalance;

  for (const row of rows) {
    running = running + row.debit - row.credit;
    balances.push(running);
  }

  return balances;
}

// ─── Summary ────────────────────────────────────────────────────────────────

/**
 * Compute the four summary figures from the filtered row set.
 */
export function computeSummary(
  rows: GlTransactionDto[],
  openingBalance: number
): GlLedgerSummary {
  let periodDebit = 0;
  let periodCredit = 0;

  for (const row of rows) {
    periodDebit += row.debit;
    periodCredit += row.credit;
  }

  const closingBalance = openingBalance + periodDebit - periodCredit;

  return {
    openingBalance,
    periodDebit,
    periodCredit,
    closingBalance,
  };
}

// ─── Formatting ─────────────────────────────────────────────────────────────

/**
 * Format a monetary value with thousands separators and 2 decimal places.
 * e.g. 127000 → "AED 127,000.00"
 */
export function formatAmount(
  value: number,
  currency: string = "AED"
): string {
  const formatted = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
}

/**
 * Format a raw number with thousands separators and 2 decimal places.
 * e.g. 127000 → "127,000.00"
 */
export function formatNumber(value: number): string {
  return Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a balance as "Dr <amount>" or "Cr <amount>" based on sign.
 * Per FRD §6.4: ≥ 0 → "Dr", < 0 → "Cr" (absolute value).
 */
export function formatBalanceDisplay(value: number): {
  label: string;
  formattedValue: string;
  isDebit: boolean;
} {
  const isDebit = value >= 0;
  const formattedValue = formatNumber(value);
  return {
    label: isDebit ? "Dr" : "Cr",
    formattedValue,
    isDebit,
  };
}

/**
 * Display a debit/credit cell value.
 * Shows "—" (em dash) when zero per FRD §6.3, never "0.00".
 */
export function formatCellAmount(value: number): string {
  if (value === 0) return "—";
  return formatNumber(value);
}

// ─── Search ─────────────────────────────────────────────────────────────────

/**
 * Client-side search matching against voucher number, narration, account, and amount.
 * Per FRD §6.5 / AC-9.
 */
export function matchesSearch(
  row: GlTransactionDto,
  searchText: string
): boolean {
  if (!searchText.trim()) return true;

  const query = searchText.toLowerCase().trim();
  const fields = [
    row.voucherNo,
    row.narration,
    row.accountNumber,
    row.accountName,
    `${row.accountNumber} – ${row.accountName}`,
    row.debit > 0 ? formatNumber(row.debit) : "",
    row.credit > 0 ? formatNumber(row.credit) : "",
    row.debit.toString(),
    row.credit.toString(),
  ];

  return fields.some((field) => field.toLowerCase().includes(query));
}

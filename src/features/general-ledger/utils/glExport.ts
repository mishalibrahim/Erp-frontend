import type { GlTransactionDto, GlLedgerSummary } from "../types";
import { GL_TRANSACTION_TYPE_LABELS } from "../types";
import { formatNumber } from "./glCalculations";
import { format } from "date-fns";

/**
 * Export the currently filtered ledger table to a CSV file (as .xlsx-compatible).
 *
 * For v1, we generate a CSV with proper formatting. When a backend export
 * endpoint is available, this can be upgraded to download a server-generated .xlsx.
 */
export function exportToExcel(
  rows: GlTransactionDto[],
  summary: GlLedgerSummary,
  filterContext: string
): void {
  const headers = [
    "Date",
    "Voucher No.",
    "Type",
    "Narration",
    "Account",
    "Cost Center",
    "Debit (AED)",
    "Credit (AED)",
    "Posted By",
    "Status",
  ];

  const csvRows = [
    `"Aegis ERP — General Ledger Export"`,
    `"${filterContext}"`,
    `"Exported: ${format(new Date(), "dd MMM yyyy, HH:mm")}"`,
    "",
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) =>
      [
        format(new Date(row.date), "dd MMM yyyy"),
        row.voucherNo,
        GL_TRANSACTION_TYPE_LABELS[row.type] ?? row.type,
        row.narration,
        `${row.accountNumber} – ${row.accountName}`,
        row.costCenter,
        row.debit > 0 ? formatNumber(row.debit) : "",
        row.credit > 0 ? formatNumber(row.credit) : "",
        row.postedBy,
        row.status,
      ]
        .map((v) => `"${v}"`)
        .join(",")
    ),
    "",
    `"Opening Balance","","","","","","${formatNumber(summary.openingBalance)}",""`,
    `"Period Debit","","","","","","${formatNumber(summary.periodDebit)}",""`,
    `"Period Credit","","","","","","","${formatNumber(summary.periodCredit)}"`,
    `"Closing Balance","","","","","","${formatNumber(summary.closingBalance)}",""`,
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = format(new Date(), "yyyyMMdd");
  link.href = url;
  link.download = `GL_Ledger_${dateStamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Open a print-friendly dialog for the current ledger view.
 */
export function printLedger(): void {
  window.print();
}

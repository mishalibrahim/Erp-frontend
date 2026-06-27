import { formatAmount } from "../utils/glCalculations";
import type { GlLedgerSummary } from "../types";

interface GlPageHeaderProps {
  accountLabel?: string; // e.g. "11020 – ENBD Current Account"
  subtitle: string; // e.g. "All transactions · May 2026 · AED"
  summary: GlLedgerSummary;
}

export function GlPageHeader({
  accountLabel,
  subtitle,
  summary,
}: GlPageHeaderProps) {
  const title = accountLabel ?? "General Ledger";
  const breadcrumb = accountLabel ?? "All Accounts";

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground/70">General Ledger</span>
        <span className="text-muted-foreground/50">›</span>
        <span>{breadcrumb}</span>
      </nav>

      {/* Title + Badges */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Summary Badges — Dr / Cr / Bal */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Debit badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 dark:text-blue-400">
              Dr
            </span>
            <span className="text-sm font-bold tabular-nums text-blue-700 dark:text-blue-300">
              {formatAmount(summary.periodDebit)}
            </span>
          </div>

          {/* Credit badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500 dark:text-amber-400">
              Cr
            </span>
            <span className="text-sm font-bold tabular-nums text-amber-700 dark:text-amber-300">
              {formatAmount(summary.periodCredit)}
            </span>
          </div>

          {/* Balance badge */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              summary.closingBalance >= 0
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40"
                : "bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/40"
            }`}
          >
            <span
              className={`text-[10px] uppercase tracking-wider font-bold ${
                summary.closingBalance >= 0
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              Bal
            </span>
            <span
              className={`text-sm font-bold tabular-nums ${
                summary.closingBalance >= 0
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {formatAmount(summary.closingBalance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

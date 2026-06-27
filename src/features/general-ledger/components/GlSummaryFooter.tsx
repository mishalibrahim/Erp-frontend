import type { GlLedgerSummary } from "../types";
import { formatAmount } from "../utils/glCalculations";

interface GlSummaryFooterProps {
  summary: GlLedgerSummary;
  rowCount: number;
}

export function GlSummaryFooter({ summary, rowCount }: GlSummaryFooterProps) {
  const cards = [
    {
      label: "Opening Balance",
      value: summary.openingBalance,
      color: "text-muted-foreground",
    },
    {
      label: "Period Debit",
      value: summary.periodDebit,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Period Credit",
      value: summary.periodCredit,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Closing Balance",
      value: summary.closingBalance,
      color:
        summary.closingBalance >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="border-t bg-card/80 backdrop-blur-sm rounded-b-lg">
      {/* Row count */}
      <div className="px-4 py-2 border-b">
        <span className="text-xs text-muted-foreground font-medium">
          {rowCount} entries
        </span>
      </div>

      {/* Summary figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-1 p-3 rounded-lg bg-muted/40 border border-border/50"
          >
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {card.label}
            </span>
            <span className={`text-sm font-bold tabular-nums ${card.color}`}>
              {formatAmount(card.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

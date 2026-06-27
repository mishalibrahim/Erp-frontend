import { useState } from "react";
import { format } from "date-fns";
import {
  BarChart3,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { generalLedgerApi } from "../api/generalLedgerApi";
import { useGetTrialBalance } from "../hooks/useGeneralLedgerExtra";
import type { TrialBalanceLineDto } from "../types/extraTypes";
import { formatNumber } from "../utils/glCalculations";

const CATEGORY_ORDER = ["ASSETS", "LIABILITIES", "EQUITY", "REVENUE", "EXPENSES"];
const CATEGORY_COLORS: Record<string, string> = {
  ASSETS: "text-blue-400",
  LIABILITIES: "text-red-400",
  EQUITY: "text-purple-400",
  REVENUE: "text-green-400",
  EXPENSES: "text-orange-400",
};
const CATEGORY_BG: Record<string, string> = {
  ASSETS: "bg-blue-500/10 border-blue-500/20",
  LIABILITIES: "bg-red-500/10 border-red-500/20",
  EQUITY: "bg-purple-500/10 border-purple-500/20",
  REVENUE: "bg-green-500/10 border-green-500/20",
  EXPENSES: "bg-orange-500/10 border-orange-500/20",
};

function AmountCell({ value }: { value: number }) {
  if (value === 0) return <span className="text-muted-foreground/40">—</span>;
  return <span className="font-mono tabular-nums">{formatNumber(value)}</span>;
}

export function TrialBalancePage() {
  const [periodValue, setPeriodValue] = useState<string>("2026-05");

  const { data: periods = [] } = useQuery({
    queryKey: ["gl-periods"],
    queryFn: generalLedgerApi.getPeriods,
  });

  const {
    data: summary,
    isLoading,
    refetch,
  } = useGetTrialBalance(periodValue);

  const handleExportCsv = () => {
    if (!summary) return;
    const headers = [
      "Account No.",
      "Account Name",
      "Category",
      "Opening Dr",
      "Opening Cr",
      "Period Dr",
      "Period Cr",
      "Closing Dr",
      "Closing Cr",
    ];
    const rows = summary.lines.map((l) =>
      [
        l.accountNumber,
        l.accountName,
        l.category,
        l.openingDebit,
        l.openingCredit,
        l.periodDebit,
        l.periodCredit,
        l.closingDebit,
        l.closingCredit,
      ]
        .map((v) => `"${v}"`)
        .join(",")
    );
    const totals = [
      "TOTAL",
      "",
      "",
      summary.totalOpeningDebit,
      summary.totalOpeningCredit,
      summary.totalPeriodDebit,
      summary.totalPeriodCredit,
      summary.totalClosingDebit,
      summary.totalClosingCredit,
    ]
      .map((v) => `"${v}"`)
      .join(",");

    const csv =
      `"Aegis ERP - Trial Balance"\n"Period: ${summary.periodLabel}"\n"Exported: ${format(new Date(), "dd MMM yyyy HH:mm")}"\n\n` +
      [headers.map((h) => `"${h}"`).join(","), ...rows, "", totals].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TrialBalance_${periodValue}_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, TrialBalanceLineDto[]>>(
    (acc, cat) => {
      acc[cat] = summary?.lines.filter((l) => l.category === cat) ?? [];
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Trial Balance</h2>
            <p className="text-sm text-muted-foreground">
              {summary?.periodLabel ?? "Select a period"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodValue} onValueChange={setPeriodValue}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              {periods
                .filter((p) => p.value.length === 7)
                .map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExportCsv}
            disabled={!summary}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center border rounded-lg bg-card/50">
          <p className="text-muted-foreground animate-pulse">Loading trial balance...</p>
        </div>
      ) : !summary || summary.lines.length === 0 ? (
        <div className="h-64 flex items-center justify-center border rounded-lg bg-card/50">
          <p className="text-muted-foreground">No posted transactions for this period.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Table */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Account</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Opening Dr</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Opening Cr</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Period Dr</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Period Cr</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Closing Dr</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Closing Cr</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_ORDER.map((cat) => {
                  const catLines = grouped[cat];
                  if (catLines.length === 0) return null;
                  return (
                    <>
                      {/* Category header row */}
                      <tr key={`cat-${cat}`} className={`border-b ${CATEGORY_BG[cat]}`}>
                        <td
                          colSpan={7}
                          className={`px-4 py-2 text-xs font-bold tracking-widest uppercase ${CATEGORY_COLORS[cat]}`}
                        >
                          {cat}
                        </td>
                      </tr>
                      {/* Account rows */}
                      {catLines.map((line) => (
                        <tr
                          key={line.accountNumber}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-2.5">
                            <span className="font-mono text-xs text-muted-foreground mr-2">
                              {line.accountNumber}
                            </span>
                            <span className="text-foreground">{line.accountName}</span>
                          </td>
                          <td className="text-right px-4 py-2.5 text-muted-foreground">
                            <AmountCell value={line.openingDebit} />
                          </td>
                          <td className="text-right px-4 py-2.5 text-muted-foreground">
                            <AmountCell value={line.openingCredit} />
                          </td>
                          <td className="text-right px-4 py-2.5 text-blue-400">
                            <AmountCell value={line.periodDebit} />
                          </td>
                          <td className="text-right px-4 py-2.5 text-purple-400">
                            <AmountCell value={line.periodCredit} />
                          </td>
                          <td className="text-right px-4 py-2.5 font-semibold text-foreground">
                            <AmountCell value={line.closingDebit} />
                          </td>
                          <td className="text-right px-4 py-2.5 font-semibold text-foreground">
                            <AmountCell value={line.closingCredit} />
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
              {/* Grand Total Footer */}
              <tfoot>
                <tr className="border-t-2 bg-muted/60 font-bold">
                  <td className="px-4 py-3 text-foreground">Grand Total</td>
                  <td className="text-right px-4 py-3 font-mono tabular-nums">
                    {formatNumber(summary.totalOpeningDebit)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono tabular-nums">
                    {formatNumber(summary.totalOpeningCredit)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono tabular-nums text-blue-400">
                    {formatNumber(summary.totalPeriodDebit)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono tabular-nums text-purple-400">
                    {formatNumber(summary.totalPeriodCredit)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono tabular-nums text-green-400">
                    {formatNumber(summary.totalClosingDebit)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono tabular-nums text-red-400">
                    {formatNumber(summary.totalClosingCredit)}
                  </td>
                </tr>
                {/* Balance check */}
                <tr className="bg-muted/30">
                  <td colSpan={7} className="px-4 py-2 text-center text-xs text-muted-foreground">
                    {Math.abs(summary.totalClosingDebit - summary.totalClosingCredit) < 0.01 ? (
                      <span className="text-green-400 font-semibold">
                        ✓ Trial Balance is balanced (Dr = Cr)
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        ⚠ Trial Balance is unbalanced — Difference:{" "}
                        {formatNumber(
                          Math.abs(summary.totalClosingDebit - summary.totalClosingCredit)
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

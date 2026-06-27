import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Info } from "lucide-react";

// UI components
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Feature Components
import { GlPageHeader } from "./GlPageHeader";
import { QuickReportBar } from "./QuickReportBar";
import { GlActionPanel } from "./GlActionPanel";
import { GlFilterToolbar } from "./GlFilterToolbar";
import { GlLedgerTable } from "./GlLedgerTable";
import { GlSummaryFooter } from "./GlSummaryFooter";
import { TrialBalancePage } from "./TrialBalancePage";
import { PeriodLockPage } from "./PeriodLockPage";

// Hooks & Types
import {
  useGetGlTransactions,
  useGetOpeningBalance,
  useGetPeriods,
  useGetCostCenters,
  useGetGlAccounts,
} from "../hooks/useGeneralLedger";
import type { GlTransactionType, GlLedgerFilterParams } from "../types";
import { computeSummary } from "../utils/glCalculations";
import { exportToExcel, printLedger } from "../utils/glExport";

export function GeneralLedgerPage() {
  const [searchParams] = useSearchParams();
  const queryAccountId = searchParams.get("accountId") || undefined;

  // Active view tab
  const [currentTab, setCurrentTab] = useState("ledger");

  // Filters state (temporary till "Run" is clicked)
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(queryAccountId);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2026-05");
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<GlTransactionType | undefined>(undefined);

  // Applied filters state (powers React Query)
  const [appliedFilters, setAppliedFilters] = useState<GlLedgerFilterParams>({
    accountId: queryAccountId,
    periodValue: "2026-05",
    costCenter: "all",
    type: undefined,
  });

  // Sync route query parameters with filter state
  useEffect(() => {
    if (queryAccountId) {
      setSelectedAccountId(queryAccountId);
      setAppliedFilters((prev) => ({
        ...prev,
        accountId: queryAccountId,
      }));
    }
  }, [queryAccountId]);

  // Queries
  const { data: accounts = [], isLoading: isLoadingAccounts } = useGetGlAccounts();
  const { data: periods = [], isLoading: isLoadingPeriods } = useGetPeriods();
  const { data: costCenters = [], isLoading: isLoadingCostCenters } = useGetCostCenters();

  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
  } = useGetGlTransactions(appliedFilters);

  const {
    data: openingBalance = 0,
    isLoading: isLoadingOpeningBalance,
  } = useGetOpeningBalance(appliedFilters.accountId, appliedFilters.periodValue);

  // Sync default period once loaded
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periods[0].value);
      setAppliedFilters((prev) => ({
        ...prev,
        periodValue: periods[0].value,
      }));
    }
  }, [periods]);

  // Compile filters to description subtitle
  const filterSubtitle = useMemo(() => {
    const account = accounts.find((a) => a.id === appliedFilters.accountId);
    const period = periods.find((p) => p.value === appliedFilters.periodValue);
    const cc = costCenters.find((c) => c.value === appliedFilters.costCenter);

    const parts = [
      account ? `${account.accountNumber} – ${account.accountName}` : "All Accounts",
      period ? period.label : "May 2026",
      cc ? cc.label : "All Segments",
      "AED",
    ];
    return parts.join(" · ");
  }, [appliedFilters, accounts, periods, costCenters]);

  const activeAccount = accounts.find((a) => a.id === appliedFilters.accountId);
  const accountLabel = activeAccount
    ? `${activeAccount.accountNumber} – ${activeAccount.accountName}`
    : undefined;

  // Running calculations
  const summary = useMemo(() => {
    return computeSummary(transactions, openingBalance);
  }, [transactions, openingBalance]);

  // Actions
  const handleRun = () => {
    setAppliedFilters({
      accountId: selectedAccountId,
      periodValue: selectedPeriod,
      costCenter: selectedCostCenter,
      type: selectedType,
    });
  };

  const handleExportExcel = () => {
    exportToExcel(transactions, summary, filterSubtitle);
  };

  const handlePrint = () => {
    printLedger();
  };

  const isDataLoading = isLoadingTransactions || isLoadingOpeningBalance;
  const isMetadataLoading = isLoadingAccounts || isLoadingPeriods || isLoadingCostCenters;

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Quick Report Date Range Bar */}
        <QuickReportBar onExportExcel={handleExportExcel} onExportPdf={handlePrint} />

        {/* Tabs and Action buttons bar */}
        <GlActionPanel
          onTabChange={setCurrentTab}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
        />

        {/* ── Tabs Content ──────────────────────────────────────────────── */}
        <TabsContent value="ledger" className="space-y-6 outline-none">
          {/* Header section with Breadcrumb, Title & Summary badges */}
          {isMetadataLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-10 w-80" />
              </div>
            </div>
          ) : (
            <GlPageHeader
              accountLabel={accountLabel}
              subtitle={filterSubtitle}
              summary={summary}
            />
          )}

          {/* Filter Toolbar Section */}
          <div className="border bg-card p-4 rounded-xl shadow-sm">
            {isMetadataLoading ? (
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-9 w-52" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-20" />
              </div>
            ) : (
              <GlFilterToolbar
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onAccountChange={setSelectedAccountId}
                periods={periods}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                costCenters={costCenters}
                selectedCostCenter={selectedCostCenter}
                onCostCenterChange={setSelectedCostCenter}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                onRun={handleRun}
              />
            )}
          </div>

          {/* Ledger Table Section */}
          {isDataLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <GlLedgerTable transactions={transactions} openingBalance={openingBalance} />
              <GlSummaryFooter summary={summary} rowCount={transactions.length} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="drill-down" className="outline-none">
          <PeriodLockPage />
        </TabsContent>

        <TabsContent value="reports" className="outline-none">
          <TrialBalancePage />
        </TabsContent>
      </div>
    </Tabs>
  );
}

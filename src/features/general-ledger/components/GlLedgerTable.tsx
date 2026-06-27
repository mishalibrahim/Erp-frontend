import { useState, useMemo, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { GlTransactionDto } from "../types";
import { GlTypeBadge } from "./GlTypeBadge";
import {
  computeRunningBalances,
  formatCellAmount,
  formatBalanceDisplay,
  matchesSearch,
} from "../utils/glCalculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GlLedgerTableProps {
  transactions: GlTransactionDto[];
  openingBalance: number;
}

type TypeChipOption = "All" | "Journal" | "Receipt" | "Payment" | "Invoice";
type SortField = "date" | "voucherNo" | "accountNumber" | "debit" | "credit";
type SortOrder = "asc" | "desc";

export function GlLedgerTable({ transactions, openingBalance }: GlLedgerTableProps) {
  // Client-side UI states
  const [searchText, setSearchText] = useState("");
  const [typeChip, setTypeChip] = useState<TypeChipOption>("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, typeChip]);

  // Reset selection when transactions change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [transactions]);

  // 1. Chronological running balance map so rows keep their correct running balance if visual sorting changes
  const balanceMap = useMemo(() => {
    const chronological = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const balances = computeRunningBalances(chronological, openingBalance);
    const map = new Map<string, number>();
    chronological.forEach((tx, idx) => {
      map.set(tx.id, balances[idx]);
    });
    return map;
  }, [transactions, openingBalance]);

  // 2. Client-side Filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type chip filter
      if (typeChip !== "All") {
        if (typeChip === "Journal" && tx.type !== "JV") return false;
        if (typeChip === "Receipt" && tx.type !== "RV") return false;
        if (typeChip === "Payment" && tx.type !== "PV") return false;
        if (typeChip === "Invoice" && tx.type !== "INV" && tx.type !== "PINV") return false;
      }
      // Search text filter
      return matchesSearch(tx, searchText);
    });
  }, [transactions, typeChip, searchText]);

  // 3. Client-side Sort
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "voucherNo") {
        comparison = a.voucherNo.localeCompare(b.voucherNo);
      } else if (sortField === "accountNumber") {
        comparison = a.accountNumber.localeCompare(b.accountNumber);
      } else if (sortField === "debit") {
        comparison = a.debit - b.debit;
      } else if (sortField === "credit") {
        comparison = a.credit - b.credit;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [filteredTransactions, sortField, sortOrder]);

  // 4. Client-side Pagination
  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedTransactions.slice(start, end);
  }, [sortedTransactions, currentPage, pageSize]);

  // Sorting Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedTransactions.map((tx) => tx.id);
      setSelectedIds(new Set([...selectedIds, ...pageIds]));
    } else {
      const newSelected = new Set(selectedIds);
      paginatedTransactions.forEach((tx) => newSelected.delete(tx.id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllPageSelected =
    paginatedTransactions.length > 0 &&
    paginatedTransactions.every((tx) => selectedIds.has(tx.id));

  // Render sort icon helper
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="inline-block ml-1 h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="inline-block ml-1 h-3.5 w-3.5" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Type Filter Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-card p-4 rounded-xl border shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Voucher, Narration, Account, or Amount..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Chips Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-muted-foreground mr-1 uppercase tracking-wider">
            Type:
          </span>
          {(["All", "Journal", "Receipt", "Payment", "Invoice"] as TypeChipOption[]).map(
            (option) => {
              const isActive = typeChip === option;
              return (
                <button
                  key={option}
                  onClick={() => setTypeChip(option)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border-input"
                  }`}
                >
                  {option}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Row Count / Select Count Indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </div>
        {selectedIds.size > 0 && (
          <div className="font-medium text-primary">
            {selectedIds.size} transaction{selectedIds.size > 1 ? "s" : ""} selected
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-medium text-left">
                {/* Checkbox Header */}
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background cursor-pointer"
                  />
                </th>

                {/* Headers */}
                <th
                  onClick={() => handleSort("date")}
                  className="p-3 cursor-pointer hover:bg-muted/70 transition-colors select-none whitespace-nowrap"
                >
                  Date {renderSortIcon("date")}
                </th>
                <th
                  onClick={() => handleSort("voucherNo")}
                  className="p-3 cursor-pointer hover:bg-muted/70 transition-colors select-none whitespace-nowrap"
                >
                  Voucher No. {renderSortIcon("voucherNo")}
                </th>
                <th className="p-3 whitespace-nowrap">Type</th>
                <th className="p-3 max-w-[200px]">Narration</th>
                <th
                  onClick={() => handleSort("accountNumber")}
                  className="p-3 cursor-pointer hover:bg-muted/70 transition-colors select-none whitespace-nowrap"
                >
                  Account No. {renderSortIcon("accountNumber")}
                </th>
                <th className="p-3 whitespace-nowrap">Account Name</th>
                <th className="p-3 whitespace-nowrap">Cost Center</th>
                <th
                  onClick={() => handleSort("debit")}
                  className="p-3 text-right cursor-pointer hover:bg-muted/70 transition-colors select-none whitespace-nowrap"
                >
                  Debit {renderSortIcon("debit")}
                </th>
                <th
                  onClick={() => handleSort("credit")}
                  className="p-3 text-right cursor-pointer hover:bg-muted/70 transition-colors select-none whitespace-nowrap"
                >
                  Credit {renderSortIcon("credit")}
                </th>
                <th className="p-3 text-right whitespace-nowrap">Running Balance</th>
                <th className="p-3 whitespace-nowrap">Posted By</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="h-32 text-center text-muted-foreground">
                    No transactions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isChecked = selectedIds.has(tx.id);
                  const rowBalance = balanceMap.get(tx.id) ?? 0;
                  const balDisplay = formatBalanceDisplay(rowBalance);
                  const isDraft = tx.status === "Draft";

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isDraft ? "opacity-60 bg-muted/10 font-italic" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(tx.id, e.target.checked)}
                          className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background cursor-pointer"
                        />
                      </td>

                      {/* Date */}
                      <td className="p-3 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Voucher No. */}
                      <td className="p-3 font-semibold whitespace-nowrap">
                        {tx.voucherNo}
                      </td>

                      {/* Type Badge */}
                      <td className="p-3">
                        <GlTypeBadge type={tx.type} />
                      </td>

                      {/* Narration */}
                      <td className="p-3 max-w-[200px] truncate text-muted-foreground" title={tx.narration}>
                        {tx.narration}
                      </td>

                      {/* Account No */}
                      <td className="p-3 font-mono text-xs whitespace-nowrap">
                        {tx.accountNumber}
                      </td>

                      {/* Account Name */}
                      <td className="p-3 font-medium whitespace-nowrap truncate max-w-[150px]" title={tx.accountName}>
                        {tx.accountName}
                      </td>

                      {/* Cost Center */}
                      <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                        {tx.costCenter || "—"}
                      </td>

                      {/* Debit */}
                      <td className="p-3 text-right font-mono font-medium">
                        {formatCellAmount(tx.debit)}
                      </td>

                      {/* Credit */}
                      <td className="p-3 text-right font-mono font-medium">
                        {formatCellAmount(tx.credit)}
                      </td>

                      {/* Running Balance */}
                      <td className="p-3 text-right font-mono font-semibold whitespace-nowrap">
                        <span
                          className={
                            balDisplay.isDebit
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-amber-600 dark:text-amber-400"
                          }
                        >
                          {balDisplay.label} {balDisplay.formattedValue}
                        </span>
                      </td>

                      {/* Posted By */}
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                        {tx.postedBy}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-8 text-xs">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First Page"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

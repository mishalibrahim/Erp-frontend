import { useState, useMemo, useRef } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  GlAccountOption,
  GlPeriodOption,
  GlCostCenterOption,
  GlTransactionType,
} from "../types";
import { GL_TRANSACTION_TYPE_LABELS } from "../types";

interface GlFilterToolbarProps {
  // Account
  accounts: GlAccountOption[];
  selectedAccountId?: string;
  onAccountChange: (accountId?: string) => void;

  // Period
  periods: GlPeriodOption[];
  selectedPeriod: string;
  onPeriodChange: (periodValue: string) => void;

  // Cost Center
  costCenters: GlCostCenterOption[];
  selectedCostCenter: string;
  onCostCenterChange: (costCenter: string) => void;

  // Type
  selectedType?: GlTransactionType;
  onTypeChange: (type?: GlTransactionType) => void;

  // Run
  onRun: () => void;
}

export function GlFilterToolbar({
  accounts,
  selectedAccountId,
  onAccountChange,
  periods,
  selectedPeriod,
  onPeriodChange,
  costCenters,
  selectedCostCenter,
  onCostCenterChange,
  selectedType,
  onTypeChange,
  onRun,
}: GlFilterToolbarProps) {
  const [accountSearchOpen, setAccountSearchOpen] = useState(false);
  const [accountSearchText, setAccountSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Group accounts by category
  const groupedAccounts = useMemo(() => {
    const groups: Record<string, GlAccountOption[]> = {};
    const filteredAccounts = accounts.filter((a) => {
      if (!accountSearchText.trim()) return true;
      const q = accountSearchText.toLowerCase();
      return (
        a.accountNumber.toLowerCase().includes(q) ||
        a.accountName.toLowerCase().includes(q)
      );
    });

    for (const account of filteredAccounts) {
      const cat = account.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(account);
    }
    return groups;
  }, [accounts, accountSearchText]);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const accountDisplayLabel = selectedAccount
    ? `${selectedAccount.accountNumber} – ${selectedAccount.accountName}`
    : "— All Accounts —";

  // Transaction type options
  const typeOptions: { label: string; value: string }[] = [
    { label: "All Types", value: "all" },
    ...Object.entries(GL_TRANSACTION_TYPE_LABELS).map(([value, label]) => ({
      label: `${label} (${value})`,
      value,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      {/* ── Account Filter (Searchable Combobox) ─────────────────────────── */}
      <Popover
        open={accountSearchOpen}
        onOpenChange={(open) => {
          setAccountSearchOpen(open);
          if (open) {
            setAccountSearchText("");
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={accountSearchOpen}
            className="h-9 w-auto min-w-[220px] max-w-[320px] justify-between text-sm font-normal"
          >
            <span className="truncate">{accountDisplayLabel}</span>
            <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] p-0"
          align="start"
        >
          {/* Search input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search accounts..."
                value={accountSearchText}
                onChange={(e) => setAccountSearchText(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {/* All Accounts option */}
            <button
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                !selectedAccountId
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              }`}
              onClick={() => {
                onAccountChange(undefined);
                setAccountSearchOpen(false);
              }}
            >
              — All Accounts —
            </button>

            {/* Grouped accounts */}
            {Object.entries(groupedAccounts).map(([category, accts]) => (
              <div key={category} className="mt-1">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  {category}
                </div>
                {accts.map((account) => (
                  <button
                    key={account.id}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                      selectedAccountId === account.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      onAccountChange(account.id);
                      setAccountSearchOpen(false);
                    }}
                  >
                    {account.accountNumber} – {account.accountName}
                  </button>
                ))}
              </div>
            ))}

            {/* Add New Account action */}
            <div className="border-t mt-1 pt-1">
              <button className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add New Account
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Period Filter ───────────────────────────────────────────────── */}
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="h-9 w-auto min-w-[140px] text-sm">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ── Cost Center Filter ──────────────────────────────────────────── */}
      <Select value={selectedCostCenter} onValueChange={onCostCenterChange}>
        <SelectTrigger className="h-9 w-auto min-w-[160px] text-sm">
          <SelectValue placeholder="Cost Center" />
        </SelectTrigger>
        <SelectContent>
          {costCenters.map((cc) => (
            <SelectItem key={cc.value} value={cc.value}>
              {cc.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ── Type Filter ─────────────────────────────────────────────────── */}
      <Select
        value={selectedType ?? "all"}
        onValueChange={(v) =>
          onTypeChange(v === "all" ? undefined : (v as GlTransactionType))
        }
      >
        <SelectTrigger className="h-9 w-auto min-w-[130px] text-sm">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ── Run Button ──────────────────────────────────────────────────── */}
      <Button size="sm" className="h-9 gap-1.5" onClick={onRun}>
        Run
      </Button>
    </div>
  );
}

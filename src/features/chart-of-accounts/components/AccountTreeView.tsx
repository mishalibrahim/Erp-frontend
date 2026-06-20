import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { GLAccount, GLAccountTreeNode, AccountCategory } from "../types";
import { ACCOUNT_CATEGORY_CONFIG } from "../constants";

interface AccountTreeViewProps {
  flatTree: GLAccountTreeNode[];
  onEdit: (account: GLAccount) => void;
  onDelete: (accountNumber: string) => void;
  hasChildren: (accountNumber: string) => boolean;
}

const categoryTabs: { value: AccountCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "asset", label: "Assets" },
  { value: "liability", label: "Liabilities" },
  { value: "equity", label: "Equity" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function getCategoryConfig(category: AccountCategory) {
  return ACCOUNT_CATEGORY_CONFIG.find((c) => c.value === category)!;
}

export function AccountTreeView({
  flatTree,
  onEdit,
  onDelete,
  hasChildren,
}: AccountTreeViewProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    AccountCategory | "all"
  >("all");
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  // Toggle collapse
  const toggleNode = (accountNumber: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(accountNumber)) {
        next.delete(accountNumber);
      } else {
        next.add(accountNumber);
      }
      return next;
    });
  };

  // Filter and visibility
  const visibleAccounts = useMemo(() => {
    let filtered = flatTree;

    // Category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (a) => a.accountCategory === activeCategory,
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.accountNumber.includes(q) ||
          a.accountName.toLowerCase().includes(q),
      );
    }

    // Hide children of collapsed nodes (only when not searching)
    if (!search.trim()) {
      const hidden = new Set<string>();
      for (const node of filtered) {
        if (hidden.has(node.accountNumber)) continue;
        if (collapsedNodes.has(node.accountNumber)) {
          // Mark all descendants as hidden
          const markHidden = (n: GLAccountTreeNode) => {
            for (const child of n.children) {
              hidden.add(child.accountNumber);
              markHidden(child);
            }
          };
          markHidden(node);
        }
      }
      filtered = filtered.filter((a) => !hidden.has(a.accountNumber));
    }

    return filtered;
  }, [flatTree, activeCategory, search, collapsedNodes]);

  return (
    <div className="space-y-4">
      {/* ── Search & Category Tabs ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="coa-search"
            placeholder="Search by account number or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-lg"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.value;
          const config =
            tab.value !== "all"
              ? getCategoryConfig(tab.value as AccountCategory)
              : null;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border",
                isActive
                  ? config
                    ? `${config.badgeColor} border-current`
                    : "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted/70",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Account Tree ── */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/50 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <div className="col-span-5">Account</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1 text-center">Manual</div>
          <div className="col-span-1 text-center">Dims</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        {visibleAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No accounts found matching your criteria
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {visibleAccounts.map((account) => {
              const config = getCategoryConfig(account.accountCategory);
              const isHeader = account.postingType === "header";
              const isCollapsed = collapsedNodes.has(account.accountNumber);
              const canExpand = account.children.length > 0;

              return (
                <div
                  key={account.accountNumber}
                  className={cn(
                    "grid grid-cols-12 gap-2 px-4 py-2.5 items-center transition-colors group",
                    isHeader
                      ? "bg-muted/20 hover:bg-muted/40"
                      : "hover:bg-muted/20",
                  )}
                >
                  {/* Account Name + Number */}
                  <div
                    className="col-span-5 flex items-center gap-1.5 min-w-0"
                    style={{ paddingLeft: `${account.level * 20}px` }}
                  >
                    {/* Expand/Collapse Toggle */}
                    {canExpand ? (
                      <button
                        onClick={() => toggleNode(account.accountNumber)}
                        className="flex items-center justify-center w-5 h-5 shrink-0 rounded hover:bg-muted/60 transition-colors"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5 shrink-0" />
                    )}

                    {/* Posting Type Badge */}
                    <span
                      className={cn(
                        "shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold",
                        isHeader
                          ? "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                          : `${config.bgColor} ${config.color}`,
                      )}
                    >
                      {isHeader ? "H" : "P"}
                    </span>

                    {/* Account Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-mono",
                            config.color,
                          )}
                        >
                          {account.accountNumber}
                        </span>
                        <span
                          className={cn(
                            "text-sm truncate",
                            isHeader
                              ? "font-semibold text-foreground"
                              : "text-foreground/80",
                          )}
                        >
                          {account.accountName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {account.accountType}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        config.badgeColor,
                      )}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Allow Manual Entry */}
                  <div className="col-span-1 text-center">
                    {!isHeader && (
                      <span
                        className={cn(
                          "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold",
                          account.allowManualEntry
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-500/10 text-slate-400",
                        )}
                      >
                        {account.allowManualEntry ? "✓" : "—"}
                      </span>
                    )}
                  </div>

                  {/* Dimensions */}
                  <div className="col-span-1 text-center">
                    {account.mandatoryDimensions && (
                      <Layers className="w-3.5 h-3.5 text-violet-500 mx-auto" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(account)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(account.accountNumber)}
                      disabled={hasChildren(account.accountNumber)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer Stats ── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing {visibleAccounts.length} of {flatTree.length} accounts
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-md bg-slate-500/15 flex items-center justify-center text-[8px] font-bold text-slate-500">
              H
            </span>
            Header
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-md bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
              P
            </span>
            Posting
          </span>
        </span>
      </div>
    </div>
  );
}

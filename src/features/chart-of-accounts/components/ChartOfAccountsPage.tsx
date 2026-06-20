import { useState } from "react";
import {
  BookOpen,
  Plus,
  Download,
  Layers,
  Receipt,
  ShieldAlert,
  BarChart3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useChartOfAccounts } from "../hooks/useChartOfAccounts";
import { useTaxEngine } from "../hooks/useTaxEngine";
import { AccountTreeView } from "./AccountTreeView";
import { AccountFormDialog } from "./AccountFormDialog";
import { TaxEnginePanel } from "./TaxEnginePanel";
import { DimensionsPanel } from "./DimensionsPanel";
import { GLPostingRules } from "./GLPostingRules";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { GLAccount, GLAccountFormValues } from "../types";

// ─── Sidebar Navigation Config ───────────────────────────────────────────────
const COA_NAV_ITEMS = [
  {
    value: "accounts",
    label: "Accounts",
    description: "GL account hierarchy",
    icon: BookOpen,
    activeBg: "bg-primary/10",
    activeColor: "text-primary",
  },
  {
    value: "tax-engine",
    label: "Tax Engine",
    description: "UAE VAT codes & calculator",
    icon: Receipt,
    activeBg: "bg-violet-500/10",
    activeColor: "text-violet-600 dark:text-violet-400",
  },
  {
    value: "dimensions",
    label: "Dimensions",
    description: "Analytical dimensions",
    icon: Layers,
    activeBg: "bg-blue-500/10",
    activeColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "posting-rules",
    label: "Posting Rules",
    description: "GL enforcement rules",
    icon: ShieldAlert,
    activeBg: "bg-rose-500/10",
    activeColor: "text-rose-600 dark:text-rose-400",
  },
] as const;


export function ChartOfAccountsPage() {
  const {
    accounts,
    flatTree,
    headerAccounts,
    postingAccounts,
    stats,
    hasChildren,
    addAccount,
    updateAccount,
    deleteAccount,
    accountExists,
  } = useChartOfAccounts();

  const {
    taxCodes,
    stats: taxStats,
    addTaxCode,
    updateTaxCode,
    deleteTaxCode,
    calculateVat,
  } = useTaxEngine();

  // ── Dialog State ─────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<GLAccount | null>(null);
  const [deleteConfirmAccount, setDeleteConfirmAccount] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState("accounts");

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddNew = () => {
    setEditingAccount(null);
    setFormOpen(true);
  };

  const handleEdit = (account: GLAccount) => {
    setEditingAccount(account);
    setFormOpen(true);
  };

  const handleSave = (data: GLAccountFormValues) => {
    if (editingAccount) {
      const result = updateAccount(editingAccount.accountNumber, data);
      if (result.success) {
        toast.success("Account updated", {
          description: `${data.accountNumber} — ${data.accountName}`,
        });
      } else {
        toast.error("Update failed", { description: result.error });
      }
    } else {
      const result = addAccount(data as GLAccount);
      if (result.success) {
        toast.success("Account created", {
          description: `${data.accountNumber} — ${data.accountName}`,
        });
      } else {
        toast.error("Creation failed", { description: result.error });
      }
    }
  };

  const handleDelete = (accountNumber: string) => {
    setDeleteConfirmAccount(accountNumber);
  };

  const confirmDelete = () => {
    if (!deleteConfirmAccount) return;
    const account = accounts.find(
      (a) => a.accountNumber === deleteConfirmAccount,
    );
    const result = deleteAccount(deleteConfirmAccount);
    if (result.success) {
      toast.success("Account deleted", {
        description: `${account?.accountNumber} — ${account?.accountName}`,
      });
    } else {
      toast.error("Delete failed", { description: result.error });
    }
    setDeleteConfirmAccount(null);
  };

  const kpiCards = [
    {
      label: "Total Accounts",
      value: stats.total,
      icon: BookOpen,
      accent: "border-l-primary",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Header Accounts",
      value: stats.header,
      icon: Layers,
      accent: "border-l-slate-500",
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-500/10",
    },
    {
      label: "Posting Accounts",
      value: stats.posting,
      icon: BarChart3,
      accent: "border-l-emerald-500",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Active Tax Codes",
      value: taxStats.active,
      icon: Receipt,
      accent: "border-l-violet-500",
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Accounting &rsaquo; General Ledger &rsaquo; Chart of Accounts
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Chart of Accounts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your GL account structure, tax codes, and posting rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleAddNew}>
            <Plus className="h-3.5 w-3.5" />
            New Account
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border bg-card p-5 border-l-4 ${card.accent}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {card.label}
              </p>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${card.bgColor}`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Sidebar + Content Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left Sidebar Navigation ── */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-4">
            <nav className="flex lg:flex-col w-full bg-card rounded-xl border border-border/60 p-2 overflow-x-auto lg:overflow-x-visible gap-1">
              {COA_NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group whitespace-nowrap",
                      isActive
                        ? "bg-primary/8 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors",
                        isActive
                          ? `${item.activeBg} ${item.activeColor}`
                          : "bg-muted/50 text-muted-foreground group-hover:bg-muted",
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div className="hidden lg:block min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-foreground" : "",
                        )}
                      >
                        {item.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="hidden lg:block ml-auto w-1.5 h-6 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-border/60 bg-card p-6 md:p-8 shadow-sm">
            {activeTab === "accounts" && (
              <AccountTreeView
                flatTree={flatTree}
                onEdit={handleEdit}
                onDelete={handleDelete}
                hasChildren={hasChildren}
              />
            )}

            {activeTab === "tax-engine" && (
              <TaxEnginePanel
                taxCodes={taxCodes}
                postingAccounts={postingAccounts}
                onAdd={addTaxCode}
                onUpdate={updateTaxCode}
                onDelete={deleteTaxCode}
                calculateVat={calculateVat}
              />
            )}

            {activeTab === "dimensions" && (
              <DimensionsPanel accounts={accounts} />
            )}

            {activeTab === "posting-rules" && <GLPostingRules />}
          </div>
        </div>
      </div>

      {/* ── Account Form Dialog ── */}
      <AccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editAccount={editingAccount}
        headerAccounts={headerAccounts}
        onSave={handleSave}
        accountExists={accountExists}
      />

      {/* ── Delete Confirmation ── */}
      <ConfirmDialog
        open={!!deleteConfirmAccount}
        onOpenChange={() => setDeleteConfirmAccount(null)}
        title="Delete Account"
        description={`Are you sure you want to delete account ${deleteConfirmAccount}? This action cannot be undone.`}
        confirmLabel="Delete Account"
        destructive
        onConfirm={confirmDelete}
        icon={<Trash2 className="w-6 h-6 text-destructive" />}
      />
    </div>
  );
}

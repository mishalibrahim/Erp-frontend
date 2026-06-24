import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ClipboardCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type CompanyListItem } from "../api/companySetupApi";
import { RequirePermission } from "@/components/shared/RequirePermission";
import { useGetCompanies, useDeleteCompany } from "../hooks/useCompanySetup";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: CompanyListItem["status"] }) => {
  const config = {
    Active: {
      label: "Active",
      icon: CheckCircle2,
      className:
        "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    },
    Draft: {
      label: "Draft",
      icon: Clock,
      className:
        "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25",
    },
    Inactive: {
      label: "Inactive",
      icon: XCircle,
      className: "bg-muted text-muted-foreground border-border",
    },
  }[status] ?? {
    label: status,
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  };

  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        config.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
const DeleteDialog = ({
  company,
  onConfirm,
  onCancel,
}: {
  company: CompanyListItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Dialog open={!!company} onOpenChange={(open) => !open && onCancel()}>
    <DialogContent className="max-w-sm p-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Delete Company?
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">
              {company?.companyName}
            </span>{" "}
            will be permanently removed. This action cannot be undone.
          </p>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
      <Building2 className="h-8 w-8 text-primary" />
    </div>
    <h3 className="text-base font-semibold text-foreground">
      No companies yet
    </h3>
    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
      Get started by adding your first tenant company. You can configure it step
      by step.
    </p>
    <Button className="mt-5 gap-2" onClick={onAdd}>
      <Plus className="h-4 w-4" />
      Add First Company
    </Button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const TenantListPage = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading, refetch } = useGetCompanies();
  const deleteCompanyMutation = useDeleteCompany();
  const [searchQuery, setSearchQuery] = useState("");
  const [toDelete, setToDelete] = useState<CompanyListItem | null>(null);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCompanyMutation.mutateAsync(toDelete.id);
      toast.success(`${toDelete.companyName} has been deleted.`);
      setToDelete(null);
      refetch();
    } catch {
      toast.error("Failed to delete company");
    }
  };

  const handleEdit = (company: CompanyListItem) => {
    // Navigate to step-1 with the draftId so user can edit from the beginning
    navigate(`/settings/company-setup/wizard/step-1?draftId=${company.id}`);
  };

  const handleCompleteDraft = (company: CompanyListItem) => {
    // Navigate to the first incomplete step — for simplicity, start at step-2
    // since Basic Info (step-1) was already done when draft was created
    navigate(`/settings/company-setup/wizard/step-2?draftId=${company.id}`);
  };

  const handleAddNew = () => {
    navigate("/settings/company-setup/wizard/step-1");
  };

  const filtered = companies.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tradeName ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCnt = companies.filter((c) => c.status === "Active").length;
  const draftCnt = companies.filter((c) => c.status === "Draft").length;

  return (
    <div className="space-y-5">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Settings › Company Setup
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
            Companies & Tenants
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all company tenants in your ERP system.
          </p>
        </div>
        <RequirePermission module="CompanySetup" action="Create">
          <Button className="gap-2 w-full sm:w-auto" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </RequirePermission>
      </div>

      {/* ── Summary KPIs ─────────────────────────────── */}
      {companies.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: companies.length,
              color: "text-foreground",
            },
            { label: "Active", value: activeCnt, color: "text-emerald-500" },
            { label: "Drafts", value: draftCnt, color: "text-amber-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-3 sm:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={cn("text-xl sm:text-2xl font-bold mt-1", stat.color)}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Content card ─────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        {companies.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center px-4 py-3 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or code…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-1.5 text-muted-foreground self-end sm:self-auto"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && companies.length === 0 && (
          <EmptyState onAdd={handleAddNew} />
        )}

        {/* ── Mobile: Card list (< md) ─────────────────── */}
        {!isLoading && companies.length > 0 && (
          <div className="md:hidden divide-y divide-border">
            {filtered.length === 0 ? (
              <p className="text-center py-10 text-sm text-muted-foreground">
                No companies match your search.
              </p>
            ) : (
              filtered.map((company) => (
                <div key={company.id} className="p-4">
                  {/* Top row: avatar + name + status + menu */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      {company.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground leading-tight truncate">
                          {company.companyName}
                        </p>
                        <StatusBadge status={company.status} />
                      </div>
                      {company.tradeName && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {company.tradeName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 ml-13 pl-[52px]">
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {company.companyCode}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {company.licenseNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {company.emirate ? `${company.emirate}, ` : ""}
                      {company.country}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex gap-2 pl-[52px]">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 h-8 text-xs flex-1"
                      onClick={() => handleEdit(company)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    {company.status === "Draft" && (
                      <Button
                        size="sm"
                        className="gap-1.5 h-8 text-xs flex-1"
                        onClick={() => handleCompleteDraft(company)}
                      >
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setToDelete(company)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Desktop: Table (md+) ──────────────────────── */}
        {!isLoading && companies.length > 0 && (
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-semibold text-muted-foreground pl-5">
                  Company
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">
                  Code
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">
                  License No.
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">
                  Country
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground text-sm"
                  >
                    No companies match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((company) => (
                  <TableRow key={company.id} className="group">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          {company.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-none">
                            {company.companyName}
                          </p>
                          {company.tradeName && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {company.tradeName}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {company.companyCode}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {company.licenseNumber}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {company.emirate
                        ? `${company.emirate}, ${company.country}`
                        : company.country}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={company.status} />
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <RequirePermission module="CompanySetup" action="Update">
                            <DropdownMenuItem onClick={() => handleEdit(company)}>
                              <Pencil className="h-4 w-4" />
                              Edit Company
                            </DropdownMenuItem>
                            {company.status === "Draft" && (
                              <DropdownMenuItem
                                onClick={() => handleCompleteDraft(company)}
                              >
                                <ClipboardCheck className="h-4 w-4" />
                                Complete Setup
                              </DropdownMenuItem>
                            )}
                          </RequirePermission>
                          <RequirePermission module="CompanySetup" action="Delete">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setToDelete(company)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </RequirePermission>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Delete Confirm ──────────────────────────── */}
      <DeleteDialog
        company={toDelete}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

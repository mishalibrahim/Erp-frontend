import { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ClientDataTable } from "@/components/shared/data-table/ClientDataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useGetJournalEntries, useDeleteJournalVoucher } from "../hooks/useJournalEntries";
import type { JournalVoucherDto } from "../types";
import { formatAmount } from "../../general-ledger/utils/glCalculations";

interface VoucherInquiriesListProps {
  onViewVoucher: (id: string) => void;
}

export function VoucherInquiriesList({ onViewVoucher }: VoucherInquiriesListProps) {
  const { data: vouchers = [], isLoading } = useGetJournalEntries();
  const deleteMutation = useDeleteJournalVoucher();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVoucherToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!voucherToDelete) return;
    try {
      await deleteMutation.mutateAsync(voucherToDelete);
      toast.success("Journal Voucher deleted successfully!");
      setDeleteConfirmOpen(false);
      setVoucherToDelete(null);
    } catch {
      toast.error("Failed to delete Journal Voucher");
    }
  };

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      const matchesType = typeFilter === "all" || v.journalType === typeFilter;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        v.voucherNo.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.journalName.toLowerCase().includes(query);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [vouchers, statusFilter, typeFilter, searchQuery]);

  const columns = useMemo<ColumnDef<JournalVoucherDto>[]>(
    () => [
      {
        accessorKey: "voucherNo",
        header: "Voucher No.",
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-foreground">
            {row.original.voucherNo}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          const d = new Date(row.original.date);
          return isNaN(d.getTime()) ? "—" : format(d, "dd MMM yyyy");
        },
      },
      {
        accessorKey: "journalName",
        header: "Journal Name",
      },
      {
        accessorKey: "journalType",
        header: "Type",
        cell: ({ row }) => (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border">
            {row.original.journalType}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Narration/Description",
        cell: ({ row }) => (
          <span className="truncate max-w-[250px] block" title={row.original.description}>
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">
            {row.original.currency}
          </span>
        ),
      },
      {
        id: "totalAmount",
        header: "Amount",
        cell: ({ row }) => {
          // Debit sum
          const sum = row.original.lines.reduce((s, l) => s + l.debit, 0);
          if (row.original.currency !== "AED") {
            const baseAmount = sum * row.original.exchangeRate;
            return (
              <div className="flex flex-col text-right pr-4">
                <span className="font-semibold text-sm tabular-nums">
                  {row.original.currency} {sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  (AED {formatAmount(baseAmount)})
                </span>
              </div>
            );
          }
          return (
            <div className="text-right pr-4 font-semibold text-sm tabular-nums">
              AED {formatAmount(sum)}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let badgeStyle = "";
          switch (status) {
            case "Draft":
              badgeStyle = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
              break;
            case "Pending Approval":
              badgeStyle = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50";
              break;
            case "Approved":
              badgeStyle = "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/50";
              break;
            case "Posted":
              badgeStyle = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50";
              break;
            case "Rejected":
              badgeStyle = "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/50";
              break;
            case "Reversed":
              badgeStyle = "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/50";
              break;
          }
          return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:bg-muted"
              onClick={() => onViewVoucher(row.original.id)}
              title="View/Edit Voucher"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {(row.original.status === "Draft" || row.original.status === "Rejected") && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={(e) => handleDeleteClick(row.original.id, e)}
                title="Delete Draft"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [deleteMutation.isPending]
  );

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Search by Voucher No., description, or journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Dropdown */}
          <div className="flex-1 sm:flex-none">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] text-sm">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Posted">Posted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Dropdown */}
          <div className="flex-1 sm:flex-none">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px] text-sm">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Adjusting">Adjusting</SelectItem>
                <SelectItem value="Accrual">Accrual</SelectItem>
                <SelectItem value="Reversing">Reversing</SelectItem>
                <SelectItem value="Opening">Opening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center border rounded-md bg-card/50">
          <p className="text-muted-foreground animate-pulse">Loading journal inquiries...</p>
        </div>
      ) : (
        <div className="border rounded-md bg-card">
          <ClientDataTable
            columns={columns}
            data={filteredVouchers}
            searchKey="voucherNo"
            searchPlaceholder="Search vouchers..."
          />
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Journal Voucher Draft"
        description="Are you sure you want to delete this draft? This action is permanent and cannot be undone."
        confirmLabel="Delete Draft"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

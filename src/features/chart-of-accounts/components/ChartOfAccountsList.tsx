import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ClientDataTable } from "@/components/shared/data-table/ClientDataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ChartOfAccountsForm } from "./ChartOfAccountsForm";
import { useGetAccountTree, useCreateAccount, useUpdateAccount, useDeleteAccount } from "../hooks/useChartOfAccounts";
import {
  type GlAccountDto,
  getGlAccountCategoryLabel,
  getGlAccountTypeLabel,
  getGlPostingTypeLabel,
} from "../types";

export function ChartOfAccountsList() {
  const { data = [], isLoading } = useGetAccountTree();
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<GlAccountDto | null>(null);
  
  // Delete Confirmation State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setAccountToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (account: GlAccountDto) => {
    setAccountToEdit(account);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAccountToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      await deleteAccountMutation.mutateAsync(accountToDelete);
      toast.success("Account deactivated successfully");
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch {
      toast.error("Failed to deactivate account");
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (accountToEdit) {
        await updateAccountMutation.mutateAsync({ id: accountToEdit.id, data: formData });
        toast.success("Account updated successfully");
      } else {
        await createAccountMutation.mutateAsync(formData);
        toast.success("Account created successfully");
      }
      setIsFormOpen(false);
    } catch (error: any) {
      // Show backend error if available, else generic error handled by interceptor
      if (error.response?.status === 400) {
        toast.error("Account Number may already exist.");
      }
    }
  };

  const columns = useMemo<ColumnDef<GlAccountDto>[]>(
    () => [
      {
        accessorKey: "accountNumber",
        header: "Account No.",
        cell: ({ row }) => (
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${row.depth * 1.5}rem` }}
          >
            {row.getCanExpand() ? (
              <button
                className="cursor-pointer"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <span className="w-4" /> // placeholder for alignment
            )}
            <span className="font-medium">{row.original.accountNumber}</span>
          </div>
        ),
      },
      {
        accessorKey: "accountName",
        header: "Account Name",
      },
      {
        accessorKey: "accountCategory",
        header: "Category",
        cell: ({ row }) => getGlAccountCategoryLabel(row.original.accountCategory),
      },
      {
        accessorKey: "accountType",
        header: "Type",
        cell: ({ row }) => getGlAccountTypeLabel(row.original.accountType),
      },
      {
        accessorKey: "postingType",
        header: "Posting",
        cell: ({ row }) => getGlPostingTypeLabel(row.original.postingType),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleEdit(row.original)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            {row.original.isActive && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chart of Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your General Ledger accounts and their configurations.
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center border rounded-md bg-card/50">
          <p className="text-muted-foreground animate-pulse">Loading accounts...</p>
        </div>
      ) : (
        <ClientDataTable
          columns={columns}
          data={data}
          searchKey="accountName"
          searchPlaceholder="Search accounts by name or number..."
        />
      )}

      <ChartOfAccountsForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        accountToEdit={accountToEdit}
        onSubmit={handleFormSubmit}
        isLoading={createAccountMutation.isPending || updateAccountMutation.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Deactivate Account"
        description="Are you sure you want to deactivate this account? It will no longer be available for new transactions."
        confirmLabel="Deactivate"
        destructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

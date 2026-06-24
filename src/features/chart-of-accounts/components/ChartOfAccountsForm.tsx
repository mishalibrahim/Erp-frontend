import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/hook-form/Form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import {
  GlAccountCategory,
  GlAccountType,
  GlPostingType,
  type GlAccountDto,
} from "../types";
import {
  createGlAccountSchema,
  updateGlAccountSchema,
} from "../schemas/chartOfAccountsSchema";
import { useGetAccounts, useGetNextNumber } from "../hooks/useChartOfAccounts";

interface ChartOfAccountsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountToEdit: GlAccountDto | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

const categoryOptions = [
  { label: "Asset", value: GlAccountCategory.Asset.toString() },
  { label: "Liability", value: GlAccountCategory.Liability.toString() },
  { label: "Equity", value: GlAccountCategory.Equity.toString() },
  { label: "Income", value: GlAccountCategory.Income.toString() },
  { label: "Expense", value: GlAccountCategory.Expense.toString() },
];

const typeOptions = [
  { label: "Ledger", value: GlAccountType.Ledger.toString() },
  { label: "Customer", value: GlAccountType.Customer.toString() },
  { label: "Vendor", value: GlAccountType.Vendor.toString() },
];

const postingOptions = [
  { label: "Header", value: GlPostingType.Header.toString() },
  { label: "Posting", value: GlPostingType.Posting.toString() },
];

export function ChartOfAccountsForm({
  open,
  onOpenChange,
  accountToEdit,
  onSubmit,
  isLoading,
}: ChartOfAccountsFormProps) {
  const isEditing = !!accountToEdit;

  const defaultValues = {
    accountNumber: "",
    accountName: "",
    accountCategory: GlAccountCategory.Asset.toString(),
    accountType: GlAccountType.Ledger.toString(),
    postingType: GlPostingType.Posting.toString(),
    allowManualEntry: true,
    mandatoryDimensions: false,
    parentAccountId: "none",
    isActive: true,
  };

  const methods = useForm<any>({
    resolver: zodResolver(
      isEditing ? updateGlAccountSchema : createGlAccountSchema
    ),
    defaultValues,
  });

  const { data: allAccounts = [] } = useGetAccounts();
  
  const parentOptions = useMemo(() => {
    return [
      { label: "None (Root level)", value: "none" },
      ...allAccounts
        // We can show all accounts as potential parents, except the account itself if editing
        .filter((a) => a.id !== accountToEdit?.id)
        .map((a) => ({
          label: `${a.accountNumber} - ${a.accountName}`,
          value: a.id,
        })),
    ];
  }, [allAccounts, accountToEdit]);

  // Watch for auto-numbering
  const watchedCategory = useWatch({ control: methods.control, name: "accountCategory" });
  const watchedParent = useWatch({ control: methods.control, name: "parentAccountId" });

  const categoryNum = watchedCategory ? parseInt(watchedCategory, 10) : undefined;
  const parentIdStr = watchedParent === "none" || !watchedParent ? undefined : watchedParent;

  const { data: nextNumber, isFetching: fetchingNumber } = useGetNextNumber(
    categoryNum,
    parentIdStr
  );

  useEffect(() => {
    if (!isEditing && nextNumber) {
      methods.setValue("accountNumber", nextNumber, { shouldValidate: true });
    }
  }, [nextNumber, isEditing, methods]);

  useEffect(() => {
    if (accountToEdit && open) {
      methods.reset({
        accountNumber: accountToEdit.accountNumber,
        accountName: accountToEdit.accountName,
        accountCategory: accountToEdit.accountCategory.toString(),
        accountType: accountToEdit.accountType.toString(),
        postingType: accountToEdit.postingType.toString(),
        allowManualEntry: accountToEdit.allowManualEntry,
        mandatoryDimensions: accountToEdit.mandatoryDimensions,
        isActive: accountToEdit.isActive,
      });
    } else if (!open) {
      methods.reset(defaultValues);
    }
  }, [accountToEdit, open, methods]);

  const handleSubmit = async (data: any) => {
    // For editing, accountNumber is excluded from Zod and DTO
    const payload = {
      ...data,
      parentAccountId: data.parentAccountId === "none" ? null : data.parentAccountId,
    };
    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Account" : "Add New Account"}
          </DialogTitle>
        </DialogHeader>

        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {!isEditing && (
              <div className="space-y-1">
                <FormInput
                  name="accountNumber"
                  label="Account Number"
                  placeholder={fetchingNumber ? "Generating..." : "e.g. 1000"}
                  disabled={fetchingNumber}
                />
                <p className="text-[10px] text-muted-foreground ml-1">
                  Auto-generated based on Category & Parent Account.
                </p>
              </div>
            )}
            
            <FormInput
              name="accountName"
              label="Account Name"
              placeholder="e.g. Cash in Bank"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                name="accountCategory"
                label="Category"
                options={categoryOptions}
              />
              <FormSelect
                name="accountType"
                label="Type"
                options={typeOptions}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                name="parentAccountId"
                label="Parent Account"
                options={parentOptions}
              />
              <FormSelect
                name="postingType"
                label="Posting Type"
                options={postingOptions}
              />
            </div>

            <div className="space-y-3 pt-2">
              <FormSwitch
                name="allowManualEntry"
                label="Allow Manual Entry"
                description="Can this account be selected in manual journal entries?"
              />
              <FormSwitch
                name="mandatoryDimensions"
                label="Mandatory Dimensions"
                description="Require cost centers or projects when posting."
              />
              {isEditing && (
                <FormSwitch
                  name="isActive"
                  label="Active Status"
                  description="Inactive accounts cannot receive new postings."
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Account"}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

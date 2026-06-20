import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  glAccountSchema,
  getCategoryFromAccountNumber,
  type GLAccount,
  type GLAccountFormValues,
} from "../types";
import {
  ACCOUNT_TYPE_OPTIONS,
  POSTING_TYPE_OPTIONS,
  ACCOUNT_CATEGORY_CONFIG,
  DIMENSION_TYPE_OPTIONS,
} from "../constants";

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAccount: GLAccount | null;
  headerAccounts: GLAccount[];
  onSave: (account: GLAccountFormValues) => void;
  accountExists: (accountNumber: string) => boolean;
}

export function AccountFormDialog({
  open,
  onOpenChange,
  editAccount,
  headerAccounts,
  onSave,
  accountExists,
}: AccountFormDialogProps) {
  const isEditing = !!editAccount;

  const form = useForm<GLAccountFormValues>({
    resolver: zodResolver(glAccountSchema),
    defaultValues: {
      accountNumber: "",
      accountName: "",
      accountType: "ledger",
      accountCategory: "asset",
      postingType: "posting",
      parentAccountNumber: null,
      allowManualEntry: true,
      mandatoryDimensions: false,
      linkedDimensions: [],
      isActive: true,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const watchedNumber = watch("accountNumber");
  const watchedPostingType = watch("postingType");
  const watchedMandatoryDimensions = watch("mandatoryDimensions");

  // Auto-detect category from account number
  useEffect(() => {
    if (watchedNumber?.length === 6) {
      const category = getCategoryFromAccountNumber(watchedNumber);
      if (category) {
        setValue("accountCategory", category);
      }
    }
  }, [watchedNumber, setValue]);

  // Header accounts cannot allow manual entry
  useEffect(() => {
    if (watchedPostingType === "header") {
      setValue("allowManualEntry", false);
    }
  }, [watchedPostingType, setValue]);

  // Reset form when dialog opens/closes or edit account changes
  useEffect(() => {
    if (open) {
      if (editAccount) {
        reset({
          accountNumber: editAccount.accountNumber,
          accountName: editAccount.accountName,
          accountType: editAccount.accountType,
          accountCategory: editAccount.accountCategory,
          postingType: editAccount.postingType,
          parentAccountNumber: editAccount.parentAccountNumber,
          allowManualEntry: editAccount.allowManualEntry,
          mandatoryDimensions: editAccount.mandatoryDimensions,
          linkedDimensions: editAccount.linkedDimensions,
          isActive: editAccount.isActive,
        });
      } else {
        reset({
          accountNumber: "",
          accountName: "",
          accountType: "ledger",
          accountCategory: "asset",
          postingType: "posting",
          parentAccountNumber: null,
          allowManualEntry: true,
          mandatoryDimensions: false,
          linkedDimensions: [],
          isActive: true,
        });
      }
    }
  }, [open, editAccount, reset]);

  const onSubmit = (data: GLAccountFormValues) => {
    // Check uniqueness on create
    if (!isEditing && accountExists(data.accountNumber)) {
      form.setError("accountNumber", {
        message: `Account ${data.accountNumber} already exists`,
      });
      return;
    }
    onSave(data);
    onOpenChange(false);
  };

  // Detect the category config for the badge display
  const detectedCategory = getCategoryFromAccountNumber(watchedNumber || "");
  const categoryConfig = detectedCategory
    ? ACCOUNT_CATEGORY_CONFIG.find((c) => c.value === detectedCategory)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit GL Account" : "New GL Account"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Editing account ${editAccount.accountNumber}`
              : "Create a new account in the chart of accounts"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ── Account Number + Category Badge ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="accountNumber"
                className={cn(
                  "text-sm font-medium",
                  errors.accountNumber && "text-destructive",
                )}
              >
                Account Number
              </Label>
              <Input
                id="accountNumber"
                placeholder="e.g. 111000"
                maxLength={6}
                disabled={isEditing}
                className={cn(
                  "h-10 font-mono",
                  errors.accountNumber &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                {...register("accountNumber")}
              />
              {errors.accountNumber && (
                <p className="text-xs text-destructive">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Category (auto)</Label>
              <div className="h-10 flex items-center">
                {categoryConfig ? (
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border",
                      categoryConfig.badgeColor,
                    )}
                  >
                    {categoryConfig.label} ({categoryConfig.range})
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Enter a 6-digit account number
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Account Name ── */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="accountName"
              className={cn(
                "text-sm font-medium",
                errors.accountName && "text-destructive",
              )}
            >
              Account Name
            </Label>
            <Input
              id="accountName"
              placeholder="e.g. Cash, Bank, Accounts Receivable"
              className={cn(
                "h-10",
                errors.accountName &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              {...register("accountName")}
            />
            {errors.accountName && (
              <p className="text-xs text-destructive">
                {errors.accountName.message}
              </p>
            )}
          </div>

          {/* ── Account Type + Posting Type ── */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Account Type</Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="!h-10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="postingType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Posting Type</Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="!h-10">
                      <SelectValue placeholder="Select posting type" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSTING_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          {/* ── Parent Account ── */}
          <Controller
            name="parentAccountNumber"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">
                  Parent Account{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "__none__" ? null : val)
                  }
                  value={field.value ?? "__none__"}
                >
                  <SelectTrigger className="!h-10">
                    <SelectValue placeholder="No parent (root level)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="__none__">
                      No parent (root level)
                    </SelectItem>
                    {headerAccounts
                      .filter(
                        (h) =>
                          h.accountNumber !== editAccount?.accountNumber,
                      )
                      .map((h) => (
                        <SelectItem
                          key={h.accountNumber}
                          value={h.accountNumber}
                        >
                          {h.accountNumber} — {h.accountName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* ── Toggles ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Allow Manual Entry */}
            <Controller
              name="allowManualEntry"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => {
                    if (watchedPostingType !== "header") {
                      field.onChange(!field.value);
                    }
                  }}
                  disabled={watchedPostingType === "header"}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors text-left",
                    watchedPostingType === "header"
                      ? "opacity-50 cursor-not-allowed border-input bg-muted/20"
                      : field.value
                        ? "border-primary/40 bg-primary/5"
                        : "border-input bg-background hover:bg-muted/40",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">Allow Manual Entry</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {watchedPostingType === "header"
                        ? "Disabled for header accounts"
                        : "Allow direct journal entries"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors",
                      field.value && watchedPostingType !== "header"
                        ? "bg-primary"
                        : "bg-slate-300 dark:bg-slate-600",
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md transition-transform",
                        field.value && watchedPostingType !== "header"
                          ? "translate-x-4"
                          : "translate-x-0",
                      )}
                    />
                  </div>
                </button>
              )}
            />

            {/* Mandatory Dimensions */}
            <Controller
              name="mandatoryDimensions"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors text-left",
                    field.value
                      ? "border-violet-500/40 bg-violet-500/5"
                      : "border-input bg-background hover:bg-muted/40",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">Mandatory Dimensions</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Require dimension on every posting
                    </p>
                  </div>
                  <div
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors",
                      field.value
                        ? "bg-violet-500"
                        : "bg-slate-300 dark:bg-slate-600",
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md transition-transform",
                        field.value ? "translate-x-4" : "translate-x-0",
                      )}
                    />
                  </div>
                </button>
              )}
            />
          </div>

          {/* ── Dimension Links (shown when mandatory dimensions is on) ── */}
          {watchedMandatoryDimensions && (
            <Controller
              name="linkedDimensions"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Linked Dimensions
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIMENSION_TYPE_OPTIONS.map((dim) => {
                      const isChecked = field.value?.includes(dim.value);
                      return (
                        <button
                          key={dim.value}
                          type="button"
                          onClick={() => {
                            const current = field.value || [];
                            field.onChange(
                              isChecked
                                ? current.filter((d) => d !== dim.value)
                                : [...current, dim.value],
                            );
                          }}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                            isChecked
                              ? "border-violet-500/40 bg-violet-500/5"
                              : "border-input bg-background hover:bg-muted/40",
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center w-4 h-4 rounded border-2 transition-colors",
                              isChecked
                                ? "border-violet-500 bg-violet-500"
                                : "border-muted-foreground/40",
                            )}
                          >
                            {isChecked && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium">{dim.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            />
          )}

          {/* ── Footer ── */}
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Account" : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

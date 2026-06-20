import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Receipt,
  Plus,
  Pencil,
  Trash2,
  Calculator,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { taxCodeSchema, type TaxCode, type TaxCodeFormValues } from "../types";
import type { GLAccount } from "../types";
import { TAX_CODE_TYPE_OPTIONS } from "../constants";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface TaxEnginePanelProps {
  taxCodes: TaxCode[];
  postingAccounts: GLAccount[];
  onAdd: (taxCode: Omit<TaxCode, "id">) => { success: boolean; error?: string };
  onUpdate: (
    id: string,
    updates: Partial<TaxCode>,
  ) => { success: boolean; error?: string };
  onDelete: (id: string) => { success: boolean; error?: string };
  calculateVat: (
    amount: number,
    taxCodeId: string,
  ) => { net: number; vat: number; gross: number } | null;
}

export function TaxEnginePanel({
  taxCodes,
  postingAccounts,
  onAdd,
  onUpdate,
  onDelete,
  calculateVat,
}: TaxEnginePanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTaxCode, setEditingTaxCode] = useState<TaxCode | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // VAT Calculator state
  const [calcAmount, setCalcAmount] = useState<string>("");
  const [calcTaxCode, setCalcTaxCode] = useState<string>("");

  const calcResult =
    calcAmount && calcTaxCode
      ? calculateVat(parseFloat(calcAmount) || 0, calcTaxCode)
      : null;

  const handleEdit = (tc: TaxCode) => {
    setEditingTaxCode(tc);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">UAE VAT Tax Engine</h3>
            <p className="text-sm text-muted-foreground">
              Manage tax codes, map to GL accounts, and calculate VAT
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingTaxCode(null);
            setFormOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Tax Code
        </Button>
      </div>

      {/* ── Tax Codes Table ── */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/50 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <div className="col-span-1">Code</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-1 text-right">Rate</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Input VAT A/C</div>
          <div className="col-span-2">Output VAT A/C</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {taxCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No tax codes configured
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {taxCodes.map((tc) => {
              const inputAcc = postingAccounts.find(
                (a) => a.accountNumber === tc.inputVatAccount,
              );
              const outputAcc = postingAccounts.find(
                (a) => a.accountNumber === tc.outputVatAccount,
              );

              return (
                <div
                  key={tc.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/20 transition-colors group"
                >
                  <div className="col-span-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold font-mono">
                      {tc.code}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm font-medium">
                    {tc.name}
                  </div>
                  <div className="col-span-1 text-right text-sm font-semibold">
                    {tc.rate}%
                  </div>
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        tc.type === "input"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          : tc.type === "output"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20"
                            : "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/20",
                      )}
                    >
                      {tc.type === "input"
                        ? "Input VAT"
                        : tc.type === "output"
                          ? "Output VAT"
                          : "Exempt"}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground font-mono">
                    {inputAcc
                      ? `${inputAcc.accountNumber} – ${inputAcc.accountName}`
                      : tc.inputVatAccount || "—"}
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground font-mono">
                    {outputAcc
                      ? `${outputAcc.accountNumber} – ${outputAcc.accountName}`
                      : tc.outputVatAccount || "—"}
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold",
                        tc.isActive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-500/10 text-slate-400",
                      )}
                    >
                      {tc.isActive ? "✓" : "—"}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => handleEdit(tc)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteConfirm(tc.id)}
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

      {/* ── VAT Calculator ── */}
      <div className="rounded-xl border border-border/60 p-5 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-violet-500" />
          <h4 className="text-sm font-semibold">VAT Calculator</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Net Amount
            </Label>
            <Input
              id="vat-calc-amount"
              type="number"
              placeholder="0.00"
              value={calcAmount}
              onChange={(e) => setCalcAmount(e.target.value)}
              className="h-10 font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Tax Code
            </Label>
            <Select
              value={calcTaxCode}
              onValueChange={setCalcTaxCode}
            >
              <SelectTrigger className="!h-10">
                <SelectValue placeholder="Select tax code" />
              </SelectTrigger>
              <SelectContent>
                {taxCodes
                  .filter((tc) => tc.isActive)
                  .map((tc) => (
                    <SelectItem key={tc.id} value={tc.id}>
                      {tc.code} — {tc.name} ({tc.rate}%)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {calcResult && (
            <div className="flex items-center gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-2.5">
              <div className="text-center flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Net
                </p>
                <p className="text-sm font-bold font-mono">
                  {calcResult.net.toLocaleString("en-AE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <div className="text-center flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  VAT
                </p>
                <p className="text-sm font-bold font-mono text-violet-600 dark:text-violet-400">
                  {calcResult.vat.toLocaleString("en-AE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <div className="text-center flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Gross
                </p>
                <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {calcResult.gross.toLocaleString("en-AE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tax Code Form Dialog ── */}
      <TaxCodeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editTaxCode={editingTaxCode}
        postingAccounts={postingAccounts}
        onSave={(data) => {
          if (editingTaxCode) {
            onUpdate(editingTaxCode.id, data);
          } else {
            onAdd(data as Omit<TaxCode, "id">);
          }
          setFormOpen(false);
        }}
      />

      {/* ── Delete Confirmation ── */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        title="Delete Tax Code"
        description="This action cannot be undone. Are you sure you want to remove this tax code?"
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        icon={<Trash2 className="w-6 h-6 text-destructive" />}
      />
    </div>
  );
}

// ─── Tax Code Form Sub-Dialog ────────────────────────────────────────────────
function TaxCodeFormDialog({
  open,
  onOpenChange,
  editTaxCode,
  postingAccounts,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTaxCode: TaxCode | null;
  postingAccounts: GLAccount[];
  onSave: (data: TaxCodeFormValues) => void;
}) {
  const isEditing = !!editTaxCode;

  const form = useForm<TaxCodeFormValues>({
    resolver: zodResolver(taxCodeSchema),
    defaultValues: {
      code: "",
      name: "",
      rate: 0,
      type: "output",
      inputVatAccount: "",
      outputVatAccount: "",
      isActive: true,
    },
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  // Reset on open
  useState(() => {
    if (open && editTaxCode) {
      reset({
        code: editTaxCode.code,
        name: editTaxCode.name,
        rate: editTaxCode.rate,
        type: editTaxCode.type,
        inputVatAccount: editTaxCode.inputVatAccount,
        outputVatAccount: editTaxCode.outputVatAccount,
        isActive: editTaxCode.isActive,
      });
    } else if (open) {
      reset({
        code: "",
        name: "",
        rate: 0,
        type: "output",
        inputVatAccount: "",
        outputVatAccount: "",
        isActive: true,
      });
    }
  });

  // Also watch for changes to editTaxCode / open
  // We use a workaround with useEffect-like behavior in the parent
  // by passing key={editTaxCode?.id} when rendering

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={editTaxCode?.id ?? "new"}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Tax Code" : "New Tax Code"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Editing ${editTaxCode.code}`
              : "Configure a new VAT tax code"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-sm font-medium", errors.code && "text-destructive")}>
                Tax Code
              </Label>
              <Input
                id="tax-code"
                placeholder="e.g. SR"
                className={cn("h-10 font-mono uppercase", errors.code && "border-destructive")}
                {...register("code")}
              />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-sm font-medium", errors.name && "text-destructive")}>
                Tax Name
              </Label>
              <Input
                id="tax-name"
                placeholder="e.g. Standard Rate"
                className={cn("h-10", errors.name && "border-destructive")}
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                placeholder="5"
                className="h-10 font-mono"
                {...register("rate")}
              />
            </div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Type</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="!h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAX_CODE_TYPE_OPTIONS.map((opt) => (
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

          <Controller
            name="inputVatAccount"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Input VAT GL Account</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="!h-10">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="">None</SelectItem>
                    {postingAccounts.map((a) => (
                      <SelectItem key={a.accountNumber} value={a.accountNumber}>
                        {a.accountNumber} — {a.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            name="outputVatAccount"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Output VAT GL Account</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="!h-10">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="">None</SelectItem>
                    {postingAccounts.map((a) => (
                      <SelectItem key={a.accountNumber} value={a.accountNumber}>
                        {a.accountNumber} — {a.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

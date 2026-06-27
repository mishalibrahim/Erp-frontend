import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Save,
  Send,
  Plus,
  Trash2,
  Check,
  X,
  Play,
  Printer,
  ChevronUp,
  ChevronDown,
  Paperclip,
  Trash,
  CornerUpLeft,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/hook-form/Form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { VoucherSimulationDialog } from "./VoucherSimulationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Hooks & Service Layers
import { useGetAccounts } from "@/features/chart-of-accounts/hooks/useChartOfAccounts";
import {
  useGetJournalEntry,
  useSaveJournalVoucher,
  useDeleteJournalVoucher,
  useValidateJournalVoucher,
  useSimulateJournalVoucher,
  useSendForApproval,
  useApproveJournalVoucher,
  useRejectJournalVoucher,
  usePostJournalVoucher,
  useReverseJournalVoucher,
  useAddAttachment,
  useRemoveAttachment,
} from "../hooks/useJournalEntries";
import { createJournalVoucherSchema } from "../schemas/journalEntrySchemas";
import type { JournalVoucherDto, CreateJournalVoucherDto } from "../types";
// import { MOCK_TEMPLATES } from "../api/journalEntriesApi";
import { formatAmount } from "../../general-ledger/utils/glCalculations";

const MOCK_TEMPLATES = [
  {
    name: "General Journal Default",
    journalType: "General" as const,
    currency: "AED",
    description: "Monthly adjustments",
    lines: [
      { accountType: "Ledger" as const, accountNumber: "110100", debit: 0, credit: 0 },
      { accountType: "Ledger" as const, accountNumber: "510400", debit: 0, credit: 0 },
    ],
  },
  {
    name: "Rent Expense Accrual",
    journalType: "Accrual" as const,
    currency: "AED",
    description: "Accrued rent for the month",
    lines: [
      { accountType: "Ledger" as const, accountNumber: "510200", debit: 12000, credit: 0 },
      { accountType: "Ledger" as const, accountNumber: "210200", debit: 0, credit: 12000 },
    ],
  },
  {
    name: "Office Supplies Adjustment",
    journalType: "Adjusting" as const,
    currency: "AED",
    description: "Office supplies adjustment",
    lines: [
      { accountType: "Ledger" as const, accountNumber: "510400", debit: 850, credit: 0 },
      { accountType: "Ledger" as const, accountNumber: "110100", debit: 0, credit: 850 },
    ],
  },
];

interface JournalVoucherFormProps {
  voucherId: string | null;
  onCancel: () => void;
  onNew: () => void;
}

export function JournalVoucherForm({ voucherId, onCancel, onNew }: JournalVoucherFormProps) {
  // Query for existing voucher
  const { data: voucher, isLoading: isVoucherLoading } = useGetJournalEntry(voucherId || "");

  // Master lists
  const { data: glAccounts = [] } = useGetAccounts();

  // Mutations
  const saveMutation = useSaveJournalVoucher();
  const validateMutation = useValidateJournalVoucher();
  const simulateMutation = useSimulateJournalVoucher();
  const sendApprovalMutation = useSendForApproval();
  const approveMutation = useApproveJournalVoucher();
  const rejectMutation = useRejectJournalVoucher();
  const postMutation = usePostJournalVoucher();
  const reverseMutation = useReverseJournalVoucher();
  const addAttachMutation = useAddAttachment();
  const removeAttachMutation = useRemoveAttachment();
  const deleteMutation = useDeleteJournalVoucher();

  // Component UI States
  const [testingRole, setTestingRole] = useState<string>("Finance Review");
  const [linesView, setLinesView] = useState<"standard" | "compact">("compact");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [isLinesExpanded, setIsLinesExpanded] = useState(true);
  const [isAttachmentsExpanded, setIsAttachmentsExpanded] = useState(true);
  const [showSimDialog, setShowSimDialog] = useState(false);
  const [simData, setSimData] = useState<any[] | null>(null);

  // Validation results modal state
  const [validationResult, setValidationResult] = useState<{
    open: boolean;
    success: boolean;
    errors: string[];
  } | null>(null);

  // Map options
  const journalNameOptions = [
    { label: "General Journal (GenJrn-2026)", value: "GenJrn-2026" },
    { label: "Adjusting Journal (AdjJrn-2026)", value: "AdjJrn-2026" },
    { label: "Accrual Journal (AccrualJrn)", value: "AccrualJrn" },
  ];

  const typeOptions = [
    { label: "General Ledger Entry", value: "General" },
    { label: "Adjusting Entry", value: "Adjusting" },
    { label: "Accrual Entry", value: "Accrual" },
    { label: "Reversing Entry", value: "Reversing" },
    { label: "Opening Balance Entry", value: "Opening" },
  ];

  const currencyOptions = [
    { label: "AED - United Arab Emirates Dirham (Base)", value: "AED" },
    { label: "USD - United States Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - Great British Pound", value: "GBP" },
  ];

  const ccOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Passport Services", value: "Passport Services" },
    { label: "Travel & Tourism", value: "Travel & Tourism" },
    { label: "Business Lounge", value: "Business Lounge" },
  ];

  const deptOptions = [
    { label: "Finance", value: "Finance" },
    { label: "Operations", value: "Operations" },
    { label: "HR", value: "HR" },
  ];

  const accountTypeOptions = [
    { label: "Ledger", value: "Ledger" },
    { label: "Customer", value: "Customer" },
    { label: "Vendor", value: "Vendor" },
    { label: "Bank", value: "Bank" },
  ];

  // Sub-ledger selections
  const customerOptions = [
    { label: "CUST-001 - Al Futtaim Group", value: "c1" },
    { label: "CUST-002 - Majid Al Futtaim", value: "c2" },
    { label: "CUST-003 - Emirates Group", value: "c3" },
  ];
  const vendorOptions = [
    { label: "VEND-001 - Oracle Gulf LLC", value: "v1" },
    { label: "VEND-002 - Microsoft Gulf", value: "v2" },
    { label: "VEND-003 - US Marketing Consultants", value: "v3" },
  ];
  const bankOptions = [
    { label: "BANK-001 - Emirates NBD Current", value: "b1" },
    { label: "BANK-002 - Abu Dhabi Commercial Bank", value: "b2" },
    { label: "BANK-003 - HSBC Savings Account", value: "b3" },
  ];

  const ledgerOptions = useMemo(() => {
    return glAccounts.map((acc) => ({
      label: `${acc.accountNumber} - ${acc.accountName}`,
      value: acc.id,
    }));
  }, [glAccounts]);

  const getAccountOptions = (type: string) => {
    switch (type) {
      case "Customer": return customerOptions;
      case "Vendor": return vendorOptions;
      case "Bank": return bankOptions;
      case "Ledger":
      default:
        return ledgerOptions;
    }
  };

  const isReadOnly = voucher && (voucher.status === "Posted" || voucher.status === "Reversed" || voucher.status === "Pending Approval");

  const defaultValues: CreateJournalVoucherDto & { id?: string } = {
    id: voucher?.id,
    journalName: voucher?.journalName || "GenJrn-2026",
    date: voucher ? voucher.date : format(new Date(), "yyyy-MM-dd"),
    currency: voucher?.currency || "AED",
    journalType: voucher?.journalType || "General",
    costCenter: voucher?.costCenter || "Admin",
    department: voucher?.department || "Finance",
    exchangeRate: voucher?.exchangeRate || 1.0,
    description: voucher?.description || "",
    internalNotes: voucher?.internalNotes || "",
    lines: voucher?.lines.length
      ? voucher.lines.map(line => ({
        accountType: line.accountType,
        accountId: line.accountId,
        description: line.description,
        costCenter: line.costCenter,
        debit: line.debit,
        credit: line.credit,
        offsetType: line.offsetType,
        offsetAccountId: line.offsetAccountId,
      }))
      : [
        { accountType: "Ledger", accountId: "", debit: 0, credit: 0 },
        { accountType: "Ledger", accountId: "", debit: 0, credit: 0 },
      ],
  };

  // Form configuration
  const methods = useForm<any>({
    resolver: zodResolver(createJournalVoucherSchema),
    defaultValues,
  });

  const { control, formState: { errors }, reset, setValue, register } = methods;

  // Reset defaults when query loads
  useEffect(() => {
    if (voucher) {
      reset(defaultValues);
    } else {
      reset({
        journalName: "GenJrn-2026",
        date: format(new Date(), "yyyy-MM-dd"),
        currency: "AED",
        journalType: "General",
        costCenter: "Admin",
        department: "Finance",
        exchangeRate: 1.0,
        description: "",
        internalNotes: "",
        lines: [
          { accountType: "Ledger", accountId: "", debit: 0, credit: 0 },
          { accountType: "Ledger", accountId: "", debit: 0, credit: 0 },
        ],
      });
    }
  }, [voucher, reset, voucherId]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });

  // Watch Form states
  const watchLines = useWatch({ control, name: "lines" }) || [];
  const selectedCurrency = useWatch({ control, name: "currency" });
  const selectedExchangeRate = useWatch({ control, name: "exchangeRate" }) || 1.0;
  const watchHeaderCostCenter = useWatch({ control, name: "costCenter" });
  const watchHeaderDescription = useWatch({ control, name: "description" });

  const totalDebit = watchLines.reduce((sum: number, line: any) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = watchLines.reduce((sum: number, line: any) => sum + (Number(line.credit) || 0), 0);
  const diffAmount = Math.abs(totalDebit - totalCredit);
  const isBalanced = diffAmount < 0.01;

  // Auto-set exchange rate to 1.0 when Currency is AED
  useEffect(() => {
    if (selectedCurrency === "AED") {
      setValue("exchangeRate", 1.0);
    } else if (selectedCurrency === "USD" && methods.getValues("exchangeRate") === 1.0) {
      setValue("exchangeRate", 3.6725);
    }
  }, [selectedCurrency, setValue]);

  // Header template application
  const applyTemplate = (templateName: string) => {
    const template = MOCK_TEMPLATES.find((t) => t.name === templateName);
    if (!template) return;

    setValue("journalType", template.journalType);
    setValue("currency", template.currency);
    setValue("description", template.description);

    // Set exchange rate
    if (template.currency === "AED") {
      setValue("exchangeRate", 1.0);
    } else if (template.currency === "USD") {
      setValue("exchangeRate", 3.6725);
    }

    // Set lines
    const newLines = template.lines.map((l) => {
      const matched = glAccounts.find((acc: any) => acc.accountNumber === l.accountNumber);
      return {
        accountType: l.accountType,
        accountId: matched ? matched.id : "",
        description: template.description,
        costCenter: watchHeaderCostCenter || "Admin",
        debit: l.debit,
        credit: l.credit,
      };
    });

    setValue("lines", newLines);
    toast.success(`Applied template: ${templateName}`);
  };

  // Submit operations
  const onSave = async (data: any) => {
    try {
      const payload = {
        ...data,
        id: voucher?.id,
      };
      const result = await saveMutation.mutateAsync(payload);
      toast.success(voucher ? "Voucher updated successfully!" : "Voucher created as draft!");
      if (!voucher) {
        onViewVoucher(result.id);
      }
    } catch {
      toast.error("An error occurred while saving the voucher.");
    }
  };

  const onViewVoucher = (id: string) => {
    // Navigate or update state
    window.location.hash = `#${id}`; // Simple simulation
  };

  // Ribbon Actions
  const handleValidate = async () => {
    // Perform standard validations on form inputs
    const isValid = await methods.trigger();
    const currentFormValues = methods.getValues();

    // Gather errors from react-hook-form
    const localErrors: string[] = [];
    if (!isValid) {
      if (errors.journalName) localErrors.push("Journal Name is mandatory.");
      if (errors.date) localErrors.push("Voucher Date is mandatory.");
      if (errors.description) localErrors.push("Voucher description is mandatory.");
      if (errors.exchangeRate) localErrors.push("Exchange Rate must be greater than zero.");
      if (errors.lines?.message) localErrors.push(errors.lines.message as string);
      if (errors.lines && Array.isArray(errors.lines)) {
        errors.lines.forEach((lineErr: any, i: number) => {
          if (lineErr?.accountId) localErrors.push(`Line ${i + 1}: Account selection is required.`);
          if (lineErr?.debit) localErrors.push(`Line ${i + 1}: Must select either a Debit or Credit (not both).`);
        });
      }
    }

    const mockDto = {
      ...voucher,
      ...currentFormValues,
      exchangeRate: Number(currentFormValues.exchangeRate) || 1.0,
      lines: currentFormValues.lines.map((l: any) => ({
        ...l,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      })),
    } as JournalVoucherDto;

    try {
      const apiValidation = await validateMutation.mutateAsync(mockDto);
      const allErrors = [...localErrors, ...apiValidation.errors];

      setValidationResult({
        open: true,
        success: allErrors.length === 0,
        errors: allErrors,
      });

      if (allErrors.length === 0) {
        toast.success("Validation successful: Voucher is balanced and valid.");
      } else {
        toast.error("Validation failed: Please correct the errors listed.");
      }
    } catch {
      toast.error("Failed to run validation services.");
    }
  };

  const handleSimulate = async () => {
    const currentFormValues = methods.getValues();
    const mockDto = {
      ...voucher,
      ...currentFormValues,
      exchangeRate: Number(currentFormValues.exchangeRate) || 1.0,
      lines: currentFormValues.lines.map((l: any) => ({
        ...l,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      })),
    } as JournalVoucherDto;

    try {
      const data = await simulateMutation.mutateAsync(mockDto);
      setSimData(data);
      setShowSimDialog(true);
    } catch {
      toast.error("Failed to simulate GL postings.");
    }
  };

  const handleSendForApproval = async () => {
    if (!voucher) return;
    try {
      await sendApprovalMutation.mutateAsync(voucher.id);
      toast.success("Voucher submitted to approval chain successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit for approval.");
    }
  };

  const handleApprove = async () => {
    if (!voucher) return;
    const remark = methods.getValues("approvalRemarks");
    try {
      await approveMutation.mutateAsync({ id: voucher.id, remarks: remark });
      toast.success("Voucher stage approved successfully!");
    } catch (e: any) {
      toast.error(e.message || "Approval action failed.");
    }
  };

  const handleReject = async () => {
    if (!voucher) return;
    const remark = methods.getValues("approvalRemarks");
    if (!remark) {
      toast.error("Approval remarks are mandatory to reject a voucher.");
      return;
    }
    try {
      await rejectMutation.mutateAsync({ id: voucher.id, remarks: remark });
      toast.success("Voucher rejected and returned to initiator draft.");
    } catch (e: any) {
      toast.error(e.message || "Rejection action failed.");
    }
  };

  const handlePost = async () => {
    if (!voucher) return;
    try {
      await postMutation.mutateAsync(voucher.id);
      toast.success("Journal Voucher posted successfully to General Ledger!");
    } catch (e: any) {
      toast.error(e.message || "Failed to post voucher.");
    }
  };

  const handleReverse = async () => {
    if (!voucher) return;
    try {
      const reversingVoucher = await reverseMutation.mutateAsync(voucher.id);
      toast.success(`Created reversing draft entry ${reversingVoucher.voucherNo}!`);
      onViewVoucher(reversingVoucher.id);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate reversal.");
    }
  };

  const handleDelete = async () => {
    if (!voucher) return;
    if (confirm("Are you sure you want to delete this draft journal voucher?")) {
      try {
        await deleteMutation.mutateAsync(voucher.id);
        toast.success("Draft deleted.");
        onCancel();
      } catch (e: any) {
        toast.error(e.message || "Failed to delete voucher.");
      }
    }
  };

  // Attachments simulation
  const handleAttachMock = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!voucher) {
      toast.warning("Please save the voucher as a draft before attaching documents.");
      return;
    }
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    // Check sizes/types per BRD Section 12
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds maximum allowed size of 10MB.");
      return;
    }

    const allowed = ["application/pdf", "image/png", "image/jpeg", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Unsupported format. Allowed: PDF, PNG, JPG, XLSX, DOCX.");
      return;
    }

    try {
      await addAttachMutation.mutateAsync({
        id: voucher.id,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      });
      toast.success(`Attached file: ${file.name}`);
    } catch {
      toast.error("Failed to upload attachment.");
    }
  };

  const handleRemoveAttach = async (fileName: string) => {
    if (!voucher) return;
    try {
      await removeAttachMutation.mutateAsync({ id: voucher.id, fileName });
      toast.success("Attachment removed.");
    } catch {
      toast.error("Failed to remove attachment.");
    }
  };

  if (voucherId && isVoucherLoading) {
    return (
      <div className="bg-card border rounded-md shadow-sm p-6 space-y-6">
        <div className="h-6 flex items-center justify-between border-b pb-4">
          <div className="h-4 bg-muted w-1/4 rounded animate-pulse" />
          <div className="h-4 bg-muted w-1/12 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  // Determine permissions based on Role and Status
  const canModify = !isReadOnly;
  const isPostable = voucher?.status === "Approved" && isBalanced;

  // Banner steppers active calculations
  const getStepStatus = (step: string) => {
    if (!voucher) return "pending";
    const status = voucher.status;
    const stage = voucher.currentApprovalStage;

    if (status === "Posted") return "done";
    if (status === "Reversed") return "done";

    if (step === "Initiator") {
      return "done";
    }

    if (step === "Finance Review") {
      if (status === "Pending Approval" && stage === "Finance Review") return "active";
      if (stage === "CFO Approve" || status === "Approved") return "done";
      if (status === "Rejected" && stage === "Initiator") return "rejected";
    }

    if (step === "CFO Approve") {
      if (status === "Pending Approval" && stage === "CFO Approve") return "active";
      if (status === "Approved") return "done";
      if (status === "Rejected" && stage === "Initiator") return "pending";
    }

    if (step === "Posted") {
      if (status === "Approved") return "active";
      return "pending";
    }

    return "pending";
  };

  return (
    <div className="space-y-6">
      {/* Action / Ribbon Bar */}
      <div className="bg-card border rounded-lg p-3 shadow-sm flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Group: Journal */}
          <Button
            type="button"
            size="sm"
            onClick={handlePost}
            disabled={!isPostable || postMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            title="Post transactions to General Ledger"
          >
            <Send className="h-4 w-4 mr-1.5" /> Post
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={async () => {
              await handlePost();
              toast.success("Data transferred downstream successfully!");
            }}
            disabled={!isPostable || postMutation.isPending}
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-semibold"
            title="Post and trigger subledger synchronizations"
          >
            <Play className="h-4 w-4 mr-1.5" /> Post & Transfer
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={methods.handleSubmit(onSave)}
            disabled={!canModify || saveMutation.isPending}
            variant="outline"
            className="font-semibold"
          >
            <Save className="h-4 w-4 mr-1.5" /> Save Draft
          </Button>

          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

          {/* Group: Actions */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleValidate}
            className="hover:bg-muted font-medium text-xs sm:text-sm"
          >
            Validate
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleSimulate}
            className="hover:bg-muted font-medium text-xs sm:text-sm"
            disabled={watchLines.length === 0}
          >
            Simulate GL
          </Button>

          {voucher?.status === "Posted" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleReverse}
              className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/20 font-semibold"
              disabled={reverseMutation.isPending}
            >
              <CornerUpLeft className="h-4 w-4 mr-1.5" /> Reverse Entry
            </Button>
          )}

          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

          {/* Group: Utilities */}
          {canModify && (
            <div className="relative">
              <select
                className="text-xs bg-muted hover:bg-muted/80 border rounded p-1.5 font-medium cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    applyTemplate(e.target.value);
                    e.target.value = ""; // reset
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Apply Template...</option>
                {MOCK_TEMPLATES.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => window.print()}
            className="hover:bg-muted"
          >
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
        </div>

        <div className="flex gap-2">
          {voucher?.status === "Draft" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete Draft
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Back to List
          </Button>
          {voucher && (
            <Button type="button" variant="outline" size="sm" onClick={onNew}>
              New Voucher
            </Button>
          )}
        </div>
      </div>

      {/* Conditionally Render Approval Stepper Banner */}
      {voucher && (
        <div className="bg-card border rounded-lg shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-primary">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Voucher Approval Banner:
              </span>
              {voucher.status === "Pending Approval" && (
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded font-semibold dark:bg-amber-950/30 dark:text-amber-400">
                  Approval required before posting to GL.
                </span>
              )}
              {voucher.status === "Approved" && (
                <span className="text-xs text-sky-600 bg-sky-50 border border-sky-200/50 px-2 py-0.5 rounded font-semibold dark:bg-sky-950/30 dark:text-sky-400">
                  Approved! Balanced voucher is eligible for GL posting.
                </span>
              )}
            </div>

            {/* Stepper Timeline UI */}
            <div className="flex items-center gap-2 pt-2">
              {["Initiator", "Finance Review", "CFO Approve", "Posted"].map((step, idx) => {
                const stepStatus = getStepStatus(step);
                let circleStyle = "border-muted-foreground bg-muted text-muted-foreground";
                let textStyle = "text-muted-foreground";

                if (stepStatus === "done") {
                  circleStyle = "bg-primary border-primary text-primary-foreground";
                  textStyle = "text-foreground font-semibold";
                } else if (stepStatus === "active") {
                  circleStyle = "border-primary bg-background text-primary ring-2 ring-primary/20";
                  textStyle = "text-primary font-semibold animate-pulse";
                } else if (stepStatus === "rejected") {
                  circleStyle = "bg-destructive border-destructive text-white";
                  textStyle = "text-destructive font-semibold";
                }

                return (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${circleStyle}`}>
                        {stepStatus === "done" ? <Check className="h-3 w-3" /> : (idx + 1)}
                      </span>
                      <span className={`text-xs ${textStyle}`}>{step}</span>
                    </div>
                    {idx < 3 && <span className="text-muted-foreground font-mono text-sm">➔</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workflow Action controls based on roles (Multi-user mockup selector) */}
          <div className="flex flex-col sm:flex-row gap-2 items-center bg-muted/40 p-2.5 rounded-lg border border-border/50">
            {/* Testing Role Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground font-mono">Test Role:</span>
              <select
                className="text-[11px] bg-background border rounded px-1 py-1 font-semibold"
                value={testingRole}
                onChange={(e) => setTestingRole(e.target.value)}
              >
                <option value="Initiator">Initiator (Finance Maker)</option>
                <option value="Finance Review">Finance Reviewer</option>
                <option value="CFO">CFO / Final Approver</option>
              </select>
            </div>

            <div className="h-[18px] w-[1px] bg-border mx-1 hidden sm:block" />

            {/* Stage Actions */}
            {voucher.status === "Draft" || voucher.status === "Rejected" ? (
              <Button
                size="sm"
                onClick={handleSendForApproval}
                className="bg-primary text-primary-foreground font-medium"
                disabled={sendApprovalMutation.isPending}
              >
                Send for Approval
              </Button>
            ) : null}

            {voucher.status === "Pending Approval" && voucher.currentApprovalStage === "Finance Review" && testingRole === "Finance Review" && (
              <div className="flex gap-1.5">
                <Button size="sm" onClick={handleApprove} className="bg-sky-600 hover:bg-sky-700 text-white font-medium">
                  Approve (Review)
                </Button>
                <Button size="sm" variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
              </div>
            )}

            {voucher.status === "Pending Approval" && voucher.currentApprovalStage === "CFO Approve" && testingRole === "CFO" && (
              <div className="flex gap-1.5">
                <Button size="sm" onClick={handleApprove} className="bg-sky-600 hover:bg-sky-700 text-white font-medium">
                  Approve (CFO Final)
                </Button>
                <Button size="sm" variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
              </div>
            )}

            {voucher.status === "Pending Approval" && (
              <span className="text-xs text-muted-foreground pl-1 font-medium italic">
                (Switch Test Role to act)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Conditionally Display Rejection Notice */}
      {voucher?.status === "Rejected" && (
        <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200/50 p-4 rounded-lg flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Voucher Rejected by Approver</h4>
            <p className="text-xs mt-1">
              Remarks/Reason: <span className="font-medium italic">"{voucher.approvalRemarks || "No remarks provided"}"</span>
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Main Form Block */}
      <Form methods={methods} onSubmit={onSave}>
        <div className="space-y-4">

          {/* collapsible section: Journal Header */}
          <div className="bg-card border rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              className="w-full flex items-center justify-between p-4 font-semibold text-base border-b hover:bg-muted/10 transition-colors"
            >
              <span>Voucher Header Specifications</span>
              {isHeaderExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {isHeaderExpanded && (
              <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <FormSelect
                  name="journalName"
                  label="Journal Name"
                  options={journalNameOptions}
                  disabled={isReadOnly}
                />

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-muted-foreground">Voucher No. (Read-only)</Label>
                  <div className="h-10 border rounded-lg px-3 bg-muted/40 text-muted-foreground text-sm flex items-center font-mono font-bold">
                    {voucher ? voucher.voucherNo : "JV-YYYY-NNNN (Auto)"}
                  </div>
                </div>

                <FormDatePicker
                  name="date"
                  label="Voucher Date"
                  disabled={isReadOnly}
                />

                <FormSelect
                  name="currency"
                  label="Currency"
                  options={currencyOptions}
                  disabled={isReadOnly}
                />

                <FormSelect
                  name="journalType"
                  label="Journal Type"
                  options={typeOptions}
                  disabled={isReadOnly}
                />

                <FormSelect
                  name="costCenter"
                  label="Default Cost Center"
                  options={ccOptions}
                  disabled={isReadOnly}
                />

                <FormSelect
                  name="department"
                  label="Department"
                  options={deptOptions}
                  disabled={isReadOnly}
                />

                {/* Show exchange rate input if currency is not AED */}
                {selectedCurrency !== "AED" && (
                  <FormInput
                    name="exchangeRate"
                    label={`Exchange Rate (${selectedCurrency} to AED)`}
                    type="number"
                    step="0.00001"
                    min="0.00001"
                    disabled={isReadOnly}
                  />
                )}

                <div className="sm:col-span-2 md:col-span-4">
                  <FormInput
                    name="description"
                    label="Voucher Description / Narration"
                    placeholder="Provide a general description of the voucher batch"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            )}
          </div>

          {/* collapsible section: Journal Lines Grid */}
          <div className="bg-card border rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b hover:bg-muted/10 transition-colors">
              <button
                type="button"
                onClick={() => setIsLinesExpanded(!isLinesExpanded)}
                className="flex items-center gap-2 font-semibold text-base"
              >
                <span>Journal Entries Grid ({watchLines.length} lines)</span>
                {isLinesExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              <div className="flex items-center gap-2">
                {/* Lines View Toggle */}
                <div className="flex items-center bg-muted rounded-md p-0.5 border text-xs">
                  <button
                    type="button"
                    onClick={() => setLinesView("compact")}
                    className={`px-2.5 py-1 rounded-sm font-medium transition-all ${linesView === "compact" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Compact View
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinesView("standard")}
                    className={`px-2.5 py-1 rounded-sm font-medium transition-all ${linesView === "standard" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Standard View (Offsets)
                  </button>
                </div>

                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ accountType: "Ledger", accountId: "", debit: 0, credit: 0 })}
                    className="font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Line
                  </Button>
                )}
              </div>
            </div>

            {isLinesExpanded && (
              <div className="p-4 md:p-6">
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full text-sm text-left table-fixed">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-3 py-3 font-medium w-12 text-center">Row</th>
                        <th className="px-3 py-3 font-medium w-28">Type</th>
                        <th className="px-3 py-3 font-medium w-64">Account</th>
                        <th className="px-3 py-3 font-medium w-48">Description</th>
                        <th className="px-3 py-3 font-medium w-36">Cost Center</th>
                        <th className="px-3 py-3 font-medium w-36 text-right">Debit ({selectedCurrency})</th>
                        <th className="px-3 py-3 font-medium w-36 text-right">Credit ({selectedCurrency})</th>

                        {/* Standard extra offset columns */}
                        {linesView === "standard" && (
                          <>
                            <th className="px-3 py-3 font-medium w-28">Offset Type</th>
                            <th className="px-3 py-3 font-medium w-48">Offset Account</th>
                          </>
                        )}

                        {!isReadOnly && <th className="px-3 py-3 font-medium w-12 text-center"></th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {fields.map((field, index) => {
                        const lineType = watchLines[index]?.accountType || "Ledger";
                        const accountOptionsForLine = getAccountOptions(lineType);

                        return (
                          <tr key={field.id} className="bg-card hover:bg-muted/5">
                            {/* Row number */}
                            <td className="px-3 py-2 text-center text-muted-foreground font-medium font-mono">
                              {index + 1}
                            </td>

                            {/* Account Type */}
                            <td className="px-1.5 py-1.5">
                              {isReadOnly ? (
                                <span className="text-sm font-medium px-2 py-1 rounded bg-muted block text-center">
                                  {watchLines[index]?.accountType}
                                </span>
                              ) : (
                                <FormSelect
                                  name={`lines.${index}.accountType`}
                                  options={accountTypeOptions}
                                  placeholder="Type"
                                />
                              )}
                            </td>

                            {/* Account Selector */}
                            <td className="px-1.5 py-1.5">
                              {isReadOnly ? (
                                <div className="text-sm font-medium truncate py-1 text-foreground" title={watchLines[index]?.accountNumber ? `${watchLines[index]?.accountNumber} - ${watchLines[index]?.accountName}` : "—"}>
                                  {watchLines[index]?.accountNumber
                                    ? `${watchLines[index]?.accountNumber} - ${watchLines[index]?.accountName}`
                                    : "—"}
                                </div>
                              ) : (
                                <FormSelect
                                  name={`lines.${index}.accountId`}
                                  options={accountOptionsForLine}
                                  placeholder="Select Account"
                                />
                              )}
                            </td>

                            {/* Description */}
                            <td className="px-1.5 py-1.5">
                              {isReadOnly ? (
                                <span className="text-sm block truncate text-muted-foreground py-1" title={watchLines[index]?.description || watchHeaderDescription}>
                                  {watchLines[index]?.description || "—"}
                                </span>
                              ) : (
                                <FormInput
                                  name={`lines.${index}.description`}
                                  placeholder="Line Narration"
                                />
                              )}
                            </td>

                            {/* Cost Center */}
                            <td className="px-1.5 py-1.5">
                              {isReadOnly ? (
                                <span className="text-sm block text-muted-foreground py-1 text-center font-medium">
                                  {watchLines[index]?.costCenter || "—"}
                                </span>
                              ) : (
                                <FormSelect
                                  name={`lines.${index}.costCenter`}
                                  options={ccOptions}
                                  placeholder="Cost Center"
                                />
                              )}
                            </td>

                            {/* Debit amount */}
                            <td className="px-1.5 py-1.5">
                              {isReadOnly ? (
                                <span className="text-right block font-semibold text-foreground py-1 pr-2 font-mono tabular-nums">
                                  {watchLines[index]?.debit > 0 ? formatAmount(watchLines[index]?.debit) : "—"}
                                </span>
                              ) : (
                                <FormInput
                                  name={`lines.${index}.debit`}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="text-right font-mono"
                                  disabled={Number(watchLines[index]?.credit) > 0}
                                />
                              )}
                            </td>

                            {/* Credit amount */}
                            <td className="px-1.5 py-1.5">
                              {isReadOnly ? (
                                <span className="text-right block font-semibold text-foreground py-1 pr-2 font-mono tabular-nums">
                                  {watchLines[index]?.credit > 0 ? formatAmount(watchLines[index]?.credit) : "—"}
                                </span>
                              ) : (
                                <FormInput
                                  name={`lines.${index}.credit`}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="text-right font-mono"
                                  disabled={Number(watchLines[index]?.debit) > 0}
                                />
                              )}
                            </td>

                            {/* Standard Extra Offset Columns */}
                            {linesView === "standard" && (
                              <>
                                <td className="px-1.5 py-1.5">
                                  {isReadOnly ? (
                                    <span className="text-sm block py-1 text-muted-foreground text-center">
                                      {watchLines[index]?.offsetType || "—"}
                                    </span>
                                  ) : (
                                    <FormSelect
                                      name={`lines.${index}.offsetType`}
                                      options={[
                                        { label: "Ledger", value: "Ledger" },
                                        { label: "Bank", value: "Bank" },
                                      ]}
                                      placeholder="Offset Type"
                                    />
                                  )}
                                </td>
                                <td className="px-1.5 py-1.5">
                                  {isReadOnly ? (
                                    <span className="text-sm block py-1 text-muted-foreground truncate" title={watchLines[index]?.offsetAccountNumber ? `${watchLines[index]?.offsetAccountNumber} - ${watchLines[index]?.offsetAccountName}` : "—"}>
                                      {watchLines[index]?.offsetAccountNumber
                                        ? `${watchLines[index]?.offsetAccountNumber} - ${watchLines[index]?.offsetAccountName}`
                                        : "—"}
                                    </span>
                                  ) : (
                                    <FormSelect
                                      name={`lines.${index}.offsetAccountId`}
                                      options={getAccountOptions(watchLines[index]?.offsetType || "Ledger")}
                                      placeholder="Offset Account"
                                    />
                                  )}
                                </td>
                              </>
                            )}

                            {/* Row actions */}
                            {!isReadOnly && (
                              <td className="px-1 py-1.5 text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => remove(index)}
                                  disabled={fields.length <= 2}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Live Totals Summary Section */}
                <div className="flex flex-col items-end gap-1.5 mt-4 text-sm font-semibold pr-2">
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground font-medium">Total Debits:</span>
                    <span className="font-mono tabular-nums">{selectedCurrency} {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground font-medium">Total Credits:</span>
                    <span className="font-mono tabular-nums">{selectedCurrency} {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className={`flex justify-between w-64 pt-1.5 border-t border-border/80 ${isBalanced ? "text-purple-600 dark:text-purple-400" : "text-destructive animate-pulse"}`}>
                    <span className="font-bold flex items-center gap-1">
                      Difference: {isBalanced ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </span>
                    <span className="font-mono tabular-nums">
                      {selectedCurrency} {diffAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {selectedCurrency !== "AED" && (
                    <div className="text-[11px] text-muted-foreground text-right max-w-sm mt-1">
                      Converts to AED equivalents: Debits AED {formatAmount(totalDebit * selectedExchangeRate)} / Credits AED {formatAmount(totalCredit * selectedExchangeRate)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* collapsible section: Attachments & Notes */}
          <div className="bg-card border rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setIsAttachmentsExpanded(!isAttachmentsExpanded)}
              className="w-full flex items-center justify-between p-4 font-semibold text-base border-b hover:bg-muted/10 transition-colors"
            >
              <span>Attachments & Voucher commentary ({voucher?.attachments?.length || 0} files)</span>
              {isAttachmentsExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {isAttachmentsExpanded && (
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Attachments Upload list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Supporting Receipts/Attachments</Label>
                    {!isReadOnly && (
                      <div className="relative">
                        <label className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg border border-primary text-xs font-semibold text-primary bg-background hover:bg-primary/5 transition-colors">
                          <Paperclip className="h-3.5 w-3.5 mr-1" />
                          <span>Attach File</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleAttachMock}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="border border-dashed rounded-lg p-3 bg-muted/10 min-h-[120px] flex flex-col justify-center">
                    {!voucher?.attachments?.length ? (
                      <p className="text-xs text-muted-foreground text-center italic">
                        No files attached. Drag & drop or click Attach File to upload document references. (Supports PDF, PNG, JPG, XLSX, DOCX up to 10MB)
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {voucher.attachments.map((file) => (
                          <div
                            key={file.name}
                            className="flex items-center justify-between p-2 rounded border bg-card text-xs font-mono"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="truncate text-foreground font-semibold" title={file.name}>
                                {file.name}
                              </span>
                              <span className="text-muted-foreground text-[10px]">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAttach(file.name)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1 rounded transition-colors"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes and approval commentary */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Internal Notes / Memo</Label>
                    <Textarea
                      {...register("internalNotes")}
                      placeholder="Commentary for audit and internal review purposes"
                      disabled={isReadOnly}
                      rows={2}
                      className="text-sm rounded-lg"
                    />
                  </div>

                  {voucher && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-amber-600 dark:text-amber-400">Approval Remarks / Rejection commentary</Label>
                      <Textarea
                        {...register("approvalRemarks")}
                        placeholder="Add remarks here to record on the approval audit log"
                        disabled={voucher.status === "Posted" || voucher.status === "Reversed"}
                        rows={2}
                        className="text-sm rounded-lg border-amber-200/80 focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </Form>

      {/* GL Simulation dialog */}
      <VoucherSimulationDialog
        open={showSimDialog}
        onOpenChange={setShowSimDialog}
        voucher={voucher || null}
        simulationData={simData}
      />

      {/* Validation results dialog */}
      {validationResult && (
        <Dialog open={validationResult.open} onOpenChange={(o: boolean) => setValidationResult(o ? validationResult : null)}>
          <DialogContent className="max-w-md">
            <DialogHeader className="flex flex-col items-center text-center space-y-2">
              {validationResult.success ? (
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="h-6 w-6" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <X className="h-6 w-6" />
                </div>
              )}
              <DialogTitle className="text-lg font-bold">
                {validationResult.success ? "Verification Passed" : "Verification Failed"}
              </DialogTitle>
              <DialogDescription>
                {validationResult.success
                  ? "This journal voucher meets all double-entry, account checking, and period lock requirements."
                  : "Validation errors were encountered. The voucher cannot be submitted or posted until corrected."}
              </DialogDescription>
            </DialogHeader>

            {!validationResult.success && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 p-4 rounded-lg my-2 max-h-[200px] overflow-y-auto">
                <ul className="text-xs text-rose-700 dark:text-rose-400 space-y-2 list-disc list-inside font-medium">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter className="sm:justify-center">
              <Button onClick={() => setValidationResult(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

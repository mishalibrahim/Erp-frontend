import { useWatch } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { FileText } from "lucide-react";

export const CorporateTaxSection = () => {
  const ctRegistered = useWatch<CompanySetupFormValues>({ name: "ctRegistered" });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Corporate Tax</h3>
          <p className="text-sm text-muted-foreground">
            UAE Corporate Tax registration and settings
          </p>
        </div>
      </div>

      {/* CT Registration Toggle */}
      <FormSwitch
        name="ctRegistered"
        label="CT Registered"
        description="Is this company registered for Corporate Tax?"
      />

      {/* Conditional CT Fields */}
      {ctRegistered && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Row 1: CT TRN + First Tax Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              name="corporateTaxTrn"
              label="Corporate Tax TRN *"
              placeholder="Enter CT TRN"
            />
            <FormDatePicker
              name="firstTaxPeriodStartDate"
              label="First Tax Period Start Date *"
              placeholder="Select date"
            />
          </div>

          {/* Row 2: FY End (linked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              name="ctFinancialYearEnd"
              label="Financial Year End"
              placeholder="Linked with Financial Setup"
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
          </div>

          {/* Row 3: Boolean toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormSwitch
              name="freeZonePerson"
              label="Free Zone Person"
              description="Qualifies as FZ Person?"
            />
            <FormSwitch
              name="qfzpStatus"
              label="QFZP Status"
              description="Qualifying Free Zone Person?"
            />
            <FormSwitch
              name="smallBusinessRelief"
              label="Small Business Relief"
              description="Eligible for SBR?"
            />
          </div>
        </div>
      )}
    </div>
  );
};

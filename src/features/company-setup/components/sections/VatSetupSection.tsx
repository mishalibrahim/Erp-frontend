import { useWatch } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import {
  VAT_SCHEMES,
  VAT_FILING_FREQUENCIES,
  TRN_LABELS,
} from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { Receipt } from "lucide-react";

export const VatSetupSection = () => {
  const vatRegistered = useWatch<CompanySetupFormValues>({ name: "vatRegistered" });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <Receipt className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">VAT Setup</h3>
          <p className="text-sm text-muted-foreground">
            Value Added Tax registration and configuration
          </p>
        </div>
      </div>

      {/* VAT Registration Toggle */}
      <FormSwitch
        name="vatRegistered"
        label="VAT Registered"
        description="Is this company registered for VAT?"
      />

      {/* Conditional VAT fields */}
      {vatRegistered && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Row 1: TRN Label + TRN Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormSelect
              name="trnLabel"
              label="TRN Label *"
              placeholder="Select label"
              options={TRN_LABELS}
            />
            <FormInput
              name="trnNumber"
              label="TRN Number *"
              placeholder="Enter 15-digit TRN"
              maxLength={15}
            />
          </div>

          {/* Row 2: Registration Date + Scheme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormDatePicker
              name="vatRegistrationDate"
              label="VAT Registration Date *"
              placeholder="Select date"
            />
            <FormSelect
              name="vatScheme"
              label="VAT Scheme *"
              placeholder="Select scheme"
              options={VAT_SCHEMES}
            />
          </div>

          {/* Row 3: Filing Frequency + First VAT Period (auto) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormSelect
              name="vatFilingFrequency"
              label="VAT Filing Frequency *"
              placeholder="Select frequency"
              options={VAT_FILING_FREQUENCIES}
            />
            <FormInput
              name="firstVatPeriod"
              label="First VAT Period"
              placeholder="Auto-generated"
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
          </div>

          {/* Row 4: Return Start + Deregistration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              name="vatReturnStartPeriod"
              label="VAT Return Start Period"
              placeholder="Auto-generated"
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
            <FormDatePicker
              name="vatDeregistrationDate"
              label="VAT Deregistration Date"
              placeholder="Select date (optional)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

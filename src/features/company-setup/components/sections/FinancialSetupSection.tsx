import { useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import {
  ACCOUNTING_METHODS,
  FISCAL_YEARS,
  CURRENCIES,
} from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { useEffect } from "react";
import { Landmark } from "lucide-react";
import { format, addYears, subDays, parseISO } from "date-fns";

export const FinancialSetupSection = () => {
  const { setValue } = useFormContext<CompanySetupFormValues>();
  const fyStart = useWatch<CompanySetupFormValues>({ name: "financialYearStart" });

  // Auto-calculate FY End = Start + 1 year - 1 day
  useEffect(() => {
    if (fyStart && typeof fyStart === "string") {
      try {
        const startDate = parseISO(fyStart);
        const endDate = subDays(addYears(startDate, 1), 1);
        setValue("financialYearEnd", format(endDate, "yyyy-MM-dd"));
      } catch {
        // invalid date, skip
      }
    }
  }, [fyStart, setValue]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Financial Setup</h3>
          <p className="text-sm text-muted-foreground">
            Configure fiscal year, accounting method, and currencies
          </p>
        </div>
      </div>

      {/* Row 1: FY Start + FY End (auto) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormDatePicker
          name="financialYearStart"
          label="Financial Year Start Date *"
          placeholder="Select start date"
        />
        <FormInput
          name="financialYearEnd"
          label="Financial Year End Date"
          placeholder="Auto-calculated"
          disabled
          className="bg-muted/50 cursor-not-allowed"
        />
      </div>

      {/* Row 2: Books Start + Accounting Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormDatePicker
          name="booksStartDate"
          label="Books Start Date *"
          placeholder="Select books start date"
        />
        <FormSelect
          name="accountingMethod"
          label="Accounting Method *"
          placeholder="Select method"
          options={ACCOUNTING_METHODS}
        />
      </div>

      {/* Row 3: Fiscal Year + Base Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          name="fiscalYear"
          label="Fiscal Year *"
          placeholder="Select fiscal year"
          options={FISCAL_YEARS}
        />
        <FormSelect
          name="baseCurrency"
          label="Base Currency *"
          placeholder="Select base currency"
          options={CURRENCIES}
        />
      </div>

      {/* Row 4: Reporting Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          name="reportingCurrency"
          label="Reporting Currency"
          placeholder="Select reporting currency (optional)"
          options={CURRENCIES}
        />
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { FormInput } from "@/components/hook-form/FormInput";
import { Form } from "@/components/hook-form/Form";
import { format, addYears, subDays, parseISO } from "date-fns";
import { WizardFooter } from "../WizardFooter";
import { step2Schema, type Step2FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import type { CompanySetupContextType } from "../CompanySetupWizard";

export const Step2Financials = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion, setRowVersion } = useOutletContext<CompanySetupContextType>();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      financialYearStart: "",
      booksStartDate: "",
      accountingMethod: "Accrual",
      fiscalYear: "Jan-Dec",
      baseCurrency: "AED",
      reportingCurrency: "USD",
      financialYearEnd: "",
      defaultCostCenterId: "",
      defaultProjectId: "",
    },
  });

  useEffect(() => {
    if (draftData) {
      const financialsData = draftData.financials || draftData;
      methods.reset({ ...methods.getValues(), ...financialsData });
    }
  }, [draftData, methods]);

  const fyStart = methods.watch("financialYearStart");

  useEffect(() => {
    if (fyStart && typeof fyStart === "string") {
      try {
        const startDate = parseISO(fyStart);
        const endDate = subDays(addYears(startDate, 1), 1);
        methods.setValue("financialYearEnd", format(endDate, "yyyy-MM-dd"));
      } catch {
        // invalid date
      }
    }
  }, [fyStart, methods]);

  const onSubmit = async (data: Step2FormData) => {
    if (!draftId) {
      toast.error("Draft ID missing. Please restart.");
      return;
    }
    setIsLoading(true);
    const cleanData = {
      ...data,
      financialYearEnd: data.financialYearEnd || undefined,
      rowVersion,
    };
    try {
      const response = await companySetupApi.updateFinancials(draftId, cleanData);
      setRowVersion(response.rowVersion);
      navigate(`/settings/company-setup/wizard/step-3?draftId=${draftId}`);
    } catch {
      // Error is handled by global axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Fiscal Period
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormDatePicker name="financialYearStart" label="Financial Year Start *" placeholder="Select date" />
            <FormInput name="financialYearEnd" label="Financial Year End" placeholder="Auto-calculated" disabled className="bg-muted/50 cursor-not-allowed" />
            <FormDatePicker name="booksStartDate" label="Books Start Date *" placeholder="Select date" />
            <FormSelect
              name="fiscalYear"
              label="Fiscal Year *"
              placeholder="Select period"
              options={[
                { label: "January – December", value: "Jan-Dec" },
                { label: "April – March", value: "Apr-Mar" },
                { label: "July – June", value: "Jul-Jun" },
              ]}
            />
            <FormSelect
              name="accountingMethod"
              label="Accounting Method *"
              placeholder="Select method"
              options={[
                { label: "Accrual Basis", value: "Accrual" },
                { label: "Cash Basis", value: "Cash" },
              ]}
            />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Currency
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="baseCurrency"
              label="Base Currency *"
              placeholder="Select currency"
              options={[
                { label: "AED — UAE Dirham", value: "AED" },
                { label: "USD — US Dollar", value: "USD" },
                { label: "EUR — Euro", value: "EUR" },
                { label: "GBP — British Pound", value: "GBP" },
                { label: "SAR — Saudi Riyal", value: "SAR" },
              ]}
            />
            <FormSelect
              name="reportingCurrency"
              label="Reporting Currency"
              placeholder="Select currency"
              options={[
                { label: "AED — UAE Dirham", value: "AED" },
                { label: "USD — US Dollar", value: "USD" },
                { label: "EUR — Euro", value: "EUR" },
                { label: "GBP — British Pound", value: "GBP" },
              ]}
            />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Default Dimensions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="defaultCostCenterId" label="Default Cost Center ID" placeholder="Enter ID" />
            <FormInput name="defaultProjectId" label="Default Project ID" placeholder="Enter ID" />
          </div>
        </div>

        <WizardFooter
          isLoading={isLoading}
          onBack={() => navigate(`/settings/company-setup/wizard/step-1?draftId=${draftId}`)}
        />
    </Form>
  );
};

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { WizardFooter } from "../WizardFooter";
import { step2Schema, type Step2FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

export const Step2Financials = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
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
    },
  });

  const onSubmit = async (data: Step2FormData) => {
    if (!draftId) {
      toast.error("Draft ID missing. Please restart.");
      return;
    }
    setIsLoading(true);
    try {
      await companySetupApi.updateDraft(draftId, { financials: data });
      navigate(`/settings/company-setup/wizard/step-3?draftId=${draftId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Fiscal Period
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormDatePicker name="financialYearStart" label="Financial Year Start *" placeholder="Select date" />
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

        <WizardFooter
          isLoading={isLoading}
          onBack={() => navigate(`/settings/company-setup/wizard/step-1?draftId=${draftId}`)}
        />
      </form>
    </FormProvider>
  );
};

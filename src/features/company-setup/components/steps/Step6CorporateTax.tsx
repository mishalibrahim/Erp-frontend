import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { WizardFooter } from "../WizardFooter";
import { step6Schema, type Step6FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

export const Step6CorporateTax = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step6FormData>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      ctRegistered: false,
      corporateTaxTrn: "",
      freeZonePerson: false,
      qfzpStatus: false,
      smallBusinessRelief: false,
    },
  });

  const ctRegistered = methods.watch("ctRegistered");

  const onSubmit = async (data: Step6FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      await companySetupApi.updateDraft(draftId, { corporateTax: data });
      navigate(`/settings/company-setup/wizard/step-7?draftId=${draftId}`);
    } catch {
      toast.error("Failed to save data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <FormSwitch
            name="ctRegistered"
            label="Company is Corporate Tax Registered"
            description="Enable if the company is registered for UAE Corporate Tax."
          />
        </div>

        {ctRegistered && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              CT Registration Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput name="corporateTaxTrn" label="Corporate Tax TRN" placeholder="CT-XXXXXXXXX" />
              <FormDatePicker name="firstTaxPeriodStart" label="First Tax Period Start" placeholder="Select date" />
            </div>
          </div>
        )}

        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Qualification Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormSwitch
              name="freeZonePerson"
              label="Free Zone Person"
              description="Entity qualifies as a Free Zone person for CT."
            />
            <FormSwitch
              name="qfzpStatus"
              label="QFZP Status"
              description="Qualifying Free Zone Person under FTA rules."
            />
            <div className="sm:col-span-2">
              <FormSwitch
                name="smallBusinessRelief"
                label="Small Business Relief"
                description="Eligible for small business relief (revenue ≤ AED 3M)."
              />
            </div>
          </div>
        </div>

        <WizardFooter
          isLoading={isLoading}
          onBack={() => navigate(`/settings/company-setup/wizard/step-5?draftId=${draftId}`)}
        />
      </form>
    </FormProvider>
  );
};

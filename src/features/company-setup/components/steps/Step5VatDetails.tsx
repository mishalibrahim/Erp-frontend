import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { WizardFooter } from "../WizardFooter";
import { step5Schema, type Step5FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

export const Step5VatDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      vatRegistered: false,
      trnLabel: "TRN",
      trnNumber: "",
      vatScheme: "Standard",
      filingFrequency: "Quarterly",
    },
  });

  const vatRegistered = methods.watch("vatRegistered");

  const onSubmit = async (data: Step5FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      await companySetupApi.updateDraft(draftId, { vatDetails: data });
      navigate(`/settings/company-setup/wizard/step-6?draftId=${draftId}`);
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
            name="vatRegistered"
            label="Company is VAT Registered"
            description="Enable if the company holds a valid VAT TRN issued by the FTA."
          />
        </div>

        {vatRegistered && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              VAT Registration Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput name="trnLabel" label="TRN Label" placeholder="e.g. TRN" />
              <FormInput name="trnNumber" label="TRN Number" placeholder="100XXXXXXXXX003" />
              <FormSelect
                name="vatScheme"
                label="VAT Scheme"
                placeholder="Select scheme"
                options={[
                  { label: "Standard Rate", value: "Standard" },
                  { label: "Margin Scheme", value: "Margin Scheme" },
                  { label: "Exempt", value: "Exempt" },
                ]}
              />
              <FormSelect
                name="filingFrequency"
                label="Filing Frequency"
                placeholder="Select frequency"
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Quarterly", value: "Quarterly" },
                ]}
              />
              <div className="sm:col-span-2">
                <FormDatePicker name="vatRegistrationDate" label="VAT Registration Date" placeholder="Select date" />
              </div>
            </div>
          </div>
        )}

        <WizardFooter
          isLoading={isLoading}
          onBack={() => navigate(`/settings/company-setup/wizard/step-4?draftId=${draftId}`)}
        />
      </form>
    </FormProvider>
  );
};

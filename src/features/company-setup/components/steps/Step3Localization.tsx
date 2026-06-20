import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { WizardFooter } from "../WizardFooter";
import { step3Schema, type Step3FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

export const Step3Localization = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      organizationLanguage: "English",
      invoiceLanguage: "English",
      timeZone: "UTC+04:00 Abu Dhabi, Muscat",
      dateFormat: "DD/MM/YYYY",
    },
  });

  const onSubmit = async (data: Step3FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      await companySetupApi.updateDraft(draftId, { localization: data });
      navigate(`/settings/company-setup/wizard/step-4?draftId=${draftId}`);
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
            Language
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="organizationLanguage"
              label="Organization Language *"
              placeholder="Select language"
              options={[
                { label: "English", value: "English" },
                { label: "Arabic", value: "Arabic" },
              ]}
            />
            <FormSelect
              name="invoiceLanguage"
              label="Invoice Language *"
              placeholder="Select language"
              options={[
                { label: "English", value: "English" },
                { label: "Arabic", value: "Arabic" },
                { label: "Bilingual (En / Ar)", value: "Bilingual" },
              ]}
            />
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Regional
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="timeZone"
              label="Time Zone *"
              placeholder="Select timezone"
              options={[
                { label: "UTC+04:00 — Abu Dhabi, Muscat", value: "UTC+04:00 Abu Dhabi, Muscat" },
                { label: "UTC+03:00 — Riyadh, Kuwait", value: "UTC+03:00 Riyadh" },
                { label: "UTC+00:00 — London (GMT)", value: "UTC+00:00 London" },
                { label: "UTC+05:30 — India (IST)", value: "UTC+05:30 India" },
              ]}
            />
            <FormSelect
              name="dateFormat"
              label="Date Format *"
              placeholder="Select format"
              options={[
                { label: "DD/MM/YYYY (e.g. 16/06/2025)", value: "DD/MM/YYYY" },
                { label: "MM/DD/YYYY (e.g. 06/16/2025)", value: "MM/DD/YYYY" },
                { label: "YYYY-MM-DD (e.g. 2025-06-16)", value: "YYYY-MM-DD" },
              ]}
            />
          </div>
        </div>

        <WizardFooter
          isLoading={isLoading}
          onBack={() => navigate(`/settings/company-setup/wizard/step-2?draftId=${draftId}`)}
        />
      </form>
    </FormProvider>
  );
};

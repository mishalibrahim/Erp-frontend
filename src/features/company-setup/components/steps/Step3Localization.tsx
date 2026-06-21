import { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import {
  step3Schema,
  type Step3FormData,
} from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import type { CompanySetupContextType } from "../CompanySetupWizard";

export const Step3Localization = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion, setRowVersion } =
    useOutletContext<CompanySetupContextType>();
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

  useEffect(() => {
    if (draftData) {
      const locData = draftData.localization || draftData;
      methods.reset({ ...methods.getValues(), ...locData });
    }
  }, [draftData, methods]);

  const onSubmit = async (data: Step3FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      const response = await companySetupApi.updateLocalization(draftId, {
        ...data,
        rowVersion,
      });
      setRowVersion(response.rowVersion);
      navigate(`/settings/company-setup/wizard/step-4?draftId=${draftId}`);
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

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Communication Languages</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              "English",
              "Arabic",
              "Hindi",
              "Urdu",
              "French",
              "Filipino",
              "Malayalam",
              "Tamil",
            ].map((lang) => {
              const isSelected =
                methods.watch("communicationLanguages")?.includes(lang) ||
                false;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    const current =
                      methods.getValues("communicationLanguages") || [];
                    if (isSelected) {
                      methods.setValue(
                        "communicationLanguages",
                        current.filter((l) => l !== lang),
                      );
                    } else {
                      methods.setValue("communicationLanguages", [
                        ...current,
                        lang,
                      ]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
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
              {
                label: "UTC+04:00 — Abu Dhabi, Muscat",
                value: "UTC+04:00 Abu Dhabi, Muscat",
              },
              {
                label: "UTC+03:00 — Riyadh, Kuwait",
                value: "UTC+03:00 Riyadh",
              },
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
        onBack={() =>
          navigate(`/settings/company-setup/wizard/step-2?draftId=${draftId}`)
        }
      />
    </Form>
  );
};

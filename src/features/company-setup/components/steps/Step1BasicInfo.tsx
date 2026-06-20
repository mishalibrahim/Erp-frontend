import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { FormCountrySelect } from "@/components/hook-form/FormCountrySelect";
import { WizardFooter } from "../WizardFooter";
import { step1Schema, type Step1FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

export const Step1BasicInfo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      companyName: "",
      tradeName: "",
      companyCode: "",
      licenseNumber: "",
      licenseType: "",
      country: "United Arab Emirates",
      isFreeZoneEntity: false,
      isDesignatedZone: false,
    },
  });

  const onSubmit = async (data: Step1FormData) => {
    setIsLoading(true);
    try {
      if (draftId) {
        await companySetupApi.updateDraft(draftId, data);
        navigate(`/settings/company-setup/wizard/step-2?draftId=${draftId}`);
      } else {
        const response = await companySetupApi.createDraft(data);
        toast.success("Company draft created!");
        navigate(`/settings/company-setup/wizard/step-2?draftId=${response.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {/* Identity */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Company Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="companyName" label="Company Name *" placeholder="Acme Corp LLC" />
            <FormInput name="tradeName" label="Trade Name" placeholder="Acme (optional)" />
            <FormInput name="companyCode" label="Company Code *" placeholder="e.g. ACME-001" />
            <FormCountrySelect name="country" label="Country *" />
          </div>
        </div>

        {/* License */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            License Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="licenseNumber" label="License Number *" placeholder="CN-1234567" />
            <FormSelect
              name="licenseType"
              label="License Type *"
              placeholder="Select type"
              options={[
                { label: "Commercial", value: "Commercial" },
                { label: "Professional", value: "Professional" },
                { label: "Industrial", value: "Industrial" },
              ]}
            />
            <FormDatePicker name="registrationDate" label="Registration Date *" placeholder="Select date" />
            <FormDatePicker name="licenseExpiryDate" label="License Expiry Date" placeholder="Select date (optional)" />
            <div className="sm:col-span-2">
              <FormInput name="emirate" label="Emirate / State" placeholder="e.g. Dubai" />
            </div>
          </div>
        </div>

        {/* Jurisdiction flags */}
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Jurisdiction
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormSwitch
              name="isFreeZoneEntity"
              label="Free Zone Entity"
              description="Company is registered in a UAE Free Zone."
            />
            <FormSwitch
              name="isDesignatedZone"
              label="Designated Zone"
              description="Applicable for VAT designated zones."
            />
          </div>
        </div>

        <WizardFooter isLoading={isLoading} />
      </form>
    </FormProvider>
  );
};

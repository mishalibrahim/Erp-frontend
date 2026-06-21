import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { FormCountrySelect } from "@/components/hook-form/FormCountrySelect";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import { step1Schema, type Step1FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import type { CompanySetupContextType } from "../CompanySetupWizard";

export const Step1BasicInfo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion, setRowVersion } = useOutletContext<CompanySetupContextType>();
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

  useEffect(() => {
    if (draftData) {
      methods.reset({ ...methods.getValues(), ...draftData });
    }
  }, [draftData, methods]);

  const isFreeZoneEntity = methods.watch("isFreeZoneEntity");

  const onSubmit = async (data: Step1FormData) => {
    setIsLoading(true);
    const cleanData = {
      ...data,
      licenseExpiryDate: data.licenseExpiryDate || undefined,
      rowVersion,
    };
    try {
      if (draftId) {
        const response = await companySetupApi.updateGeneral(draftId, cleanData);
        if (setRowVersion) setRowVersion(response.rowVersion);
        navigate(`/settings/company-setup/wizard/step-2?draftId=${draftId}`);
      } else {
        const response = await companySetupApi.createDraft(cleanData);
        toast.success("Company draft created!");
        navigate(`/settings/company-setup/wizard/step-2?draftId=${response.id}`);
      }
    } catch {
      // Error is handled by global axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
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
            <FormInput name="emirate" label="Emirate / State" placeholder="e.g. Dubai" />
            <FormInput name="placeOfIncorporation" label="Place of Incorporation" placeholder="e.g. UAE" />
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
            {isFreeZoneEntity && (
              <FormSwitch
                name="isDesignatedZone"
                label="Designated Zone"
                description="Applicable for VAT designated zones."
              />
            )}
          </div>
        </div>

        <WizardFooter isLoading={isLoading} />
    </Form>
  );
};

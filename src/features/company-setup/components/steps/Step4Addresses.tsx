import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormCountrySelect } from "@/components/hook-form/FormCountrySelect";
import { FormPhoneInput } from "@/components/hook-form/FormPhoneInput";
import { WizardFooter } from "../WizardFooter";
import { step4Schema, type Step4FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

const AddressFields = ({ prefix }: { prefix: "registeredAddress" | "billingAddress" }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="sm:col-span-2">
      <FormInput name={`${prefix}.addressLine1`} label="Address Line 1" placeholder="Street address, building" />
    </div>
    <div className="sm:col-span-2">
      <FormInput name={`${prefix}.addressLine2`} label="Address Line 2" placeholder="Floor, unit, suite (optional)" />
    </div>
    <FormInput name={`${prefix}.city`} label="City" placeholder="e.g. Dubai" />
    <FormInput name={`${prefix}.emirate`} label="Emirate / State" placeholder="e.g. Dubai" />
    <FormCountrySelect name={`${prefix}.country`} label="Country" />
    <FormInput name={`${prefix}.poBox`} label="P.O. Box" placeholder="e.g. 12345" />
    <FormPhoneInput name={`${prefix}.phoneNumber`} label="Phone Number" />
    <FormInput name={`${prefix}.faxNumber`} label="Fax Number" placeholder="+971 4 xxx xxxx (optional)" />
  </div>
);

export const Step4Addresses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      registeredAddress: {
        addressLine1: "",
        city: "",
        country: "United Arab Emirates",
        phoneNumber: "",
      },
      billingAddress: {
        addressLine1: "",
        city: "",
        country: "United Arab Emirates",
        phoneNumber: "",
      },
    },
  });

  const onSubmit = async (data: Step4FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      await companySetupApi.updateDraft(draftId, {
        registeredAddress: data.registeredAddress,
        billingAddress: data.billingAddress,
      });
      navigate(`/settings/company-setup/wizard/step-5?draftId=${draftId}`);
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
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Registered Address
          </h3>
          <AddressFields prefix="registeredAddress" />
        </div>

        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Billing Address
          </h3>
          <AddressFields prefix="billingAddress" />
        </div>

        <WizardFooter
          isLoading={isLoading}
          onBack={() => navigate(`/settings/company-setup/wizard/step-3?draftId=${draftId}`)}
        />
      </form>
    </FormProvider>
  );
};

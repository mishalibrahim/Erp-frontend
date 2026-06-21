import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormCountrySelect } from "@/components/hook-form/FormCountrySelect";
import { FormPhoneInput } from "@/components/hook-form/FormPhoneInput";
import { TogglePill } from "@/components/hook-form/FormSwitch";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import { step4Schema, type Step4FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import type { CompanySetupContextType } from "../CompanySetupWizard";
import { Label } from "@/components/ui/label";

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
  const { draftData, rowVersion, setRowVersion } = useOutletContext<CompanySetupContextType>();
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsRegistered, setSameAsRegistered] = useState(false);

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

  useEffect(() => {
    if (draftData) {
      const registeredAddress = draftData.registeredAddress || methods.getValues().registeredAddress;
      const billingAddress = draftData.billingAddress || methods.getValues().billingAddress;
      
      // Auto-check if addresses are deeply identical (basic check)
      if (draftData.registeredAddress && draftData.billingAddress && JSON.stringify(draftData.registeredAddress) === JSON.stringify(draftData.billingAddress)) {
        setSameAsRegistered(true);
      }
      
      methods.reset({ ...methods.getValues(), registeredAddress, billingAddress });
    }
  }, [draftData, methods]);

  const onSubmit = async (data: Step4FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    
    // Copy registered address to billing if checked
    const finalBillingAddress = sameAsRegistered ? data.registeredAddress : data.billingAddress;
    
    try {
      const response = await companySetupApi.updateAddresses(draftId, {
        registeredAddress: data.registeredAddress,
        billingAddress: finalBillingAddress,
        rowVersion,
      });
      setRowVersion(response.rowVersion);
      navigate(`/settings/company-setup/wizard/step-5?draftId=${draftId}`);
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
          Registered Address
        </h3>
        <AddressFields prefix="registeredAddress" />
      </div>

      <div className="mb-6 pb-6 border-b border-border/50">
        <div 
          className="flex items-center gap-4 rounded-lg border border-input bg-background px-4 py-3.5 transition-colors cursor-pointer select-none hover:bg-muted/40"
          onClick={() => setSameAsRegistered(!sameAsRegistered)}
        >
          <div className="flex-1 min-w-0">
            <Label htmlFor="same-as-registered" className="text-sm font-medium leading-none cursor-pointer">
              Billing Address is the same as Registered Address
            </Label>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <TogglePill
              id="same-as-registered"
              checked={sameAsRegistered}
              onChange={setSameAsRegistered}
            />
          </div>
        </div>
      </div>

      {!sameAsRegistered && (
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Billing Address
          </h3>
          <AddressFields prefix="billingAddress" />
        </div>
      )}

      <WizardFooter
        isLoading={isLoading}
        onBack={() => navigate(`/settings/company-setup/wizard/step-3?draftId=${draftId}`)}
      />
    </Form>
  );
};

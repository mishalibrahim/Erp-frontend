import { useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import {
  EMIRATES,
  LICENSE_TYPES,
  COUNTRIES,
} from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { useEffect } from "react";
import { Hash } from "lucide-react";

export const GeneralInfoSection = () => {
  const { setValue } = useFormContext<CompanySetupFormValues>();
  const companyName = useWatch<CompanySetupFormValues>({ name: "companyName" });
  const isFreeZone = useWatch<CompanySetupFormValues>({ name: "isFreeZoneEntity" });

  // Auto-generate company code from name
  useEffect(() => {
    if (companyName && typeof companyName === "string") {
      const words = companyName.trim().split(/\s+/);
      const prefix = words
        .map((w: string) => w.charAt(0).toUpperCase())
        .join("")
        .slice(0, 4);
      const code = `${prefix}-${String(Date.now()).slice(-4)}`;
      setValue("companyCode", code);
    }
  }, [companyName, setValue]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          <Hash className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">General Information</h3>
          <p className="text-sm text-muted-foreground">
            Basic company registration details
          </p>
        </div>
      </div>

      {/* Row 1: Company Name + Trade Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          name="companyName"
          label="Company Name (Legal) *"
          placeholder="Enter legal company name"
        />
        <FormInput
          name="tradeName"
          label="Trade Name"
          placeholder="Enter trade name (optional)"
        />
      </div>

      {/* Row 2: Company Code + License Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          name="companyCode"
          label="Company Code"
          placeholder="Auto-generated"
          disabled
          className="bg-muted/50 cursor-not-allowed"
        />
        <FormInput
          name="licenseNumber"
          label="License Number *"
          placeholder="Enter license number"
        />
      </div>

      {/* Row 3: License Type + Registration Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          name="licenseType"
          label="License Type *"
          placeholder="Select license type"
          options={LICENSE_TYPES}
        />
        <FormDatePicker
          name="registrationDate"
          label="Registration Date *"
          placeholder="Select registration date"
        />
      </div>

      {/* Row 4: License Expiry + Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormDatePicker
          name="licenseExpiryDate"
          label="License Expiry Date"
          placeholder="Select expiry date (optional)"
        />
        <FormSelect
          name="country"
          label="Country *"
          placeholder="Select country"
          options={COUNTRIES}
        />
      </div>

      {/* Row 5: Emirate + Place of Incorporation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          name="emirate"
          label="Emirate *"
          placeholder="Select emirate"
          options={EMIRATES}
        />
        <FormSelect
          name="placeOfIncorporation"
          label="Place of Incorporation *"
          placeholder="Select place"
          options={EMIRATES}
        />
      </div>

      {/* Row 6: Free Zone toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSwitch
          name="isFreeZoneEntity"
          label="Free Zone Entity"
          description="Is this company registered in a Free Zone?"
        />
        {isFreeZone && (
          <FormSwitch
            name="isDesignatedZone"
            label="Designated Zone"
            description="Is the Free Zone a Designated Zone?"
          />
        )}
      </div>
    </div>
  );
};

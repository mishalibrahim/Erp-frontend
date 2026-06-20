import { useWatch } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { EMIRATES, COUNTRIES } from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { MapPin } from "lucide-react";

export const AddressSection = () => {
  const sameAsRegistered = useWatch<CompanySetupFormValues>({ name: "sameAsRegistered" });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Address Details</h3>
          <p className="text-sm text-muted-foreground">
            Registered and billing address information
          </p>
        </div>
      </div>

      {/* ── Registered Address ── */}
      <div className="rounded-xl border border-border/60 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          Registered Address
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            name="registeredAddressLine1"
            label="Address Line 1 *"
            placeholder="Street address"
          />
          <FormInput
            name="registeredAddressLine2"
            label="Address Line 2"
            placeholder="Suite, floor, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormInput
            name="registeredCity"
            label="City *"
            placeholder="City"
          />
          <FormSelect
            name="registeredEmirate"
            label="Emirate *"
            placeholder="Select emirate"
            options={EMIRATES}
          />
          <FormInput
            name="registeredPoBox"
            label="PO Box"
            placeholder="PO Box"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormSelect
            name="registeredCountry"
            label="Country *"
            placeholder="Select country"
            options={COUNTRIES}
          />
          <FormInput
            name="registeredPhone"
            label="Phone Number *"
            placeholder="+971 XX XXX XXXX"
            type="tel"
          />
          <FormInput
            name="registeredFax"
            label="Fax Number"
            placeholder="Fax number (optional)"
          />
        </div>
      </div>

      {/* ── Same as Registered ── */}
      <FormSwitch
        name="sameAsRegistered"
        label="Same as Registered Address"
        description="Use the registered address as the billing address"
      />

      {/* ── Billing Address (conditional) ── */}
      {!sameAsRegistered && (
        <div className="rounded-xl border border-border/60 p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
            Billing Address
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              name="billingAddressLine1"
              label="Address Line 1 *"
              placeholder="Street address"
            />
            <FormInput
              name="billingAddressLine2"
              label="Address Line 2"
              placeholder="Suite, floor, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInput
              name="billingCity"
              label="City *"
              placeholder="City"
            />
            <FormSelect
              name="billingEmirate"
              label="Emirate"
              placeholder="Select emirate"
              options={EMIRATES}
            />
            <FormInput
              name="billingPoBox"
              label="PO Box"
              placeholder="PO Box"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormSelect
              name="billingCountry"
              label="Country"
              placeholder="Select country"
              options={COUNTRIES}
            />
            <FormInput
              name="billingPhone"
              label="Phone Number"
              placeholder="+971 XX XXX XXXX"
              type="tel"
            />
            <FormInput
              name="billingFax"
              label="Fax Number"
              placeholder="Fax number"
            />
          </div>
        </div>
      )}
    </div>
  );
};

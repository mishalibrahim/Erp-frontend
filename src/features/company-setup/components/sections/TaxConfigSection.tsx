import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TaxConfigSection = () => {
  const { control } = useFormContext<CompanySetupFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "taxRates",
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tax Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Define tax rates, GL account mapping, and tax groups
          </p>
        </div>
      </div>

      {/* Default VAT Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          name="defaultVatRate"
          label="Default VAT Rate (%)"
          placeholder="5"
          type="number"
        />
        <FormInput
          name="taxGroups"
          label="Tax Groups / Categories"
          placeholder="e.g. Standard, Zero-Rated, Exempt"
        />
      </div>

      {/* GL Account Mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          name="inputVatGlAccount"
          label="Input VAT GL Account"
          placeholder="e.g. 2310"
        />
        <FormInput
          name="outputVatGlAccount"
          label="Output VAT GL Account"
          placeholder="e.g. 2320"
        />
      </div>

      {/* Tax Rates Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
            Tax Rates
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: "",
                rate: 0,
                description: "",
                isDefault: false,
              })
            }
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Rate
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
            <Calculator className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No tax rates configured. Click "Add Rate" to begin.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border border-border/60 p-4 bg-card/50 hover:border-border transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <FormInput
                    name={`taxRates.${index}.name`}
                    label="Tax Name"
                    placeholder="e.g. Standard VAT"
                  />
                </div>
                <div className="md:col-span-2">
                  <FormInput
                    name={`taxRates.${index}.rate`}
                    label="Rate (%)"
                    placeholder="5"
                    type="number"
                  />
                </div>
                <div className="md:col-span-5">
                  <FormInput
                    name={`taxRates.${index}.description`}
                    label="Description"
                    placeholder="Description (optional)"
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

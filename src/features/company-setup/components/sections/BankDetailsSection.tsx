import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { CURRENCIES } from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { CreditCard, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BankDetailsSection = () => {
  const { control, setValue, watch } = useFormContext<CompanySetupFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bankAccounts",
  });

  const bankAccounts = watch("bankAccounts");

  const setPrimary = (index: number) => {
    bankAccounts.forEach((_: unknown, i: number) => {
      setValue(`bankAccounts.${i}.isPrimary`, i === index);
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Bank Details</h3>
          <p className="text-sm text-muted-foreground">
            Add bank accounts and designate a primary account
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              bankName: "",
              accountName: "",
              accountNumber: "",
              iban: "",
              swiftCode: "",
              currency: "AED",
              isPrimary: fields.length === 0,
            })
          }
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Bank Account
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 p-10 text-center">
          <CreditCard className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground mb-1">
            No bank accounts added yet
          </p>
          <p className="text-xs text-muted-foreground/70">
            Click "Add Bank Account" to get started
          </p>
        </div>
      )}

      {/* Bank Account Cards */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const isPrimary = bankAccounts?.[index]?.isPrimary;

          return (
            <div
              key={field.id}
              className={`rounded-xl border p-5 transition-all duration-200 ${
                isPrimary
                  ? "border-primary/40 bg-primary/5 shadow-sm"
                  : "border-border/60 bg-card/50 hover:border-border"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/80">
                    Bank Account #{index + 1}
                  </span>
                  {isPrimary && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!isPrimary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrimary(index)}
                      className="text-xs gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Set Primary
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name={`bankAccounts.${index}.bankName`}
                  label="Bank Name *"
                  placeholder="e.g. Emirates NBD"
                />
                <FormInput
                  name={`bankAccounts.${index}.accountName`}
                  label="Account Name *"
                  placeholder="Account holder name"
                />
                <FormInput
                  name={`bankAccounts.${index}.accountNumber`}
                  label="Account Number *"
                  placeholder="Enter account number"
                />
                <FormInput
                  name={`bankAccounts.${index}.iban`}
                  label="IBAN *"
                  placeholder="e.g. AE07033..."
                />
                <FormInput
                  name={`bankAccounts.${index}.swiftCode`}
                  label="SWIFT Code *"
                  placeholder="e.g. EABORAEAXXX"
                />
                <FormSelect
                  name={`bankAccounts.${index}.currency`}
                  label="Currency *"
                  placeholder="Select currency"
                  options={CURRENCIES}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

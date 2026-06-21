import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import { step7Schema, type Step7FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import { Plus, Trash2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompanySetupContextType } from "../CompanySetupWizard";

export const Step7BankDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion, setRowVersion } = useOutletContext<CompanySetupContextType>();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step7FormData>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      bankAccounts: [],
    },
  });

  useEffect(() => {
    if (draftData) {
      const bankData = draftData.bankAccounts ? { bankAccounts: draftData.bankAccounts } : draftData;
      methods.reset({ ...methods.getValues(), ...bankData });
    }
  }, [draftData, methods]);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "bankAccounts",
  });

  const onSubmit = async (data: Step7FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    
    // Sanitize optional string fields and IDs
    const cleanData = {
      bankAccounts: data.bankAccounts.map(account => ({
        ...account,
        id: account.id || undefined,
        iban: account.iban || undefined,
        swiftCode: account.swiftCode || undefined,
      })),
    };

    try {
      const response = await companySetupApi.updateBankAccounts(draftId, { ...cleanData, rowVersion });
      setRowVersion(response.rowVersion);
      navigate(`/settings/company-setup/wizard/step-8?draftId=${draftId}`);
    } catch {
      // Error is handled by global axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="mb-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Bank Details</h3>
            <p className="text-sm text-muted-foreground">
              Add primary and secondary bank accounts for the company
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Bank Accounts
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ 
              bankName: "", 
              accountName: "", 
              accountNumber: "", 
              iban: "", 
              swiftCode: "", 
              currency: "", 
              isPrimary: fields.length === 0 
            })}
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Account
          </Button>
        </div>
        
        {fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center bg-card/30">
            <Landmark className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No bank accounts added yet.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 rounded-xl border border-border bg-card/50 relative">
              <div className="absolute top-4 right-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
                <FormInput name={`bankAccounts.${index}.bankName`} label="Bank Name" placeholder="e.g. Emirates NBD" />
                <FormInput name={`bankAccounts.${index}.accountName`} label="Account Name" placeholder="e.g. Acme Corp LLC" />
                <FormInput name={`bankAccounts.${index}.accountNumber`} label="Account Number" placeholder="e.g. 101202303" />
                <FormInput name={`bankAccounts.${index}.iban`} label="IBAN" placeholder="e.g. AE1200000000" />
                <FormInput name={`bankAccounts.${index}.swiftCode`} label="SWIFT Code" placeholder="e.g. ENBDAEA" />
                <FormInput name={`bankAccounts.${index}.currency`} label="Currency" placeholder="e.g. AED" />
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <FormSwitch
                  name={`bankAccounts.${index}.isPrimary`}
                  label="Primary Account"
                  description="Set this as the default bank account for transactions"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <WizardFooter
        isLoading={isLoading}
        onBack={() => navigate(`/settings/company-setup/wizard/step-6?draftId=${draftId}`)}
      />
    </Form>
  );
};

import { useState, useEffect, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import {
  step5Schema,
  type Step5FormData,
} from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompanySetupContextType } from "../CompanySetupWizard";

import type { Resolver } from "react-hook-form";

export const Step5Taxes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion, setRowVersion } =
    useOutletContext<CompanySetupContextType>();
  const [isLoading, setIsLoading] = useState(false);

  const defaultFormValues = useMemo(() => {
    const legacyData = draftData as any;
    const taxesData: any = draftData ? {
      ...draftData.vatDetails,
      ...draftData.corporateTax,
      ...draftData,
      defaultVatRateId: draftData.defaultVatRateId || legacyData?.taxConfiguration?.defaultVatRateId || null,
      inputVatAccountId: draftData.inputVatAccountId || legacyData?.taxConfiguration?.inputVatAccountId || "",
      outputVatAccountId: draftData.outputVatAccountId || legacyData?.taxConfiguration?.outputVatAccountId || "",
      taxGroups: draftData.taxGroups || [],
    } : {};

    return {
      vatRegistered: taxesData.vatRegistered ?? false,
      trnLabel: taxesData.trnLabel || "TRN",
      trnNumber: taxesData.trnNumber || "",
      vatScheme: taxesData.vatScheme || "Standard",
      filingFrequency: taxesData.filingFrequency || "Quarterly",
      vatRegistrationDate: taxesData.vatRegistrationDate || "",
      firstVatPeriod: taxesData.firstVatPeriod || "",
      vatReturnStartPeriod: taxesData.vatReturnStartPeriod || "",
      vatDeregistrationDate: taxesData.vatDeregistrationDate || "",
      ctRegistered: taxesData.ctRegistered ?? false,
      corporateTaxTrn: taxesData.corporateTaxTrn || "",
      firstTaxPeriodStart: taxesData.firstTaxPeriodStart || "",
      freeZonePerson: taxesData.freeZonePerson ?? false,
      qfzpStatus: taxesData.qfzpStatus ?? false,
      smallBusinessRelief: taxesData.smallBusinessRelief ?? false,
      defaultVatRateId: taxesData.defaultVatRateId || null,
      inputVatAccountId: taxesData.inputVatAccountId || "",
      outputVatAccountId: taxesData.outputVatAccountId || "",
      taxGroups: taxesData.taxGroups || [],
    };
  }, [draftData]);

  const methods = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema) as Resolver<Step5FormData>,
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (draftData) {
      methods.reset(defaultFormValues);
    }
  }, [defaultFormValues, methods]);

  const vatRegistered = methods.watch("vatRegistered");
  const ctRegistered = methods.watch("ctRegistered");

  const {
    fields: taxGroupsFields,
    append: appendTaxGroup,
    remove: removeTaxGroup,
  } = useFieldArray({
    control: methods.control,
    name: "taxGroups",
  });

  const onSubmit = async (data: Step5FormData) => {
    if (!draftId) return;
    setIsLoading(true);

    try {
      const response = await companySetupApi.updateTaxes(draftId, {
        ...data,
        rowVersion,
      });
      setRowVersion(response.rowVersion);
      navigate(`/settings/company-setup/wizard/step-6?draftId=${draftId}`);
    } catch {
      // Error is handled by global axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {/* ─── VAT DETAILS ─── */}
      <div className="mb-6">
        <FormSwitch
          name="vatRegistered"
          label="Company is VAT Registered"
          description="Enable if the company holds a valid VAT TRN issued by the FTA."
        />
      </div>

      {vatRegistered && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            VAT Registration Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="trnLabel"
              label="TRN Label"
              placeholder="e.g. TRN"
            />
            <FormInput
              name="trnNumber"
              label="TRN Number"
              placeholder="100XXXXXXXXX003"
            />
            <FormSelect
              name="vatScheme"
              label="VAT Scheme"
              placeholder="Select scheme"
              options={[
                { label: "Standard Rate", value: "Standard" },
                { label: "Margin Scheme", value: "Margin Scheme" },
                { label: "Exempt", value: "Exempt" },
              ]}
            />
            <FormSelect
              name="filingFrequency"
              label="Filing Frequency"
              placeholder="Select frequency"
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "Quarterly", value: "Quarterly" },
              ]}
            />
            <FormDatePicker
              name="vatRegistrationDate"
              label="VAT Registration Date"
              placeholder="Select date"
            />
            <FormDatePicker
              name="vatDeregistrationDate"
              label="VAT Deregistration Date"
              placeholder="Select date (optional)"
            />
            <FormDatePicker
              name="firstVatPeriod"
              label="First VAT Period"
              placeholder="Select date"
            />
            <FormDatePicker
              name="vatReturnStartPeriod"
              label="VAT Return Start Period"
              placeholder="Select date"
            />
          </div>
        </div>
      )}

      {/* ─── CORPORATE TAX ─── */}
      <div className="mb-6 pt-6 border-t border-border/50">
        <FormSwitch
          name="ctRegistered"
          label="Company is Corporate Tax Registered"
          description="Enable if the company is registered for UAE Corporate Tax."
        />
      </div>

      {ctRegistered && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            CT Registration Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="corporateTaxTrn"
              label="Corporate Tax TRN"
              placeholder="CT-XXXXXXXXX"
            />
            <FormDatePicker
              name="firstTaxPeriodStart"
              label="First Tax Period Start"
              placeholder="Select date"
            />
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Qualification Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormSwitch
            name="freeZonePerson"
            label="Free Zone Person"
            description="Entity qualifies as a Free Zone person for CT."
          />
          <FormSwitch
            name="qfzpStatus"
            label="QFZP Status"
            description="Qualifying Free Zone Person under FTA rules."
          />
          <div className="sm:col-span-2">
            <FormSwitch
              name="smallBusinessRelief"
              label="Small Business Relief"
              description="Eligible for small business relief (revenue ≤ AED 3M)."
            />
          </div>
        </div>
      </div>

      {/* ─── GLOBAL TAX CONFIG & RATES ─── */}
      <div className="pt-6 border-t border-border/50">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Global Tax Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              name="defaultVatRateId"
              label="Default VAT Rate"
              placeholder="Select a saved rate"
              options={methods.watch("taxGroups")?.flatMap(g => g.taxRates?.filter(r => r.id).map(r => ({ label: `${g.name} (${r.ratePercentage}%)`, value: r.id! })) || []) || []}
            />
            <FormInput name="inputVatAccountId" label="Input VAT GL Account" placeholder="e.g. 2310" />
            <FormInput name="outputVatAccountId" label="Output VAT GL Account" placeholder="e.g. 2320" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tax Groups & Rates</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendTaxGroup({ name: "", description: "", isActive: true, taxRates: [] })} className="gap-1.5 h-8 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Group
            </Button>
          </div>
          {taxGroupsFields.length === 0 && (<p className="text-sm text-muted-foreground italic mb-4">No tax groups defined.</p>)}
          <div className="space-y-6">
            {taxGroupsFields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-border bg-card/30 relative">
                <div className="absolute top-4 right-4">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeTaxGroup(index)} className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10 mb-4">
                  <FormInput name={`taxGroups.${index}.name`} label="Group Name" placeholder="e.g. Standard VAT" />
                  <FormInput name={`taxGroups.${index}.description`} label="Description" placeholder="Optional info" />
                </div>
                <div className="mb-4 pb-4 border-b border-border/50">
                  <FormSwitch name={`taxGroups.${index}.isActive`} label="Active Group" description="Enable or disable this tax group." />
                </div>
                
                <TaxRatesArray control={methods.control} groupIndex={index} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <WizardFooter isLoading={isLoading} onBack={() => navigate(`/settings/company-setup/wizard/step-4?draftId=${draftId}`)} />
    </Form>
  );
};

// Sub-component to handle nested field array
const TaxRatesArray = ({ control, groupIndex }: { control: any, groupIndex: number }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `taxGroups.${groupIndex}.taxRates`,
  });

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tax Rates</h4>
        <Button type="button" variant="secondary" size="sm" onClick={() => append({ ratePercentage: 0, effectiveFrom: "", effectiveTo: "", isActive: true })} className="gap-1.5 h-7 text-xs">
          <Plus className="w-3 h-3" /> Add Rate
        </Button>
      </div>
      {fields.length === 0 && <p className="text-xs text-muted-foreground italic">No rates added to this group yet.</p>}
      <div className="space-y-3">
        {fields.map((field, rateIndex) => (
          <div key={field.id} className="p-4 rounded-lg border border-border bg-background relative">
            <div className="absolute top-4 right-4">
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(rateIndex)} className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mr-10">
              <FormInput name={`taxGroups.${groupIndex}.taxRates.${rateIndex}.ratePercentage`} label="Rate (%)" type="number" placeholder="5" />
              <FormDatePicker name={`taxGroups.${groupIndex}.taxRates.${rateIndex}.effectiveFrom`} label="Effective From" placeholder="Select date" />
              <FormDatePicker name={`taxGroups.${groupIndex}.taxRates.${rateIndex}.effectiveTo`} label="Effective To" placeholder="Select date (optional)" />
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <FormSwitch name={`taxGroups.${groupIndex}.taxRates.${rateIndex}.isActive`} label="Active Rate" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

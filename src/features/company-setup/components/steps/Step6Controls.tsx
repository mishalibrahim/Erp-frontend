import { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import {
  step6Schema,
  type Step6FormData,
} from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompanySetupContextType } from "../CompanySetupWizard";

import type { Resolver } from "react-hook-form";

export const Step6Controls = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion, setRowVersion } =
    useOutletContext<CompanySetupContextType>();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step6FormData>({
    resolver: zodResolver(step6Schema) as Resolver<Step6FormData>,
    defaultValues: {
      multiCompanyEnable: false,
      auditTrailEnable: true,
      approvalWorkflow: true,
      postingGroups: [],
      documentNumberSeries: [],
    },
  });

  useEffect(() => {
    if (draftData) {
      const controlsData = {
        ...draftData.controls,
        postingGroups: draftData.postingGroups || [],
        documentNumberSeries: draftData.documentNumberSeries || [],
      };
      methods.reset({ ...methods.getValues(), ...controlsData });
    }
  }, [draftData, methods]);

  const {
    fields: postingGroupFields,
    append: appendPostingGroup,
    remove: removePostingGroup,
  } = useFieldArray({
    control: methods.control,
    name: "postingGroups",
  });

  const {
    fields: numberSeriesFields,
    append: appendNumberSeries,
    remove: removeNumberSeries,
  } = useFieldArray({
    control: methods.control,
    name: "documentNumberSeries",
  });

  const onSubmit = async (data: Step6FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      const response = await companySetupApi.updateControls(draftId, {
        ...data,
        rowVersion,
      });
      setRowVersion(response.rowVersion);
      navigate(`/settings/company-setup/wizard/step-7?draftId=${draftId}`);
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
          System Controls
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <FormSwitch
            name="multiCompanyEnable"
            label="Multi-Company Processing"
            description="Allows managing multiple companies within this tenant."
          />
          <FormSwitch
            name="auditTrailEnable"
            label="Audit Trail"
            description="Logs all user actions for compliance and accountability."
          />
          <FormSwitch
            name="approvalWorkflow"
            label="Approval Workflows"
            description="Enforces multi-level approval rules for financial transactions."
          />
        </div>
      </div>

      {/* Posting Groups */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Posting Groups
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendPostingGroup({
                groupName: "",
                type: "Customer",
                receivablesAccountId: "",
                payablesAccountId: "",
                inventoryAccountId: "",
                cogsAccountId: "",
                isActive: true,
              })
            }
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Group
          </Button>
        </div>

        {postingGroupFields.length === 0 && (
          <p className="text-sm text-muted-foreground italic mb-4">
            No posting groups defined.
          </p>
        )}

        <div className="space-y-3">
          {postingGroupFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 relative"
            >
              <div className="absolute top-4 right-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePostingGroup(index)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
                <FormInput
                  name={`postingGroups.${index}.groupName`}
                  label="Group Name"
                  placeholder="e.g. Trade Receivables"
                />
                <FormSelect
                  name={`postingGroups.${index}.type`}
                  label="Type"
                  placeholder="Select type"
                  options={[
                    { label: "Customer", value: "Customer" },
                    { label: "Vendor", value: "Vendor" },
                    { label: "Inventory", value: "Inventory" },
                  ]}
                />
                <FormInput
                  name={`postingGroups.${index}.receivablesAccountId`}
                  label="Receivables Account ID"
                  placeholder="e.g. 1010"
                />
                <FormInput
                  name={`postingGroups.${index}.payablesAccountId`}
                  label="Payables Account ID"
                  placeholder="e.g. 2010"
                />
                <FormInput
                  name={`postingGroups.${index}.inventoryAccountId`}
                  label="Inventory Account ID"
                  placeholder="e.g. 1510"
                />
                <FormInput
                  name={`postingGroups.${index}.cogsAccountId`}
                  label="COGS Account ID"
                  placeholder="e.g. 5010"
                />
              </div>
              <div className="mt-2 pt-2 border-t border-border/50">
                <FormSwitch
                  name={`postingGroups.${index}.isActive`}
                  label="Active"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Number Series */}
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Document Number Series
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendNumberSeries({
                documentType: "",
                prefix: "",
                currentNumber: 1,
                suffix: "",
                isActive: true,
              })
            }
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Series
          </Button>
        </div>

        {numberSeriesFields.length === 0 && (
          <p className="text-sm text-muted-foreground italic mb-4">
            No number series defined.
          </p>
        )}

        <div className="space-y-3">
          {numberSeriesFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 relative"
            >
              <div className="absolute top-4 right-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeNumberSeries(index)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mr-10">
                <FormInput
                  name={`documentNumberSeries.${index}.documentType`}
                  label="Document Type"
                  placeholder="e.g. Invoice"
                />
                <FormInput
                  name={`documentNumberSeries.${index}.prefix`}
                  label="Prefix"
                  placeholder="e.g. INV-"
                />
                <FormInput
                  name={`documentNumberSeries.${index}.suffix`}
                  label="Suffix"
                  placeholder="Optional"
                />
                <FormInput
                  name={`documentNumberSeries.${index}.currentNumber`}
                  label="Current Number"
                  type="number"
                  placeholder="1"
                />
              </div>
              <div className="mt-2 pt-2 border-t border-border/50">
                <FormSwitch
                  name={`documentNumberSeries.${index}.isActive`}
                  label="Active"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <WizardFooter
        isLoading={isLoading}
        onBack={() =>
          navigate(`/settings/company-setup/wizard/step-5?draftId=${draftId}`)
        }
      />
    </Form>
  );
};

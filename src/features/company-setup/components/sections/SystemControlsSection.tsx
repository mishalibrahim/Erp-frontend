import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { DOC_NUMBER_TYPES } from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { Cog, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SystemControlsSection = () => {
  const { control } = useFormContext<CompanySetupFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "numberSeries",
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400">
          <Cog className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">System Controls</h3>
          <p className="text-sm text-muted-foreground">
            Document numbering, dimensions, and system preferences
          </p>
        </div>
      </div>

      {/* System Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormSwitch
          name="multiCompanyEnabled"
          label="Multi-Company"
          description="Enable multi-company mode"
        />
        <FormSwitch
          name="auditTrailEnabled"
          label="Audit Trail"
          description="Track all data changes"
        />
        <FormSwitch
          name="approvalWorkflowEnabled"
          label="Approval Workflow"
          description="Require approvals for actions"
        />
      </div>

      {/* Posting Groups + Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          name="postingGroupsMapping"
          label="Posting Groups Mapping"
          placeholder="Define posting groups"
        />
        <FormInput
          name="defaultDimensions"
          label="Default Dimensions"
          placeholder="Cost Center / Project / Property"
        />
      </div>

      {/* Document Number Series */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
            Document Number Series
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                documentType: "",
                prefix: "",
                startNumber: 1,
              })
            }
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Series
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
            <Cog className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No number series defined. Click "Add Series" to begin.
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
                  <FormSelect
                    name={`numberSeries.${index}.documentType`}
                    label="Document Type"
                    placeholder="Select type"
                    options={DOC_NUMBER_TYPES}
                  />
                </div>
                <div className="md:col-span-3">
                  <FormInput
                    name={`numberSeries.${index}.prefix`}
                    label="Prefix"
                    placeholder="e.g. INV-"
                  />
                </div>
                <div className="md:col-span-3">
                  <FormInput
                    name={`numberSeries.${index}.startNumber`}
                    label="Start Number"
                    placeholder="1"
                    type="number"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
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

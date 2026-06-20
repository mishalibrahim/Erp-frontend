import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { WizardFooter } from "../WizardFooter";
import { step7Schema, type Step7FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";

export const Step7Controls = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Step7FormData>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      multiCompanyEnable: false,
      auditTrailEnable: true,
      approvalWorkflow: true,
    },
  });

  const onSubmit = async (data: Step7FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      await companySetupApi.updateDraft(draftId, {
        controls: data,
        status: "Active",
      });
      toast.success("🎉 Company setup complete! Welcome aboard.");
      navigate("/settings/company-setup");
    } catch {
      toast.error("Failed to complete setup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <div className="mb-2">
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

        {/* Final step summary */}
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/40 p-4">
          <p className="text-sm font-medium text-green-800 dark:text-green-400">
            ✓ Almost done!
          </p>
          <p className="text-xs text-green-700 dark:text-green-500 mt-0.5">
            Click "Complete Setup" to finalize your company. All details have been saved automatically.
          </p>
        </div>

        <WizardFooter
          isLoading={isLoading}
          isFinalStep
          onBack={() => navigate(`/settings/company-setup/wizard/step-6?draftId=${draftId}`)}
        />
      </form>
    </FormProvider>
  );
};

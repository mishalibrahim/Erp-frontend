import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { Form } from "@/components/hook-form/Form";
import { WizardFooter } from "../WizardFooter";
import { step8Schema, type Step8FormData } from "../../schemas/companySetupSchemas";
import { companySetupApi } from "../../api/companySetupApi";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompanySetupContextType } from "../CompanySetupWizard";
import { rolesApi, type Role } from "@/features/auth/api/rolesApi";

export const Step8UsersRoles = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { draftData, rowVersion } = useOutletContext<CompanySetupContextType>();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await rolesApi.getRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        toast.error("Failed to fetch roles.");
      }
    };
    fetchRoles();
  }, []);

  const methods = useForm<Step8FormData>({
    resolver: zodResolver(step8Schema),
    defaultValues: {
      userTenantAccess: [],
    },
  });

  useEffect(() => {
    if (draftData) {
      const accesses = draftData.userTenantAccesses || (draftData as any).userTenantAccess || [];
      // Map any legacy 'role' strings to 'roleId' if necessary, though backend should return roleId now
      const mappedAccesses = accesses.map((access: any) => ({
        ...access,
        roleId: access.roleId || access.role || "",
      }));
      
      const usersData = { userTenantAccess: mappedAccesses };
      methods.reset({ ...methods.getValues(), ...usersData });
    }
  }, [draftData, methods]);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "userTenantAccess",
  });

  const onSubmit = async (data: Step8FormData) => {
    if (!draftId) return;
    setIsLoading(true);
    try {
      await companySetupApi.updateUsers(draftId, { 
        ...data,
        status: "Active",
        rowVersion
      });
      toast.success("🎉 Company setup complete! Welcome aboard.");
      navigate("/settings/company-setup");
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Users & Access</h3>
              <p className="text-sm text-muted-foreground">
                Invite users and assign their roles for this company
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              User Access List
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ firstName: "", lastName: "", email: "", roleId: "", password: "" })}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add User
            </Button>
          </div>
          
          {fields.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 p-8 text-center bg-card/30">
              <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No users added yet. You will be assigned as the Admin automatically.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-lg border border-border bg-card/50 relative">
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
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mr-10 mb-3">
                  <div className="md:col-span-4">
                    <FormInput name={`userTenantAccess.${index}.firstName`} label="First Name *" placeholder="e.g. John" />
                  </div>
                  <div className="md:col-span-4">
                    <FormInput name={`userTenantAccess.${index}.lastName`} label="Last Name *" placeholder="e.g. Doe" />
                  </div>
                  <div className="md:col-span-4">
                    <FormInput name={`userTenantAccess.${index}.email`} label="User Email *" placeholder="user@company.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mr-10">
                  <div className="md:col-span-6">
                    <FormInput 
                      name={`userTenantAccess.${index}.password`} 
                      label="Password" 
                      type="password" 
                      placeholder={methods.getValues(`userTenantAccess.${index}.id`) ? "(Password Set)" : "Min 8 characters"} 
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {methods.getValues(`userTenantAccess.${index}.id`) ? "Leave blank to keep current password." : "Required for new users."}
                    </p>
                  </div>
                  <div className="md:col-span-6">
                    <FormSelect
                      name={`userTenantAccess.${index}.roleId`}
                      label="Role *"
                      placeholder="Select Role"
                      options={roles.map((r) => ({
                        label: r.name,
                        value: r.id,
                      }))}
                    />
                  </div>
                </div>
              </div>
            ))}
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
          onBack={() => navigate(`/settings/company-setup/wizard/step-7?draftId=${draftId}`)}
        />
    </Form>
  );
};

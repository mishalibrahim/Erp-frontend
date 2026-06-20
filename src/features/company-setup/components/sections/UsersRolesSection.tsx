import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { USER_ROLES } from "@/features/company-setup/constants";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { Users, Plus, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UsersRolesSection = () => {
  const { control } = useFormContext<CompanySetupFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Users & Roles</h3>
          <p className="text-sm text-muted-foreground">
            Manage user access and role-based permissions
          </p>
        </div>
      </div>

      {/* Approval Hierarchy Toggle */}
      <FormSwitch
        name="approvalHierarchyEnabled"
        label="Approval Hierarchy"
        description="Enable approval hierarchy for this company"
      />

      {/* Users List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
            Company Users
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                userName: "",
                email: "",
                role: "",
                companyAccess: true,
              })
            }
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-10 text-center">
            <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mb-1">
              No users assigned yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Click "Add User" to assign company access
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
                <div className="md:col-span-3">
                  <FormInput
                    name={`users.${index}.userName`}
                    label="User Name"
                    placeholder="Full name"
                  />
                </div>
                <div className="md:col-span-4">
                  <FormInput
                    name={`users.${index}.email`}
                    label="Email"
                    placeholder="user@company.com"
                    type="email"
                  />
                </div>
                <div className="md:col-span-3">
                  <FormSelect
                    name={`users.${index}.role`}
                    label="Role"
                    placeholder="Select role"
                    options={USER_ROLES}
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

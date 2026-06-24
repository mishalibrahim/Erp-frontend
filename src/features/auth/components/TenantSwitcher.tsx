import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function TenantSwitcher() {
  const { activeTenantId, switchTenant, tenants } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (id: string) => {
    if (id === activeTenantId) return;
    
    setIsSwitching(true);
    try {
      await switchTenant(id);
      toast.success("Switched tenant successfully");
    } catch (error) {
      toast.error("Failed to switch tenant");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
      <p className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground flex items-center justify-between">
        <span>Active Tenant</span>
        {isSwitching && <Loader2 className="h-3 w-3 animate-spin" />}
      </p>
      <Select
        value={activeTenantId || ""}
        onValueChange={handleSwitch}
        disabled={isSwitching}
      >
        <SelectTrigger className="w-full text-left bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Select tenant" />
          </div>
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="top"
          align="start"
          className="w-[--radix-select-trigger-width]"
        >
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{tenant.companyName}</span>
                <span className="text-xs text-muted-foreground">
                  {tenant.companyCode} · {tenant.roleName}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

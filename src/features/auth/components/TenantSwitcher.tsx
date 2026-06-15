import { Building2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TenantSwitcher() {
  const { activeTenant, setActiveTenant, tenants } = useAuth();

  return (
    <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
      <p className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Active Tenant
      </p>
      <Select
        value={activeTenant.id}
        onValueChange={(id) => {
          const tenant = tenants.find((t) => t.id === id);
          if (tenant) setActiveTenant(tenant);
        }}
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
                <span className="font-medium">{tenant.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tenant.industry} · {tenant.country}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

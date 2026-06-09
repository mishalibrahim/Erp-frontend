import { createContext, useContext, useState, type ReactNode } from "react";
import { DUMMY_TENANTS, type Tenant } from "@/features/auth/types/tenant";

interface TenantContextType {
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
}

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [activeTenant, setActiveTenant] = useState<Tenant>(DUMMY_TENANTS[0]);

  return (
    <TenantContext.Provider
      value={{ activeTenant, setActiveTenant, tenants: DUMMY_TENANTS }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}

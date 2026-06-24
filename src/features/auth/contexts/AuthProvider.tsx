import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/features/auth/types/auth";
import type { TenantListItemDto } from "@/features/auth/types/tenant";
import { login as loginApi, getMe as getMeApi, getMyTenants, switchTenant as switchTenantApi } from "@/features/auth/api/auth";
import { GlobalSpinner } from "@/components/shared/GlobalSpinner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Tenant
  tenants: TenantListItemDto[];
  activeTenantId: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<TenantListItemDto[]>([]);

  const loadUserAndTenants = async () => {
    try {
      const data = await getMeApi();
      const storedTenantId = localStorage.getItem("active_tenant_id");
      setUser({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.roleName,
        tenantId: storedTenantId || data.tenantId,
        permissions: data.permissions || [],
      });
      const tenantsData = await getMyTenants();
      setTenants(tenantsData);
    } catch (error) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("active_tenant_id");
      setUser(null);
      setTenants([]);
    }
  };

  //check for token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        await loadUserAndTenants();
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    const { token } = data;

    // Save token securely to local storage
    localStorage.setItem("jwt_token", token);
    if (data.tenantId) {
      localStorage.setItem("active_tenant_id", data.tenantId);
    }
    
    // Fetch full user and tenants to populate context
    await loadUserAndTenants();
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("active_tenant_id");
    setUser(null);
    setTenants([]);
  };

  const switchTenant = async (targetTenantId: string) => {
    if (user?.tenantId === targetTenantId) return;

    setIsLoading(true);
    try {
      const data = await switchTenantApi(targetTenantId);
      
      // Update token
      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }
      localStorage.setItem("active_tenant_id", data.tenantId || targetTenantId);

      // Update user state with new roles and tenantId
      setUser((prev) => prev ? {
        ...prev,
        role: data.roleName || data.role || prev.role,
        tenantId: data.tenantId || targetTenantId,
        permissions: data.permissions || [],
      } : null);
      
      // Reload tenants in case roles in other tenants changed
      try {
        const tenantsData = await getMyTenants();
        setTenants(tenantsData);
      } catch (err) {
        console.error("Failed to refresh tenants after switch", err);
      }
      
      // Dispatch a custom event to notify other components (like React Query) to invalidate caches if needed
      window.dispatchEvent(new Event('tenantSwitched'));
    } catch (error) {
      console.error("Failed to switch tenant", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        tenants,
        activeTenantId: user?.tenantId || null,
        switchTenant,
      }}
    >
      {isLoading ? <GlobalSpinner /> : children}
    </AuthContext.Provider>
  );
};

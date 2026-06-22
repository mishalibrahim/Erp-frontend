import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/features/auth/types/auth";
import { DUMMY_TENANTS, type Tenant } from "@/features/auth/types/tenant";
import { login as loginApi, getMe as getMeApi } from "@/features/auth/api/auth";
import { GlobalSpinner } from "@/components/shared/GlobalSpinner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Tenant
  tenants: Tenant[];
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tenant state — will be replaced by auth API payload in the future
  const [activeTenant, setActiveTenant] = useState<Tenant>(DUMMY_TENANTS[0]);

  //check for token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        try {
          // Verify the token by calling the secure /me endpoint we built
          const data = await getMeApi();
          setUser({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.roleName,
            tenantId: data.tenantId,
            permissions: data.permissions || [],
          });
        } catch (error) {
          // If the token is expired or invalid, clear it out
          localStorage.removeItem("jwt_token");
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    const { token, roleName, tenantId, permissions } = data;

    // Save token securely to local storage
    localStorage.setItem("jwt_token", token);

    // Update global React state
    setUser({
      id: "extracted_from_token",
      firstName: "",
      lastName: "",
      email,
      role: roleName,
      tenantId,
      permissions: permissions || [],
    });
  };
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        tenants: DUMMY_TENANTS,
        activeTenant,
        setActiveTenant,
      }}
    >
      {isLoading ? <GlobalSpinner /> : children}
    </AuthContext.Provider>
  );
};

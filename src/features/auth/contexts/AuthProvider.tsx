import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/features/auth/types/auth";
import { login as loginApi, getMe as getMeApi } from "@/features/auth/api/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //check for token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        try {
          // Verify the token by calling the secure /me endpoint we built
          const data = await getMeApi();
          setUser({
            userId: data.userId,
            email: "admin@aegis-erp.com", // In a real app, the API should return this
            role: data.isSuperAdmin ? "SuperAdmin" : "User",
            tenantId: data.tenantId,
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
    const { token, role, tenantId } = data;

    // Save token securely to local storage
    localStorage.setItem("jwt_token", token);

    // Update global React state
    setUser({ userId: "extracted_from_token", email, role, tenantId });
  };
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

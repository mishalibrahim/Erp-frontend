import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { hasPermission } from "@/features/auth/utils/permissions";

interface RequirePermissionProps {
  module: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that only renders its children if the current user
 * has the required module and action permission.
 * 
 * @param module The module name (e.g., "CompanySetup")
 * @param action The action name (e.g., "Create", "Update", "Delete", "View")
 * @param fallback Optional component to render if the user lacks permission
 */
export const RequirePermission = ({
  module,
  action,
  children,
  fallback = null,
}: RequirePermissionProps) => {
  const { user } = useAuth();

  const isAuthorized = hasPermission(user, module, action);

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

import type { User } from "../types/auth";

/**
 * Checks if a user has a specific permission.
 * SuperAdmin role is always granted access.
 * Otherwise, it checks if the user's permissions array contains the exact permission,
 * or a wildcard permission like "Module:All:Any".
 * 
 * @param user The current authenticated user object
 * @param module The module name (e.g., "CompanySetup")
 * @param action The action name (e.g., "Create", "Update", "Delete", "View")
 * @returns boolean true if the user has permission, false otherwise
 */
export const hasPermission = (user: User | null, module: string, action: string): boolean => {
  if (!user) return false;

  // SuperAdmin gets a free pass
  if (user.role === "SuperAdmin") return true;

  // Ensure user.permissions exists before attempting to use .some()
  const userPermissions = user.permissions || [];

  return userPermissions.some(
    (p) => p.startsWith(`${module}:${action}`) || p === `${module}:All:Any`
  );
};

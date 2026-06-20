import { LogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const { logout, user } = useAuth();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={
        <LogOut className="h-6 w-6 text-destructive" />
      }
      title="Sign out?"
      description={
        user?.email
          ? `You are currently signed in as ${user.email}. You will need to log in again to access your workspace.`
          : "You will need to log in again to access your workspace."
      }
      confirmLabel="Yes, sign me out"
      cancelLabel="Stay signed in"
      destructive
      onConfirm={logout}
    />
  );
}

import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";
import { LogoutDialog } from "@/features/auth/components/LogoutDialog";

export const ProtectedLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading Aegis ERP...</div>;
  }

  // Security Checkpoint: No token? Go to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center space-x-4 text-sm">
            <span className="mr-2 hidden sm:inline-block">
              Welcome, {user?.email || "Admin"}
            </span>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLogoutOpen(true)}
              title="Log out"
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
          <Outlet />
        </main>
      </SidebarInset>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </SidebarProvider>
  );
};


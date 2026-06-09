import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "@/features/theme/contexts/ThemeProvider";

export const ProtectedLayout = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

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
          <div className="ml-auto flex items-center space-x-2 text-sm">
            <span className="mr-2">Welcome, {user?.email || "Admin"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} title="Log out">
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

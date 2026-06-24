import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./App.css";
import { ThemeProvider } from "@/features/theme/contexts/ThemeProvider";
import { AuthProvider } from "@/features/auth/contexts/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    const handleTenantSwitch = () => {
      queryClient.resetQueries();
    };
    window.addEventListener('tenantSwitched', handleTenantSwitch);
    return () => window.removeEventListener('tenantSwitched', handleTenantSwitch);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="erp-theme">
        <AuthProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

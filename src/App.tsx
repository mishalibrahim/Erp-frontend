import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./App.css";
import { ThemeProvider } from "@/features/theme/contexts/ThemeProvider";
import { AuthProvider } from "@/features/auth/contexts/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="erp-theme">
      <AuthProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

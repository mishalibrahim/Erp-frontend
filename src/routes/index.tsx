import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout, PublicLayout } from "../layouts";
import { Login } from "@/features/auth/routes";
import { ErrorBoundary } from "@/features/error/components/ErrorBoundary";
import { FinanceDashboard } from "@/features/dashboard/components/FinanceDashboard";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <FinanceDashboard />,
      },
      {
        path: "/settings/company",
        element: <div></div>,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);

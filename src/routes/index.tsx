import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedLayout, PublicLayout } from "../layouts";
import { Login } from "@/features/auth/routes";
import { ErrorBoundary } from "@/features/error/components/ErrorBoundary";
import { FinanceDashboard } from "@/features/dashboard/components/FinanceDashboard";
import { ChartOfAccountsPage } from "@/features/chart-of-accounts/components/ChartOfAccountsPage";

import { TenantListPage } from "@/features/company-setup/components/TenantListPage";
import { CompanySetupWizard } from "@/features/company-setup/components/CompanySetupWizard";
import { Step1BasicInfo } from "@/features/company-setup/components/steps/Step1BasicInfo";
import { Step2Financials } from "@/features/company-setup/components/steps/Step2Financials";
import { Step3Localization } from "@/features/company-setup/components/steps/Step3Localization";
import { Step4Addresses } from "@/features/company-setup/components/steps/Step4Addresses";
import { Step5VatDetails } from "@/features/company-setup/components/steps/Step5VatDetails";
import { Step6CorporateTax } from "@/features/company-setup/components/steps/Step6CorporateTax";
import { Step7Controls } from "@/features/company-setup/components/steps/Step7Controls";

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
      // ── Chart of Accounts ────────────────────────────────────────────────
      {
        path: "/accounting/coa",
        element: <ChartOfAccountsPage />,
      },
      // ── Company Setup: List Page ────────────────────────────────────────
      {
        path: "/settings/company-setup",
        element: <TenantListPage />,
      },
      // ── Company Setup: Wizard (nested steps) ────────────────────────────
      {
        path: "/settings/company-setup/wizard",
        element: <CompanySetupWizard />,
        children: [
          { index: true, element: <Navigate to="step-1" replace /> },
          { path: "step-1", element: <Step1BasicInfo /> },
          { path: "step-2", element: <Step2Financials /> },
          { path: "step-3", element: <Step3Localization /> },
          { path: "step-4", element: <Step4Addresses /> },
          { path: "step-5", element: <Step5VatDetails /> },
          { path: "step-6", element: <Step6CorporateTax /> },
          { path: "step-7", element: <Step7Controls /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);

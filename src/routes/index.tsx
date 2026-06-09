import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout, PublicLayout } from "../layouts";
import { Login } from "@/features/auth/routes";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <div>dashboard</div>,
      },
      {
        path: "/settings/company",
        element: <div></div>,
      },
    ],
  },
]);

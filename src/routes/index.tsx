import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout, PublicLayout } from "../layouts";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <div>hello</div>,
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

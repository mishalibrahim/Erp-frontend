import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import {
  BarChart3,
  Package,
  Users,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

const features = [
  { icon: BarChart3, label: "Live dashboards & business analytics" },
  { icon: Package, label: "End-to-end inventory management" },
  { icon: Users, label: "Team, roles & access management" },
  { icon: ClipboardList, label: "Streamlined approvals & workflows" },
  { icon: ShieldCheck, label: "Enterprise-grade security & compliance" },
];

export const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary/30 rounded-full border-t-primary animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between overflow-hidden bg-primary p-12 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        {/* Logo / brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Aegis ERP</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            Enterprise Resource Planning
          </p>
        </div>

        {/* Centre headline */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Smarter operations.<br />Clearer insights.<br />Less complexity.
            </h1>
            <p className="mt-4 text-primary-foreground/70 text-base leading-relaxed max-w-sm">
              A unified platform that connects every part of your business —
              so your teams always have the information they need, when they need it.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3 mt-2">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Aegis ERP. All rights reserved.
        </p>
      </div>

      {/* ── Right sign-in panel ───────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Aegis ERP</span>
        </div>

        <div className="w-full max-w-[400px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};


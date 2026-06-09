import { ShieldCheck } from "lucide-react";

export function GlobalSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-background">
      {/* Logo mark */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <span className="absolute inline-flex h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        {/* Inner pulsing icon container */}
        <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
      </div>

      {/* Brand label */}
      <div className="text-center space-y-1">
        <p className="text-base font-semibold tracking-tight text-foreground">Aegis ERP</p>
        <p className="text-xs text-muted-foreground animate-pulse">Initializing your workspace…</p>
      </div>
    </div>
  );
}

import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  FileSearch,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GL_POSTING_RULES } from "../constants";

const iconMap: Record<string, React.ElementType> = {
  Scale,
  ShieldAlert,
  CheckCircle2,
  FileSearch,
  Layers,
};

const severityStyles = {
  critical: {
    border: "border-rose-500/30",
    bg: "bg-gradient-to-br from-rose-500/5 to-rose-500/10",
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20",
    label: "Critical",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-gradient-to-br from-amber-500/5 to-amber-500/10",
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
    label: "Warning",
  },
  info: {
    border: "border-blue-500/30",
    bg: "bg-gradient-to-br from-blue-500/5 to-blue-500/10",
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    label: "Info",
  },
};

export function GLPostingRules() {
  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">GL Posting Rules</h3>
          <p className="text-sm text-muted-foreground">
            Core rules enforced across all general ledger transactions
          </p>
        </div>
      </div>

      {/* ── Rules Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GL_POSTING_RULES.map((rule) => {
          const Icon = iconMap[rule.icon] || CheckCircle2;
          const styles = severityStyles[rule.severity];

          return (
            <div
              key={rule.id}
              className={cn(
                "rounded-xl border p-5 transition-all hover:shadow-md",
                styles.border,
                styles.bg,
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                    styles.icon,
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold">{rule.title}</h4>
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                        styles.badge,
                      )}
                    >
                      {styles.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Summary ── */}
      <div className="rounded-xl border border-border/60 p-5 bg-muted/20">
        <h4 className="text-sm font-semibold mb-3">Enforcement Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {GL_POSTING_RULES.filter((r) => r.severity === "critical").length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
              Critical Rules
            </p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {GL_POSTING_RULES.filter((r) => r.severity === "warning").length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
              Validations
            </p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {GL_POSTING_RULES.filter((r) => r.severity === "info").length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
              Best Practices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

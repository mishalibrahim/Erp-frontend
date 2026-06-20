import {
  Building2,
  FolderKanban,
  Home,
  Users,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSION_TYPE_OPTIONS } from "../constants";
import type { GLAccount } from "../types";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  FolderKanban,
  Home,
  Users,
};

interface DimensionsPanelProps {
  accounts: GLAccount[];
}

export function DimensionsPanel({ accounts }: DimensionsPanelProps) {
  const accountsWithDimensions = accounts.filter(
    (a) => a.mandatoryDimensions && a.linkedDimensions.length > 0,
  );

  // Count how many accounts use each dimension
  const dimensionUsage = DIMENSION_TYPE_OPTIONS.map((dim) => ({
    ...dim,
    count: accounts.filter((a) =>
      a.linkedDimensions.includes(dim.value),
    ).length,
  }));

  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Dimension Integration</h3>
          <p className="text-sm text-muted-foreground">
            Use dimensions to capture analytical data without creating excessive
            GL accounts
          </p>
        </div>
      </div>

      {/* ── Info Banner ── */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-foreground/80 space-y-1">
          <p className="font-medium text-foreground">
            Why use dimensions?
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dimensions allow you to tag transactions with analytical attributes
            like Cost Center, Project, Property, or Department. This provides
            multi-dimensional reporting without needing to create separate GL
            accounts for each combination — keeping your Chart of Accounts clean
            and manageable.
          </p>
        </div>
      </div>

      {/* ── Dimension Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dimensionUsage.map((dim) => {
          const Icon = iconMap[dim.icon] || Layers;
          const colors = [
            {
              bg: "bg-emerald-500/10",
              text: "text-emerald-600 dark:text-emerald-400",
              border: "border-emerald-500/20",
              badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
            },
            {
              bg: "bg-blue-500/10",
              text: "text-blue-600 dark:text-blue-400",
              border: "border-blue-500/20",
              badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
            },
            {
              bg: "bg-amber-500/10",
              text: "text-amber-600 dark:text-amber-400",
              border: "border-amber-500/20",
              badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
            },
            {
              bg: "bg-rose-500/10",
              text: "text-rose-600 dark:text-rose-400",
              border: "border-rose-500/20",
              badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
            },
          ];
          const colorIndex = DIMENSION_TYPE_OPTIONS.indexOf(
            DIMENSION_TYPE_OPTIONS.find((d) => d.value === dim.value)!,
          );
          const color = colors[colorIndex % colors.length];

          return (
            <div
              key={dim.value}
              className={cn(
                "rounded-xl border p-5 transition-all hover:shadow-md",
                color.border,
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl",
                    color.bg,
                    color.text,
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                    color.badge,
                  )}
                >
                  {dim.count} account{dim.count !== 1 ? "s" : ""}
                </span>
              </div>
              <h4 className="text-sm font-semibold mb-1">{dim.label}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {dim.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Accounts with Mandatory Dimensions ── */}
      {accountsWithDimensions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
            Accounts with Mandatory Dimensions
          </h4>
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/30 border-b border-border/50 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-2">Account #</div>
              <div className="col-span-4">Name</div>
              <div className="col-span-6">Linked Dimensions</div>
            </div>
            <div className="divide-y divide-border/30">
              {accountsWithDimensions.map((acc) => (
                <div
                  key={acc.accountNumber}
                  className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-muted/20 transition-colors"
                >
                  <div className="col-span-2 text-xs font-mono text-primary">
                    {acc.accountNumber}
                  </div>
                  <div className="col-span-4 text-sm">{acc.accountName}</div>
                  <div className="col-span-6 flex flex-wrap gap-1.5">
                    {acc.linkedDimensions.map((dim) => {
                      const dimConfig = DIMENSION_TYPE_OPTIONS.find(
                        (d) => d.value === dim,
                      );
                      return (
                        <span
                          key={dim}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 text-[10px] font-medium border border-violet-500/20"
                        >
                          <ArrowRight className="w-2.5 h-2.5" />
                          {dimConfig?.label || dim}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

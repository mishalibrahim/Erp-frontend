import { cn } from "@/lib/utils";
import type { GlTransactionType } from "../types";

const TYPE_STYLES: Record<
  string,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  JV: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    darkBg: "dark:bg-indigo-900/30",
    darkText: "dark:text-indigo-400",
  },
  RV: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    darkBg: "dark:bg-emerald-900/30",
    darkText: "dark:text-emerald-400",
  },
  PV: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    darkBg: "dark:bg-amber-900/30",
    darkText: "dark:text-amber-400",
  },
  INV: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-400",
  },
  PINV: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    darkBg: "dark:bg-purple-900/30",
    darkText: "dark:text-purple-400",
  },
  OB: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    darkBg: "dark:bg-slate-800/40",
    darkText: "dark:text-slate-400",
  },
};

interface GlTypeBadgeProps {
  type: GlTransactionType;
  className?: string;
}

export function GlTypeBadge({ type, className }: GlTypeBadgeProps) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.JV;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide",
        style.bg,
        style.text,
        style.darkBg,
        style.darkText,
        className
      )}
    >
      {type}
    </span>
  );
}

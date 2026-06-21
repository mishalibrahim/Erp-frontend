import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  className?: string;
}

// ─── Pure toggle pill — no library dependency ───────────────────────────────
// We intentionally avoid Radix Switch here because wrapping it in a <label>
// causes a double-fire (label click + switch internal click), which cancels out
// and keeps the value the same. A hand-rolled toggle gives us total control.
export const TogglePill = ({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      // Track
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
      "transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      checked
        ? "bg-primary"
        : "bg-slate-300 dark:bg-slate-600"
    )}
  >
    {/* Thumb */}
    <span
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full shadow-md",
        "bg-white",
        "transition-transform duration-200 ease-in-out",
        checked ? "translate-x-4" : "translate-x-0"
      )}
    />
  </button>
);

export const FormSwitch = ({
  name,
  label,
  description,
  className,
}: FormSwitchProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isOn = Boolean(field.value);
        return (
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-lg border px-4 py-3.5 transition-colors cursor-pointer select-none",
              isOn
                ? "border-primary/40 bg-primary/5"
                : "border-input bg-background hover:bg-muted/40",
              className
            )}
            onClick={() => field.onChange(!isOn)}
          >
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-sm font-medium leading-none text-foreground">
                {label}
              </p>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {/* Stop propagation so the div onClick doesn't double-fire */}
            <div onClick={(e) => e.stopPropagation()}>
              <TogglePill
                id={name}
                checked={isOn}
                onChange={(v) => field.onChange(v)}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

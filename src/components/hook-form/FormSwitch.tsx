import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";

interface FormSwitchProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export const FormSwitch = ({
  name,
  label,
  description,
  className,
  disabled,
}: FormSwitchProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field className={`flex flex-row items-center justify-between gap-3 rounded-lg border border-border/60 p-4 ${className || ""}`}>
          <div className="flex flex-col gap-0.5">
            {label && (
              <FieldLabel htmlFor={name} className="ml-0 text-sm font-medium cursor-pointer">
                {label}
              </FieldLabel>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <Switch
            id={name}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
};

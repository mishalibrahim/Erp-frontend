import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const FormInput = ({ name, label, className, ...props }: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1.5">
          {label && (
            <Label
              htmlFor={name}
              className={cn("text-sm font-medium", error && "text-destructive")}
            >
              {label}
            </Label>
          )}
          <Input
            id={name}
            className={cn(
              "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...field}
            {...props}
          />
          {error && (
            <p className="text-xs text-destructive mt-0.5">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

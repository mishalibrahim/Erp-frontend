import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const FormSelect = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  className,
  disabled,
}: FormSelectProps) => {
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
          <Select onValueChange={field.onChange} value={field.value ?? undefined} disabled={disabled}>
            <SelectTrigger
              id={name}
              className={cn(
                "!h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                error && "border-destructive focus:ring-destructive",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-xs text-destructive mt-0.5">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

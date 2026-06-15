import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormSelect = ({
  name,
  label,
  placeholder = "Select...",
  options,
  className,
  disabled,
}: FormSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field className="flex flex-col gap-2">
          {label && (
            <FieldLabel
              htmlFor={name}
              className={`ml-1 text-sm font-medium ${error ? "text-destructive" : ""}`}
            >
              {label}
            </FieldLabel>
          )}
          <FieldContent>
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={name}
                className={`w-full h-10 px-3 rounded-lg ${
                  error ? "border-destructive focus-visible:ring-destructive" : ""
                } ${className || ""}`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
          {error && (
            <FieldError className="text-destructive text-xs mt-1 ml-1">
              {error.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
};

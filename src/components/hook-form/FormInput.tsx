import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";

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
        <Field className="flex flex-col gap-2">
          {label && (
            <FieldLabel
              htmlFor={name}
              className={`ml-1 ${error ? "text-destructive" : ""}`}
            >
              {label}
            </FieldLabel>
          )}
          <FieldContent className="relative flex items-center">
            <Input
              id={name}
              className={`w-full px-4 py-3.5 rounded-xl ${
                error ? "border-destructive focus-visible:ring-destructive" : ""
              } ${className || ""}`}
              {...field}
              {...props}
            />
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

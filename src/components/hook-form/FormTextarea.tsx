import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

export const FormTextarea = ({
  name,
  label,
  className,
  ...props
}: FormTextareaProps) => {
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
          <FieldContent className="relative">
            <Textarea
              id={name}
              className={`w-full rounded-lg resize-none ${
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

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const FormDatePicker = ({
  name,
  label,
  placeholder = "Pick a date",
  className,
  disabled,
}: FormDatePickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const dateValue = field.value ? parseISO(field.value) : undefined;

        return (
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={name}
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal rounded-lg",
                      !field.value && "text-muted-foreground",
                      error && "border-destructive focus-visible:ring-destructive",
                      className
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                    {field.value
                      ? format(dateValue!, "dd MMM yyyy")
                      : placeholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => {
                      field.onChange(
                        date ? format(date, "yyyy-MM-dd") : ""
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FieldContent>
            {error && (
              <FieldError className="text-destructive text-xs mt-1 ml-1">
                {error.message}
              </FieldError>
            )}
          </Field>
        );
      }}
    />
  );
};

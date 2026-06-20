import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const FormDatePicker = ({
  name,
  label,
  placeholder = "Pick a date",
  className,
}: FormDatePickerProps) => {
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
          <Popover>
            <PopoverTrigger asChild>
              <button
                id={name}
                type="button"
                className={cn(
                  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors",
                  "flex items-center gap-2 text-left",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  !field.value && "text-muted-foreground",
                  error && "border-destructive focus:ring-destructive",
                  className
                )}
              >
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {field.value
                    ? format(new Date(field.value), "dd MMM yyyy")
                    : placeholder}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date ? date.toISOString() : undefined);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {error && (
            <p className="text-xs text-destructive mt-0.5">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

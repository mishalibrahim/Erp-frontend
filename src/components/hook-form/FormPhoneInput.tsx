import { useFormContext, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormPhoneInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const FormPhoneInput = ({
  name,
  label,
  placeholder = "Enter phone number",
  className,
}: FormPhoneInputProps) => {
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
          <div
            className={cn(
              "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors",
              "flex items-center gap-1",
              "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent",
              error && "border-destructive focus-within:ring-destructive",
              className
            )}
          >
            <PhoneInput
              id={name}
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
              defaultCountry="AE"
              className={cn(
                "w-full flex items-center gap-1",
                "[&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:shrink-0",
                "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountrySelect]:text-sm [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountrySelect]:p-0",
                "[&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:h-auto",
                "[&_.PhoneInputCountrySelectArrow]:ml-1 [&_.PhoneInputCountrySelectArrow]:opacity-50",
                "[&_input]:flex-1 [&_input]:bg-transparent [&_input]:border-none [&_input]:outline-none [&_input]:text-sm [&_input]:pl-2 [&_input]:min-w-0",
              )}
            />
          </div>
          {error && (
            <p className="text-xs text-destructive mt-0.5">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

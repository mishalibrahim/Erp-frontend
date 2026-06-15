import { useFormContext, Controller } from "react-hook-form";
import { FormSelect } from "@/components/hook-form/FormSelect";
import {
  LANGUAGES,
  TIME_ZONES,
  DATE_FORMATS,
} from "@/features/company-setup/constants";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LocalizationSection = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Localization & Language</h3>
          <p className="text-sm text-muted-foreground">
            Set up languages, time zone, and date format
          </p>
        </div>
      </div>

      {/* Row 1: Org Language + Invoice Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          name="organizationLanguage"
          label="Organization Language *"
          placeholder="Select language"
          options={LANGUAGES}
        />
        <FormSelect
          name="invoiceLanguage"
          label="Invoice Language *"
          placeholder="Select language"
          options={LANGUAGES}
        />
      </div>

      {/* Communication Languages — multi-select */}
      <Controller
        name="communicationLanguages"
        control={control}
        render={({ field, fieldState: { error } }) => {
          const selected: string[] = field.value || [];

          const toggleLanguage = (val: string) => {
            if (selected.includes(val)) {
              field.onChange(selected.filter((v: string) => v !== val));
            } else {
              field.onChange([...selected, val]);
            }
          };

          return (
            <Field className="flex flex-col gap-2">
              <FieldLabel className={`ml-1 text-sm font-medium ${error ? "text-destructive" : ""}`}>
                Communication Languages
              </FieldLabel>
              <FieldContent>
                {/* Selected chips */}
                {selected.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selected.map((val: string) => {
                      const lang = LANGUAGES.find((l) => l.value === val);
                      return (
                        <span
                          key={val}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {lang?.label || val}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-primary/20 rounded-full"
                            onClick={() => toggleLanguage(val)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* Options grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selected.includes(lang.value);
                    return (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => toggleLanguage(lang.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground"
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
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

      {/* Row 3: Time Zone + Date Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          name="timeZone"
          label="Time Zone *"
          placeholder="Select time zone"
          options={TIME_ZONES}
        />
        <FormSelect
          name="dateFormat"
          label="Date Format *"
          placeholder="Select format"
          options={DATE_FORMATS}
        />
      </div>
    </div>
  );
};

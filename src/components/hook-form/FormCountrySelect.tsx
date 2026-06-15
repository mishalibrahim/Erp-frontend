import { useState, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import countries from "world-countries";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CountryOption {
  label: string;
  value: string;
  flag: string;
  cca2: string;
}

interface FormCountrySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const FormCountrySelect = ({
  name,
  label,
  placeholder = "Select country",
  className,
}: FormCountrySelectProps) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const countryOptions: CountryOption[] = useMemo(() => {
    return countries
      .map((c) => ({
        label: c.name.common,
        value: c.name.common,
        flag: c.flag,
        cca2: c.cca2,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countryOptions;
    const q = searchQuery.toLowerCase().trim();
    return countryOptions.filter((c) => c.label.toLowerCase().includes(q));
  }, [countryOptions, searchQuery]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = countryOptions.find((c) => c.value === field.value);

        return (
          <div className="flex flex-col gap-1.5">
            {label && (
              <Label
                htmlFor={name}
                className={cn("text-sm font-medium", error && "text-destructive")}
              >
                {label}
              </Label>
            )}
            <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearchQuery(""); }}>
              <PopoverTrigger asChild>
                <button
                  id={name}
                  type="button"
                  aria-expanded={open}
                  className={cn(
                    "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors",
                    "flex items-center justify-between gap-2 text-left",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    !field.value && "text-muted-foreground",
                    error && "border-destructive focus:ring-destructive",
                    className
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {selected ? (
                      <>
                        <span className="text-base leading-none shrink-0">{selected.flag}</span>
                        <span className="truncate text-foreground">{selected.label}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[320px] p-0 shadow-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                {/* Search input */}
                <div className="flex items-center gap-2 border-b px-3 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>

                {/* Country list */}
                <div className="max-h-[240px] overflow-y-auto">
                  {filteredCountries.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No country found.
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <button
                        key={country.cca2}
                        type="button"
                        onClick={() => {
                          field.onChange(country.value);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          field.value === country.value && "bg-primary/10 text-primary"
                        )}
                      >
                        <span className="text-base leading-none shrink-0">{country.flag}</span>
                        <span className="flex-1 truncate">{country.label}</span>
                        {field.value === country.value && (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-xs text-destructive mt-0.5">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

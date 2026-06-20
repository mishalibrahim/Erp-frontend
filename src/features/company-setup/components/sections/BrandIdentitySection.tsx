import { useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { Palette, Building2, Hash, Upload, X, Eye } from "lucide-react";
import type { CompanySetupFormValues } from "@/features/company-setup/types";
import { BRAND_COLORS, ID_SEPARATORS } from "@/features/company-setup/constants";
import { useRef } from "react";
import { Label } from "@/components/ui/label";

// ─── Color Swatch Picker ──────────────────────────────────────────────────────
function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Brand Primary Color</Label>
      <div className="flex flex-wrap gap-2">
        {BRAND_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onClick={() => onChange(c.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110 ${
              value === c.value
                ? "border-foreground ring-2 ring-offset-2 ring-foreground/30 scale-110"
                : "border-transparent"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
        {/* Custom color input */}
        <div className="relative flex items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer border-2 border-border bg-transparent p-0.5"
            title="Custom color"
          />
        </div>
      </div>
      {/* Preview badge */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: value }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          Brand Color Preview
        </span>
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  );
}

// ─── Logo Upload Preview ──────────────────────────────────────────────────────
function LogoUpload({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className={`relative flex items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
          value ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
        }`}
        style={{ minHeight: 96 }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Logo preview"
              className="max-h-16 max-w-[200px] object-contain rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-destructive/90 text-white hover:bg-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-4 text-muted-foreground">
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">Click to upload</span>
            {hint && <span className="text-xs opacity-60">{hint}</span>}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Company ID Preview ───────────────────────────────────────────────────────
function CompanyIdPreview({
  prefix,
  separator,
  digits,
}: {
  prefix: string;
  separator: string;
  digits: number;
}) {
  const sample = "0".repeat(Math.max(1, digits));
  const sep = separator === "none" ? "" : (separator ?? "-");
  const parts = [prefix?.trim().toUpperCase(), sample].filter(Boolean);
  const preview = parts.join(sep);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border/60">
      <Eye className="w-4 h-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-0.5">Live Preview</p>
        <p className="text-base font-mono font-bold tracking-widest text-foreground">
          {preview || "COMP-00001"}
        </p>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export const BrandIdentitySection = () => {
  const { setValue, control } = useFormContext<CompanySetupFormValues>();

  const brandColor = useWatch<CompanySetupFormValues>({ name: "brandColor", control }) as string;
  const logoUrl = useWatch<CompanySetupFormValues>({ name: "logoUrl", control }) as string;
  const faviconUrl = useWatch<CompanySetupFormValues>({ name: "faviconUrl", control }) as string;
  const companyIdPrefix = useWatch<CompanySetupFormValues>({ name: "companyIdPrefix", control }) as string;
  const companyIdSeparator = useWatch<CompanySetupFormValues>({ name: "companyIdSeparator", control }) as string;
  const companyIdDigits = useWatch<CompanySetupFormValues>({ name: "companyIdDigits", control }) as number;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Brand Identity & Company ID</h3>
          <p className="text-sm text-muted-foreground">
            Set your brand visuals, identity colors, and define how Company IDs are formatted
          </p>
        </div>
      </div>

      {/* ── Brand Identity ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Brand Information</h4>
        </div>

        {/* Brand Name + Tagline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            name="brandName"
            label="Brand Name"
            placeholder="e.g. Aegis Solutions"
          />
          <FormInput
            name="brandTagline"
            label="Brand Tagline"
            placeholder="e.g. Empowering Business, Globally"
          />
        </div>

        {/* Color Picker */}
        <ColorSwatchPicker
          value={(brandColor as string) || "#0f172a"}
          onChange={(v) => setValue("brandColor", v, { shouldDirty: true })}
        />

        {/* Logo + Favicon Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LogoUpload
            label="Company Logo"
            value={(logoUrl as string) || ""}
            onChange={(v) => setValue("logoUrl", v, { shouldDirty: true })}
            hint="PNG, SVG — max 2 MB"
          />
          <LogoUpload
            label="Favicon"
            value={(faviconUrl as string) || ""}
            onChange={(v) => setValue("faviconUrl", v, { shouldDirty: true })}
            hint="ICO, PNG — 32×32px recommended"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* ── Company ID Format ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Company ID Format</h4>
        </div>

        <p className="text-sm text-muted-foreground -mt-3">
          Configure how auto-generated Company IDs will look (e.g.{" "}
          <span className="font-mono font-semibold text-foreground">COMP-00001</span>).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormInput
            name="companyIdPrefix"
            label="ID Prefix"
            placeholder="e.g. COMP"
          />
          <FormSelect
            name="companyIdSeparator"
            label="Separator"
            placeholder="Select separator"
            options={ID_SEPARATORS}
          />
          <FormInput
            name="companyIdDigits"
            label="Number of Digits (3–10)"
            placeholder="e.g. 5"
            type="number"
          />
        </div>

        {/* Live Preview */}
        <CompanyIdPreview
          prefix={(companyIdPrefix as string) || ""}
          separator={(companyIdSeparator as string) ?? "-"}
          digits={(companyIdDigits as number) || 5}
        />
      </div>
    </div>
  );
};

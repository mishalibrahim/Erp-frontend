import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/hook-form/Form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  companySetupSchema,
  type CompanySetupFormValues,
} from "@/features/company-setup/types";
import { COMPANY_SETUP_TABS } from "@/features/company-setup/constants";
import { GeneralInfoSection } from "@/features/company-setup/components/sections/GeneralInfoSection";
import { FinancialSetupSection } from "@/features/company-setup/components/sections/FinancialSetupSection";
import { LocalizationSection } from "@/features/company-setup/components/sections/LocalizationSection";
import { AddressSection } from "@/features/company-setup/components/sections/AddressSection";
import { VatSetupSection } from "@/features/company-setup/components/sections/VatSetupSection";
import { CorporateTaxSection } from "@/features/company-setup/components/sections/CorporateTaxSection";
import { TaxConfigSection } from "@/features/company-setup/components/sections/TaxConfigSection";
import { SystemControlsSection } from "@/features/company-setup/components/sections/SystemControlsSection";
import { BankDetailsSection } from "@/features/company-setup/components/sections/BankDetailsSection";
import { UsersRolesSection } from "@/features/company-setup/components/sections/UsersRolesSection";
import { DocumentsSection } from "@/features/company-setup/components/sections/DocumentsSection";
import { BrandIdentitySection } from "@/features/company-setup/components/sections/BrandIdentitySection";
import { toast } from "sonner";
import {
  Building2,
  Landmark,
  Globe,
  MapPin,
  Receipt,
  FileText,
  Calculator,
  Cog,
  CreditCard,
  Users,
  FolderOpen,
  Palette,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

// Map icon name strings to actual components
const iconMap: Record<string, React.ElementType> = {
  Building2,
  Landmark,
  Globe,
  MapPin,
  Receipt,
  FileText,
  Calculator,
  Cog,
  CreditCard,
  Users,
  FolderOpen,
  Palette,
};

// Section colors for visual distinction
const sectionColors: Record<string, string> = {
  general: "text-primary",
  financial: "text-emerald-600 dark:text-emerald-400",
  localization: "text-blue-600 dark:text-blue-400",
  address: "text-orange-600 dark:text-orange-400",
  vat: "text-violet-600 dark:text-violet-400",
  "corporate-tax": "text-rose-600 dark:text-rose-400",
  "tax-config": "text-amber-600 dark:text-amber-400",
  system: "text-slate-600 dark:text-slate-400",
  bank: "text-cyan-600 dark:text-cyan-400",
  users: "text-indigo-600 dark:text-indigo-400",
  documents: "text-teal-600 dark:text-teal-400",
  brand: "text-violet-600 dark:text-violet-400",
};

const defaultValues: CompanySetupFormValues = {
  // General
  companyName: "",
  tradeName: "",
  companyCode: "",
  licenseNumber: "",
  licenseType: "",
  registrationDate: "",
  licenseExpiryDate: "",
  country: "UAE",
  emirate: "",
  placeOfIncorporation: "",
  isFreeZoneEntity: false,
  isDesignatedZone: false,
  // Financial
  financialYearStart: "",
  financialYearEnd: "",
  booksStartDate: "",
  accountingMethod: "",
  fiscalYear: "",
  baseCurrency: "",
  reportingCurrency: "",
  // Localization
  organizationLanguage: "",
  communicationLanguages: [],
  invoiceLanguage: "",
  timeZone: "",
  dateFormat: "",
  // Address
  registeredAddressLine1: "",
  registeredAddressLine2: "",
  registeredCity: "",
  registeredEmirate: "",
  registeredPoBox: "",
  registeredCountry: "UAE",
  registeredPhone: "",
  registeredFax: "",
  sameAsRegistered: true,
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingCity: "",
  billingEmirate: "",
  billingPoBox: "",
  billingCountry: "",
  billingPhone: "",
  billingFax: "",
  // VAT
  vatRegistered: false,
  trnLabel: "TRN",
  trnNumber: "",
  vatRegistrationDate: "",
  vatScheme: "",
  vatFilingFrequency: "",
  firstVatPeriod: "",
  vatReturnStartPeriod: "",
  vatDeregistrationDate: "",
  // Corporate Tax
  ctRegistered: false,
  corporateTaxTrn: "",
  firstTaxPeriodStartDate: "",
  ctFinancialYearEnd: "",
  freeZonePerson: false,
  qfzpStatus: false,
  smallBusinessRelief: false,
  // Tax Config
  taxRates: [],
  defaultVatRate: 5,
  inputVatGlAccount: "",
  outputVatGlAccount: "",
  taxGroups: "",
  // System Controls
  numberSeries: [],
  postingGroupsMapping: "",
  defaultDimensions: "",
  multiCompanyEnabled: false,
  auditTrailEnabled: true,
  approvalWorkflowEnabled: false,
  // Bank
  bankAccounts: [],
  // Users
  users: [],
  approvalHierarchyEnabled: false,
  // Documents
  documents: [],
  // Brand
  brandName: "",
  brandTagline: "",
  brandColor: "#0f172a",
  logoUrl: "",
  faviconUrl: "",
  companyIdPrefix: "",
  companyIdDigits: 5,
  companyIdSeparator: "-",
  companyIdPreview: "",
};

// Section component map
const sectionComponents: Record<string, React.FC> = {
  general: GeneralInfoSection,
  financial: FinancialSetupSection,
  localization: LocalizationSection,
  address: AddressSection,
  vat: VatSetupSection,
  "corporate-tax": CorporateTaxSection,
  "tax-config": TaxConfigSection,
  system: SystemControlsSection,
  bank: BankDetailsSection,
  users: UsersRolesSection,
  documents: DocumentsSection,
  brand: BrandIdentitySection,
};

export const CompanySetupPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<CompanySetupFormValues>({
    resolver: zodResolver(companySetupSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = methods;

  const onSubmit = async (data: CompanySetupFormValues) => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      console.log("Company Setup Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Company setup saved successfully!", {
        description: `${data.companyName} has been configured.`,
        icon: <CheckCircle2 className="w-4 h-4" />,
      });
    } catch {
      toast.error("Failed to save company setup", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onError = () => {
    // Find the first section with errors and navigate to it
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      toast.error("Please fix the validation errors", {
        description: `${errorFields.length} field(s) require attention.`,
      });
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    toast.info("Form has been reset to defaults");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your company details, financials, tax, and system settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit, onError)}
            disabled={isSaving}
            className="gap-1.5 min-w-[100px]"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Setup
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <Form methods={methods} className="w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* ── Sidebar Tab Navigation ── */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-4">
              <TabsList
                variant="line"
                className="flex lg:flex-col w-full h-auto bg-card rounded-xl border border-border/60 p-2 overflow-x-auto lg:overflow-x-visible gap-0.5"
              >
                {COMPANY_SETUP_TABS.map((tab, index) => {
                  const IconComponent = iconMap[tab.icon];
                  const colorClass = sectionColors[tab.value];

                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap data-active:bg-primary/8 data-active:text-primary data-active:after:opacity-0 hover:bg-muted/60 transition-colors"
                    >
                      <span className="flex items-center justify-center w-6 h-6 shrink-0">
                        <span
                          className={`flex items-center justify-center w-5 h-5 text-xs font-bold rounded-md ${activeTab === tab.value
                              ? "text-primary"
                              : colorClass
                            }`}
                        >
                          {IconComponent ? (
                            <IconComponent className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </span>
                      </span>
                      <span className="truncate hidden lg:inline">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* ── Tab Content Area ── */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border border-border/60 bg-card p-6 md:p-8 shadow-sm">
              {COMPANY_SETUP_TABS.map((tab) => {
                const SectionComponent = sectionComponents[tab.value];
                return (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                  >
                    {SectionComponent && <SectionComponent />}
                  </TabsContent>
                );
              })}

              {/* ── Section Navigation ── */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentIdx = COMPANY_SETUP_TABS.findIndex(
                      (t) => t.value === activeTab
                    );
                    if (currentIdx > 0) {
                      setActiveTab(COMPANY_SETUP_TABS[currentIdx - 1].value);
                    }
                  }}
                  disabled={activeTab === COMPANY_SETUP_TABS[0].value}
                  className="gap-1.5"
                >
                  ← Previous
                </Button>

                <span className="text-xs text-muted-foreground">
                  Section{" "}
                  {COMPANY_SETUP_TABS.findIndex((t) => t.value === activeTab) +
                    1}{" "}
                  of {COMPANY_SETUP_TABS.length}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentIdx = COMPANY_SETUP_TABS.findIndex(
                      (t) => t.value === activeTab
                    );
                    if (currentIdx < COMPANY_SETUP_TABS.length - 1) {
                      setActiveTab(COMPANY_SETUP_TABS[currentIdx + 1].value);
                    }
                  }}
                  disabled={
                    activeTab ===
                    COMPANY_SETUP_TABS[COMPANY_SETUP_TABS.length - 1].value
                  }
                  className="gap-1.5"
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </Form>
    </div>
  );
};

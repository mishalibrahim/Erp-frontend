import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  DollarSign,
  Globe,
  MapPin,
  Receipt,
  Settings2,
  CheckCircle2,
  ChevronLeft,
  Users,
  Landmark,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { companySetupApi, type CompanyDetailsDto } from "../api/companySetupApi";

export interface CompanySetupContextType {
  draftData: CompanyDetailsDto | null;
  rowVersion: string;
  setRowVersion: (version: string) => void;
  setDraftData: (data: CompanyDetailsDto | null) => void;
}

const STEPS = [
  { id: "step-1", label: "Basic Info",     description: "Company identity & license",    icon: Building2 },
  { id: "step-2", label: "Financials",     description: "Fiscal year & currency",        icon: DollarSign },
  { id: "step-3", label: "Localization",   description: "Language, timezone & format",   icon: Globe },
  { id: "step-4", label: "Addresses",      description: "Registered & billing address",  icon: MapPin },
  { id: "step-5", label: "Taxes",          description: "VAT & Corporate Tax setup",     icon: Receipt },
  { id: "step-6", label: "Controls",       description: "System preferences",            icon: Settings2 },
  { id: "step-7", label: "Bank Details",   description: "Accounts & billing",            icon: Landmark },
  { id: "step-8", label: "Users & Access", description: "Team invites & roles",          icon: Users },
];

// ─── Mobile: slim top progress bar ───────────────────────────────────────────
const MobileProgressBar = ({
  currentIndex,
  total,
  currentStep,
}: {
  currentIndex: number;
  total: number;
  currentStep: (typeof STEPS)[0];
}) => {
  const Icon = currentStep.icon;
  return (
    <div className="lg:hidden w-full">
      {/* Step dots */}
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  done || active ? "bg-primary" : "bg-border"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Current step info row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-foreground">
              {currentStep.label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {currentStep.description}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-primary">
          {currentIndex + 1} / {total}
        </span>
      </div>
    </div>
  );
};

// ─── Desktop: left sidebar stepper ───────────────────────────────────────────
const DesktopSidebar = ({
  currentIndex,
  progressPercent,
}: {
  currentIndex: number;
  progressPercent: number;
}) => (
  <div className="hidden lg:block w-56 shrink-0 rounded-xl border border-border bg-card shadow-sm p-3 sticky top-8 self-start">
    <nav className="flex flex-col gap-0.5">
      {STEPS.map((s, index) => {
        const Icon = s.icon;
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={s.id} className="relative">
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute left-[22px] top-[44px] w-0.5 h-[8px] z-0",
                  isCompleted ? "bg-primary/60" : "bg-border"
                )}
              />
            )}
            <div
              className={cn(
                "relative z-10 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                isActive && "bg-primary shadow-sm",
                isCompleted && "hover:bg-muted/60",
                isUpcoming && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                  isActive && "bg-white/20",
                  isCompleted && "bg-primary/15",
                  isUpcoming && "bg-muted"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : isCompleted ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-xs font-semibold leading-tight truncate",
                    isActive ? "text-white" : isCompleted ? "text-foreground" : "text-foreground/70"
                  )}
                >
                  {s.label}
                </p>
                <p
                  className={cn(
                    "text-[10px] leading-tight truncate mt-0.5",
                    isActive ? "text-white/75" : "text-muted-foreground"
                  )}
                >
                  {s.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </nav>

    {/* Progress bar */}
    <div className="mt-4 pt-3 border-t border-border">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-medium text-muted-foreground">
          Step {currentIndex + 1} of {STEPS.length}
        </span>
        <span className="text-[10px] font-bold text-primary">{progressPercent}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  </div>
);

// ─── Main Wizard ──────────────────────────────────────────────────────────────
export const CompanySetupWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const draftId = searchParams.get("draftId");

  const [draftData, setDraftData] = useState<CompanyDetailsDto | null>(null);
  const [rowVersion, setRowVersion] = useState<string>("");
  const [isFetchingData, setIsFetchingData] = useState(false);

  const fetchDraftData = async () => {
    if (!draftId) return;
    setIsFetchingData(true);
    try {
      const data = await companySetupApi.getById(draftId);
      
      const stripNulls = (obj: any): any => {
        if (obj === null) return undefined;
        if (Array.isArray(obj)) return obj.map(stripNulls).filter((v) => v !== undefined);
        if (typeof obj === 'object' && obj !== null) {
          const newObj: any = {};
          for (const key in obj) {
            const val = stripNulls(obj[key]);
            if (val !== undefined) {
              newObj[key] = val;
            }
          }
          return newObj;
        }
        return obj;
      };

      const cleanedData = stripNulls(data);
      setDraftData(cleanedData);
      setRowVersion(data.rowVersion || "");
    } catch (error) {
      toast.error("Failed to load company setup draft.");
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    if (draftId) {
      fetchDraftData();
    } else {
      setDraftData({});
      setRowVersion("");
    }
  }, [draftId, location.pathname]);

  const currentStepId = location.pathname.split("/").pop();
  const rawIndex = STEPS.findIndex((s) => s.id === currentStepId);
  const currentStepIndex = rawIndex >= 0 ? rawIndex : 0;
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);
  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Top nav bar ── */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/settings/company-setup")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">All Companies</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Company Setup</span>
          </div>

          {draftId ? (
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
              Draft #{draftId.slice(0, 8)}
            </span>
          ) : (
            <div className="w-20" /> /* spacer */
          )}
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Mobile progress bar (shown only below lg) */}
        {currentStep && (
          <MobileProgressBar
            currentIndex={currentStepIndex}
            total={STEPS.length}
            currentStep={currentStep}
          />
        )}

        {/* Desktop: title block */}
        <div className="hidden lg:block mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Configure your new company
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your progress is automatically saved after each step.
          </p>
        </div>

        {/* Main layout: sidebar (desktop) + form */}
        <div className="flex gap-6 items-start">
          <DesktopSidebar
            currentIndex={currentStepIndex}
            progressPercent={progressPercent}
          />

          {/* Form column */}
          <div className="flex-1 min-w-0">
            {/* Step header — desktop only (mobile uses MobileProgressBar) */}
            <div className="hidden lg:flex mb-4 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {currentStep && <currentStep.icon className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <h2 className="text-base font-semibold leading-tight text-foreground">
                  {currentStep?.label}
                </h2>
                <p className="text-xs text-muted-foreground leading-tight">
                  {currentStep?.description}
                </p>
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px]">
              {isFetchingData || !draftData ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="p-4 sm:p-6"
                  >
                    <Outlet context={{ draftData, rowVersion, setRowVersion, setDraftData }} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

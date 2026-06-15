import { ArrowLeft, ArrowRight, Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WizardFooterProps {
  isLoading?: boolean;
  onBack?: () => void;
  isFinalStep?: boolean;
  submitLabel?: string;
  className?: string;
}

export const WizardFooter = ({
  isLoading,
  onBack,
  isFinalStep = false,
  submitLabel,
  className,
}: WizardFooterProps) => {
  return (
    <div
      className={cn(
        "flex items-center pt-6 mt-6 border-t border-border gap-3",
        // On mobile: stack vertically (submit on top as primary CTA, back below)
        // On sm+: side by side as before
        onBack ? "flex-col-reverse sm:flex-row sm:justify-between" : "flex-row justify-end",
        className
      )}
    >
      {onBack && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={isLoading}
        className={cn(
          "w-full sm:w-auto gap-1.5 min-w-[130px]",
          isFinalStep && "bg-green-600 hover:bg-green-700"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isFinalStep ? (
          <>
            <CheckCheck className="h-4 w-4" />
            {submitLabel ?? "Complete Setup"}
          </>
        ) : (
          <>
            {submitLabel ?? "Save & Continue"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

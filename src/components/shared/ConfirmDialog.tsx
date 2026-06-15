import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Icon shown above the title */
  icon?: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive colours the confirm button red */
  destructive?: boolean;
  onConfirm: () => void;
  /** Optional extra content rendered between description and footer */
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  icon,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm text-center">
        {icon && (
          <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
        )}
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant={destructive ? "destructive" : "default"}
            className="w-full rounded-xl font-semibold"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

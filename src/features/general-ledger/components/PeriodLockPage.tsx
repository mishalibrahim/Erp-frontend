import { format } from "date-fns";
import { Lock, Unlock, ShieldAlert, ShieldCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetPeriodLocks, useLockPeriod, useUnlockPeriod } from "../hooks/useGeneralLedgerExtra";
import type { PeriodLockDto } from "../types/extraTypes";

export function PeriodLockPage() {
  const { data: periods = [], isLoading } = useGetPeriodLocks();
  const lockMutation = useLockPeriod();
  const unlockMutation = useUnlockPeriod();

  const handleToggle = (period: PeriodLockDto) => {
    if (period.isLocked) {
      unlockMutation.mutate(period.periodValue);
    } else {
      lockMutation.mutate(period.periodValue);
    }
  };

  const isPending = (periodValue: string) =>
    (lockMutation.isPending && lockMutation.variables === periodValue) ||
    (unlockMutation.isPending && unlockMutation.variables === periodValue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <CalendarClock className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Period Management</h2>
          <p className="text-sm text-muted-foreground">
            Lock closed periods to prevent new postings. Unlock to make corrections.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
        <ShieldAlert className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-amber-400">Finance Managers only.</span> Locking a
          period prevents any journal vouchers from being validated or posted into that period.
          Vouchers already posted are not affected.
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center border rounded-lg bg-card/50">
          <p className="text-muted-foreground animate-pulse">Loading periods...</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Period</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Locked By</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Locked At</th>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr
                  key={period.periodValue}
                  className={`border-b transition-colors hover:bg-muted/20 ${
                    period.isLocked ? "bg-red-500/5" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {period.periodLabel}
                    <span className="ml-2 text-xs font-mono text-muted-foreground">
                      ({period.periodValue})
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {period.isLocked ? (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-red-500/40 text-red-400 bg-red-500/10"
                      >
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-green-500/40 text-green-400 bg-green-500/10"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        Open
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {period.lockedBy ?? <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs font-mono">
                    {period.lockedAt ? (
                      format(new Date(period.lockedAt), "dd MMM yyyy HH:mm")
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant={period.isLocked ? "outline" : "destructive"}
                      className={`gap-1.5 text-xs ${
                        period.isLocked
                          ? "border-green-500/40 text-green-400 hover:bg-green-500/10"
                          : "border-red-500/40 text-red-400 hover:bg-red-500/10 bg-transparent"
                      }`}
                      onClick={() => handleToggle(period)}
                      disabled={isPending(period.periodValue)}
                    >
                      {isPending(period.periodValue) ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : period.isLocked ? (
                        <>
                          <Unlock className="h-3.5 w-3.5" />
                          Unlock Period
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          Lock Period
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

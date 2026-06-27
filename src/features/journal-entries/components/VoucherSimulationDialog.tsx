import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JournalVoucherDto } from "../types";
import { formatAmount } from "../../general-ledger/utils/glCalculations";

interface VoucherSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: JournalVoucherDto | null;
  simulationData: any[] | null;
}

export function VoucherSimulationDialog({
  open,
  onOpenChange,
  voucher,
  simulationData,
}: VoucherSimulationDialogProps) {
  if (!voucher || !simulationData) return null;

  const totalDebit = simulationData.reduce((s, d) => s + d.debit, 0);
  const totalCredit = simulationData.reduce((s, d) => s + d.credit, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">GL Posting Simulation</DialogTitle>
          <DialogDescription>
            This is a dry-run preview of the entries that will be posted to the General Ledger for voucher{" "}
            <span className="font-semibold text-foreground font-mono">{voucher.voucherNo}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto border rounded-md my-4">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Account No.</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="w-[150px]">Cost Center</TableHead>
                <TableHead className="text-right w-[150px]">Debit (AED)</TableHead>
                <TableHead className="text-right w-[150px]">Credit (AED)</TableHead>
                {voucher.currency !== "AED" && (
                  <TableHead className="text-right w-[180px]">
                    Original Amt ({voucher.currency})
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulationData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">{row.accountNumber}</TableCell>
                  <TableCell className="font-medium">{row.accountName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.costCenter || "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                    {row.debit > 0 ? formatAmount(row.debit) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                    {row.credit > 0 ? formatAmount(row.credit) : "—"}
                  </TableCell>
                  {voucher.currency !== "AED" && (
                    <TableCell className="text-right text-muted-foreground text-sm tabular-nums">
                      {row.foreignDebit > 0
                        ? `${voucher.currency} ${row.foreignDebit.toFixed(2)}`
                        : row.foreignCredit > 0
                        ? `${voucher.currency} ${row.foreignCredit.toFixed(2)}`
                        : "—"}
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {/* Summary Row */}
              <TableRow className="bg-muted/30 font-bold border-t-2">
                <TableCell colSpan={3} className="text-left font-semibold">
                  Total (Base Currency equivalents)
                </TableCell>
                <TableCell className="text-right text-blue-600 dark:text-blue-400 tabular-nums">
                  {formatAmount(totalDebit)}
                </TableCell>
                <TableCell className="text-right text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatAmount(totalCredit)}
                </TableCell>
                {voucher.currency !== "AED" && <TableCell />}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex items-center sm:justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            * Conversions are simulated using exchange rate:{" "}
            <span className="font-bold text-foreground font-mono">{voucher.exchangeRate}</span>
          </div>
          <Button onClick={() => onOpenChange(false)}>Close Simulation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

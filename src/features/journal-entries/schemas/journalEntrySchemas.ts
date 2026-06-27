import { z } from "zod";

export const createJournalVoucherLineSchema = z
  .object({
    accountType: z.enum(["Ledger", "Customer", "Vendor", "Bank"]),
    accountId: z.string().min(1, "Account selection is required"),
    description: z.string().optional(),
    costCenter: z.string().optional(),
    debit: z.coerce.number().min(0, "Debit cannot be negative").default(0),
    credit: z.coerce.number().min(0, "Credit cannot be negative").default(0),
    offsetType: z.enum(["Ledger", "Bank"]).optional(),
    offsetAccountId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Must have either debit > 0 or credit > 0
      const hasDebit = data.debit > 0;
      const hasCredit = data.credit > 0;

      // Cannot have both or neither
      if (hasDebit && hasCredit) return false;
      if (!hasDebit && !hasCredit) return false;

      return true;
    },
    {
      message: "Each line must have either a Debit or a Credit, but not both.",
      path: ["debit"], // attach error to debit
    }
  );

export const createJournalVoucherSchema = z
  .object({
    journalName: z.string().min(1, "Journal Name is required"),
    date: z.string().min(1, "Date is required"),
    currency: z.string().min(1, "Currency is required"),
    journalType: z.enum(
      ["General", "Adjusting", "Accrual", "Reversing", "Opening"]
    ),
    costCenter: z.string().optional(),
    department: z.string().optional(),
    exchangeRate: z.coerce
      .number()
      .min(0.00001, "Exchange Rate must be greater than zero")
      .default(1.0),
    description: z.string().min(1, "Description is required"),
    internalNotes: z.string().optional(),
    lines: z
      .array(createJournalVoucherLineSchema)
      .min(2, "A minimum of 2 lines is required"),
  })
  .refine(
    (data) => {
      // Check if exchange rate is required for foreign currency
      if (data.currency !== "AED" && (!data.exchangeRate || data.exchangeRate <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Exchange rate must be greater than zero for foreign currencies.",
      path: ["exchangeRate"],
    }
  )
  .refine(
    (data) => {
      // Check if total debit equals total credit
      const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
      const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

      // Round to 2 decimal places before comparing (0.01 tolerance)
      const roundedDebit = Math.round(totalDebit * 100);
      const roundedCredit = Math.round(totalCredit * 100);

      return roundedDebit === roundedCredit;
    },
    {
      message: "Total Debits must equal Total Credits.",
      path: ["lines"], // Attach error to lines array
    }
  );

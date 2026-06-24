import { z } from "zod";

export const createJournalEntryLineSchema = z.object({
  glAccountId: z.string().min(1, "GL Account is required"),
  debit: z.coerce.number().min(0, "Debit cannot be negative").default(0),
  credit: z.coerce.number().min(0, "Credit cannot be negative").default(0),
  taxCodeId: z.string().nullable().optional(),
  dimensionId: z.string().nullable().optional(),
}).refine(
  (data) => {
    // A line must have either debit > 0 or credit > 0, but not both
    const hasDebit = data.debit > 0;
    const hasCredit = data.credit > 0;
    
    // It shouldn't have both
    if (hasDebit && hasCredit) return false;
    
    return true;
  },
  {
    message: "A line cannot have both a Debit and a Credit.",
    path: ["debit"], // attach error to debit
  }
);

export const createJournalEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  reference: z.string().min(1, "Reference is required"),
  description: z.string().min(1, "Description is required"),
  postImmediately: z.boolean().default(false),
  lines: z.array(createJournalEntryLineSchema)
    .min(2, "At least 2 lines are required")
}).refine(
  (data) => {
    const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    
    // Use an epsilon for floating point comparison if necessary, but assuming exact for currency 
    // Usually rounding to 2 decimal places before compare is safer:
    const roundedDebit = Math.round(totalDebit * 100);
    const roundedCredit = Math.round(totalCredit * 100);
    
    return roundedDebit === roundedCredit;
  },
  {
    message: "Total Debits must equal Total Credits.",
    path: ["lines"], // Attach the error to the lines array generally
  }
);

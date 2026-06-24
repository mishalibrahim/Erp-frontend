import { z } from "zod";

export const createGlAccountSchema = z.object({
  accountNumber: z.string().min(1, "Account Number is required"),
  accountName: z.string().min(1, "Account Name is required"),
  accountType: z.preprocess((val) => Number(val), z.number()),
  accountCategory: z.preprocess((val) => Number(val), z.number()),
  postingType: z.preprocess((val) => Number(val), z.number()),
  allowManualEntry: z.boolean().default(false),
  mandatoryDimensions: z.boolean().default(false),
  parentAccountId: z.string().nullable().optional(),
});

export const updateGlAccountSchema = z.object({
  accountName: z.string().min(1, "Account Name is required"),
  accountType: z.preprocess((val) => Number(val), z.number()),
  accountCategory: z.preprocess((val) => Number(val), z.number()),
  postingType: z.preprocess((val) => Number(val), z.number()),
  allowManualEntry: z.boolean().default(false),
  mandatoryDimensions: z.boolean().default(false),
  parentAccountId: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type CreateGlAccountFormData = z.infer<typeof createGlAccountSchema>;
export type UpdateGlAccountFormData = z.infer<typeof updateGlAccountSchema>;

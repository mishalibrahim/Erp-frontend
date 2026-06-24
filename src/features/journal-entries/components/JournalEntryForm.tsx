import { useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/hook-form/Form";
import { FormInput } from "@/components/hook-form/FormInput";
import { FormSelect } from "@/components/hook-form/FormSelect";
import { FormSwitch } from "@/components/hook-form/FormSwitch";
import { FormDatePicker } from "@/components/hook-form/FormDatePicker";

import { useGetAccounts } from "@/features/chart-of-accounts/hooks/useChartOfAccounts";
import { GlPostingType } from "@/features/chart-of-accounts/types";
import { createJournalEntrySchema } from "../schemas/journalEntrySchemas";
import type { CreateJournalEntryDto, JournalEntryDto } from "../types";

interface JournalEntryFormProps {
  initialData?: JournalEntryDto;
  onSubmit: (data: CreateJournalEntryDto) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function JournalEntryForm({ initialData, onSubmit, isLoading, onCancel }: JournalEntryFormProps) {
  const isReadOnly = initialData?.isPosted;

  const defaultValues: CreateJournalEntryDto = {
    date: initialData ? initialData.date.split("T")[0] : format(new Date(), "yyyy-MM-dd"),
    reference: initialData?.reference || "",
    description: initialData?.description || "",
    postImmediately: false,
    lines: initialData?.lines.length
      ? initialData.lines.map(line => ({
          glAccountId: line.glAccountId,
          debit: line.debit,
          credit: line.credit,
          taxCodeId: line.taxCodeId,
          dimensionId: line.dimensionId,
        }))
      : [
          { glAccountId: "", debit: 0, credit: 0, taxCodeId: null, dimensionId: null },
          { glAccountId: "", debit: 0, credit: 0, taxCodeId: null, dimensionId: null },
        ],
  };

  const methods = useForm<any>({
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues,
  });

  const { control, formState: { errors } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });

  const watchLines = useWatch({ control, name: "lines" }) || [];
  
  const totalDebit = watchLines.reduce((sum: number, line: any) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = watchLines.reduce((sum: number, line: any) => sum + (Number(line.credit) || 0), 0);
  const isBalanced = Math.round(totalDebit * 100) === Math.round(totalCredit * 100);

  // Fetch Accounts for dropdown
  const { data: accounts = [] } = useGetAccounts();
  const accountOptions = useMemo(() => {
    return accounts
      .filter((acc) => acc.postingType === GlPostingType.Posting && acc.allowManualEntry && acc.isActive)
      .map((acc) => ({
        label: `${acc.accountNumber} - ${acc.accountName}`,
        value: acc.id,
      }));
  }, [accounts]);

  const onFormSubmit = async (data: CreateJournalEntryDto) => {
    await onSubmit(data);
  };

  return (
    <div className="bg-card border rounded-md shadow-sm p-4 md:p-6">
      <Form methods={methods} onSubmit={onFormSubmit}>
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <FormDatePicker
            name="date"
            label="Date"
            disabled={isReadOnly || isLoading}
          />
          <FormInput
            name="reference"
            label="Reference"
            placeholder="e.g. INV-1029"
            disabled={isReadOnly || isLoading}
          />
          <FormInput
            name="description"
            label="Description"
            placeholder="Journal description..."
            disabled={isReadOnly || isLoading}
          />
        </div>

        {/* Lines Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Journal Lines</h3>
            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ glAccountId: "", debit: 0, credit: 0, taxCodeId: null, dimensionId: null })}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Line
              </Button>
            )}
          </div>

          <div className="border rounded-md overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium min-w-[200px]">GL Account</th>
                  <th className="px-4 py-3 font-medium w-32 sm:w-48">Debit</th>
                  <th className="px-4 py-3 font-medium w-32 sm:w-48">Credit</th>
                  {!isReadOnly && <th className="px-4 py-3 font-medium w-12 sm:w-16 text-center"></th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {fields.map((field, index) => (
                  <tr key={field.id} className="bg-card">
                    <td className="px-4 py-2 align-top">
                      <FormSelect
                        name={`lines.${index}.glAccountId`}
                        options={accountOptions}
                        placeholder="Select Account"
                      />
                    </td>
                    <td className="px-4 py-2 align-top">
                      <FormInput
                        name={`lines.${index}.debit`}
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={isReadOnly || isLoading || watchLines[index]?.credit > 0}
                      />
                    </td>
                    <td className="px-4 py-2 align-top">
                      <FormInput
                        name={`lines.${index}.credit`}
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={isReadOnly || isLoading || watchLines[index]?.debit > 0}
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="px-4 py-2 align-top text-center pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 2 || isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.lines?.root?.message && (
             <p className="text-sm text-destructive mt-2 font-medium">{errors.lines.root.message as string}</p>
          )}
        </div>

        {/* Totals Section */}
        <div className="flex flex-col items-end mb-6 md:mb-8 space-y-2 text-sm">
          <div className="flex justify-between w-full sm:w-64 px-4">
            <span className="font-semibold text-muted-foreground">Total Debits:</span>
            <span className="font-medium">{totalDebit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full sm:w-64 px-4">
            <span className="font-semibold text-muted-foreground">Total Credits:</span>
            <span className="font-medium">{totalCredit.toFixed(2)}</span>
          </div>
          <div className={`flex justify-between w-full sm:w-64 px-4 pt-2 border-t font-semibold ${isBalanced ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
            <span>Out of Balance:</span>
            <span>{Math.abs(totalDebit - totalCredit).toFixed(2)}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
          {!isReadOnly ? (
             <div className="flex items-center space-x-2">
                <FormSwitch
                  name="postImmediately"
                  label="Post Immediately"
                />
             </div>
          ) : (
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Posted
              </span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {isReadOnly ? "Back" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={isLoading || !isBalanced}>
                {methods.getValues("postImmediately") ? (
                   <><Send className="mr-2 h-4 w-4" /> Post Journal</>
                ) : (
                   <><Save className="mr-2 h-4 w-4" /> Save Draft</>
                )}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}

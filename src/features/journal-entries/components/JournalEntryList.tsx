import { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Eye, Send } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ClientDataTable } from "@/components/shared/data-table/ClientDataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

import { useGetJournalEntries, useCreateJournalEntry, usePostJournalEntry } from "../hooks/useJournalEntries";
import { JournalEntryForm } from "./JournalEntryForm";
import type { JournalEntryDto, CreateJournalEntryDto } from "../types";

export function JournalEntryList() {
  const { data = [], isLoading } = useGetJournalEntries();
  const createMutation = useCreateJournalEntry();
  const postMutation = usePostJournalEntry();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryDto | null>(null);

  const [postConfirmOpen, setPostConfirmOpen] = useState(false);
  const [entryToPost, setEntryToPost] = useState<string | null>(null);

  const handleAddNew = () => {
    setSelectedEntry(null);
    setIsFormOpen(true);
  };

  const handleView = (entry: JournalEntryDto) => {
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handlePostClick = (id: string) => {
    setEntryToPost(id);
    setPostConfirmOpen(true);
  };

  const confirmPost = async () => {
    if (!entryToPost) return;
    try {
      await postMutation.mutateAsync(entryToPost);
      toast.success("Journal Entry posted successfully!");
      setPostConfirmOpen(false);
      setEntryToPost(null);
    } catch {
      toast.error("Failed to post Journal Entry");
    }
  };

  const handleFormSubmit = async (data: CreateJournalEntryDto) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success(data.postImmediately ? "Journal Entry created and posted!" : "Journal Entry saved as draft!");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to save Journal Entry");
    }
  };

  const columns = useMemo<ColumnDef<JournalEntryDto>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy"),
      },
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => <span className="font-medium">{row.original.reference}</span>,
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "totalAmount",
        header: "Amount",
        cell: ({ row }) => {
          // Display total debit as amount (since debits=credits)
          const amount = row.original.lines.reduce((sum, line) => sum + line.debit, 0);
          return <span>${amount.toFixed(2)}</span>;
        }
      },
      {
        accessorKey: "isPosted",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.isPosted
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}
          >
            {row.original.isPosted ? "Posted" : "Draft"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleView(row.original)}
              title="View Entry"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!row.original.isPosted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => handlePostClick(row.original.id)}
                title="Post Entry"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  if (isFormOpen) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-bold tracking-tight">
               {selectedEntry ? (selectedEntry.isPosted ? "View Journal Entry" : "Edit Draft Entry") : "New Journal Entry"}
             </h1>
             <p className="text-sm text-muted-foreground">
               {selectedEntry ? selectedEntry.reference : "Create a new manual journal entry."}
             </p>
           </div>
        </div>
        <JournalEntryForm
          initialData={selectedEntry || undefined}
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isPending}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Journal Entries</h1>
          <p className="text-sm text-muted-foreground">
            Manage and post manual journal entries.
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> New Journal Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center border rounded-md bg-card/50">
          <p className="text-muted-foreground animate-pulse">Loading journals...</p>
        </div>
      ) : (
        <ClientDataTable
          columns={columns}
          data={data}
          searchKey="reference"
          searchPlaceholder="Search by reference or description..."
        />
      )}

      <ConfirmDialog
        open={postConfirmOpen}
        onOpenChange={setPostConfirmOpen}
        title="Post Journal Entry"
        description="Are you sure you want to post this journal entry? Once posted, it cannot be modified or deleted."
        confirmLabel="Post Entry"
        onConfirm={confirmPost}
      />
    </div>
  );
}

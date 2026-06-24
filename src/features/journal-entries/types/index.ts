export interface JournalEntryLineDto {
  id: string;
  glAccountId: string;
  glAccountNumber: string;
  glAccountName: string;
  debit: number;
  credit: number;
  taxCodeId: string | null;
  dimensionId: string | null;
}

export interface JournalEntryDto {
  id: string;
  date: string;
  reference: string;
  description: string;
  isPosted: boolean;
  lines: JournalEntryLineDto[];
}

export interface CreateJournalEntryLineDto {
  glAccountId: string;
  debit: number;
  credit: number;
  taxCodeId: string | null;
  dimensionId: string | null;
}

export interface CreateJournalEntryDto {
  date: string;
  reference: string;
  description: string;
  postImmediately: boolean;
  lines: CreateJournalEntryLineDto[];
}

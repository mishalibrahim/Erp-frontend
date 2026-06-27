import type {
  GlTransactionDto,
  GlPeriodOption,
  GlCostCenterOption,
  GlAccountOption,
} from "../types";
import { GlTransactionType, GlTransactionStatus } from "../types";

// ─── Mock Accounts ──────────────────────────────────────────────────────────
export const MOCK_GL_ACCOUNTS: GlAccountOption[] = [
  // ASSETS
  { id: "a1", accountNumber: "11010", accountName: "Cash in Hand", category: "ASSETS" },
  { id: "a2", accountNumber: "11020", accountName: "ENBD Current Account", category: "ASSETS" },
  { id: "a3", accountNumber: "11030", accountName: "ADCB Savings Account", category: "ASSETS" },
  { id: "a4", accountNumber: "12010", accountName: "Accounts Receivable", category: "ASSETS" },
  { id: "a5", accountNumber: "13010", accountName: "Prepaid Expenses", category: "ASSETS" },
  { id: "a6", accountNumber: "14010", accountName: "Office Equipment", category: "ASSETS" },
  // LIABILITIES
  { id: "l1", accountNumber: "21010", accountName: "Accounts Payable", category: "LIABILITIES" },
  { id: "l2", accountNumber: "21020", accountName: "Accrued Expenses", category: "LIABILITIES" },
  { id: "l3", accountNumber: "22010", accountName: "VAT Payable", category: "LIABILITIES" },
  { id: "l4", accountNumber: "23010", accountName: "Short-term Loan – ENBD", category: "LIABILITIES" },
  // EQUITY
  { id: "e1", accountNumber: "31010", accountName: "Share Capital", category: "EQUITY" },
  { id: "e2", accountNumber: "32010", accountName: "Retained Earnings", category: "EQUITY" },
  // REVENUE
  { id: "r1", accountNumber: "41010", accountName: "Passport Service Revenue", category: "REVENUE" },
  { id: "r2", accountNumber: "41020", accountName: "Travel & Tourism Revenue", category: "REVENUE" },
  { id: "r3", accountNumber: "41030", accountName: "Business Lounge Revenue", category: "REVENUE" },
  // EXPENSES
  { id: "x1", accountNumber: "51010", accountName: "Salaries & Wages", category: "EXPENSES" },
  { id: "x2", accountNumber: "51020", accountName: "Rent Expense", category: "EXPENSES" },
  { id: "x3", accountNumber: "51030", accountName: "Utilities Expense", category: "EXPENSES" },
  { id: "x4", accountNumber: "51040", accountName: "Office Supplies", category: "EXPENSES" },
  { id: "x5", accountNumber: "51050", accountName: "Marketing Expense", category: "EXPENSES" },
];

// ─── Mock Periods ───────────────────────────────────────────────────────────
export const MOCK_PERIODS: GlPeriodOption[] = [
  { label: "May 2026", value: "2026-05", startDate: "2026-05-01", endDate: "2026-05-31" },
  { label: "Apr 2026", value: "2026-04", startDate: "2026-04-01", endDate: "2026-04-30" },
  { label: "Mar 2026", value: "2026-03", startDate: "2026-03-01", endDate: "2026-03-31" },
  { label: "Feb 2026", value: "2026-02", startDate: "2026-02-01", endDate: "2026-02-28" },
  { label: "Jan 2026", value: "2026-01", startDate: "2026-01-01", endDate: "2026-01-31" },
  { label: "YTD 2026 (Jul–May)", value: "YTD-2026", startDate: "2025-07-01", endDate: "2026-05-31" },
  { label: "Full Year 2026", value: "FY-2026", startDate: "2025-07-01", endDate: "2026-06-30" },
];

// ─── Mock Cost Centers ──────────────────────────────────────────────────────
export const MOCK_COST_CENTERS: GlCostCenterOption[] = [
  { label: "All Cost Centers", value: "all" },
  { label: "Passport Services", value: "Passport Services" },
  { label: "Travel & Tourism", value: "Travel & Tourism" },
  { label: "Business Lounge", value: "Business Lounge" },
  { label: "Admin", value: "Admin" },
];

// ─── Mock Transactions ──────────────────────────────────────────────────────

export const MOCK_GL_TRANSACTIONS: GlTransactionDto[] = [
  // ── May 2026 Transactions ─────────────────────────────────────────────
  {
    id: "t001", date: "2026-05-01", voucherNo: "JV-2026-0201", type: GlTransactionType.Journal,
    narration: "Opening balance adjustment for May 2026", accountId: "a2", accountNumber: "11020",
    accountName: "ENBD Current Account", costCenter: "Admin", debit: 250000, credit: 0,
    postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t002", date: "2026-05-01", voucherNo: "JV-2026-0201", type: GlTransactionType.Journal,
    narration: "Opening balance adjustment for May 2026", accountId: "e2", accountNumber: "32010",
    accountName: "Retained Earnings", costCenter: "Admin", debit: 0, credit: 250000,
    postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t003", date: "2026-05-02", voucherNo: "RV-2026-0028", type: GlTransactionType.Receipt,
    narration: "Receipt from Al Futtaim Group – Passport renewal services", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Passport Services",
    debit: 45000, credit: 0, postedBy: "Sara Al-Rashid", status: GlTransactionStatus.Posted,
  },
  {
    id: "t004", date: "2026-05-02", voucherNo: "RV-2026-0028", type: GlTransactionType.Receipt,
    narration: "Receipt from Al Futtaim Group – Passport renewal services", accountId: "r1",
    accountNumber: "41010", accountName: "Passport Service Revenue", costCenter: "Passport Services",
    debit: 0, credit: 45000, postedBy: "Sara Al-Rashid", status: GlTransactionStatus.Posted,
  },
  {
    id: "t005", date: "2026-05-03", voucherNo: "PV-2026-0055", type: GlTransactionType.Payment,
    narration: "Monthly rent payment – Dubai Marina office", accountId: "x2",
    accountNumber: "51020", accountName: "Rent Expense", costCenter: "Admin",
    debit: 35000, credit: 0, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t006", date: "2026-05-03", voucherNo: "PV-2026-0055", type: GlTransactionType.Payment,
    narration: "Monthly rent payment – Dubai Marina office", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Admin",
    debit: 0, credit: 35000, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t007", date: "2026-05-05", voucherNo: "INV-2026-0141", type: GlTransactionType.SalesInvoice,
    narration: "Travel package – Dubai to London, 4 pax (Emirates Business)", accountId: "a4",
    accountNumber: "12010", accountName: "Accounts Receivable", costCenter: "Travel & Tourism",
    debit: 127000, credit: 0, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t008", date: "2026-05-05", voucherNo: "INV-2026-0141", type: GlTransactionType.SalesInvoice,
    narration: "Travel package – Dubai to London, 4 pax (Emirates Business)", accountId: "r2",
    accountNumber: "41020", accountName: "Travel & Tourism Revenue", costCenter: "Travel & Tourism",
    debit: 0, credit: 127000, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t009", date: "2026-05-06", voucherNo: "PV-2026-0056", type: GlTransactionType.Payment,
    narration: "DEWA utility bill – April 2026", accountId: "x3",
    accountNumber: "51030", accountName: "Utilities Expense", costCenter: "Admin",
    debit: 8500, credit: 0, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t010", date: "2026-05-06", voucherNo: "PV-2026-0056", type: GlTransactionType.Payment,
    narration: "DEWA utility bill – April 2026", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Admin",
    debit: 0, credit: 8500, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t011", date: "2026-05-07", voucherNo: "RV-2026-0029", type: GlTransactionType.Receipt,
    narration: "Business lounge daily pass – 15 corporate guests", accountId: "a1",
    accountNumber: "11010", accountName: "Cash in Hand", costCenter: "Business Lounge",
    debit: 22500, credit: 0, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t012", date: "2026-05-07", voucherNo: "RV-2026-0029", type: GlTransactionType.Receipt,
    narration: "Business lounge daily pass – 15 corporate guests", accountId: "r3",
    accountNumber: "41030", accountName: "Business Lounge Revenue", costCenter: "Business Lounge",
    debit: 0, credit: 22500, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t013", date: "2026-05-08", voucherNo: "PINV-2026-0033", type: GlTransactionType.PurchaseInvoice,
    narration: "Office furniture purchase – Workspace Solutions LLC", accountId: "a6",
    accountNumber: "14010", accountName: "Office Equipment", costCenter: "Admin",
    debit: 18750, credit: 0, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t014", date: "2026-05-08", voucherNo: "PINV-2026-0033", type: GlTransactionType.PurchaseInvoice,
    narration: "Office furniture purchase – Workspace Solutions LLC", accountId: "l1",
    accountNumber: "21010", accountName: "Accounts Payable", costCenter: "Admin",
    debit: 0, credit: 18750, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t015", date: "2026-05-10", voucherNo: "PV-2026-0057", type: GlTransactionType.Payment,
    narration: "May salary advance – Operations team (5 staff)", accountId: "x1",
    accountNumber: "51010", accountName: "Salaries & Wages", costCenter: "Admin",
    debit: 75000, credit: 0, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t016", date: "2026-05-10", voucherNo: "PV-2026-0057", type: GlTransactionType.Payment,
    narration: "May salary advance – Operations team (5 staff)", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Admin",
    debit: 0, credit: 75000, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t017", date: "2026-05-11", voucherNo: "INV-2026-0142", type: GlTransactionType.SalesInvoice,
    narration: "Passport expedite service – VIP batch (8 applications)", accountId: "a4",
    accountNumber: "12010", accountName: "Accounts Receivable", costCenter: "Passport Services",
    debit: 32000, credit: 0, postedBy: "Sara Al-Rashid", status: GlTransactionStatus.Posted,
  },
  {
    id: "t018", date: "2026-05-11", voucherNo: "INV-2026-0142", type: GlTransactionType.SalesInvoice,
    narration: "Passport expedite service – VIP batch (8 applications)", accountId: "r1",
    accountNumber: "41010", accountName: "Passport Service Revenue", costCenter: "Passport Services",
    debit: 0, credit: 32000, postedBy: "Sara Al-Rashid", status: GlTransactionStatus.Posted,
  },
  {
    id: "t019", date: "2026-05-12", voucherNo: "JV-2026-0202", type: GlTransactionType.Journal,
    narration: "Prepaid insurance allocation – May portion", accountId: "x4",
    accountNumber: "51040", accountName: "Office Supplies", costCenter: "Admin",
    debit: 4200, credit: 0, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t020", date: "2026-05-12", voucherNo: "JV-2026-0202", type: GlTransactionType.Journal,
    narration: "Prepaid insurance allocation – May portion", accountId: "a5",
    accountNumber: "13010", accountName: "Prepaid Expenses", costCenter: "Admin",
    debit: 0, credit: 4200, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t021", date: "2026-05-13", voucherNo: "RV-2026-0030", type: GlTransactionType.Receipt,
    narration: "Customer payment – Al Futtaim Group (Invoice INV-2026-0138)", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Travel & Tourism",
    debit: 89000, credit: 0, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t022", date: "2026-05-13", voucherNo: "RV-2026-0030", type: GlTransactionType.Receipt,
    narration: "Customer payment – Al Futtaim Group (Invoice INV-2026-0138)", accountId: "a4",
    accountNumber: "12010", accountName: "Accounts Receivable", costCenter: "Travel & Tourism",
    debit: 0, credit: 89000, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t023", date: "2026-05-14", voucherNo: "PV-2026-0058", type: GlTransactionType.Payment,
    narration: "Google Ads campaign – May travel promotion", accountId: "x5",
    accountNumber: "51050", accountName: "Marketing Expense", costCenter: "Travel & Tourism",
    debit: 15000, credit: 0, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t024", date: "2026-05-14", voucherNo: "PV-2026-0058", type: GlTransactionType.Payment,
    narration: "Google Ads campaign – May travel promotion", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Travel & Tourism",
    debit: 0, credit: 15000, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t025", date: "2026-05-15", voucherNo: "PINV-2026-0034", type: GlTransactionType.PurchaseInvoice,
    narration: "IT equipment – 3 laptops for operations team", accountId: "a6",
    accountNumber: "14010", accountName: "Office Equipment", costCenter: "Admin",
    debit: 24500, credit: 0, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t026", date: "2026-05-15", voucherNo: "PINV-2026-0034", type: GlTransactionType.PurchaseInvoice,
    narration: "IT equipment – 3 laptops for operations team", accountId: "l1",
    accountNumber: "21010", accountName: "Accounts Payable", costCenter: "Admin",
    debit: 0, credit: 24500, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t027", date: "2026-05-16", voucherNo: "INV-2026-0143", type: GlTransactionType.SalesInvoice,
    narration: "Travel package – Abu Dhabi to Paris, 2 pax (Etihad First)", accountId: "a4",
    accountNumber: "12010", accountName: "Accounts Receivable", costCenter: "Travel & Tourism",
    debit: 95000, credit: 0, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t028", date: "2026-05-16", voucherNo: "INV-2026-0143", type: GlTransactionType.SalesInvoice,
    narration: "Travel package – Abu Dhabi to Paris, 2 pax (Etihad First)", accountId: "r2",
    accountNumber: "41020", accountName: "Travel & Tourism Revenue", costCenter: "Travel & Tourism",
    debit: 0, credit: 95000, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t029", date: "2026-05-17", voucherNo: "RV-2026-0031", type: GlTransactionType.Receipt,
    narration: "Business lounge membership – Q3 2026 (Gold tier, 5 companies)", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Business Lounge",
    debit: 62500, credit: 0, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t030", date: "2026-05-17", voucherNo: "RV-2026-0031", type: GlTransactionType.Receipt,
    narration: "Business lounge membership – Q3 2026 (Gold tier, 5 companies)", accountId: "r3",
    accountNumber: "41030", accountName: "Business Lounge Revenue", costCenter: "Business Lounge",
    debit: 0, credit: 62500, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t031", date: "2026-05-18", voucherNo: "JV-2026-0203", type: GlTransactionType.Journal,
    narration: "VAT accrual – May 2026 output tax", accountId: "l3",
    accountNumber: "22010", accountName: "VAT Payable", costCenter: "Admin",
    debit: 0, credit: 18125, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t032", date: "2026-05-18", voucherNo: "JV-2026-0203", type: GlTransactionType.Journal,
    narration: "VAT accrual – May 2026 output tax", accountId: "a4",
    accountNumber: "12010", accountName: "Accounts Receivable", costCenter: "Admin",
    debit: 18125, credit: 0, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t033", date: "2026-05-19", voucherNo: "PV-2026-0059", type: GlTransactionType.Payment,
    narration: "Supplier payment – Workspace Solutions LLC (PINV-2026-0033)", accountId: "l1",
    accountNumber: "21010", accountName: "Accounts Payable", costCenter: "Admin",
    debit: 18750, credit: 0, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t034", date: "2026-05-19", voucherNo: "PV-2026-0059", type: GlTransactionType.Payment,
    narration: "Supplier payment – Workspace Solutions LLC (PINV-2026-0033)", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Admin",
    debit: 0, credit: 18750, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t035", date: "2026-05-20", voucherNo: "RV-2026-0032", type: GlTransactionType.Receipt,
    narration: "Walk-in passport service fees – 22 applications", accountId: "a1",
    accountNumber: "11010", accountName: "Cash in Hand", costCenter: "Passport Services",
    debit: 16500, credit: 0, postedBy: "Sara Al-Rashid", status: GlTransactionStatus.Posted,
  },
  {
    id: "t036", date: "2026-05-20", voucherNo: "RV-2026-0032", type: GlTransactionType.Receipt,
    narration: "Walk-in passport service fees – 22 applications", accountId: "r1",
    accountNumber: "41010", accountName: "Passport Service Revenue", costCenter: "Passport Services",
    debit: 0, credit: 16500, postedBy: "Sara Al-Rashid", status: GlTransactionStatus.Posted,
  },
  {
    id: "t037", date: "2026-05-21", voucherNo: "PV-2026-0060", type: GlTransactionType.Payment,
    narration: "Etisalat telephone & internet – May 2026", accountId: "x3",
    accountNumber: "51030", accountName: "Utilities Expense", costCenter: "Admin",
    debit: 3200, credit: 0, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t038", date: "2026-05-21", voucherNo: "PV-2026-0060", type: GlTransactionType.Payment,
    narration: "Etisalat telephone & internet – May 2026", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Admin",
    debit: 0, credit: 3200, postedBy: "Omar Farooq", status: GlTransactionStatus.Posted,
  },
  {
    id: "t039", date: "2026-05-22", voucherNo: "INV-2026-0144", type: GlTransactionType.SalesInvoice,
    narration: "Corporate travel management – Emaar Properties (monthly retainer)", accountId: "a4",
    accountNumber: "12010", accountName: "Accounts Receivable", costCenter: "Travel & Tourism",
    debit: 55000, credit: 0, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t040", date: "2026-05-22", voucherNo: "INV-2026-0144", type: GlTransactionType.SalesInvoice,
    narration: "Corporate travel management – Emaar Properties (monthly retainer)", accountId: "r2",
    accountNumber: "41020", accountName: "Travel & Tourism Revenue", costCenter: "Travel & Tourism",
    debit: 0, credit: 55000, postedBy: "Layla Hassan", status: GlTransactionStatus.Posted,
  },
  {
    id: "t041", date: "2026-05-23", voucherNo: "JV-2026-0204", type: GlTransactionType.Journal,
    narration: "Depreciation – Office equipment, May 2026", accountId: "x4",
    accountNumber: "51040", accountName: "Office Supplies", costCenter: "Admin",
    debit: 6800, credit: 0, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t042", date: "2026-05-23", voucherNo: "JV-2026-0204", type: GlTransactionType.Journal,
    narration: "Depreciation – Office equipment, May 2026", accountId: "a6",
    accountNumber: "14010", accountName: "Office Equipment", costCenter: "Admin",
    debit: 0, credit: 6800, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t043", date: "2026-05-24", voucherNo: "RV-2026-0033", type: GlTransactionType.Receipt,
    narration: "Business lounge event hosting – Corporate dinner (Majid Al Futtaim)", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Business Lounge",
    debit: 38000, credit: 0, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t044", date: "2026-05-24", voucherNo: "RV-2026-0033", type: GlTransactionType.Receipt,
    narration: "Business lounge event hosting – Corporate dinner (Majid Al Futtaim)", accountId: "r3",
    accountNumber: "41030", accountName: "Business Lounge Revenue", costCenter: "Business Lounge",
    debit: 0, credit: 38000, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t045", date: "2026-05-25", voucherNo: "PV-2026-0061", type: GlTransactionType.Payment,
    narration: "End-of-month salary balance – All departments", accountId: "x1",
    accountNumber: "51010", accountName: "Salaries & Wages", costCenter: "Admin",
    debit: 145000, credit: 0, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t046", date: "2026-05-25", voucherNo: "PV-2026-0061", type: GlTransactionType.Payment,
    narration: "End-of-month salary balance – All departments", accountId: "a2",
    accountNumber: "11020", accountName: "ENBD Current Account", costCenter: "Admin",
    debit: 0, credit: 145000, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t047", date: "2026-05-26", voucherNo: "PINV-2026-0035", type: GlTransactionType.PurchaseInvoice,
    narration: "Catering supplies – Business Lounge kitchen (Sysco Gulf)", accountId: "x4",
    accountNumber: "51040", accountName: "Office Supplies", costCenter: "Business Lounge",
    debit: 12300, credit: 0, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t048", date: "2026-05-26", voucherNo: "PINV-2026-0035", type: GlTransactionType.PurchaseInvoice,
    narration: "Catering supplies – Business Lounge kitchen (Sysco Gulf)", accountId: "l1",
    accountNumber: "21010", accountName: "Accounts Payable", costCenter: "Business Lounge",
    debit: 0, credit: 12300, postedBy: "Khalid Nasser", status: GlTransactionStatus.Posted,
  },
  {
    id: "t049", date: "2026-05-28", voucherNo: "JV-2026-0205", type: GlTransactionType.Journal,
    narration: "Accrued expenses – Professional services (audit fee provision)", accountId: "l2",
    accountNumber: "21020", accountName: "Accrued Expenses", costCenter: "Admin",
    debit: 0, credit: 25000, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
  {
    id: "t050", date: "2026-05-28", voucherNo: "JV-2026-0205", type: GlTransactionType.Journal,
    narration: "Accrued expenses – Professional services (audit fee provision)", accountId: "x4",
    accountNumber: "51040", accountName: "Office Supplies", costCenter: "Admin",
    debit: 25000, credit: 0, postedBy: "Ahmed Khalil", status: GlTransactionStatus.Posted,
  },
];

// ─── Opening Balance Map (per account, for May 2026) ────────────────────────
export const MOCK_OPENING_BALANCES: Record<string, number> = {
  "a1": 35000,     // Cash in Hand – Dr balance
  "a2": 480000,    // ENBD Current – Dr balance
  "a3": 150000,    // ADCB Savings – Dr balance
  "a4": 125000,    // Accounts Receivable – Dr balance
  "a5": 42000,     // Prepaid Expenses – Dr balance
  "a6": 85000,     // Office Equipment – Dr balance
  "l1": -67500,    // Accounts Payable – Cr balance (stored as negative)
  "l2": -45000,    // Accrued Expenses – Cr balance
  "l3": -28000,    // VAT Payable – Cr balance
  "l4": -200000,   // Short-term Loan – Cr balance
  "e1": -500000,   // Share Capital – Cr balance
  "e2": -350000,   // Retained Earnings – Cr balance
  "r1": -180000,   // Passport Revenue – Cr balance
  "r2": -310000,   // Travel Revenue – Cr balance
  "r3": -95000,    // Lounge Revenue – Cr balance
  "x1": 420000,    // Salaries – Dr balance
  "x2": 245000,    // Rent – Dr balance
  "x3": 52000,     // Utilities – Dr balance
  "x4": 78000,     // Office Supplies – Dr balance
  "x5": 63500,     // Marketing – Dr balance
};

// ─── Emirates ────────────────────────────────────────────────────────────────
export const EMIRATES = [
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "dubai", label: "Dubai" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "fujairah", label: "Fujairah" },
] as const;

// ─── License Types ───────────────────────────────────────────────────────────
export const LICENSE_TYPES = [
  { value: "llc", label: "LLC" },
  { value: "fze", label: "FZE" },
  { value: "fzco", label: "FZCO" },
  { value: "sole", label: "Sole Establishment" },
] as const;

// ─── Countries ───────────────────────────────────────────────────────────────
export const COUNTRIES = [
  { value: "UAE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "BH", label: "Bahrain" },
  { value: "OM", label: "Oman" },
  { value: "KW", label: "Kuwait" },
  { value: "QA", label: "Qatar" },
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
] as const;

// ─── Currencies ──────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "SAR", label: "SAR — Saudi Riyal" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "BHD", label: "BHD — Bahraini Dinar" },
  { value: "OMR", label: "OMR — Omani Rial" },
  { value: "QAR", label: "QAR — Qatari Riyal" },
  { value: "KWD", label: "KWD — Kuwaiti Dinar" },
] as const;

// ─── Accounting Methods ──────────────────────────────────────────────────────
export const ACCOUNTING_METHODS = [
  { value: "accrual", label: "Accrual" },
  { value: "cash", label: "Cash" },
] as const;

// ─── Fiscal Year Options ─────────────────────────────────────────────────────
export const FISCAL_YEARS = [
  { value: "jan-dec", label: "January – December" },
  { value: "apr-mar", label: "April – March" },
  { value: "jul-jun", label: "July – June" },
  { value: "oct-sep", label: "October – September" },
] as const;

// ─── Languages ───────────────────────────────────────────────────────────────
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "ur", label: "Urdu" },
  { value: "fr", label: "French" },
  { value: "zh", label: "Chinese" },
  { value: "tl", label: "Filipino" },
  { value: "ml", label: "Malayalam" },
  { value: "ta", label: "Tamil" },
] as const;

// ─── Time Zones ──────────────────────────────────────────────────────────────
export const TIME_ZONES = [
  { value: "Asia/Dubai", label: "(UTC+04:00) Dubai" },
  { value: "Asia/Riyadh", label: "(UTC+03:00) Riyadh" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Mumbai" },
  { value: "Europe/London", label: "(UTC+00:00) London" },
  { value: "America/New_York", label: "(UTC-05:00) New York" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Los Angeles" },
  { value: "Asia/Shanghai", label: "(UTC+08:00) Shanghai" },
  { value: "Asia/Bahrain", label: "(UTC+03:00) Bahrain" },
  { value: "Asia/Muscat", label: "(UTC+04:00) Muscat" },
] as const;

// ─── Date Formats ────────────────────────────────────────────────────────────
export const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "DD-MMM-YYYY", label: "DD-MMM-YYYY" },
  { value: "DD.MM.YYYY", label: "DD.MM.YYYY" },
] as const;

// ─── VAT Schemes ─────────────────────────────────────────────────────────────
export const VAT_SCHEMES = [
  { value: "standard", label: "Standard" },
  { value: "cash", label: "Cash" },
] as const;

// ─── VAT Filing Frequencies ──────────────────────────────────────────────────
export const VAT_FILING_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
] as const;

// ─── TRN Labels ──────────────────────────────────────────────────────────────
export const TRN_LABELS = [
  { value: "TRN", label: "TRN" },
  { value: "GST", label: "GST" },
] as const;

// ─── User Roles ──────────────────────────────────────────────────────────────
export const USER_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "accountant", label: "Accountant" },
  { value: "auditor", label: "Auditor" },
  { value: "custom", label: "Custom" },
] as const;

// ─── Document Types (UAE) ────────────────────────────────────────────────────
export const DOCUMENT_TYPES = [
  { value: "trade-license", label: "Trade License Copy" },
  { value: "moa", label: "Memorandum of Association" },
  { value: "vat-certificate", label: "VAT Certificate" },
  { value: "emirates-id", label: "Emirates ID" },
  { value: "passport", label: "Passport Copy" },
  { value: "other", label: "Other Supporting Documents" },
] as const;

// ─── Document Number Series Types ────────────────────────────────────────────
export const DOC_NUMBER_TYPES = [
  { value: "invoice", label: "Invoice" },
  { value: "credit-note", label: "Credit Note" },
  { value: "debit-note", label: "Debit Note" },
  { value: "journal", label: "Journal Voucher" },
  { value: "payment", label: "Payment Voucher" },
  { value: "receipt", label: "Receipt Voucher" },
  { value: "purchase-order", label: "Purchase Order" },
  { value: "sales-order", label: "Sales Order" },
] as const;

// ─── Default Dimensions ──────────────────────────────────────────────────────
export const DIMENSION_TYPES = [
  { value: "cost-center", label: "Cost Center" },
  { value: "project", label: "Project" },
  { value: "property", label: "Property" },
] as const;

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const BRAND_COLORS = [
  { value: "#0f172a", label: "Midnight" },
  { value: "#1e3a5f", label: "Navy" },
  { value: "#1d4ed8", label: "Royal Blue" },
  { value: "#0369a1", label: "Ocean" },
  { value: "#047857", label: "Emerald" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#be185d", label: "Crimson" },
  { value: "#b45309", label: "Amber" },
  { value: "#374151", label: "Graphite" },
  { value: "#111827", label: "Obsidian" },
] as const;

// ─── ID Separator Options ─────────────────────────────────────────────────────
export const ID_SEPARATORS = [
  { value: "-", label: "Hyphen  ( - )" },
  { value: "/", label: "Slash   ( / )" },
  { value: "_", label: "Underscore  ( _ )" },
  { value: ".", label: "Dot  ( . )" },
  { value: "none", label: "None" },
] as const;

// ─── Tab Configuration ───────────────────────────────────────────────────────
export const COMPANY_SETUP_TABS = [
  { value: "general", label: "General Information", icon: "Building2" },
  { value: "financial", label: "Financial Setup", icon: "Landmark" },
  { value: "localization", label: "Localization & Language", icon: "Globe" },
  { value: "address", label: "Address Details", icon: "MapPin" },
  { value: "vat", label: "VAT Setup", icon: "Receipt" },
  { value: "corporate-tax", label: "Corporate Tax", icon: "FileText" },
  { value: "tax-config", label: "Tax Configuration", icon: "Calculator" },
  { value: "system", label: "System Controls", icon: "Cog" },
  { value: "bank", label: "Bank Details", icon: "CreditCard" },
  { value: "users", label: "Users & Roles", icon: "Users" },
  { value: "documents", label: "Document Management", icon: "FolderOpen" },
  { value: "brand", label: "Brand & ID", icon: "Palette" },
] as const;

// Dummy data for the Finance Dashboard

export const kpiCards = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "AED 4.2M",
    sub: "↑ 12% vs last month",
    subColor: "text-emerald-500",
    accent: "border-l-emerald-500",
  },
  {
    id: "ar",
    label: "Outstanding AR",
    value: "AED 1.8M",
    sub: "42 open invoices",
    subColor: "text-amber-400",
    accent: "border-l-amber-400",
  },
  {
    id: "ap",
    label: "Outstanding AP",
    value: "AED 950K",
    sub: "18 pending payments",
    subColor: "text-sky-400",
    accent: "border-l-sky-400",
  },
  {
    id: "overdue",
    label: "Overdue Payables",
    value: "AED 120K",
    sub: "3 vendors overdue",
    subColor: "text-rose-500",
    accent: "border-l-rose-500",
  },
];

export const revenueExpenseData = [
  { month: "Jul", revenue: 320, expenses: 210 },
  { month: "Aug", revenue: 420, expenses: 280 },
  { month: "Sep", revenue: 290, expenses: 195 },
  { month: "Oct", revenue: 490, expenses: 340 },
  { month: "Nov", revenue: 380, expenses: 260 },
  { month: "Dec", revenue: 540, expenses: 410 },
  { month: "Jan", revenue: 450, expenses: 305 },
  { month: "Feb", revenue: 530, expenses: 370 },
  { month: "Mar", revenue: 430, expenses: 290 },
  { month: "Apr", revenue: 570, expenses: 390 },
  { month: "May", revenue: 510, expenses: 345 },
];

export const quickActions = [
  { label: "New Journal Voucher", icon: "📒", href: "/accounting/jv" },
  { label: "New Receipt", icon: "🧾", href: "#" },
  { label: "New Payment", icon: "💳", href: "#" },
  { label: "New Sales Invoice", icon: "📄", href: "#" },
  { label: "New Purchase Order", icon: "📦", href: "#" },
  { label: "New GRN", icon: "🏷️", href: "#" },
];

export const pendingApprovals = [
  { ref: "JV-0021", type: "Journal", amount: "45,000", status: "Pending" },
  { ref: "PV-0044", type: "Payment", amount: "120,000", status: "Pending" },
  { ref: "RV-0035", type: "Receipt", amount: "78,500", status: "Pending" },
];

export const topArBalances = [
  { customer: "Spice Jet Ltd", balance: "480,000", days: 62, daysColor: "bg-rose-500" },
  { customer: "Emirates Group", balance: "320,000", days: 28, daysColor: "bg-amber-400" },
  { customer: "Al Futtaim", balance: "210,000", days: 15, daysColor: "bg-emerald-500" },
];

export const cashAndBank = [
  { account: "ENBD Current", balance: "1,240,500" },
  { account: "FAB Operating", balance: "890,200" },
  { account: "Petty Cash", balance: "15,600" },
];

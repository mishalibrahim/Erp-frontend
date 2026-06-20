import { Link } from "react-router-dom";
import { Download, Plus, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RevenueChart } from "./RevenueChart";
import {
  kpiCards,
  quickActions,
  pendingApprovals,
  topArBalances,
  cashAndBank,
} from "../data/dashboardData";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function FinanceDashboard() {
  const { activeTenant } = useAuth();

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {activeTenant.name} &rsaquo; Dashboard
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            FY 2025-26 &middot; May 2026 &middot; AED
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Voucher
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.id}
            className={`rounded-xl border bg-card p-5 border-l-4 ${card.accent}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className={`mt-1 text-xs font-medium ${card.subColor}`}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Chart + Quick Actions ─────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Monthly Revenue vs Expenses (AED '000)
            </p>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500">
              <Wifi className="h-2.5 w-2.5" />
              LIVE
            </span>
          </div>
          <RevenueChart />
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </p>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Tables ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pending Approvals */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Pending Approvals
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Ref</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map((row) => (
                <TableRow key={row.ref}>
                  <TableCell className="font-medium text-primary text-sm">{row.ref}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.type}</TableCell>
                  <TableCell className="text-right text-sm">{row.amount}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Top AR Balances */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Top AR Balances
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs text-right">Balance</TableHead>
                <TableHead className="text-xs text-right">Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topArBalances.map((row) => (
                <TableRow key={row.customer}>
                  <TableCell className="font-medium text-primary text-sm">{row.customer}</TableCell>
                  <TableCell className="text-right text-sm">{row.balance}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${row.daysColor}`}>
                      {row.days}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Cash & Bank */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Cash &amp; Bank
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Account</TableHead>
                <TableHead className="text-xs text-right">Balance (AED)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashAndBank.map((row) => (
                <TableRow key={row.account}>
                  <TableCell className="text-sm">{row.account}</TableCell>
                  <TableCell className="text-right text-sm font-semibold text-emerald-500">
                    {row.balance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

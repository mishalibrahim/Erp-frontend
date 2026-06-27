import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, History, CalendarClock } from "lucide-react";
import { VoucherInquiriesList } from "./VoucherInquiriesList";
import { JournalVoucherForm } from "./JournalVoucherForm";

export function JournalVoucherWorkspace() {
  const [activeTab, setActiveTab] = useState<string>("voucher");
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const handleViewVoucher = (id: string) => {
    setSelectedVoucherId(id);
    setActiveTab("voucher");
  };

  const handleNewVoucher = () => {
    setSelectedVoucherId(null);
    setActiveTab("voucher");
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 font-mono">
            General Ledger › Journals › Journal Voucher
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Journal Voucher
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, validate, simulate, approve, and post accounting journal vouchers.
          </p>
        </div>
      </div>

      {/* Workspace Tabs - styled vertically on md and above */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="flex flex-col md:flex-row gap-6 w-full items-start"
      >
        <TabsList className="flex flex-col items-stretch justify-start w-full md:w-[240px] bg-card border rounded-xl p-2 gap-1.5 h-auto shadow-sm flex-shrink-0">
          <TabsTrigger
            value="voucher"
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg justify-start text-left data-active:bg-primary/10 data-active:text-primary hover:bg-muted font-medium w-full transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Journal Voucher</span>
          </TabsTrigger>
          <TabsTrigger
            value="inquiries"
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg justify-start text-left data-active:bg-primary/10 data-active:text-primary hover:bg-muted font-medium w-full transition-all"
          >
            <History className="h-4 w-4" />
            <span>Inquiries</span>
          </TabsTrigger>
          <TabsTrigger
            value="periodic"
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg justify-start text-left data-active:bg-primary/10 data-active:text-primary hover:bg-muted font-medium w-full transition-all"
          >
            <CalendarClock className="h-4 w-4" />
            <span>Periodic Journals</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full overflow-hidden">
          <TabsContent value="voucher" className="outline-none mt-0">
            <JournalVoucherForm
              voucherId={selectedVoucherId}
              onCancel={() => {
                setSelectedVoucherId(null);
                setActiveTab("inquiries");
              }}
              onNew={handleNewVoucher}
            />
          </TabsContent>

          <TabsContent value="inquiries" className="outline-none mt-0">
            <VoucherInquiriesList onViewVoucher={handleViewVoucher} />
          </TabsContent>

          <TabsContent value="periodic" className="outline-none mt-0">
            <div className="border border-dashed rounded-lg bg-card p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                Future Release
              </span>
              <h3 className="text-lg font-semibold text-foreground">Periodic & Recurring Journals</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create monthly accrual schedules, amortization allocations, and template-based recurring journals automatically.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

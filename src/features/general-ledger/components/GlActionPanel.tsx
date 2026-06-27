import { FileSpreadsheet, Printer, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GlActionPanelProps {
  onTabChange: (value: string) => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export function GlActionPanel({
  onTabChange,
  onExportExcel,
  onPrint,
}: GlActionPanelProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
      {/* Tab Controls */}
      <TabsList variant="line" className="w-full sm:w-auto">
        <TabsTrigger value="ledger" onClick={() => onTabChange("ledger")}>
          General Ledger
        </TabsTrigger>
        <TabsTrigger value="drill-down" onClick={() => onTabChange("drill-down")}>
          Drill-down
        </TabsTrigger>
        <TabsTrigger value="reports" onClick={() => onTabChange("reports")}>
          Reports
        </TabsTrigger>
      </TabsList>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onExportExcel}
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          Export Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button asChild size="sm" className="gap-2 shadow-sm">
          <Link to="/general-ledger/journal-entries">
            <Plus className="h-4 w-4" />
            New Voucher
          </Link>
        </Button>
      </div>
    </div>
  );
}

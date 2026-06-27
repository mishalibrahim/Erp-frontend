import { useState } from "react";
import { CalendarIcon, Play, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GL_SEGMENTS } from "../types";

interface QuickReportBarProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
}

export function QuickReportBar({
  onExportExcel,
  onExportPdf,
}: QuickReportBarProps) {
  const [fromDate, setFromDate] = useState<Date>(new Date(2026, 4, 1)); // May 1, 2026
  const [toDate, setToDate] = useState<Date>(new Date(2026, 4, 31)); // May 31, 2026
  const [segment, setSegment] = useState("all");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-card border-b border-border/60 rounded-t-lg">
      {/* From date */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium">From</span>
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-normal"
            >
              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
              {format(fromDate, "dd MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(d) => {
                if (d) setFromDate(d);
                setFromOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To date */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium">To</span>
        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-normal"
            >
              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
              {format(toDate, "dd MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(d) => {
                if (d) setToDate(d);
                setToOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Segment */}
      <Select value={segment} onValueChange={setSegment}>
        <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GL_SEGMENTS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Run */}
      <Button size="sm" className="h-8 gap-1.5 text-xs">
        <Play className="h-3.5 w-3.5" />
        Run
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Export buttons */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={onExportExcel}
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={onExportPdf}
      >
        <FileText className="h-3.5 w-3.5" />
        PDF
      </Button>
    </div>
  );
}

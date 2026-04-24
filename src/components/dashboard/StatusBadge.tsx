import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, FileText, Receipt, AlertCircle, Ban } from "lucide-react";

export type ReportStatus = string;
export type FileStatus = string;

export function statusStyle(status: string): string {
  const s = status.toLowerCase();
  if (s === "fait" || s.includes("terminé") || s.includes("validé") || s.includes("facturé"))
    return "bg-success-soft text-success border-success/30";
  if (s.includes("attente de facturation") || s.includes("à facturer"))
    return "bg-info-soft text-info border-info/30";
  if (s.includes("attente") || s.includes("en cours") || s.includes("planifié"))
    return "bg-warning-soft text-warning-foreground border-warning/40";
  if (s.includes("annul") || s.includes("refus") || s.includes("bloqué"))
    return "bg-destructive/10 text-destructive border-destructive/30";
  if (s.includes("urgent") || s.includes("retard"))
    return "bg-destructive/10 text-destructive border-destructive/30";
  // deterministic fallback color from string hash
  const palette = [
    "bg-info-soft text-info border-info/30",
    "bg-success-soft text-success border-success/30",
    "bg-warning-soft text-warning-foreground border-warning/40",
    "bg-accent text-accent-foreground border-border",
    "bg-primary/10 text-primary border-primary/30",
  ];
  let h = 0;
  for (let i = 0; i < status.length; i++) h = (h * 31 + status.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function statusIcon(status: string) {
  const s = status.toLowerCase();
  if (s === "fait" || s.includes("terminé") || s.includes("validé") || s.includes("facturé")) return CheckCircle2;
  if (s.includes("attente de facturation") || s.includes("à facturer")) return Receipt;
  if (s.includes("attente") || s.includes("en cours")) return Clock;
  if (s.includes("annul") || s.includes("refus") || s.includes("bloqué")) return Ban;
  if (s.includes("urgent") || s.includes("retard")) return AlertCircle;
  return FileText;
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const Icon = statusIcon(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        statusStyle(status),
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

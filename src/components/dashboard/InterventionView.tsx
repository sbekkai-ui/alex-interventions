import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import type { Intervention } from "./data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intervention: Intervention | null;
}

function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function InterventionView({ open, onOpenChange, intervention }: Props) {
  if (!intervention) return null;
  const i = intervention;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {i.number}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Détails de l'intervention
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2 text-sm">
          <Row label="Client" value={i.client} />
          <Row label="Location" value={i.location || "—"} />
          <Row label="Ingénieur" value={i.engineer} />
          <Row label="Date prévue" value={fmt(i.plannedDate)} />
          <Row label="Date de fin prévue" value={fmt(i.endDate)} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Rapport</span>
            <StatusBadge status={i.reportStatus} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Dossier</span>
            <StatusBadge status={i.fileStatus} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

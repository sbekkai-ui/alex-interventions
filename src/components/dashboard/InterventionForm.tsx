import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatusInput } from "./StatusInput";
import type { Intervention } from "./data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Intervention | null;
  reportOptions: string[];
  fileOptions: string[];
  onRemoveReportOption?: (v: string) => void;
  onRemoveFileOption?: (v: string) => void;
  onSubmit: (data: Intervention) => void;
}

const empty = (): Intervention => ({
  id: "",
  number: "",
  client: "",
  location: "",
  plannedDate: new Date().toISOString().slice(0, 10),
  engineer: "",
  endDate: new Date().toISOString().slice(0, 10),
  reportStatus: "En attente",
  fileStatus: "En attente de facturation",
});

export function InterventionForm({ open, onOpenChange, initial, reportOptions, fileOptions, onRemoveReportOption, onRemoveFileOption, onSubmit }: Props) {
  const [form, setForm] = useState<Intervention>(empty());
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : empty());
  }, [open, initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client || !form.engineer) return;
    onSubmit(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEdit ? "Modifier l'intervention" : "Nouvelle intervention"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit ? "Mettez à jour les informations." : "Renseignez les informations ci-dessous."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="number">N° Intervention</Label>
              <Input id="number" value={form.number} readOnly className="bg-muted/50 font-mono" placeholder="Auto" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="client">Client</Label>
              <Input id="client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Site, ville ou adresse" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="engineer">Ingénieur</Label>
            <Input id="engineer" value={form.engineer} onChange={(e) => setForm({ ...form, engineer: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="plannedDate">Date prévue</Label>
              <Input id="plannedDate" type="date" value={form.plannedDate} onChange={(e) => setForm({ ...form, plannedDate: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="endDate">Date de fin prévue</Label>
              <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Rapport</Label>
              <StatusInput
                value={form.reportStatus}
                onChange={(v) => setForm({ ...form, reportStatus: v })}
                options={reportOptions}
                onRemoveOption={onRemoveReportOption}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Dossier</Label>
              <StatusInput
                value={form.fileStatus}
                onChange={(v) => setForm({ ...form, fileStatus: v })}
                options={fileOptions}
                onRemoveOption={onRemoveFileOption}
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-[var(--gradient-primary)] hover:opacity-90">
              {isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

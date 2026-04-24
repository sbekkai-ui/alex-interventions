import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Bell,
  Download,
  Plus,
  Wrench,
  ClipboardList,
  CheckCheck,
  Receipt,
  LayoutGrid,
  Trash2,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { StatCard } from "@/components/dashboard/StatCard";
import { InterventionsTable } from "@/components/dashboard/InterventionsTable";
import { InterventionForm } from "@/components/dashboard/InterventionForm";
import { InterventionView } from "@/components/dashboard/InterventionView";
import { interventions as seedInterventions, type Intervention } from "@/components/dashboard/data";
import { toast } from "sonner";

function emptyDraft(): Intervention {
  const today = new Date().toISOString().slice(0, 10);
  return { id: "", number: "", client: "", location: "", plannedDate: today, engineer: "", endDate: today, reportStatus: "En attente", fileStatus: "En attente de facturation" };
}

function latestPlannedDate(rows: Intervention[]) {
  return rows.map((i) => i.plannedDate).sort().at(-1) || new Date().toISOString().slice(0, 10);
}

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "AlexIntervention — Tableau de bord" },
      { name: "description", content: "Gérez vos interventions techniques: planning, rapports, facturation." },
    ],
  }),
});

function Dashboard() {
  const [interventions, setInterventions] = useState<Intervention[]>(seedInterventions);
  const [search, setSearch] = useState("");
  const [client, setClient] = useState("all");
  const [engineer, setEngineer] = useState("all");
  const [status, setStatus] = useState("all");
  const [deletePeriod, setDeletePeriod] = useState("day");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Intervention | null>(null);
  const [viewing, setViewing] = useState<Intervention | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [reportOptions, setReportOptions] = useState<string[]>(["En attente", "En cours", "Fait"]);
  const [fileOptions, setFileOptions] = useState<string[]>(["En attente de facturation", "Facturé", "Fait"]);

  function nextNumber(prev: Intervention[]) {
    const year = new Date().getFullYear();
    const prefix = `INT-${year}-`;
    const max = prev
      .map((p) => p.number)
      .filter((n) => n.startsWith(prefix))
      .map((n) => parseInt(n.slice(prefix.length), 10))
      .filter((n) => !isNaN(n))
      .reduce((a, b) => Math.max(a, b), 0);
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  }

  const clients = useMemo(() => Array.from(new Set(interventions.map(i => i.client))).sort(), [interventions]);
  const engineers = useMemo(() => Array.from(new Set(interventions.map(i => i.engineer))).sort(), [interventions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return interventions.filter(i => {
      if (q && !`${i.number} ${i.client} ${i.location} ${i.engineer}`.toLowerCase().includes(q)) return false;
      if (client !== "all" && i.client !== client) return false;
      if (engineer !== "all" && i.engineer !== engineer) return false;
      if (status === "pending" && i.reportStatus !== "En attente") return false;
      if (status === "done" && i.reportStatus !== "Fait") return false;
      if (status === "invoicing" && i.fileStatus !== "En attente de facturation") return false;
      return true;
    });
  }, [interventions, search, client, engineer, status]);

  const stats = useMemo(() => ({
    total: interventions.length,
    pending: interventions.filter(i => i.reportStatus === "En attente").length,
    completed: interventions.filter(i => i.reportStatus === "Fait").length,
    invoicing: interventions.filter(i => i.fileStatus === "En attente de facturation").length,
  }), [interventions]);

  const pendingEngineers = useMemo(() => {
    const counts = new Map<string, number>();
    interventions
      .filter((i) => i.reportStatus === "En attente")
      .forEach((i) => counts.set(i.engineer || "Sans ingénieur", (counts.get(i.engineer || "Sans ingénieur") || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [interventions]);

  const periodLabels: Record<string, string> = {
    day: "du jour",
    week: "de la semaine",
    month: "du mois",
    year: "de l'année",
  };

  function isInSelectedPeriod(dateValue: string, period: string, referenceValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);
    const reference = new Date(`${referenceValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;
    if (Number.isNaN(reference.getTime())) return false;

    if (period === "day") {
      return date.toDateString() === reference.toDateString();
    }
    if (period === "week") {
      const start = new Date(reference);
      const day = start.getDay() || 7;
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - day + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    if (period === "month") {
      return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
    }
    return date.getFullYear() === reference.getFullYear();
  }

  const deleteTargets = useMemo(
    () => interventions.filter((i) => isInSelectedPeriod(i.plannedDate, deletePeriod, latestPlannedDate(interventions))),
    [interventions, deletePeriod],
  );

  function openCreate() {
    setEditing({ ...emptyDraft(), number: nextNumber(interventions) });
    setFormOpen(true);
  }
  function openEdit(row: Intervention) {
    setEditing(row);
    setFormOpen(true);
  }
  function openView(row: Intervention) {
    setViewing(row);
    setViewOpen(true);
  }
  function handleSubmit(data: Intervention) {
    setInterventions((prev) => {
      const isExisting = prev.some((i) => i.id === editing?.id);
      if (isExisting && editing) {
        toast.success(`${data.number} mis à jour`);
        return prev.map((i) => (i.id === editing.id ? { ...data, id: editing.id } : i));
      }
      const id = (Math.max(0, ...prev.map((p) => Number(p.id) || 0)) + 1).toString();
      const number = data.number || nextNumber(prev);
      toast.success(`${number} créée`);
      return [{ ...data, id, number }, ...prev];
    });
  }
  function handleComplete(row: Intervention) {
    setInterventions((prev) => prev.map((i) => i.id === row.id ? { ...i, reportStatus: "Fait", fileStatus: "Fait" } : i));
    toast.success(`${row.number} marqué comme fait`);
  }
  function handleDelete(row: Intervention) {
    setInterventions((prev) => prev.filter((i) => i.id !== row.id));
    toast.success(`${row.number} supprimée`);
  }
  function handleDeletePeriod() {
    if (deleteTargets.length === 0) {
      toast.info(`Aucune intervention ${periodLabels[deletePeriod]} à supprimer`);
      return;
    }
    const ok = window.confirm(`Supprimer ${deleteTargets.length} intervention${deleteTargets.length > 1 ? "s" : ""} ${periodLabels[deletePeriod]} ?`);
    if (!ok) return;
    const ids = new Set(deleteTargets.map((i) => i.id));
    setInterventions((prev) => prev.filter((i) => !ids.has(i.id)));
    toast.success(`${deleteTargets.length} intervention${deleteTargets.length > 1 ? "s" : ""} supprimée${deleteTargets.length > 1 ? "s" : ""}`);
  }
  function handleReportChange(row: Intervention, v: string) {
    if (!reportOptions.includes(v)) setReportOptions((p) => [...p, v]);
    setInterventions((prev) => prev.map((i) => i.id === row.id ? { ...i, reportStatus: v } : i));
  }
  function handleFileChange(row: Intervention, v: string) {
    if (!fileOptions.includes(v)) setFileOptions((p) => [...p, v]);
    setInterventions((prev) => prev.map((i) => i.id === row.id ? { ...i, fileStatus: v } : i));
  }
  function removeReportOption(v: string) {
    setReportOptions((p) => p.filter((o) => o !== v));
    toast.success(`Statut "${v}" retiré`);
  }
  function removeFileOption(v: string) {
    setFileOptions((p) => p.filter((o) => o !== v));
    toast.success(`Statut "${v}" retiré`);
  }
  function handleExport() {
    const headers = ["N° Intervention", "Client", "Location", "Date prévue", "Ingénieur", "Date de fin", "Rapport", "Dossier"];
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = filtered.map(i => [i.number, i.client, i.location, i.plannedDate, i.engineer, i.endDate, i.reportStatus, i.fileStatus].map(escape).join(","));
    const csv = "\uFEFF" + [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interventions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} ligne${filtered.length > 1 ? "s" : ""} exportée${filtered.length > 1 ? "s" : ""}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gradient-primary)] shadow-[var(--shadow-elegant)]">
              <LayoutGrid className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold tracking-tight">AlexIntervention</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Tableau de bord</p>
            </div>
          </div>

          <div className="relative ml-auto md:ml-6 md:max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher N°, client, ingénieur…"
              className="pl-9 h-10 bg-muted/40 border-border/60 focus-visible:bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="relative h-10 w-10" onClick={() => toast.info("3 interventions en retard")}>
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:inline-flex gap-1.5" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Interventions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pilotez vos interventions techniques en temps réel.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={openCreate}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Nouvelle intervention
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total interventions" value={stats.total} icon={Wrench} tone="primary" hint="Toutes périodes" />
          <StatCard
            label="Rapports en attente"
            value={stats.pending}
            icon={ClipboardList}
            tone="warning"
            hint="Survolez pour voir les ingénieurs"
            hoverContent={
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Ingénieurs</p>
                {pendingEngineers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun rapport en attente</p>
                ) : (
                  <ul className="space-y-1.5">
                    {pendingEngineers.map(([name, count]) => (
                      <li key={name} className="flex items-center justify-between gap-4 text-sm">
                        <span>{name}</span>
                        <span className="font-semibold text-foreground">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            }
          />
          <StatCard label="Rapports terminés" value={stats.completed} icon={CheckCheck} tone="success" hint="Validés" />
          <StatCard label="En attente facturation" value={stats.invoicing} icon={Receipt} tone="info" hint="À facturer" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Client" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={engineer} onValueChange={setEngineer}>
            <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Ingénieur" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les ingénieurs</SelectItem>
              {engineers.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px] bg-card"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">Rapport en attente</SelectItem>
              <SelectItem value="done">Rapport fait</SelectItem>
              <SelectItem value="invoicing">En attente facturation</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={deletePeriod} onValueChange={setDeletePeriod}>
              <SelectTrigger className="w-[170px] bg-card"><SelectValue placeholder="Période" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeletePeriod}
              disabled={deleteTargets.length === 0}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer période ({deleteTargets.length})
            </Button>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> intervention{filtered.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <InterventionsTable
          data={filtered}
          onView={openView}
          onEdit={openEdit}
          onComplete={handleComplete}
          onDelete={handleDelete}
          reportOptions={reportOptions}
          fileOptions={fileOptions}
          onReportChange={handleReportChange}
          onFileChange={handleFileChange}
          onRemoveReportOption={removeReportOption}
          onRemoveFileOption={removeFileOption}
        />
      </main>

      <InterventionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        reportOptions={reportOptions}
        fileOptions={fileOptions}
        onRemoveReportOption={removeReportOption}
        onRemoveFileOption={removeFileOption}
        onSubmit={handleSubmit}
      />
      <InterventionView open={viewOpen} onOpenChange={setViewOpen} intervention={viewing} />
    </div>
  );
}

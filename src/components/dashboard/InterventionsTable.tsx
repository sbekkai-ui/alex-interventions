import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Eye, Pencil, CheckCircle2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "./StatusBadge";
import { StatusInput } from "./StatusInput";
import type { Intervention } from "./data";
import { toast } from "sonner";

type SortKey = keyof Intervention;
type SortDir = "asc" | "desc";

interface Props {
  data: Intervention[];
  onEdit?: (row: Intervention) => void;
  onComplete?: (row: Intervention) => void;
  onView?: (row: Intervention) => void;
  onDelete?: (row: Intervention) => void;
  reportOptions?: string[];
  fileOptions?: string[];
  onReportChange?: (row: Intervention, v: string) => void;
  onFileChange?: (row: Intervention, v: string) => void;
  onRemoveReportOption?: (v: string) => void;
  onRemoveFileOption?: (v: string) => void;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InterventionsTable({ data, onEdit, onComplete, onView, onDelete, reportOptions, fileOptions, onReportChange, onFileChange, onRemoveReportOption, onRemoveFileOption }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("plannedDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <TableHead>
      <button
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-60" />
      </button>
    </TableHead>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <Th k="number" label="N° Intervention" />
            <Th k="client" label="Client" />
            <Th k="location" label="Location" />
            <Th k="plannedDate" label="Date prévu" />
            <Th k="engineer" label="Ingénieur" />
            <Th k="endDate" label="Date de fin prévue" />
            <Th k="reportStatus" label="Rapport" />
            <Th k="fileStatus" label="Dossier" />
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                Aucune intervention trouvée
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  {row.number}
                </TableCell>
                <TableCell className="font-medium">{row.client}</TableCell>
                <TableCell className="text-muted-foreground">{row.location || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(row.plannedDate)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {row.engineer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm">{row.engineer}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(row.endDate)}</TableCell>
                <TableCell>
                  {onReportChange && reportOptions ? (
                    <StatusInput value={row.reportStatus} options={reportOptions} onChange={(v) => onReportChange(row, v)} onRemoveOption={onRemoveReportOption} className="h-8 w-[140px]" />
                  ) : (
                    <StatusBadge status={row.reportStatus} />
                  )}
                </TableCell>
                <TableCell>
                  {onFileChange && fileOptions ? (
                    <StatusInput value={row.fileStatus} options={fileOptions} onChange={(v) => onFileChange(row, v)} onRemoveOption={onRemoveFileOption} className="h-8 w-[180px]" />
                  ) : (
                    <StatusBadge status={row.fileStatus} />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => (onView ? onView(row) : toast.info(`Voir ${row.number}`))}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit?.(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success hover:bg-success-soft" onClick={() => onComplete?.(row)}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer l'intervention ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. L'intervention <span className="font-mono font-semibold">{row.number}</span> sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => onDelete?.(row)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

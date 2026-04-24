import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "primary" | "warning" | "success" | "info";

const toneStyles: Record<Tone, { bg: string; icon: string }> = {
  primary: { bg: "bg-[var(--gradient-primary)]", icon: "text-primary-foreground" },
  warning: { bg: "bg-[var(--gradient-warning)]", icon: "text-warning-foreground" },
  success: { bg: "bg-[var(--gradient-success)]", icon: "text-success-foreground" },
  info: { bg: "bg-[var(--gradient-info)]", icon: "text-info-foreground" },
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone: Tone;
  hint?: string;
  hoverContent?: ReactNode;
}

export function StatCard({ label, value, icon: Icon, tone, hint, hoverContent }: StatCardProps) {
  const t = toneStyles[tone];
  return (
    <Card className="group relative overflow-visible border border-border/60 p-5 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm",
            t.bg,
          )}
        >
          <Icon className={cn("h-5 w-5", t.icon)} />
        </div>
      </div>
      {hoverContent && (
        <div className="pointer-events-none absolute left-4 top-[calc(100%+0.5rem)] z-20 hidden min-w-56 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-[var(--shadow-elegant)] group-hover:block">
          {hoverContent}
        </div>
      )}
    </Card>
  );
}

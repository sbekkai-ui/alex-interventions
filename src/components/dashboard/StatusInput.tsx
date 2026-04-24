import { useState } from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { statusStyle } from "./StatusBadge";

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onRemoveOption?: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function StatusInput({ value, onChange, options, onRemoveOption, placeholder, className }: Props) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setCustom("");
  }

  function addCustom() {
    const v = custom.trim();
    if (v) pick(v);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring",
            value ? statusStyle(value) : "border-input bg-background",
            className,
          )}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || placeholder || "Choisir…"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-1" align="start">
        <div className="max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <div key={opt} className="group flex w-full items-center gap-1 rounded-sm hover:bg-accent">
              <button
                type="button"
                onClick={() => pick(opt)}
                className="flex flex-1 items-center justify-between px-2 py-1.5 text-sm"
              >
                <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", statusStyle(opt))}>
                  {opt}
                </span>
                {value === opt && <Check className="h-4 w-4 text-primary" />}
              </button>
              {onRemoveOption && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemoveOption(opt); }}
                  className="mr-1 rounded p-1 opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={`Supprimer ${opt}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-1 border-t pt-1">
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
            placeholder="Ajouter un statut…"
            className="h-8 text-sm"
          />
          <Button type="button" size="icon" className="h-8 w-8 shrink-0" onClick={addCustom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import {
  Badge,
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatisticCard,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import type { Tone } from "@/data/kho-nguyen-lieu";

const TONE_BADGE: Record<Tone, string> = {
  ok: "border-transparent bg-success/15 text-success",
  warn: "border-transparent bg-warning/20 text-warning-foreground",
  bad: "border-transparent bg-destructive/10 text-destructive",
  info: "border-transparent bg-primary/10 text-primary",
  violet: "border-transparent bg-accent text-accent-foreground",
  gray: "border-transparent bg-muted text-muted-foreground",
};
export const TONE_TEXT: Partial<Record<Tone, string>> = { ok: "text-success", warn: "text-warning", bad: "text-destructive" };

export function ToneBadge({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <Badge variant="outline" className={cn("font-normal", TONE_BADGE[tone])}>
      {children}
    </Badge>
  );
}

export type Kpi = { label: string; value: ReactNode; hint?: ReactNode; tone?: Tone };
export function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        items.length >= 6 ? "lg:grid-cols-3 xl:grid-cols-6" : items.length === 3 ? "md:grid-cols-3" : "lg:grid-cols-4",
      )}
    >
      {items.map((k) => (
        <StatisticCard
          key={k.label}
          label={k.label}
          value={<span className={cn("tabular-nums", k.tone && TONE_TEXT[k.tone])}>{k.value}</span>}
          hint={k.hint}
        />
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">ⓘ {children}</p>;
}

/** Select đơn giản: option đầu tiên là giá trị mặc định (thường là "Tất cả …"). */
export function FilterSelect({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  label: string;
}) {
  return (
    <Select value={value} defaultValue={value === undefined ? options[0] : undefined} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="w-auto min-w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function InfoRows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y rounded-md border text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 px-3 py-2">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-right font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

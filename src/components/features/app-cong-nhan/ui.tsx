"use client";

import {
  Badge,
  Button,
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  cn,
  ToggleGroup,
  ToggleGroupItem,
} from "@erp/miniapp-ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { fmt } from "@/lib/format";
import { type FlowStep, initials, type Nav } from "@/data/app-cong-nhan";

/*
 * Primitives dùng chung của app công nhân — cỡ chữ ≥ 16px, dòng chạm ≥ 48px như
 * cong-nhan/home-overview. Xanh = cộng, đỏ = trừ, vàng = tạm tính.
 */

export type Go = (to: Nav) => void;
export type Tone = "ok" | "warn" | "bad" | "info" | "gray";

export const TONE_TEXT: Record<Tone, string> = {
  ok: "text-success",
  warn: "text-warning",
  bad: "text-destructive",
  info: "text-primary",
  gray: "text-muted-foreground",
};
// Cùng tông với cong-nhan trade-badges.tsx.
const TONE_BADGE: Record<Tone, string> = {
  ok: "bg-success/15 text-success",
  warn: "bg-warning/15 text-warning",
  bad: "bg-destructive/10 text-destructive",
  info: "bg-primary/10 text-primary",
  gray: "bg-muted text-muted-foreground",
};

export function StatusBadge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return <Badge className={cn("h-7 px-2.5 text-sm", TONE_BADGE[tone], className)}>{children}</Badge>;
}

/** Tạm tính (vàng) / Đã chốt (xanh). */
export const ClosedBadge = ({ tmp }: { tmp: boolean }) =>
  tmp ? <StatusBadge tone="warn">Tạm tính</StatusBadge> : <StatusBadge tone="ok">Đã chốt</StatusBadge>;

/** + 1.234 xanh / − 1.234 đỏ; 0 → rỗng. */
export function Signed({ n, unit = "" }: { n: number; unit?: string }) {
  if (!n) return null;
  return (
    <span className={cn("tabular-nums", n > 0 ? "text-success" : "text-destructive")}>
      {n > 0 ? "+ " : "− "}
      {fmt(Math.abs(n))}
      {unit}
    </span>
  );
}

/** Khung danh sách: Card bo góc, các dòng cách nhau bằng đường kẻ. */
export function Box({ children, className }: { children: ReactNode; className?: string }) {
  return <Card className={cn("gap-0 divide-y overflow-hidden py-0", className)}>{children}</Card>;
}

const ROW = "flex min-h-13 w-full items-center gap-3 px-4 py-3 text-left text-base";

export function Row({
  label,
  sub,
  value,
  tone,
  onClick,
  chevron,
  className,
}: {
  label: ReactNode;
  sub?: ReactNode;
  value?: ReactNode;
  tone?: Tone;
  onClick?: () => void;
  chevron?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <div className="min-w-0 flex-1">
        {label}
        {sub ? <div className="text-muted-foreground text-sm">{sub}</div> : null}
      </div>
      {value != null && value !== "" ? (
        <b className={cn("shrink-0 text-right tabular-nums", tone && TONE_TEXT[tone])}>{value}</b>
      ) : null}
      {chevron || onClick ? <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden /> : null}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={cn(ROW, "active:bg-muted", className)}>
      {body}
    </button>
  ) : (
    <div className={cn(ROW, className)}>{body}</div>
  );
}

/** Dòng gập/mở (thay cho <details> của bản HTML). */
export function Fold({
  head,
  children,
  defaultOpen,
  headClassName,
}: {
  head: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  headClassName?: string;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/fold">
      <CollapsibleTrigger className={cn(ROW, "active:bg-muted", headClassName)}>
        <div className="flex min-w-0 flex-1 items-center gap-3">{head}</div>
        <ChevronRightIcon
          className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/fold:rotate-90"
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="divide-y border-t bg-muted/40 [&>*]:pl-6">{children}</CollapsibleContent>
    </Collapsible>
  );
}

/** Thẻ số lớn (số tiền, tổng): ok = nền xanh nhạt, info = nền primary nhạt. */
export function BigStat({
  label,
  value,
  tone,
  children,
  className,
}: {
  label: ReactNode;
  value?: ReactNode;
  tone?: "ok" | "info";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "gap-0 p-4",
        tone === "ok" && "border-transparent bg-success/10",
        tone === "info" && "border-transparent bg-primary/10",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-base text-muted-foreground">{label}</div>
      {value != null ? (
        <div
          className={cn(
            "mt-1 font-bold text-[2rem] tabular-nums leading-tight tracking-tight",
            tone === "ok" && "text-success",
            tone === "info" && "text-primary",
          )}
        >
          {value}
        </div>
      ) : null}
      {children}
    </Card>
  );
}

/** Ô số nhỏ trong lưới 3 cột. */
export function MiniStat({ label, value, tone, sub }: { label: ReactNode; value: ReactNode; tone?: Tone; sub?: ReactNode }) {
  return (
    <Card className="gap-1 p-3">
      <div className="text-muted-foreground text-sm leading-tight">{label}</div>
      <div className={cn("font-bold text-xl tabular-nums leading-tight", tone && TONE_TEXT[tone])}>{value}</div>
      {sub ? <div className="text-muted-foreground text-sm">{sub}</div> : null}
    </Card>
  );
}

export function LinkButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex min-h-11 items-center gap-1 self-start font-semibold text-base text-primary"
    >
      {children}
      <ChevronRightIcon className="size-5" aria-hidden />
    </button>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-1 flex items-center justify-between gap-2">
      <h2 className="font-semibold text-lg">{children}</h2>
      {action}
    </div>
  );
}

export const Note = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("text-muted-foreground text-sm leading-relaxed", className)}>{children}</p>
);

/** Chọn 1 trong nhiều — chip to, chạm dễ. */
export function Chips({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={2}
      value={value}
      onValueChange={(v) => v && onChange(v)}
      aria-label={label}
      className="flex-wrap justify-start"
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o}
          value={o}
          className="h-11 rounded-full px-4 text-base data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:font-semibold data-[state=on]:text-primary"
        >
          {o}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/** Lưới ô lối tắt 3 cột. */
export function Tiles({ items, go }: { items: { icon: string; label: string; to: Nav }[]; go: Go }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={() => go(t.to)}
          className="flex min-h-23 flex-col items-center justify-center gap-1.5 rounded-xl border bg-card px-1 py-2 text-center font-semibold text-[15px] leading-tight active:bg-muted"
        >
          <span className="text-[28px] leading-none" aria-hidden>
            {t.icon}
          </span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** ‹ Tháng 11/2026 › */
export function Stepper({ label, onPrev, onNext }: { label: ReactNode; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-lg" className="size-11 rounded-full" onClick={onPrev} aria-label="Tháng trước">
        <ChevronLeftIcon className="size-5" />
      </Button>
      <b className="flex-1 text-center text-lg">{label}</b>
      <Button variant="outline" size="icon-lg" className="size-11 rounded-full" onClick={onNext} aria-label="Tháng sau">
        <ChevronRightIcon className="size-5" />
      </Button>
    </div>
  );
}

const STEP_MARK: Record<FlowStep, [string, string]> = {
  done: ["✓", "text-success font-bold"],
  now: ["⏳", ""],
  no: ["✕", "text-destructive font-bold"],
  "": ["○", "text-muted-foreground"],
};
/** Các bước duyệt đơn: ✓ xong · ⏳ đang chờ · ✕ từ chối · ○ chưa tới. */
export function Steps({ steps }: { steps: { label: ReactNode; state: FlowStep }[] }) {
  return (
    <ol className="flex flex-col gap-2 px-4 py-3 pl-6 text-[15px]">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-2">
          <span className={cn("w-5 shrink-0 text-center", STEP_MARK[s.state][1])} aria-hidden>
            {STEP_MARK[s.state][0]}
          </span>
          {s.label}
        </li>
      ))}
    </ol>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground",
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

/** "a **b** c" → a <b>b</b> c (câu trả lời hỏi đáp). */
export const Bold = ({ text }: { text: string }) => (
  <>{text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}</>
);

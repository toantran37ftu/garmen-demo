"use client";

import { Badge, Progress, TableRow } from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import type { Lay, Order, Tone } from "@/data/trai-cat";
import { fmt } from "@/lib/format";

export type View = "order" | "lenh" | "sd" | "phieu" | "cuon" | "hh" | "bo" | "ns" | "dt";
/** Bộ lọc khi nhảy từ Order cắt sang màn khác: đơn (index) + màu/size/lệnh cắt tuỳ chọn */
export type Filter = { o: number; mau?: string; sz?: string; lc?: string };
export type Nav = {
  F: Filter | null;
  goto: (v: View, f?: Filter) => void;
  openLC: (lcIndex: number, layId?: string) => void;
  /** Mở màn Sơ đồ cắt của lệnh cắt */
  openSD: (lcIndex: number) => void;
};

const TONE: Record<Tone, string> = {
  ok: "border-transparent bg-success/15 text-success",
  info: "border-transparent bg-primary/10 text-primary",
  gray: "border-transparent bg-muted text-muted-foreground",
  warn: "border-transparent bg-warning/20 text-foreground",
  bad: "border-transparent bg-destructive/10 text-destructive",
};
export const Tag = ({ tone, children }: { tone: Tone; children: ReactNode }) => (
  <Badge variant="outline" className={TONE[tone]}>{children}</Badge>
);

/** Link trong bảng: chặn click của dòng để không mở Sheet chồng */
export const Lk = ({ on, children }: { on: () => void; children: ReactNode }) => (
  <button
    type="button"
    className="text-primary hover:underline focus-visible:underline focus-visible:outline-none"
    onClick={(e) => { e.stopPropagation(); on(); }}
  >
    {children}
  </button>
);

export const Ratio = ({ o }: { o: Order }) => (
  <span className="inline-flex flex-wrap items-center gap-1">
    {o.sz.map((s, i) => (
      <span key={s} className="rounded-md bg-muted px-1.5 font-semibold">{s}×{o.r[i]}</span>
    ))}
    <span className="text-muted-foreground">= {o.R} sp/lớp</span>
  </span>
);

export const Prog = ({ a, b, label }: { a: number; b: number; label?: ReactNode }) => {
  const p = b ? Math.min(100, Math.round((a / b) * 100)) : 0;
  return (
    <div className="flex min-w-32 items-center gap-2">
      <Progress value={p} className="flex-1" indicatorClassName={p >= 100 ? "bg-success" : undefined} />
      <span className="tabular-nums">{label ?? `${p}%`}</span>
    </div>
  );
};

export const Chg = ({ y }: { y: Lay }) =>
  y.tt ? (
    <span className={y.ch > 0 ? "text-destructive" : "text-success"}>{y.ch > 0 ? "+" : ""}{fmt(y.ch, 1)} m</span>
  ) : (
    <>—</>
  );

/** Dòng bảng có lọc theo đơn: ẩn nếu khác đơn, tô nếu khớp màu/size/lệnh cắt */
export function FRow({
  F, d, onClick, children,
}: {
  F: Filter | null;
  d: { o: number; m?: string[]; sz?: string; lc?: string };
  onClick?: () => void;
  children: ReactNode;
}) {
  if (F && d.o !== F.o) return null;
  const hit = !!F && (!F.mau || !d.m || d.m.includes(F.mau)) && (!F.sz || !d.sz || d.sz === F.sz) && (!F.lc || !d.lc || d.lc === F.lc);
  return (
    <TableRow
      state={hit ? "selected" : undefined}
      onClick={onClick}
      className={[onClick ? "cursor-pointer" : "", hit ? "[&>td:first-child]:border-l-4 [&>td:first-child]:border-l-primary" : ""].join(" ")}
    >
      {children}
    </TableRow>
  );
}

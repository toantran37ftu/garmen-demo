"use client";

import { Badge, Button, Progress, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { CUSTOMERS, dt, f, ln, type Order, PH, segs, ST, TODAY, ty, WARNS } from "@/data/ke-hoach-san-xuat";
import { okBadge, warnBadge } from "./tabs";

export type Detail = { kind: "order"; i: number } | { kind: "warn"; k: number } | null;

const Sec = ({ children }: { children: ReactNode }) => (
  <div className="mt-5 mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</div>
);
const Row = ({ a, b }: { a: ReactNode; b: ReactNode }) => (
  <div className="flex items-center justify-between gap-3 border-b py-2 last:border-0">
    <span className="text-muted-foreground">{a}</span>
    <b className="text-right">{b}</b>
  </div>
);
const PBar = ({ p }: { p: number }) => (
  <div className="flex flex-1 items-center gap-2">
    <Progress value={p} indicatorClassName={p === 100 ? "bg-success" : undefined} className="mx-2 flex-1" />
    <b className="w-11 text-right tabular-nums">{p}%</b>
  </div>
);

const PH_BG = ["", "bg-sky-400", "bg-blue-600", "bg-violet-600"];
const WAIT = "bg-[repeating-linear-gradient(45deg,#F59E0B_0_4px,#FDE68A_4px_8px)]";
const LATE = "bg-[repeating-linear-gradient(45deg,#DC2626_0_4px,#FCA5A5_4px_8px)]";

export function DetailSheet({
  detail,
  orders,
  done,
  onClose,
  onOpen,
  onApply,
  onJourney,
}: {
  detail: Detail;
  orders: Order[];
  done: (number | null)[];
  onClose: () => void;
  onOpen: (d: Detail) => void;
  onApply: (k: number, j: number) => void;
  onJourney: (i: number) => void;
}) {
  return (
    <Sheet open={detail != null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className={`w-full overflow-y-auto ${detail?.kind === "warn" ? "sm:max-w-[600px]" : "sm:max-w-md"}`}>
        {detail?.kind === "order" && <OrderDetail o={orders[detail.i]} onOpen={onOpen} onJourney={onJourney} />}
        {detail?.kind === "warn" && <WarnDetail k={detail.k} o={orders[WARNS[detail.k].o]} done={done[detail.k]} onOpen={onOpen} onApply={onApply} />}
      </SheetContent>
    </Sheet>
  );
}

function stBadge(o: Order) {
  if (o.late) return <Badge variant="destructive">Dự kiến trễ {o.late} ngày</Badge>;
  if (o.st === "ok") return <Badge variant="outline" className={okBadge}>{ST.ok}</Badge>;
  if (o.st === "warn") return <Badge variant="outline" className={warnBadge}>{ST.warn}</Badge>;
  return <Badge variant="secondary">{ST.plan}</Badge>;
}

function OrderDetail({ o, onOpen, onJourney }: { o: Order; onOpen: (d: Detail) => void; onJourney: (i: number) => void }) {
  const k = WARNS.findIndex((w) => w.o === o.i);
  const v = o.qty * o.usd;
  return (
    <>
      <SheetHeader>
        <SheetTitle>📋 PO {o.po} · {o.code}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-2">
          {CUSTOMERS[o.cust]} · {stBadge(o)}
        </SheetDescription>
      </SheetHeader>
      <div className="px-4 pb-6">
        <div className={`rounded-lg p-4 ${o.late ? "bg-destructive/10" : "bg-primary/10"}`}>
          <div className="text-muted-foreground">Ngày xuất hàng</div>
          <div className="text-2xl font-bold">{dt(o.ship, true)}</div>
          <div className={o.late ? "text-destructive" : "text-success"}>
            {o.late
              ? `Dự kiến xuất ${dt(o.end, true)} — trễ ${o.late} ngày`
              : `Dự kiến xong ${dt(o.end - 1)} — ${o.ship > o.end ? `dư ${o.ship - o.end} ngày` : "vừa kịp"}`}
          </div>
        </div>
        <Button variant="outline" className="mt-3 w-full" onClick={() => onJourney(o.i)}>
          🧭 Xem hành trình đơn hàng
        </Button>
        <Sec>Thông tin đơn</Sec>
        <Row a="Khách hàng" b={CUSTOMERS[o.cust]} />
        <Row a="Mã hàng" b={o.code} />
        <Row a="Số lượng" b={`${f(o.qty)} sp`} />
        <Row a="Giá trị" b={`$${f(v)} (~${ty(v)})`} />
        <Row a="Chuyền đang làm" b={`Chuyền ${o.lines}`} />
        <Row a="Đã may" b={`${f(o.done)} sp (${Math.round((o.done / o.qty) * 100)}%)`} />
        <Sec>Tiến độ từng khâu</Sec>
        {segs(o).map(([ph, x, d, p]) => (
          <div key={ph} className="flex items-center border-b py-2 last:border-0">
            <span className="w-[120px] shrink-0">
              {PH[ph]}
              <small className="block text-xs text-muted-foreground">
                {dt(x)} – {dt(x + d - 1)}
              </small>
            </span>
            {ph ? <PBar p={p} /> : <Badge variant="outline" className={warnBadge}>Chờ {d} ngày</Badge>}
          </div>
        ))}
        <Sec>Ngày nguyên liệu về</Sec>
        {o.npl.map(([name, day]) => (
          <div key={name} className="flex items-center justify-between gap-2 border-b py-2 last:border-0">
            <span>{name}</span>
            <span className="flex items-center gap-2">
              {dt(day)}{" "}
              {day > o.start ? (
                <Badge variant="destructive">Sau ngày cắt {day - o.start} ngày</Badge>
              ) : day <= TODAY ? (
                <Badge variant="outline" className={okBadge}>Đã về</Badge>
              ) : (
                <Badge variant="secondary">Kịp ngày cắt</Badge>
              )}
            </span>
          </div>
        ))}
        <Sec>Lệnh sản xuất ({o.lsx.length})</Sec>
        {o.lsx.map((l) => (
          <div key={l.code} className="flex items-center border-b py-2 last:border-0">
            <span className="w-[150px] shrink-0">
              <b>{l.code}</b>
              <small className="block text-xs text-muted-foreground">
                {ln(l.line)} · {f(l.qty)} sp
              </small>
            </span>
            <PBar p={l.pct} />
          </div>
        ))}
        <Sec>Rủi ro</Sec>
        {k >= 0 ? (
          <>
            <p className="mb-3 text-muted-foreground">
              <b className="text-destructive">⚠ {WARNS[k].why}</b> → trễ {o.late} ngày.
            </p>
            <Button onClick={() => onOpen({ kind: "warn", k })}>Xem nguyên nhân & phương án</Button>
          </>
        ) : (
          <>
            <p className="mb-3 text-muted-foreground">
              {o.w ? `Chờ nguyên liệu ${o.w} ngày nhưng vẫn kịp ngày xuất.` : "Không có rủi ro đáng kể."}
            </p>
            <Button variant="outline">Đổi chuyền / tăng ca</Button>
          </>
        )}
      </div>
    </>
  );
}

function WarnDetail({
  k,
  o,
  done,
  onOpen,
  onApply,
}: {
  k: number;
  o: Order;
  done: number | null;
  onOpen: (d: Detail) => void;
  onApply: (k: number, j: number) => void;
}) {
  const w = WARNS[k];
  const v = w.q * o.usd;
  const pen = o.qty * o.usd * 0.005 * o.late;
  const x0 = Math.min(o.start, TODAY) - 2;
  const px = 100 / (o.end + 3 - x0);
  const at = (d: number) => `${(d - x0) * px}%`;
  const plan: [number, number, number, number][] = [
    [1, o.start, o.days[0], 100],
    [2, o.start + o.days[0], o.ship - o.start - o.days[0] - o.days[2], 100],
    [3, o.ship - o.days[2], o.days[2], 100],
  ];
  const marks = (
    <>
      <i className="absolute top-0 bottom-0 z-[1] w-0.5 bg-gray-900" style={{ left: at(o.ship) }} />
      <i className="absolute top-0 bottom-0 z-[1] w-0.5 bg-primary" style={{ left: at(TODAY + 0.5) }} />
    </>
  );
  const track = (s: [number, number, number, number][], faded: boolean) =>
    s.map(([ph, x, d, p]) => (
      <i
        key={ph}
        className={`absolute top-0 flex h-full border-r border-white ${ph ? "" : WAIT} ${faded ? "opacity-45" : ""}`}
        style={{ left: at(x), width: `${d * px}%` }}
        title={`${PH[ph]}: ${dt(x)} – ${dt(x + d - 1)}${ph ? ` · ${p}%` : ""}`}
      >
        {ph > 0 && (
          <>
            <span className={`h-full ${PH_BG[ph]}`} style={{ width: `${p}%` }} />
            <span className={`h-full flex-1 ${PH_BG[ph]} opacity-50`} />
          </>
        )}
      </i>
    ));
  return (
    <>
      <SheetHeader>
        <SheetTitle>⚠ Cảnh báo trễ · PO {o.po}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-2">
          {CUSTOMERS[o.cust]} · <Badge variant="destructive">Dự kiến trễ {o.late} ngày</Badge>
        </SheetDescription>
      </SheetHeader>
      <div className="px-4 pb-6">
        <Sec>Đơn bị ảnh hưởng</Sec>
        <Row
          a="PO / Mã hàng"
          b={
            <Button variant="link" className="h-auto p-0" onClick={() => onOpen({ kind: "order", i: o.i })}>
              {o.po} · {o.code} ›
            </Button>
          }
        />
        <Row a="Lệnh sản xuất" b={o.lsx.map((l) => l.code).join(", ")} />
        <Row a="Chuyền" b={`Chuyền ${o.lines}`} />
        <Row
          a="Ngày xuất"
          b={
            <>
              {dt(o.ship, true)} → <span className="text-destructive">{dt(o.end, true)}</span>
            </>
          }
        />
        <Sec>Chuỗi nguyên nhân</Sec>
        <div className="flex flex-col items-start">
          {w.chain.map((c, j) => (
            <div key={c} className="flex flex-col items-start">
              {j > 0 && <span className="px-3.5 py-0.5 text-destructive">↓</span>}
              <div
                className={`rounded-md border-l-[3px] bg-destructive/10 px-3 py-1.5 ${j === w.chain.length - 1 ? "border-red-600 font-bold text-destructive" : "border-red-300"}`}
              >
                {c}
              </div>
            </div>
          ))}
        </div>
        <Sec>Kế hoạch so với dự kiến</Sec>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">Kế hoạch</span>
            <div className="relative h-[22px] flex-1 overflow-hidden rounded bg-muted">
              {track(plan, true)}
              {marks}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-muted-foreground">Dự kiến</span>
            <div className="relative h-[22px] flex-1 overflow-hidden rounded bg-muted">
              {track(segs(o), false)}
              <i className={`absolute top-0 h-full rounded-r-[5px] ${LATE}`} style={{ left: at(o.ship), width: `${o.late * px}%` }} />
              {marks}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0" />
            <div className="relative h-4 flex-1 text-muted-foreground">
              <b className="absolute -translate-x-1/2 font-medium whitespace-nowrap" style={{ left: at(o.start) }}>{dt(o.start)}</b>
              <b className="absolute -translate-x-1/2 font-medium whitespace-nowrap" style={{ left: at(o.ship) }}>⚑ {dt(o.ship)}</b>
              <b className="absolute -translate-x-1/2 font-medium whitespace-nowrap text-destructive" style={{ left: at(o.end) }}>{dt(o.end)}</b>
            </div>
          </div>
        </div>
        <Sec>Ảnh hưởng</Sec>
        <Row a="Số sản phẩm bị trễ" b={`${f(w.q)} sp`} />
        <Row a="Giá trị hàng trễ" b={`$${f(v)} (~${ty(v)})`} />
        <Row a={`Phạt trễ (0,5%/ngày × ${o.late} ngày)`} b={<span className="text-destructive">${f(pen)} (~{ty(pen)})</span>} />
        <Sec>Phương án đề xuất</Sec>
        <div className="flex flex-col gap-2">
          {w.acts.map((a, j) => (
            <div key={a[0]} className="flex items-start gap-2.5 rounded-lg border p-3">
              <div className="flex-1">
                <b>{a[1]}</b>
                <div className="mt-1 mb-1.5 text-muted-foreground">⚖ {a[3]}</div>
                <Badge variant="outline" className={okBadge}>→ {a[2]}</Badge>
              </div>
              {done === j ? (
                <Button size="sm" variant="outline" disabled>✓ Đã áp dụng</Button>
              ) : (
                <Button size="sm" disabled={done != null} onClick={() => onApply(k, j)}>Áp dụng</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

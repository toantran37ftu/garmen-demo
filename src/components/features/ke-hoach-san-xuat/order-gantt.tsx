"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@erp/miniapp-ui";
import { type ReactNode, type PointerEvent as RPointerEvent, useEffect, useRef, useState } from "react";
import {
  CUSTOMERS,
  calc,
  dt,
  f,
  N,
  type Order,
  type Sched,

  TODAY,
  verdict,
} from "@/data/ke-hoach-san-xuat";

const LW = 250; // Khách hàng/PO 110 + Mã hàng 140
const WAIT = "bg-[repeating-linear-gradient(45deg,#F59E0B_0_4px,#FDE68A_4px_8px)]";
const LATE = "bg-[repeating-linear-gradient(45deg,#DC2626_0_4px,#FCA5A5_4px_8px)]";
const stCls: Record<Order["st"], string> = { ok: "text-success", warn: "text-warning", late: "text-destructive", plan: "text-muted-foreground" };

const tip = (o: Order) =>
  `Order: ${o.po} · ${f(o.qty)} sp · đã làm ${o.pct}%${o.late ? ` · Dự kiến trễ ${o.late} ngày` : ""}\n` +
  `LSX: ${o.lsx.map((l) => l.code.slice(4)).join(", ")} · Chuyền: ${o.lines} · Xuất: ${dt(o.ship)} · NPL về: ${dt(o.nplDay)}\n` +
  `Sản xuất: ${dt(o.start + o.w)} – ${dt(o.end - 1)}${o.w ? ` (chờ NPL ${o.w} ngày)` : ""}`;

type Drag = { i: number; x: number; rz: boolean; s0: number; m0: number; e0: number; dd: number; moved: boolean };

export function OrderGantt({
  orders,
  cust,
  px,
  onOpen,
  onCommit,
}: {
  orders: Order[];
  cust: string; // "" = tất cả
  px: number;
  onOpen: (i: number) => void;
  onCommit: (i: number, prev: Sched, next: Sched) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [preview, setPreview] = useState<{ i: number; s: Sched } | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number; text: string } | null>(null);
  const drag = useRef<Drag | null>(null);
  const W0 = N * px;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const g = drag.current;
      if (!g) return;
      const dx = e.clientX - g.x;
      if (!g.moved) {
        if (Math.abs(dx) < 4) return;
        g.moved = true;
      }
      let d = Math.round(dx / px); // bắt theo ngày
      d = g.rz
        ? Math.min(Math.max(d, 1 - g.m0), N - g.e0)
        : Math.min(Math.max(d, Math.min(g.s0, 0) - g.s0), N - g.e0);
      g.dd = d;
      const s = g.rz ? { start: g.s0, sew: g.m0 + d } : { start: g.s0 + d, sew: g.m0 };
      const o = calc(g.i, s);
      setPreview({ i: g.i, s });
      setGhost({ x: Math.min(e.clientX + 14, window.innerWidth - 420), y: e.clientY + 18, text: `${o.po}: ${dt(o.start)} – ${dt(o.end - 1)} · ${verdict(o)}` });
    };
    const up = () => {
      const g = drag.current;
      if (!g) return;
      drag.current = null;
      setPreview(null);
      setGhost(null);
      if (!g.moved) return onOpen(g.i); // < 4px = bấm mở chi tiết
      if (!g.dd) return;
      onCommit(g.i, { start: g.s0, sew: g.m0 }, g.rz ? { start: g.s0, sew: g.m0 + g.dd } : { start: g.s0 + g.dd, sew: g.m0 });
    };
    const cancel = () => {
      drag.current = null;
      setPreview(null);
      setGhost(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [px, onOpen, onCommit]);

  const down = (e: RPointerEvent<HTMLDivElement>, o: Order) => {
    if (e.button) return;
    const rz = (e.target as HTMLElement).dataset.rz === "1";
    drag.current = { i: o.i, x: e.clientX, rz, s0: o.start, m0: o.days[1], e0: o.end, dd: 0, moved: false };
  };

  const grid = {
    width: W0,
    backgroundImage: `repeating-linear-gradient(90deg,transparent 0 ${7 * px - 1}px,#EEF0F3 ${7 * px - 1}px ${7 * px}px)`,
  };

  const head: ReactNode[] = [];
  for (let d = 0; d < N; d++) {
    const x = new Date(2026, 10, 2 + d);
    if (d === 0 || x.getDate() === 1)
      head.push(
        <span key={`m${d}`} className="absolute top-1 h-[42px] border-l border-slate-300 pl-1 text-xs font-bold whitespace-nowrap text-foreground" style={{ left: d * px }}>
          Tháng {x.getMonth() + 1}/{x.getFullYear()}
        </span>,
      );
    if (d % 7 === 0)
      head.push(
        <span key={`w${d}`} className="absolute top-[26px] pl-[3px] text-xs whitespace-nowrap text-muted-foreground" style={{ left: d * px }}>
          {px > 5 ? dt(d) : ((45 + d / 7 - 1) % 53) + 1}
        </span>,
      );
  }

  const c1 = "sticky left-0 z-[3] w-[110px] shrink-0 border-r bg-background px-2.5 py-2 text-sm";
  const c2 = "sticky left-[110px] z-[3] w-[140px] shrink-0 border-r bg-background px-2.5 py-2 text-sm";

  return (
    <div className="max-h-[72vh] overflow-auto">
      <div className="relative" style={{ width: LW + W0 }}>
        <div className="sticky top-0 z-[4] flex min-h-[46px] border-b bg-muted text-xs font-semibold text-muted-foreground">
          <div className={`${c1} z-[5] bg-muted`}>Khách hàng / PO</div>
          <div className={`${c2} z-[5] bg-muted`}>Mã hàng</div>
          <div className="relative shrink-0 overflow-hidden" style={{ width: W0 }}>
            {head}
          </div>
        </div>

        {CUSTOMERS.map((k, ci) => {
          if (cust !== "" && +cust !== ci) return null;
          const os = orders.filter((o) => o.cust === ci).map((o) => (preview?.i === o.i ? calc(o.i, preview.s) : o));
          const nl = os.filter((o) => o.late).length;
          const a = Math.min(...os.map((o) => o.start));
          const e = Math.max(...os.map((o) => o.end));
          const off = collapsed.has(ci);
          return (
            <div key={k}>
              <button
                type="button"
                aria-expanded={!off}
                className="flex min-h-11 w-full cursor-pointer border-b text-left"
                onClick={() => setCollapsed((s) => { const n = new Set(s); n.has(ci) ? n.delete(ci) : n.add(ci); return n; })}
              >
                <div className="sticky left-0 z-[3] w-[250px] shrink-0 border-r bg-slate-50 px-2.5 py-2 text-sm">
                  <b className="block truncate">
                    <span className={`inline-block transition-transform ${off ? "-rotate-90" : ""}`}>▾</span> {k}
                  </b>
                  <small className="block text-xs text-muted-foreground">
                    {os.length} đơn · {f(os.reduce((s, o) => s + o.qty, 0))} sp
                    {nl > 0 && <span className="text-destructive"> · {nl} đơn trễ</span>}
                  </small>
                </div>
                <div className="relative shrink-0 overflow-hidden bg-slate-50" style={grid}>
                  <i className="absolute top-[17px] h-2.5 rounded-full bg-slate-300" style={{ left: a * px, width: (e - a) * px }} />
                </div>
              </button>
              {!off &&
                os.map((o) => (
                  <div key={o.po} className="flex min-h-[62px] border-b">
                    <div className={c1}>
                      <b className="block truncate">{o.po}</b>
                      <small className={`block text-xs ${stCls[o.st]}`}>{o.lab}</small>
                    </div>
                    <div className={c2}>
                      <b className="block truncate">{o.code}</b>
                      <small className="block text-xs text-muted-foreground">{f(o.qty)} sp</small>
                    </div>
                    <div className="relative shrink-0 overflow-hidden" style={grid}>
                      <Bar o={o} px={px} dragging={preview?.i === o.i} onPointerDown={(ev) => down(ev, o)} />
                      <i
                        className="absolute top-1.5 z-[1] h-[54px] w-0.5 bg-gray-900"
                        style={{ left: o.ship * px }}
                        title={`Ngày xuất hàng ${dt(o.ship, true)}`}
                      >
                        <span className="absolute -top-1.5 left-0.5 text-sm not-italic text-gray-900">⚑</span>
                      </i>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={`absolute -top-[3px] z-[1] -translate-x-1/2 cursor-help text-xs ${o.nplDay > o.start ? "text-red-600" : "text-success"}`}
                            style={{ left: o.nplDay * px }}
                          >
                            ▲
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {o.npl.map((m) => (
                            <div key={m[0]}>
                              {m[0]}: về {dt(m[1])}
                            </div>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}

        <i className="pointer-events-none absolute top-0 bottom-0 z-[2] w-0.5 bg-primary" style={{ left: LW + (TODAY + 0.5) * px }} />
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-[60] rounded-md bg-gray-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white" style={{ left: ghost.x, top: ghost.y }}>
          {ghost.text}
        </div>
      )}
    </div>
  );
}

/** Thanh gộp 1 đoạn "Sản xuất" (+ chờ NPL phía trước, + đuôi trễ), chữ nằm trong thanh. */
function Bar({ o, px, dragging, onPointerDown }: { o: Order; px: number; dragging: boolean; onPointerDown: (e: RPointerEvent<HTMLDivElement>) => void }) {
  const x = o.w * px;
  const c = o.late ? "bg-red-700" : "bg-blue-600";
  return (
    <div
      className={`absolute top-[13px] h-11 touch-pan-y overflow-hidden rounded-md select-none hover:outline-2 hover:outline-gray-900 ${dragging ? "z-[2] cursor-grabbing opacity-90 outline-2 outline-dashed outline-gray-900" : "cursor-grab"}`}
      style={{ left: o.start * px, width: (o.end - o.start) * px }}
      title={tip(o)}
      onPointerDown={onPointerDown}
    >
      {o.w > 0 && <i className={`absolute top-0 h-full border-r border-white ${WAIT}`} style={{ left: 0, width: x }} />}
      <i className="absolute top-0 flex h-full border-r border-white" style={{ left: x, width: (o.end - o.start - o.w) * px }}>
        <span className={`h-full ${c}`} style={{ width: `${o.pct}%` }} />
        <span className={`h-full flex-1 ${c} opacity-50`} />
      </i>
      {o.late > 0 && (
        <i className={`absolute top-0 h-full rounded-r-[5px] border-r border-white ${LATE}`} style={{ left: (o.ship - o.start) * px, width: o.late * px }} />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[1] pt-1 pr-2.5 text-xs leading-[18px] font-semibold text-white [text-shadow:0_0_3px_rgba(0,0,0,.65)]"
        style={{ paddingLeft: Math.max(0, -o.start * px) + 7 }}
      >
        <div className="truncate">
          <em className="font-normal not-italic opacity-85">Order:</em> {o.po} · {f(o.qty)} sp · {o.pct}%{o.late ? ` · ⚠ Trễ ${o.late} ngày` : ""}
        </div>
        <div className="truncate">
          <em className="font-normal not-italic opacity-85">LSX:</em> {o.lsx.map((l) => l.code.slice(4)).join(", ")} ·{" "}
          <em className="font-normal not-italic opacity-85">Chuyền:</em> {o.lines} · <em className="font-normal not-italic opacity-85">Xuất:</em> {dt(o.ship)} ·{" "}
          <em className="font-normal not-italic opacity-85">NPL về:</em> {dt(o.nplDay)}
          {o.w ? " ⚠" : ""}
        </div>
      </div>
      <i
        data-rz="1"
        aria-hidden
        className="absolute top-0 right-0 bottom-0 z-[2] w-2 cursor-ew-resize bg-[linear-gradient(90deg,transparent_3px,rgba(255,255,255,.75)_3px_5px,transparent_5px)]"
      />
    </div>
  );
}


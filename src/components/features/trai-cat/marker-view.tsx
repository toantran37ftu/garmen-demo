"use client";

import {
  Button, Card, CardAction, CardContent, CardHeader, CardTitle, Label, Progress,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch,
} from "@erp/miniapp-ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { DB, L, O, sum } from "@/data/trai-cat";
import { fmt } from "@/lib/format";
import { type Marker, type Piece, buildMarker } from "./marker";
import { Lk, type Nav, Ratio } from "./shared";

// màu theo thứ tự size trong tỉ lệ (tối đa 5 size)
const SZC = [
  { f: "fill-sky-400/50", s: "stroke-sky-700 dark:stroke-sky-300", dot: "bg-sky-400" },
  { f: "fill-emerald-400/50", s: "stroke-emerald-700 dark:stroke-emerald-300", dot: "bg-emerald-400" },
  { f: "fill-amber-400/55", s: "stroke-amber-700 dark:stroke-amber-300", dot: "bg-amber-400" },
  { f: "fill-violet-400/50", s: "stroke-violet-700 dark:stroke-violet-300", dot: "bg-violet-400" },
  { f: "fill-rose-400/50", s: "stroke-rose-700 dark:stroke-rose-300", dot: "bg-rose-400" },
];
const ZOOM = [0, 0.6, 1, 1.5, 2]; // 0 = vừa khung; còn lại px/cm ÷ 2,2
const PAD = { l: 34, t: 16, r: 6, b: 6 };

const CACHE = new Map<string, Marker>();
const markerOf = (oi: number) => {
  const o = O[oi];
  if (!CACHE.has(o.sd[0])) CACHE.set(o.sd[0], buildMarker(o));
  return CACHE.get(o.sd[0])!;
};
console.assert(
  O.every((o, oi) => {
    const m = markerOf(oi);
    return m.pieces.every((p) => p.y >= 0 && p.y + p.h <= m.kho + 0.01 && p.x + p.w <= m.len + 0.01) && new Set(m.pieces.map((p) => p.si + "/" + p.sp)).size === o.R;
  }),
  "Sơ đồ: chi tiết nằm trong khổ/dài, đủ sp theo tỉ lệ size",
);

function MarkerSvg({ m, zoom, waste, hs, setHs }: { m: Marker; zoom: number; waste: boolean; hs: number | null; setHs: (i: number | null) => void }) {
  const [on, setOn] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; p: Piece } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  // setTimeout thay rAF: rAF không chạy khi tab/iframe ở nền → chi tiết bị ẩn mãi
  useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);
  const W = m.len + PAD.l + PAD.r, H = m.kho + PAD.t + PAD.b;
  const step = Math.min(25, 2200 / m.pieces.length);
  const move = (e: React.MouseEvent, p: Piece) => {
    const r = box.current!.getBoundingClientRect();
    setTip({ x: e.clientX - r.left + box.current!.scrollLeft, y: e.clientY - r.top, p });
    setHs(p.si);
  };
  return (
    <div ref={box} className="relative overflow-x-auto rounded-lg border bg-background">
      <svg
        role="img"
        aria-label={`Sơ đồ cắt dài ${fmt(m.len / 100, 2)} m, khổ ${m.kho} cm, ${m.pieces.length} chi tiết`}
        viewBox={`${-PAD.l} ${-PAD.t} ${W} ${H}`}
        style={zoom ? { width: W * 2.2 * zoom, height: H * 2.2 * zoom } : { width: "100%" }}
        className="block select-none"
        onMouseLeave={() => { setTip(null); setHs(null); }}
      >
        <defs>
          <pattern id="sd-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" className="stroke-destructive/45" strokeWidth="0.8" />
          </pattern>
          <marker id="sd-arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 z" className="fill-foreground/70" />
          </marker>
        </defs>
        {/* vải */}
        <rect x={0} y={0} width={m.len} height={m.kho} className={waste ? "fill-destructive/5" : "fill-muted"} />
        {waste && <rect x={0} y={0} width={m.len} height={m.kho} fill="url(#sd-hatch)" />}
        <rect x={0} y={0} width={m.len} height={m.kho} fill="none" className="stroke-foreground/60" strokeWidth={0.6} />
        {/* thước mỗi 1 m */}
        {Array.from({ length: Math.floor(m.len / 100) + 1 }, (_, i) => (
          <g key={i}>
            <line x1={i * 100} x2={i * 100} y1={-5} y2={m.kho} className="stroke-foreground/25" strokeWidth={0.4} strokeDasharray="2 2" />
            <line x1={i * 100} x2={i * 100} y1={-6} y2={0} className="stroke-foreground" strokeWidth={0.6} />
            <text x={i * 100 + 1.5} y={-7} fontSize={8} className="fill-muted-foreground">{i} m</text>
          </g>
        ))}
        <line x1={0} x2={m.len} y1={-0.4} y2={-0.4} className="stroke-foreground" strokeWidth={0.6} />
        <text x={m.len - 1.5} y={-7} fontSize={8} textAnchor="end" className="fill-foreground font-semibold">{fmt(m.len / 100, 2)} m</text>
        {/* khổ */}
        <line x1={-10} x2={-10} y1={0} y2={m.kho} className="stroke-foreground" strokeWidth={0.6} markerStart="url(#sd-arr)" markerEnd="url(#sd-arr)" />
        <text x={-15} y={m.kho / 2} fontSize={8} textAnchor="middle" transform={`rotate(-90 -15 ${m.kho / 2})`} className="fill-foreground font-semibold">Khổ {m.kho} cm</text>
        {/* chi tiết rập */}
        {m.pieces.map((p, i) => {
          const c = SZC[p.si % SZC.length];
          const pts = p.pts.map(([u, v]) => `${(p.x + u * p.w).toFixed(1)},${(p.y + v * p.h).toFixed(1)}`).join(" ");
          const fs = Math.max(3, Math.min(8, p.h / 4, p.w / 6));
          const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
          return (
            <g
              key={i}
              style={{ transform: on ? "none" : "translateY(-60px)", opacity: on ? 1 : 0, transition: `transform .45s cubic-bezier(.3,1.4,.6,1) ${i * step}ms, opacity .3s ${i * step}ms` }}
            >
              <g
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: hs === null || hs === p.si ? 1 : 0.18 }}
                onMouseMove={(e) => move(e, p)}
              >
                <polygon points={pts} className="fill-card" />
                <polygon points={pts} className={`${c.f} ${c.s}`} strokeWidth={hs === p.si ? 0.9 : 0.5} strokeLinejoin="round" />
                {p.w > 14 && (
                  <line x1={p.x + p.w * 0.22} x2={p.x + p.w * 0.78} y1={cy + fs * 0.7} y2={cy + fs * 0.7} className="stroke-foreground/70" strokeWidth={0.4} markerStart="url(#sd-arr)" markerEnd="url(#sd-arr)" />
                )}
                <text x={cx} y={cy - fs * 0.2} fontSize={fs} textAnchor="middle" className="pointer-events-none fill-foreground">
                  <tspan className="font-bold">{p.sz}</tspan> {p.ten}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      {tip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border bg-popover px-2.5 py-1.5 text-popover-foreground shadow-md"
          style={{ left: tip.x + 14, top: tip.y + 14 }}
        >
          <b>Size {tip.p.sz}</b> · {tip.p.ten}
          <div className="text-muted-foreground">Sản phẩm {tip.p.sp} của size · ~{Math.round(tip.p.w)}×{Math.round(tip.p.h)} cm</div>
        </div>
      )}
    </div>
  );
}

const Row = ({ k, v, hint }: { k: string; v: React.ReactNode; hint?: string }) => (
  <div className="flex items-baseline justify-between gap-3 border-b py-2 last:border-0">
    <span className="text-muted-foreground">{k}{hint && <span className="block">{hint}</span>}</span>
    <b className="tabular-nums">{v}</b>
  </div>
);

// ---------- SƠ ĐỒ CẮT ----------
export function MarkerView({ idx, onPick, nav }: { idx: number; onPick: (i: number) => void; nav: Nav }) {
  const lc = L[idx], o = lc.O;
  const m = useMemo(() => markerOf(lc.o), [lc.o]);
  const [zi, setZi] = useState(2);
  const [waste, setWaste] = useState(true);
  const [hs, setHs] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const lop = sum(lc.lays.map((y) => y.kh));
  const thua = (o.sd[1] * o.sd[2] * (1 - o.sd[3] / 100)) / 100;
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center gap-3">
          <CardTitle>Sơ đồ {o.sd[0]}</CardTitle>
          <Select value={String(idx)} onValueChange={(v) => { onPick(+v); setHs(null); }}>
            <SelectTrigger className="w-80" aria-label="Chọn lệnh cắt"><SelectValue /></SelectTrigger>
            <SelectContent>
              {L.map((x, i) => <SelectItem key={x.id} value={String(i)}>{x.id} · {x.O.po} · {x.O.ma}</SelectItem>)}
            </SelectContent>
          </Select>
          <CardAction className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch id="sd-waste" checked={waste} onCheckedChange={setWaste} />
              <Label htmlFor="sd-waste">Hiện phần vải thừa</Label>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" aria-label="Thu nhỏ" disabled={zi === 0} onClick={() => setZi(zi - 1)}>−</Button>
              <span className="w-20 text-center tabular-nums">{ZOOM[zi] ? Math.round(ZOOM[zi] * 100) + "%" : "Vừa khung"}</span>
              <Button variant="outline" size="icon" aria-label="Phóng to" disabled={zi === ZOOM.length - 1} onClick={() => setZi(zi + 1)}>＋</Button>
            </div>
            <Button variant="outline" onClick={() => setRun(run + 1)}>↻ Xếp lại</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <MarkerSvg key={lc.id + run} m={m} zoom={ZOOM[zi]} waste={waste} hs={hs} setHs={setHs} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            <span>↔ Mũi tên trong chi tiết = canh sợi dọc, chạy theo chiều dài vải</span>
            {waste && <span><span className="mr-1 inline-block size-3 rounded-sm border border-destructive/50 bg-destructive/15 align-middle" />Gạch chéo = vải thừa</span>}
            <span>Rê chuột vào chi tiết để tô cùng size</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader><CardTitle>{lc.id} · {lc.ban}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-1">
            <div className="text-muted-foreground"><Lk on={() => nav.openLC(idx)}>{o.po}</Lk> · {o.ma}</div>
            <div className="mt-2 text-muted-foreground">Hiệu suất sơ đồ</div>
            <div className="text-3xl font-bold tabular-nums">{fmt(o.sd[3], 1)}%</div>
            <Progress value={o.sd[3]} indicatorClassName={o.sd[3] >= 85 ? "bg-success" : undefined} />
            <div className="mt-2">
              <Row k="Dài × khổ" v={`${fmt(o.sd[1], 2)} m × ${o.sd[2]} cm`} />
              <Row k="Vải thừa / lớp" v={`${fmt(thua, 2)} m²`} />
              <Row k="Số sp / lớp" v={o.R} />
              <Row k="Số lớp" v={lop} hint={lc.lays.map((y) => `${y.mau} ${y.kh}`).join(" · ")} />
              <Row k="Tổng mét vải" v={`${fmt(lop * o.sd[1], 1)} m`} hint={`= ${lop} lớp × ${fmt(o.sd[1], 2)} m (+ đầu bàn ${fmt(DB, 2)} m/lớp → ${fmt(lop * lc.DL, 1)} m)`} />
              <Row k="Vải thừa cả lệnh" v={`${fmt(thua * lop)} m²`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Size trên sơ đồ</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Ratio o={o} />
            <div className="mt-2 flex flex-col">
              {o.sz.map((s, si) => (
                <button
                  key={s}
                  type="button"
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none ${hs === si ? "bg-muted" : ""}`}
                  onMouseEnter={() => setHs(si)}
                  onMouseLeave={() => setHs(null)}
                  onFocus={() => setHs(si)}
                  onBlur={() => setHs(null)}
                >
                  <span className={`size-3.5 rounded-sm ${SZC[si % SZC.length].dot}`} />
                  <b className="w-10">{s}</b>
                  <span className="grow text-muted-foreground">×{o.r[si]} · {m.pieces.filter((p) => p.si === si).length} chi tiết</span>
                  <span className="tabular-nums">{fmt(o.r[si] * lop)} sp</span>
                </button>
              ))}
            </div>
            <div className="mt-1 border-t pt-2 text-muted-foreground">Tổng {m.pieces.length} chi tiết/lớp · {fmt(o.R * lop)} sp cả lệnh</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

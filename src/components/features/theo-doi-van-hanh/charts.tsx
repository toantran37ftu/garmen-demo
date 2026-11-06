"use client";

import { BarChart, DashboardCard, DonutChart } from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import {
  ACT, ATT, ATT_DAYS, CUSTOMERS, DEF, EFF, HR_IN, HR_MONTHS, HR_OUT, LEVEL_LABEL, NPL_DAYS, ORDERS_ALL, OT, PARETO, PLAN,
  REV, REV_ACTUAL, REV_MONTHS, dayLabel, pad, type Level,
} from "@/data/theo-doi-van-hanh";
import { fmt } from "@/lib/format";

// Biểu đồ kit không vẽ được ngưỡng/mục tiêu, Pareto, thanh theo mức → SVG tự viết, màu bằng class Tailwind.
const FILL: Record<Level, string> = { ok: "fill-emerald-600", warn: "fill-amber-500", bad: "fill-red-500" };
const BG: Record<Level, string> = { ok: "bg-emerald-600", warn: "bg-amber-500", bad: "bg-red-500" };
const d1 = (v: number) => fmt(v, v % 1 ? 1 : 0);
const pct = (v: number) => `${v}%`;
const AXIS = "fill-muted-foreground text-xs";
const KEY = "fill-foreground text-xs [paint-order:stroke] stroke-background stroke-[3px]";
const VAL = "fill-foreground text-xs font-semibold [paint-order:stroke] stroke-background stroke-[3px]";

// ---- Chú giải ----
type LegendItem = [string, string, ("sq" | "line" | "dash")?];
export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <span className="flex flex-wrap gap-x-3.5 gap-y-1 text-muted-foreground">
      {items.map(([cls, label, kind = "sq"]) => (
        <span key={label} className="inline-flex items-center gap-1">
          {kind === "dash" ? (
            <i className="inline-block w-3.5 border-t-2 border-dashed border-foreground" />
          ) : (
            <i className={`inline-block ${kind === "sq" ? "size-2.5 rounded-sm" : "h-0.5 w-3.5"} ${cls}`} />
          )}
          {label}
        </span>
      ))}
    </span>
  );
}

function Chart({ title, legend, children, className }: { title: string; legend?: LegendItem[]; children: ReactNode; className?: string }) {
  return (
    <DashboardCard title={title} description={legend && <Legend items={legend} />} className={className}>
      {children}
    </DashboardCard>
  );
}

function Svg({ w, h, label, children }: { w: number; h: number; label: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

// ---- Thanh ngang có ngưỡng ----
type HRow = { label: string; value: number; cls: string; tip?: string };
function HBars({ rows, max, step, fmt: f, target, tl, L = 86, rh = 24, track, label }: {
  rows: HRow[]; max: number; step: number; fmt: (v: number) => string; target?: number; tl?: string; L?: number; rh?: number; track?: boolean; label: string;
}) {
  const W = 520, R = 48, T = 26, H = T + rows.length * rh + 24;
  const x = (v: number) => L + ((W - L - R) * Math.min(v, max)) / max;
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  return (
    <Svg w={W} h={H} label={label}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={T} y2={H - 22} className="stroke-border" />
          <text x={x(v)} y={H - 6} textAnchor="middle" className={AXIS}>{f(v)}</text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = T + i * rh;
        return (
          <g key={r.label}>
            <title>{r.tip ?? `${r.label}: ${f(r.value)}`}</title>
            {track && <rect x={L} y={y + 5} width={W - L - R} height={rh - 10} rx={3} className="fill-muted" />}
            <text x={L - 8} y={y + rh / 2 + 4} textAnchor="end" className={KEY}>{r.label}</text>
            <rect x={L} y={y + 5} width={Math.max(x(r.value) - L, 2)} height={rh - 10} rx={3} className={r.cls} />
            <text x={(track ? W - R : x(r.value)) + 5} y={y + rh / 2 + 4} className={VAL}>{f(r.value)}</text>
          </g>
        );
      })}
      {target != null && (
        <g>
          <line x1={x(target)} x2={x(target)} y1={T - 6} y2={H - 22} strokeWidth={1.5} strokeDasharray="5 4" className="stroke-foreground" />
          <text x={x(target)} y={T - 10} textAnchor="middle" className={KEY}>{tl}</text>
        </g>
      )}
    </Svg>
  );
}

// ---- Cột đứng có ngưỡng ----
function VBars({ cats, values, cls, max, step, fmt: f, unit = "", target, tl, tip, split, label, name }: {
  cats: string[]; values: number[]; cls: (v: number, i: number) => string; max: number; step: number; fmt: (v: number) => string;
  unit?: string; target?: number; tl?: string; tip?: (i: number) => string; split?: number; label: string; name: string;
}) {
  const W = 520, H = 230, L = 44, R = 12, T = 22, B = 28;
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const bw = (W - L - R) / cats.length, gw = bw * 0.72;
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  return (
    <Svg w={W} h={H} label={label}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="stroke-border" />
          <text x={L - 6} y={y(v) + 4} textAnchor="end" className={AXIS}>{f(v)}</text>
        </g>
      ))}
      {cats.map((c, i) => {
        const v = values[i], bx = L + bw * i + bw * 0.14;
        return (
          <g key={c}>
            <title>{`${tip ? tip(i) : c} · ${name}: ${f(v)}${unit}`}</title>
            <rect x={bx} y={y(v)} width={gw - 2} height={y(0) - y(v)} rx={2} className={cls(v, i)} />
            <text x={bx + gw / 2 - 1} y={y(v) - 4} textAnchor="middle" className={VAL}>{f(v)}</text>
            <text x={L + bw * (i + 0.5)} y={H - 8} textAnchor="middle" className={KEY}>{c}</text>
          </g>
        );
      })}
      {target != null && (
        <g>
          <line x1={L} x2={W - R} y1={y(target)} y2={y(target)} strokeWidth={1.5} strokeDasharray="5 4" className="stroke-foreground" />
          <text x={W - R} y={y(target) - 5} textAnchor="end" className={KEY}>{tl}</text>
        </g>
      )}
      {split != null && (
        <g>
          <line x1={L + bw * split} x2={L + bw * split} y1={20} y2={H - B} strokeDasharray="3 3" className="stroke-muted-foreground" />
          <text x={L + bw * split} y={16} textAnchor="middle" className={KEY}>◂ Thực tế | Dự báo ▸</text>
        </g>
      )}
    </Svg>
  );
}

// ---- Từng biểu đồ ----
export function ProductionChart() {
  const W = 800, H = 220, L = 52, B = 26, T = 10, min = 14000, max = 18500;
  const x = (i: number) => L + (i * (W - L - 10)) / 13;
  const y = (v: number) => T + (H - T - B) * (1 - (v - min) / (max - min));
  const pts = (a: number[]) => a.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <Chart
      title="Sản lượng 14 ngày: thực tế và kế hoạch"
      className="lg:col-span-2"
      legend={[["bg-primary", "Thực tế", "line"], ["bg-muted-foreground", "Kế hoạch", "line"], ["bg-red-500 rounded-full", "Thấp hơn kế hoạch >4%"]]}
    >
      <Svg w={W} h={H} label="Sản lượng 14 ngày thực tế so với kế hoạch">
        {[14000, 15500, 17000, 18500].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - 10} y1={y(v)} y2={y(v)} className="stroke-border" />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" className={AXIS}>{fmt(v)}</text>
          </g>
        ))}
        {ACT.map((_, i) => i % 2 === 1 && <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className={AXIS}>{dayLabel(i)}</text>)}
        <polyline points={pts(PLAN)} fill="none" strokeWidth={2} strokeDasharray="5 4" className="stroke-muted-foreground" />
        <polyline points={pts(ACT)} fill="none" strokeWidth={2.5} className="stroke-primary" />
        {ACT.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={3.5} className={v < PLAN[i] * 0.96 ? "fill-red-500" : "fill-primary"}>
            <title>{`${dayLabel(i)}: ${fmt(v)} / kế hoạch ${fmt(PLAN[i])}`}</title>
          </circle>
        ))}
      </Svg>
    </Chart>
  );
}

const lvl3 = (v: number, good: number, mid: number): Level => (v >= good ? "ok" : v >= mid ? "warn" : "bad");

export function EfficiencyChart() {
  return (
    <Chart title="Hiệu suất theo chuyền (hôm qua)" legend={[[BG.ok, "≥75%"], [BG.warn, "70–74%"], [BG.bad, "dưới 70%"], ["", "Mục tiêu 75%", "dash"]]}>
      <HBars
        label="Hiệu suất theo chuyền"
        rows={EFF.map((v, i) => ({ label: `Chuyền ${pad(i + 1)}`, value: v, cls: FILL[lvl3(v, 75, 70)], tip: `Chuyền ${pad(i + 1)} (Xưởng ${i < 8 ? 1 : 2}): ${v}%` }))}
        max={100} step={20} fmt={pct} target={75} tl="Mục tiêu 75%" rh={22}
      />
    </Chart>
  );
}

export function OvertimeChart() {
  return (
    <Chart title="Tăng ca tuần này so với giới hạn luật" legend={[[BG.ok, "An toàn"], [BG.warn, "Cần theo dõi"], [BG.bad, "Sát giới hạn"], ["", "Giới hạn ~9,2 giờ/người/tuần", "dash"]]}>
      <HBars
        label="Giờ tăng ca bình quân mỗi người theo bộ phận"
        rows={OT.map(([n, h, p]) => {
          const a = Math.round((h / p) * 10) / 10;
          return { label: n, value: a, cls: FILL[a >= 8.5 ? "bad" : a >= 7 ? "warn" : "ok"], tip: `${n}: ${fmt(h)} giờ · ${p} người · ${d1(a)} giờ/người` };
        })}
        max={12} step={3} fmt={(v) => `${d1(v)} giờ`} target={40 / 4.33} tl="Giới hạn 40 giờ/tháng" L={80} rh={40}
      />
    </Chart>
  );
}

export function DefectChart() {
  return (
    <Chart title="Tỷ lệ lỗi theo chuyền (tuần này)" legend={[[BG.ok, "dưới 3%"], [BG.warn, "3–5%"], [BG.bad, "trên 5%"], ["", "Mục tiêu 3%", "dash"]]}>
      <VBars
        label="Tỷ lệ lỗi theo chuyền" name="Tỷ lệ lỗi"
        cats={EFF.map((_, i) => pad(i + 1))} values={DEF}
        cls={(v) => FILL[v >= 5 ? "bad" : v >= 3 ? "warn" : "ok"]}
        max={7} step={1} fmt={d1} unit="%" target={3} tl="Mục tiêu 3%" tip={(i) => `Chuyền ${pad(i + 1)}`}
      />
    </Chart>
  );
}

export function ParetoChart() {
  const tot = PARETO.reduce((a, d) => a + d[2], 0);
  const W = 520, H = 240, L = 44, R = 42, T = 22, B = 28;
  const y = (v: number) => T + (H - T - B) * (1 - v / 600);
  const yp = (p: number) => T + (H - T - B) * (1 - p / 100);
  const bw = (W - L - R) / PARETO.length;
  let cum = 0;
  const pts = PARETO.map((d, i) => {
    cum += d[2];
    return { cx: L + bw * (i + 0.5), p: (cum / tot) * 100 };
  });
  return (
    <Chart title="Lỗi theo loại – Pareto (tuần này)" legend={[["bg-primary", "Số lỗi"], ["bg-foreground", "% cộng dồn", "line"]]}>
      <Svg w={W} h={H} label="Pareto lỗi theo loại">
        {[0, 150, 300, 450, 600].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="stroke-border" />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" className={AXIS}>{fmt(v)}</text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map((p) => <text key={p} x={W - R + 6} y={yp(p) + 4} className={AXIS}>{p}%</text>)}
        <line x1={L} x2={W - R} y1={yp(80)} y2={yp(80)} strokeDasharray="4 4" className="stroke-muted-foreground" />
        <text x={L + 4} y={yp(80) - 4} className={KEY}>80%</text>
        {PARETO.map((d, i) => {
          const cx = pts[i].cx;
          return (
            <g key={d[0]}>
              <title>{`${d[0]}: ${fmt(d[2])} lỗi (${d1(Math.round((d[2] / tot) * 1000) / 10)}%)`}</title>
              <rect x={cx - bw * 0.32} y={y(d[2])} width={bw * 0.64} height={y(0) - y(d[2])} rx={2} className="fill-primary" />
              <text x={cx} y={y(d[2]) - 4} textAnchor="middle" className={VAL}>{fmt(d[2])}</text>
              <text x={cx} y={H - 8} textAnchor="middle" className={KEY}>{d[1]}</text>
            </g>
          );
        })}
        <polyline points={pts.map((p) => `${p.cx},${yp(p.p)}`).join(" ")} fill="none" strokeWidth={2} className="stroke-foreground" />
        {pts.map((p) => (
          <circle key={p.cx} cx={p.cx} cy={yp(p.p)} r={4} strokeWidth={2} className="fill-background stroke-foreground">
            <title>{`Cộng dồn ${d1(Math.round(p.p * 10) / 10)}%`}</title>
          </circle>
        ))}
      </Svg>
    </Chart>
  );
}

export function OrderProgressChart() {
  const n = (l: Level) => ORDERS_ALL.filter((o) => o[5] === l).length;
  return (
    <Chart title="Tiến độ 22 đơn theo ngày giao" legend={[[BG.ok, `Đúng tiến độ (${n("ok")})`], [BG.warn, `Cần theo dõi (${n("warn")})`], [BG.bad, `Nguy cơ trễ (${n("bad")})`]]}>
      <HBars
        label="Tiến độ đơn hàng theo ngày giao"
        rows={ORDERS_ALL.map(([po, k, q, p, d, l]) => ({
          label: `${po} · ${d}`, value: p, cls: FILL[l],
          tip: `${po} · ${CUSTOMERS[k]} · ${fmt(q)} sp · giao ${d}: xong ${p}% (${LEVEL_LABEL[l].toLowerCase()})`,
        }))}
        max={100} step={25} fmt={pct} L={118} rh={20} track
      />
    </Chart>
  );
}

const CUS_COLORS: [string, string][] = [["#0284c7", "bg-sky-600"], ["#60a5fa", "bg-blue-400"], ["#14b8a6", "bg-teal-500"], ["#8b5cf6", "bg-violet-500"], ["#f472b6", "bg-pink-400"], ["#94a3b8", "bg-slate-400"]];
export function CustomerChart() {
  const rows = Object.entries(CUSTOMERS)
    .map(([k, name]) => {
      const os = ORDERS_ALL.filter((o) => o[1] === k);
      return { name, qty: os.reduce((a, o) => a + o[2], 0), count: os.length };
    })
    .sort((a, b) => b.qty - a.qty);
  const tot = rows.reduce((a, r) => a + r.qty, 0);
  return (
    <Chart title="Đơn đang chạy theo khách hàng" legend={[["", "Theo số lượng đặt", "line"]]}>
      <div className="flex flex-wrap items-center gap-5">
        <DonutChart
          aria-label="Đơn đang chạy theo khách hàng"
          size={170}
          thickness={28}
          segments={rows.map((r, i) => ({ label: r.name, value: r.qty, color: CUS_COLORS[i][0], className: CUS_COLORS[i][1] }))}
          center={<div className="text-center"><div className="text-lg font-semibold">{fmt(tot)}</div><div className="text-muted-foreground">sp · {ORDERS_ALL.length} đơn</div></div>}
        />
        <ul className="min-w-56 flex-1">
          {rows.map((r, i) => (
            <li key={r.name} className="grid grid-cols-[12px_1fr_auto] items-center gap-x-2 border-b border-dashed py-1.5">
              <i className={`size-3 rounded-sm ${CUS_COLORS[i][1]}`} />
              <span>{r.name}</span>
              <b className="tabular-nums">{fmt((r.qty / tot) * 100, 1)}%</b>
              <span className="col-start-2 col-end-4 text-muted-foreground">{fmt(r.qty)} sp · {r.count} đơn</span>
            </li>
          ))}
        </ul>
      </div>
    </Chart>
  );
}

export function StockDaysChart() {
  const low = NPL_DAYS.filter((n) => n[1] < 5).length;
  return (
    <Chart title="Tồn kho NPL: số ngày đủ sản xuất" legend={[[BG.bad, `dưới 5 ngày (${low} loại)`], [BG.warn, "5–7 ngày"], [BG.ok, "đủ"], ["", "Ngưỡng an toàn 5 ngày", "dash"]]}>
      <HBars
        label="Số ngày đủ sản xuất theo nguyên phụ liệu"
        rows={NPL_DAYS.map(([n, d]) => ({ label: n, value: d, cls: FILL[d < 5 ? "bad" : d < 7 ? "warn" : "ok"] }))}
        max={15} step={5} fmt={(v) => `${d1(v)} ngày`} target={5} tl="Ngưỡng 5 ngày" L={150} rh={22}
      />
    </Chart>
  );
}

export function HiringChart() {
  return (
    <Chart title="Tuyển mới và nghỉ việc 6 tháng">
      <BarChart
        aria-label="Tuyển mới và nghỉ việc 6 tháng (T11 = 6 ngày đầu)"
        categories={HR_MONTHS}
        series={[{ name: "Vào làm", data: HR_IN, className: "bg-emerald-600" }, { name: "Nghỉ việc", data: HR_OUT, className: "bg-red-500" }]}
        height={190}
        showLegend
      />
      <p className="mt-2 text-muted-foreground">* T11: 6 ngày đầu tháng.</p>
    </Chart>
  );
}

export function RevenueChart() {
  return (
    <Chart title="Doanh thu xuất hàng 6 tháng & dự báo 4 tháng (tỷ đồng)" legend={[["bg-primary", "Thực tế"], ["bg-sky-300", "Dự báo (theo đơn đã nhận + mùa vụ)"], ["", "Kế hoạch 42 tỷ/tháng", "dash"]]}>
      <VBars
        label="Doanh thu xuất hàng 6 tháng thực tế và 4 tháng dự báo" name="Doanh thu"
        cats={REV_MONTHS} values={REV}
        cls={(_, i) => (i < REV_ACTUAL ? "fill-primary" : "fill-sky-300")}
        max={50} step={10} fmt={d1} unit=" tỷ đồng" target={42} tl="Kế hoạch 42 tỷ"
        tip={(i) => `${i < REV_ACTUAL ? "Thực tế" : "Dự báo"} ${REV_MONTHS[i]}`} split={REV_ACTUAL}
      />
    </Chart>
  );
}

/** Chỉ dùng ở tab Nhân sự (đã bỏ khỏi Tổng quan). */
export function AttendanceChart() {
  const W = 520, H = 230, L = 44, R = 12, T = 22, B = 28, min = 880, max = 980, goal = 931;
  const x = (i: number) => L + (i * (W - L - R)) / 29;
  const y = (v: number) => T + (H - T - B) * (1 - (v - min) / (max - min));
  return (
    <Chart title="Công nhân đi làm 30 ngày làm việc" legend={[["bg-primary", "Số người đi làm", "line"], ["", "Mục tiêu 95%", "dash"]]}>
      <Svg w={W} h={H} label="Công nhân đi làm 30 ngày làm việc">
        {[880, 900, 920, 940, 960, 980].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="stroke-border" />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" className={AXIS}>{fmt(v)}</text>
          </g>
        ))}
        {ATT_DAYS.map((t, i) => (29 - i) % 6 === 0 && <text key={t} x={x(i)} y={H - 8} textAnchor="middle" className={AXIS}>{t}</text>)}
        <line x1={L} x2={W - R} y1={y(goal)} y2={y(goal)} strokeWidth={1.5} strokeDasharray="5 4" className="stroke-foreground" />
        <text x={W - R} y={y(goal) - 5} textAnchor="end" className={KEY}>Mục tiêu 95% (931)</text>
        <polyline points={ATT.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" strokeWidth={2.5} className="stroke-primary" />
        {ATT.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === 29 ? 5 : 3} className={v < goal ? "fill-red-500" : "fill-primary"}>
            <title>{`${ATT_DAYS[i]}: ${fmt(v)}/980 người (${fmt(v / 9.8, 1)}%)`}</title>
          </circle>
        ))}
        <text x={x(29)} y={y(ATT[29]) + 20} textAnchor="end" className={VAL}>Hôm nay {fmt(ATT[29])}/980</text>
      </Svg>
    </Chart>
  );
}

/** Thanh ngang đơn giản (div) cho danh sách nhỏ. */
export function MeterBar({ value, level }: { value: number; level: Level | "info" }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${level === "info" ? "bg-primary" : BG[level]}`} style={{ width: `${value}%` }} />
    </div>
  );
}

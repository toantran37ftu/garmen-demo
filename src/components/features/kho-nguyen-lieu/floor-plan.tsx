"use client";

import { cn } from "@erp/miniapp-ui";
import { type Cell, CELLS, cellById, FAB_RACKS, isStale, MOVES } from "@/data/kho-nguyen-lieu-map";
import { fmt } from "@/lib/format";

/** Toạ độ ô trên mặt bằng (viewBox 1000×470) */
function box(c: Cell) {
  if (c.kind === "fabric") return { x: 214 + (c.bay - 1) * 14, y: 52 + FAB_RACKS.indexOf(c.rack) * 58, w: 12, h: 26 };
  if (c.kind === "trim") return { x: 830 + (c.bay - 1) * 13, y: 56 + (Number(c.rack[1]) - 1) * 44, w: 11, h: 22 };
  const k = c.bay - 1;
  return { x: 28 + (k % 2) * 72, y: 172 + Math.floor(k / 2) * 52, w: 64, h: 44 };
}
const mid = (c: Cell) => {
  const b = box(c);
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
};

const NHAN = { x: 95, y: 85 };
const SOAN = { x: 895, y: 300 };
const CUA = { x: 895, y: 395 };

function movePath(from: string, to: string) {
  if (to === "xuat") {
    const c = cellById(from)!;
    const p = mid(c);
    const b = box(c);
    const below = b.y + b.h + (c.kind === "trim" ? 11 : 16);
    return `M${p.x} ${p.y} L${p.x} ${below} L795 ${below} L795 ${SOAN.y} L${SOAN.x} ${SOAN.y} L${CUA.x} ${CUA.y}`;
  }
  const c = cellById(to)!;
  const p = mid(c);
  const s = from === "nhan" ? NHAN : mid(cellById(from)!);
  if (c.kind === "check") return `M${s.x} ${s.y} L${p.x} ${p.y}`;
  const above = box(c).y - (c.kind === "trim" ? 11 : 16);
  if (c.kind === "trim") return `M${s.x} ${s.y} L180 ${s.y} L180 425 L795 425 L795 ${above} L${p.x} ${above} L${p.x} ${p.y}`;
  return `M${s.x} ${s.y} L180 ${s.y} L180 ${above} L${p.x} ${above} L${p.x} ${p.y}`;
}

export function fillClass(c: Cell) {
  if (c.defect) return "fill-red-500";
  if (isStale(c)) return "fill-violet-500";
  const r = c.rolls / c.cap;
  return r === 0 ? "fill-muted" : r < 0.4 ? "fill-sky-200" : r < 0.8 ? "fill-sky-400" : "fill-sky-700";
}

export const LEGEND: [string, string][] = [
  ["fill-muted", "Trống"],
  ["fill-sky-200", "Ít (< 40%)"],
  ["fill-sky-400", "Vừa"],
  ["fill-sky-700", "Đầy (≥ 80%)"],
  ["fill-violet-500", "Tồn > 90 ngày"],
  ["fill-red-500", "Lỗi chờ trả NCC"],
];

const unit = (c: Cell) => (c.kind === "trim" ? `${c.rolls} lô` : `${c.rolls} cuộn · ${fmt(c.meters)} m`);

export function WarehouseMap({
  highlight,
  marks,
  pulse,
  moves = false,
  onCell,
  onRack,
  className,
}: {
  /** có bộ lọc: ô không khớp bị làm mờ */
  highlight?: (c: Cell) => boolean;
  /** sơ đồ mini khi soạn hàng: ô cần lấy / đã lấy xong */
  marks?: Record<string, "todo" | "done">;
  pulse?: string;
  moves?: boolean;
  onCell?: (c: Cell) => void;
  onRack?: (rack: string) => void;
  className?: string;
}) {
  const pc = pulse ? cellById(pulse) : undefined;
  const label = "fill-foreground text-[14px] font-medium";
  return (
    <svg viewBox="0 0 1000 470" className={cn("h-auto w-full", className)} role="img" aria-label="Sơ đồ mặt bằng kho nguyên liệu">
      <defs>
        <marker id="kho-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10z" className="fill-muted-foreground" />
        </marker>
      </defs>
      {/* vỏ nhà kho + các khu */}
      <rect x={10} y={10} width={980} height={450} rx={10} className="fill-card stroke-border" strokeWidth={2} />
      <rect x={20} y={20} width={150} height={110} rx={6} className="fill-amber-500/10 stroke-amber-500/50" />
      <text x={95} y={62} textAnchor="middle" className={label}>Khu nhận hàng</text>
      <text x={95} y={112} textAnchor="middle" className="fill-muted-foreground text-[14px]">⇠ cửa nhập</text>
      <rect x={20} y={145} width={150} height={185} rx={6} className="fill-muted/40 stroke-border" />
      <text x={95} y={164} textAnchor="middle" className={label}>Khu kiểm vải</text>
      <rect x={190} y={20} width={600} height={380} rx={6} className="fill-none stroke-border" />
      <text x={490} y={392} textAnchor="middle" className="fill-muted-foreground text-[14px]">KHO VẢI · dãy kệ A–F · mỗi ô 5 tầng</text>
      <rect x={800} y={20} width={185} height={205} rx={6} className="fill-none stroke-border" />
      <text x={892} y={40} textAnchor="middle" className={label}>Kho phụ liệu</text>
      <rect x={800} y={240} width={185} height={120} rx={6} className="fill-primary/5 stroke-primary/40" strokeDasharray="6 4" />
      <text x={892} y={268} textAnchor="middle" className={label}>Khu soạn hàng xuất</text>
      <rect x={800} y={372} width={185} height={46} rx={6} className="fill-emerald-500/15 stroke-emerald-600" />
      <text x={892} y={400} textAnchor="middle" className={label}>Cửa xuất → Xưởng cắt</text>
      <text x={490} y={434} textAnchor="middle" className="fill-muted-foreground text-[14px]">— lối xe nâng —</text>

      {/* nhãn dãy kệ (bấm để xem cả dãy) */}
      {[...FAB_RACKS.map((r, i) => ({ r, x: 202, y: 70 + i * 58 })), ...["P1", "P2", "P3", "P4"].map((r, i) => ({ r, x: 815, y: 72 + i * 44 }))].map(({ r, x, y }) => (
        <text
          key={r}
          x={x}
          y={y}
          textAnchor="middle"
          className={cn(label, "font-bold", onRack && "cursor-pointer hover:fill-primary")}
          onClick={() => onRack?.(r)}
        >
          {r}
        </text>
      ))}

      {CELLS.map((c) => {
        const b = box(c);
        const mark = marks?.[c.id];
        const dim = marks ? !mark : highlight ? !highlight(c) : false;
        return (
          <g
            key={c.id}
            opacity={dim ? 0.18 : 1}
            className={cn(onCell && "cursor-pointer")}
            onClick={() => onCell?.(c)}
            onKeyDown={(e) => e.key === "Enter" && onCell?.(c)}
            tabIndex={onCell ? 0 : undefined}
            role={onCell ? "button" : undefined}
            aria-label={onCell ? `Ô ${c.id}: ${unit(c)}` : undefined}
          >
            <title>{`${c.id} · ${c.mat.item}${c.mat.color ? ` ${c.mat.color}` : ""} · ${unit(c)}${c.mat.order ? ` · giữ cho ${c.mat.order}` : ""}`}</title>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={2}
              className={cn(
                mark === "done" ? "fill-emerald-500" : mark === "todo" ? "fill-amber-400" : fillClass(c),
                !marks && c.mat.order ? "stroke-emerald-500" : "stroke-transparent",
                highlight && !dim && "stroke-foreground",
              )}
              strokeWidth={1.6}
            />
            {c.kind === "check" && (
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5} textAnchor="middle" className="pointer-events-none fill-foreground text-[14px] font-semibold">
                {c.id}
              </text>
            )}
          </g>
        );
      })}

      {pc && (
        <circle cx={mid(pc).x} cy={mid(pc).y} r={8} className="fill-none stroke-emerald-500" strokeWidth={3}>
          <animate attributeName="r" values="6;22" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}

      {moves &&
        MOVES.map((mv, i) => {
          const d = movePath(mv.from, mv.to);
          const tone = mv.kind === "in" ? "blue" : "orange";
          return (
            <g key={mv.label}>
              <path d={d} fill="none" className={tone === "blue" ? "stroke-blue-500/40" : "stroke-orange-500/50"} strokeWidth={2} strokeDasharray="4 5" markerEnd="url(#kho-arrow)" />
              <circle r={6} className={tone === "blue" ? "fill-blue-600" : "fill-orange-500"}>
                <animateMotion dur="6s" repeatCount="indefinite" begin={`-${i * 0.9}s`} path={d} />
              </circle>
            </g>
          );
        })}
    </svg>
  );
}

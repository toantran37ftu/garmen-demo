"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Progress,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StatisticCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
} from "@erp/miniapp-ui";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AREAS,
  buildFloor,
  CUT_TABLES,
  type DayStatus,
  LINE_TARGET,
  type Move,
  MOVES,
  RISK_DAYS,
  STEPS,
  TODAY_ABSENCE,
  TOTAL_STAFF,
  type Tone,
  type Worker,
} from "@/data/nhan-su";
import { ToneBadge } from "./ui";

type Mode = "status" | "skill" | "risk";
const MODES: [Mode, string][] = [["status", "Theo trạng thái"], ["skill", "Theo tay nghề"], ["risk", "Rủi ro nghỉ việc"]];
const X1 = ["Chuyền 01", "Chuyền 02", "Chuyền 03", "Chuyền 04", "Chuyền 05", "Chuyền 06", "Chuyền 07", "Chuyền 08"];
const X2 = ["Chuyền 09", "Chuyền 10", "Chuyền 11", "Chuyền 12", "Chuyền 13", "Chuyền 14", "Chuyền 15"];
const STATUS_TONE: Record<DayStatus, Tone> = { "Có mặt": "ok", "Đi muộn": "warn", "Nghỉ phép": "info", "Không phép": "bad" };
const SKILL_BG = ["", "bg-sky-200", "bg-sky-300", "bg-sky-500", "bg-sky-600", "bg-sky-800"];

const isPresent = (w: Worker) => w.status === "Có mặt" || w.status === "Đi muộn";

/** thiếu > 0, dư < 0 → màu khối: xanh đủ/dư, vàng thiếu 1–3, đỏ thiếu ≥4 */
function shortTone(short: number) {
  if (short >= 4) return { box: "border-red-500 bg-red-50 dark:bg-red-950/40", text: "text-red-600 dark:text-red-400", label: `Thiếu ${short}` };
  if (short >= 1) return { box: "border-amber-500 bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", label: `Thiếu ${short}` };
  return {
    box: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    label: short < 0 ? `Dư ${-short}` : "Đủ người",
  };
}

function dotClass(w: Worker, mode: Mode) {
  const here = isPresent(w);
  if (mode === "risk") {
    if (w.absentDays >= RISK_DAYS) return "bg-red-500 ring-2 ring-red-300 animate-pulse";
    return here ? "bg-muted-foreground/30" : "border border-muted-foreground/40";
  }
  if (!here) return w.status === "Không phép" ? "border-2 border-red-500" : "border-2 border-slate-400";
  if (mode === "skill") return SKILL_BG[w.level];
  return w.status === "Đi muộn" ? "bg-amber-500" : "bg-emerald-600";
}

function Dots({ workers, mode, shown }: { workers: Worker[]; mode: Mode; shown: boolean }) {
  return (
    <div className="flex flex-wrap gap-[3px]" aria-hidden>
      {workers.map((w, i) => (
        <span
          key={w.id}
          className={cn("size-2.5 rounded-full", dotClass(w, mode), w.from && "outline-2 outline-offset-1 outline-primary")}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "scale(1)" : "scale(0)",
            transition: `opacity .35s ${i * 14}ms, transform .35s ${i * 14}ms, background-color .3s`,
          }}
        />
      ))}
    </div>
  );
}

type Flyer = { key: number; x: number; y: number; dx: number; dy: number; delay: number };

export function StaffMap() {
  const [floor, setFloor] = useState(buildFloor);
  const [mode, setMode] = useState<Mode>("status");
  const [open, setOpen] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [flying, setFlying] = useState(false);
  const [shown, setShown] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const all = Object.values(floor).flat();
    const linePresent = all.filter(isPresent).length;
    return {
      present: linePresent + CUT_TABLES.reduce((s, t) => s + t[1], 0) + AREAS.reduce((s, a) => s + a.present, 0),
      late: all.filter((w) => w.status === "Đi muộn").length + TODAY_ABSENCE.lateOutsideLines,
      risk: all.filter((w) => w.absentDays >= RISK_DAYS).length,
    };
  }, [floor]);

  function apply(idx: number, m: Move) {
    const box = mapRef.current?.getBoundingClientRect();
    const a = mapRef.current?.querySelector(`[data-line="${m.from}"]`)?.getBoundingClientRect();
    const b = mapRef.current?.querySelector(`[data-line="${m.to}"]`)?.getBoundingClientRect();
    if (box && a && b) {
      setFlyers(
        Array.from({ length: m.n }, (_, i) => {
          const x = a.left - box.left + a.width / 2 + (i - (m.n - 1) / 2) * 16;
          const y = a.top - box.top + a.height / 2;
          return { key: Date.now() + i, x, y, dx: b.left - box.left + b.width / 2 - x, dy: b.top - box.top + b.height / 2 - y, delay: i * 140 };
        }),
      );
      requestAnimationFrame(() => requestAnimationFrame(() => setFlying(true)));
    }
    setApplied((s) => new Set(s).add(idx));
    setTimeout(() => {
      setFloor((f) => {
        // ưu tiên người có mặt, đúng công đoạn, tay nghề cao
        const pool = f[m.from]
          .filter(isPresent)
          .sort((p, q) => Number(q.step === m.step) - Number(p.step === m.step) || q.level - p.level)
          .slice(0, m.n);
        const ids = new Set(pool.map((w) => w.id));
        return {
          ...f,
          [m.from]: f[m.from].filter((w) => !ids.has(w.id)),
          [m.to]: [...pool.map((w) => ({ ...w, from: m.from })), ...f[m.to]],
        };
      });
      setFlyers([]);
      setFlying(false);
      toast.success(`Đã chuyển ${m.n} người từ ${m.from} sang ${m.to}`, { description: "Đã báo tổ trưởng 2 chuyền và cập nhật chấm công ca chiều." });
    }, 1000 + m.n * 140);
  }

  const lineBlock = (line: string) => {
    const ws = floor[line];
    const present = ws.filter(isPresent).length;
    const target = LINE_TARGET[line];
    const t = shortTone(target - present);
    return (
      <button
        key={line}
        type="button"
        data-line={line}
        onClick={() => setOpen(line)}
        className={cn(
          "flex min-w-0 flex-col gap-2 rounded-lg border-2 p-2.5 text-left transition-colors duration-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary",
          t.box,
        )}
        aria-label={`${line}: có mặt ${present} trên định biên ${target}, ${t.label}. Bấm để xem danh sách`}
      >
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-sm font-semibold">{line}</span>
          <span className={cn("text-sm font-medium", t.text)}>{t.label}</span>
        </div>
        <div className="text-2xl font-bold tabular-nums">
          {present}
          <span className="text-base font-normal text-muted-foreground">/{target}</span>
        </div>
        <Dots workers={ws} mode={mode} shown={shown} />
      </button>
    );
  };

  const kpis: { label: string; value: string; hint: string; cls?: string }[] = [
    { label: "Có mặt hôm nay", value: `${stats.present}/${TOTAL_STAFF}`, hint: "95,5% · từ máy chấm công 7:35" },
    { label: "Vắng có phép", value: String(TODAY_ABSENCE.leave), hint: "Phép năm, ốm, việc riêng" },
    { label: "Vắng không phép", value: String(TODAY_ABSENCE.awol), hint: "Tổ trưởng đang gọi xác minh", cls: "text-destructive" },
    { label: "Đi muộn", value: String(stats.late), hint: "Đã tính trong số có mặt", cls: "text-warning" },
    { label: "Mới vào tuần này", value: String(TODAY_ABSENCE.newThisWeek), hint: "Đang kèm cặp tại chuyền" },
  ];

  const sheetWorkers = open ? floor[open] : [];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <StatisticCard key={k.label} label={k.label} value={<span className={cn("tabular-nums", k.cls)}>{k.value}</span>} hint={k.hint} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <ToggleGroup
          type="single"
          variant="outline"
          value={mode}
          onValueChange={(v) => v && setMode(v as Mode)}
          aria-label="Cách tô màu chấm người"
        >
          {MODES.map(([v, l]) => (
            <ToggleGroupItem key={v} value={v} className="px-3">
              {l}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {mode === "status" && (
            <>
              <Legend cls="bg-emerald-600">Có mặt</Legend>
              <Legend cls="bg-amber-500">Đi muộn</Legend>
              <Legend cls="border-2 border-slate-400">Nghỉ phép</Legend>
              <Legend cls="border-2 border-red-500">Không phép</Legend>
            </>
          )}
          {mode === "skill" &&
            [1, 2, 3, 4, 5].map((l) => (
              <Legend key={l} cls={SKILL_BG[l]}>
                Bậc {l}
              </Legend>
            ))}
          {mode === "risk" && (
            <Legend cls="bg-red-500 ring-2 ring-red-300">
              Vắng ≥{RISK_DAYS} ngày / 30 ngày · {stats.risk} người
            </Legend>
          )}
          <Legend cls="bg-muted outline-2 outline-offset-1 outline-primary">Vừa điều chuyển</Legend>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Sơ đồ nhà máy · 06/11/2026</CardTitle>
            <CardDescription>Số lớn = có mặt / định biên hôm nay. Bấm vào chuyền để xem từng người.</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="relative flex flex-col gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-3">
              <Zone title="Xưởng 1" sub="Chuyền 01–08">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{X1.map(lineBlock)}</div>
              </Zone>
              <div className="text-center text-sm tracking-widest text-muted-foreground">— lối đi chính —</div>
              <Zone title="Xưởng 2" sub="Chuyền 09–15">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{X2.map(lineBlock)}</div>
              </Zone>
              <div className="grid gap-3 lg:grid-cols-[2fr_3fr]">
                <Zone title="Xưởng cắt" sub="8 bàn cắt">
                  <div className="grid grid-cols-4 gap-2">
                    {CUT_TABLES.map(([hc, p], i) => (
                      <div
                        key={i}
                        className={cn("flex flex-col gap-1 rounded-md border-2 p-1.5", shortTone(hc - p).box)}
                        aria-label={`Bàn ${i + 1}: ${p}/${hc}`}
                      >
                        <span className="text-sm">Bàn {String(i + 1).padStart(2, "0")}</span>
                        <span className="text-sm font-semibold tabular-nums">
                          {p}/{hc}
                        </span>
                      </div>
                    ))}
                  </div>
                </Zone>
                <div className="grid grid-cols-2 gap-2">
                  {AREAS.map((a) => {
                    const t = shortTone(a.hc - a.present);
                    return (
                      <div key={a.name} className={cn("flex flex-col gap-1 rounded-lg border-2 p-2.5", t.box)}>
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="text-sm font-semibold">{a.name}</span>
                          <span className={cn("text-sm", t.text)}>{t.label}</span>
                        </div>
                        <div className="text-xl font-bold tabular-nums">
                          {a.present}
                          <span className="text-base font-normal text-muted-foreground">/{a.hc}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{a.note}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {flyers.map((f) => (
                <span
                  key={f.key}
                  aria-hidden
                  className="pointer-events-none absolute z-10 size-4 rounded-full bg-primary shadow-lg ring-4 ring-primary/30"
                  style={{
                    left: f.x - 8,
                    top: f.y - 8,
                    translate: flying ? `${f.dx}px ${f.dy}px` : "0 0",
                    transition: `translate 900ms cubic-bezier(.5,0,.2,1) ${f.delay}ms`,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>✨ Gợi ý điều chuyển</CardTitle>
            <CardDescription>Dựa trên chấm công 7:35, định biên theo mã hàng và tay nghề từng người.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {MOVES.map((m, i) => {
              const done = applied.has(i);
              return (
                <div key={i} className={cn("flex flex-col gap-2 rounded-lg border p-3 transition-opacity", done && "opacity-60")}>
                  <div className="font-semibold">
                    Chuyển {m.n} người: {m.from} → {m.to}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.why}</p>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">Phù hợp {m.fit}%</Badge>
                    {done ? (
                      <ToneBadge tone="ok">✓ Đã áp dụng</ToneBadge>
                    ) : (
                      <Button size="sm" disabled={flying || flyers.length > 0} onClick={() => apply(i, m)}>
                        Áp dụng
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="text-sm text-muted-foreground">
              Hoàn thiện thiếu 12 người: đề xuất tăng ca 1 giờ tổ ủi thay vì rút người từ chuyền may.
            </p>
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open}</SheetTitle>
                <SheetDescription>
                  Có mặt {sheetWorkers.filter(isPresent).length}/{LINE_TARGET[open]} định biên · biên chế {sheetWorkers.length} người
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-5 px-4 pb-6">
                <section className="flex flex-col gap-2">
                  <h4 className="font-semibold">Kỹ năng theo công đoạn (có mặt hôm nay)</h4>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 text-sm">
                    {STEPS.map((s) => {
                      const ws = sheetWorkers.filter((w) => w.step === s);
                      const here = ws.filter(isPresent);
                      const good = here.filter((w) => w.level >= 3).length;
                      return (
                        <div key={s} className="contents">
                          <span>{s}</span>
                          <Progress value={ws.length ? (here.length / ws.length) * 100 : 0} aria-label={`${s} có mặt ${here.length}/${ws.length}`} />
                          <span className="tabular-nums">
                            {here.length}/{ws.length} · <b>{good}</b> đạt bậc ≥3
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section className="flex flex-col gap-2">
                  <h4 className="font-semibold">Danh sách công nhân</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>Công đoạn</TableHead>
                        <TableHead>Bậc</TableHead>
                        <TableHead>Hôm nay</TableHead>
                        <TableHead>Vắng 30 ngày</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetWorkers.map((w) => (
                        <TableRow key={w.id} className={cn(mode === "risk" && w.absentDays >= RISK_DAYS && "bg-destructive/10")}>
                          <TableCell>
                            <div className="font-medium">{w.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {w.id}
                              {w.from && ` · từ ${w.from}`}
                            </div>
                          </TableCell>
                          <TableCell>{w.step}</TableCell>
                          <TableCell className="tabular-nums">{w.level}</TableCell>
                          <TableCell>
                            <ToneBadge tone={STATUS_TONE[w.status]}>{w.status}</ToneBadge>
                          </TableCell>
                          <TableCell className={cn("tabular-nums", w.absentDays >= RISK_DAYS && "font-semibold text-destructive")}>
                            {w.absentDays} ngày{w.absentDays >= RISK_DAYS && " · rủi ro"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Legend({ cls, children }: { cls: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", cls)} />
      {children}
    </span>
  );
}

function Zone({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border bg-background p-2.5">
      <div className="text-sm">
        <b>{title}</b> <span className="text-muted-foreground">· {sub}</span>
      </div>
      {children}
    </section>
  );
}

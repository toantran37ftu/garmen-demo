"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Progress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ISSUES } from "@/data/kho-nguyen-lieu";
import { PICKS, WRONG } from "@/data/kho-nguyen-lieu-map";
import { fmt } from "@/lib/format";
import { WarehouseMap } from "./floor-plan";
import { FilterSelect, ToneBadge } from "./ui";

const OPTIONS = Object.keys(PICKS).map((no) => {
  const p = ISSUES.find((x) => x.no === no)!;
  return { no, p, label: `${no} · ${p.lsx === "—" ? "Mẫu" : p.lsx} · ${p.dept}` };
});

export function KhoScan({ done, onDone }: { done: Record<string, number>; onDone: (no: string, out: number) => void }) {
  const [opt, setOpt] = useState(OPTIONS[0]);
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [scanning, setScanning] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);

  const list = PICKS[opt.no];
  const got = done[opt.no] !== undefined ? list.map((r) => r.id) : (picked[opt.no] ?? []);
  const next = list.find((r) => !got.includes(r.id));
  const finished = !next;
  const meters = list.filter((r) => got.includes(r.id)).reduce((s, r) => s + r.meters, 0);

  const scan = useCallback(
    (wrong = false) => {
      if (scanning || !next) return;
      setScanning(true);
      setWarn(null);
      setTimeout(() => {
        setScanning(false);
        if (wrong) {
          const w = WRONG[opt.no];
          setWarn(`${w.id} (ô ${w.loc}) đang giữ cho ${w.held}. Để lại kệ, lấy cuộn ${next.id}.`);
          setAuto(false);
          return;
        }
        const ids = [...got, next.id];
        setPicked((p) => ({ ...p, [opt.no]: ids }));
        setLast(next.loc.slice(0, 3));
        if (ids.length === list.length) {
          const out = list.reduce((s, r) => s + r.meters, 0);
          onDone(opt.no, out);
          setAuto(false);
          toast.success("Đã soạn xong, giao Xưởng cắt", { description: `${opt.no} · ${list.length} cuộn · ${fmt(out)} m → ${opt.p.dept}` });
        }
      }, 900);
    },
    [scanning, next, got, opt, list, onDone],
  );

  useEffect(() => {
    if (!auto || scanning || finished) return;
    const t = setTimeout(() => scan(), 250);
    return () => clearTimeout(t);
  }, [auto, scanning, finished, scan]);

  // ô cần lấy trên sơ đồ mini: xong khi mọi cuộn của ô đã quét
  const marks: Record<string, "todo" | "done"> = {};
  for (const r of list) {
    const id = r.loc.slice(0, 3);
    marks[id] = marks[id] === "todo" || !got.includes(r.id) ? "todo" : "done";
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* điện thoại thủ kho */}
      <div className="mx-auto w-[340px] rounded-[2.5rem] border-[10px] border-neutral-800 bg-background shadow-xl">
        <div className="flex justify-between px-5 pt-2 text-sm text-muted-foreground">
          <span>14:20</span>
          <span>4G ▮▮▮ 82%</span>
        </div>
        <div className="flex h-[640px] flex-col gap-3 p-4">
          <div>
            <div className="text-base font-semibold">📦 Soạn hàng xuất</div>
            <div className="text-sm text-muted-foreground">Thủ kho: Trần Văn Phúc · Kho vải 2</div>
          </div>
          <FilterSelect
            label="Phiếu xuất"
            options={OPTIONS.map((o) => o.label)}
            value={opt.label}
            onChange={(v) => {
              setOpt(OPTIONS.find((o) => o.label === v)!);
              setWarn(null);
              setAuto(false);
            }}
          />
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span>{opt.p.item}</span>
              <span className="font-semibold tabular-nums">{got.length}/{list.length} cuộn</span>
            </div>
            <Progress value={(got.length / list.length) * 100} indicatorClassName={finished ? "bg-success" : undefined} />
          </div>

          <svg viewBox="0 0 200 110" className="w-full shrink-0 rounded-lg bg-neutral-900" aria-label="Khung camera quét mã">
            {["M15 30 V15 H30", "M170 15 H185 V30", "M15 80 V95 H30", "M170 95 H185 V80"].map((d) => (
              <path key={d} d={d} fill="none" stroke="white" strokeWidth={3} />
            ))}
            {Array.from({ length: 26 }, (_, i) => (
              <rect key={i} x={50 + i * 4} y={38} width={(i * 7) % 3 ? 1.5 : 3} height={34} fill="white" opacity={scanning ? 0.9 : 0.35} />
            ))}
            <text x={100} y={88} textAnchor="middle" fill="white" fontSize={10} opacity={0.8}>
              {scanning ? "Đang đọc mã…" : finished ? "Hoàn tất" : next ? `Lấy ${next.id} tại ${next.loc}` : ""}
            </text>
            {scanning && (
              <rect x={20} width={160} height={2} fill="#ef4444">
                <animate attributeName="y" values="18;92;18" dur="0.9s" repeatCount="indefinite" />
              </rect>
            )}
          </svg>

          {warn && (
            <Alert variant="destructive">
              <AlertTitle>Cuộn này giữ cho đơn khác</AlertTitle>
              <AlertDescription>{warn}</AlertDescription>
            </Alert>
          )}
          {finished && (
            <Alert>
              <AlertTitle>✅ Đã soạn xong</AlertTitle>
              <AlertDescription>Giao {opt.p.dept} · {fmt(meters)} m</AlertDescription>
            </Alert>
          )}

          <ul className="-mx-1 flex-1 overflow-y-auto">
            {list.map((r) => {
              const ok = got.includes(r.id);
              return (
                <li
                  key={r.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    r === next && "bg-primary/10 font-medium",
                    ok && "text-muted-foreground",
                  )}
                >
                  <span className={cn("flex size-5 items-center justify-center rounded-full border", ok && "border-success bg-success text-white")}>
                    {ok ? "✓" : ""}
                  </span>
                  <span className={cn("flex-1", ok && "line-through")}>{r.id}</span>
                  <span className="tabular-nums">{r.loc}</span>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2">
            <Button size="lg" disabled={scanning || finished} onClick={() => scan()}>
              📷 Quét
            </Button>
            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" disabled={scanning || finished} onClick={() => scan(true)}>
                Thử quét nhầm
              </Button>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={auto} onCheckedChange={setAuto} disabled={finished} />
                Quét liên tục
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Màn hình điều phối kho · {opt.no}</CardTitle>
            <CardDescription>
              {opt.p.lsx} · {opt.p.order} · giao {opt.p.dept} · người nhận {opt.p.receiver}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <ToneBadge tone={finished ? "info" : "warn"}>{finished ? "Đã soạn" : "Đang soạn"}</ToneBadge>
              <span className="tabular-nums">
                {got.length}/{list.length} cuộn · {fmt(meters)} / {fmt(list.reduce((s, r) => s + r.meters, 0))} m
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã cuộn</TableHead>
                    <TableHead>Màu · lô</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead numeric>Mét</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((r) => {
                    const ok = got.includes(r.id);
                    return (
                      <TableRow key={r.id} className={cn("transition-colors duration-700", ok && "bg-success/10")}>
                        <TableCell className="font-medium">{r.id}</TableCell>
                        <TableCell>{r.color} · {r.lot}</TableCell>
                        <TableCell>{r.loc}</TableCell>
                        <TableCell numeric>{fmt(r.meters)}</TableCell>
                        <TableCell>{ok ? <ToneBadge tone="ok">Đã lấy</ToneBadge> : <ToneBadge tone="gray">Chờ lấy</ToneBadge>}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Vị trí trên sơ đồ kho</CardTitle>
            <CardDescription>Vàng: ô còn cuộn cần lấy · xanh: ô đã lấy xong · vòng sáng: ô vừa quét</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <WarehouseMap className="min-w-[640px]" marks={marks} pulse={last ?? undefined} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

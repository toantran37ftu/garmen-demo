"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { ROLLS, TRIMS } from "@/data/kho-nguyen-lieu";
import { type Cell, CELLS, cellById, FABRICS, isStale, lsxOf, MOVES, ORDERS, rollsOf, TOTAL, TRIM_AT } from "@/data/kho-nguyen-lieu-map";
import { fmt } from "@/lib/format";
import { fillClass, LEGEND, WarehouseMap } from "./floor-plan";
import { FilterSelect, KpiGrid, Note, ToneBadge } from "./ui";

const ALL_ORDER = "Tất cả đơn hàng";
const ALL_FAB = "Tất cả mã vải";

type Open = { cell: string } | { rack: string } | null;

function StatusBadge({ c }: { c: Cell }) {
  if (c.defect) return <ToneBadge tone="bad">Lỗi – chờ trả NCC</ToneBadge>;
  if (isStale(c)) return <ToneBadge tone="violet">Tồn {c.age} ngày</ToneBadge>;
  if (c.rolls === 0) return <ToneBadge tone="gray">Trống</ToneBadge>;
  return c.mat.order ? <ToneBadge tone="ok">Giữ cho {c.mat.order}</ToneBadge> : <ToneBadge tone="gray">Tự do</ToneBadge>;
}

export function KhoMap() {
  const [order, setOrder] = useState(ALL_ORDER);
  const [fab, setFab] = useState(ALL_FAB);
  const [stale, setStale] = useState(false);
  const [open, setOpen] = useState<Open>(null);

  const orderId = ORDERS.find((o) => o.label === order)?.id;
  const fabCode = fab === ALL_FAB ? undefined : fab.split(" · ")[0];
  const filtered = !!orderId || !!fabCode || stale;
  const match = (c: Cell) =>
    c.rolls > 0 && (!orderId || c.mat.order === orderId) && (!fabCode || c.mat.fabric === fabCode) && (!stale || isStale(c));
  const hits = filtered ? CELLS.filter(match) : [];
  const hitFab = hits.filter((c) => c.kind !== "trim");

  const fabric = CELLS.filter((c) => c.kind === "fabric");
  const staleCells = CELLS.filter((c) => isStale(c) && c.kind !== "trim");
  const defect = CELLS.filter((c) => c.defect);

  return (
    <>
      <KpiGrid
        items={[
          { label: "Vải trong kho", value: `${fmt(TOTAL.rolls)} cuộn`, hint: `${fmt(TOTAL.meters)} m · gồm khu kiểm vải` },
          { label: "Ô kệ vải đang dùng", value: `${fabric.filter((c) => c.rolls).length}/${fabric.length}`, hint: `${fabric.filter((c) => !c.rolls).length} ô trống` },
          { label: "Tồn > 90 ngày", value: `${staleCells.reduce((s, c) => s + c.rolls, 0)} cuộn`, hint: staleCells.map((c) => c.id).join(", "), tone: "violet" },
          { label: "Lỗi chờ trả NCC", value: `${defect.reduce((s, c) => s + c.rolls, 0)} cuộn`, hint: `${defect.map((c) => c.id).join(", ")} · PN-11059`, tone: "bad" },
        ]}
      />
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Theo đơn hàng" options={[ALL_ORDER, ...ORDERS.map((o) => o.label)]} value={order} onChange={setOrder} />
          <FilterSelect label="Theo mã vải" options={[ALL_FAB, ...FABRICS]} value={fab} onChange={setFab} />
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={stale} onCheckedChange={setStale} />
            Chỉ hàng tồn lâu (&gt; 90 ngày)
          </label>
          <div className="ml-auto text-sm text-muted-foreground">
            {filtered
              ? `Tô sáng ${hits.length} ô · ${fmt(hitFab.reduce((s, c) => s + c.rolls, 0))} cuộn · ${fmt(hitFab.reduce((s, c) => s + c.meters, 0))} m`
              : "Bấm vào ô hoặc chữ tên dãy kệ để xem chi tiết"}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="overflow-x-auto">
            <WarehouseMap
              className="min-w-[860px]"
              moves
              highlight={filtered ? match : undefined}
              onCell={(c) => setOpen({ cell: c.id })}
              onRack={(r) => setOpen({ rack: r })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {LEGEND.map(([cls, text]) => (
              <span key={text} className="flex items-center gap-1.5">
                <svg width="14" height="14" aria-hidden><rect width="14" height="14" rx="2" className={cls} /></svg>
                {text}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" aria-hidden><rect x="1" y="1" width="12" height="12" rx="2" className="fill-sky-400 stroke-emerald-500" strokeWidth="2" /></svg>
              Viền xanh = đã giữ cho đơn
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Luồng hàng hôm nay 06/11</CardTitle>
          <CardDescription>Chấm xanh: hàng vào kệ · chấm cam: hàng ra cửa xuất</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          {MOVES.map((mv) => (
            <div key={mv.label} className="flex items-center gap-2">
              <span className={mv.kind === "in" ? "size-3 rounded-full bg-blue-600" : "size-3 rounded-full bg-orange-500"} />
              {mv.label}
            </div>
          ))}
        </CardContent>
      </Card>
      <MapSheet open={open} setOpen={setOpen} />
    </>
  );
}

function MapSheet({ open, setOpen }: { open: Open; setOpen: (o: Open) => void }) {
  const cell = open && "cell" in open ? cellById(open.cell) : undefined;
  const rack = open && "rack" in open ? open.rack : undefined;
  return (
    <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        {cell && <CellView c={cell} />}
        {rack && <RackView rack={rack} onCell={(id) => setOpen({ cell: id })} />}
      </SheetContent>
    </Sheet>
  );
}

function CellView({ c }: { c: Cell }) {
  const title = c.kind === "check" ? `Khu kiểm vải · ${c.id}` : `Ô ${c.id} · kệ ${c.rack}`;
  const head = (
    <SheetHeader>
      <SheetTitle className="flex items-center gap-2">
        <svg width="16" height="16" aria-hidden><rect width="16" height="16" rx="3" className={fillClass(c)} /></svg>
        {title}
      </SheetTitle>
      <SheetDescription>
        {c.mat.item} {c.mat.color} · {c.kind === "trim" ? `${c.rolls} lô` : `${c.rolls} cuộn · ${fmt(c.meters)} m · lấp đầy ${Math.round((c.rolls / c.cap) * 100)}%`}
      </SheetDescription>
    </SheetHeader>
  );

  if (c.kind === "trim") {
    const t = TRIMS.find((x) => x.code === TRIM_AT[c.id]?.code);
    return (
      <>
        {head}
        <div className="flex flex-col gap-4 px-4">
          <div><StatusBadge c={c} /></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phụ liệu</TableHead>
                <TableHead>Lô</TableHead>
                <TableHead numeric>Tồn</TableHead>
                <TableHead numeric>Đã giữ</TableHead>
                <TableHead>Giữ cho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{c.mat.item}</TableCell>
                <TableCell>{t?.lot ?? `${c.rolls} lô`}</TableCell>
                <TableCell numeric>{t?.stock ?? "—"}</TableCell>
                <TableCell numeric>{t?.held ?? "—"}</TableCell>
                <TableCell>{c.mat.order ?? "Nhiều đơn / tự do"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {t && <Note>Trên màn Tồn kho mã này ghi vị trí {t.loc} (mã vị trí cũ).</Note>}
        </div>
      </>
    );
  }

  const real = ROLLS.filter((r) => r.loc.startsWith(`${c.id}-`));
  const rows = rollsOf(c).slice(real.length);
  return (
    <>
      {head}
      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge c={c} />
          {c.mat.order && <ToneBadge tone="info">{c.mat.order} · {lsxOf(c.mat.order)}</ToneBadge>}
          <ToneBadge tone="gray">Nhập cách đây {c.age} ngày</ToneBadge>
        </div>
        {c.rolls === 0 ? (
          <Note>Ô đang trống — có thể xếp hàng mới về.</Note>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã cuộn</TableHead>
                <TableHead>Tầng</TableHead>
                <TableHead>Màu</TableHead>
                <TableHead>Lô</TableHead>
                <TableHead numeric>Mét còn</TableHead>
                <TableHead>Giữ cho đơn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {real.map((r) => (
                <TableRow key={r.id} className="bg-primary/5">
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.loc.split("-")[1]}</TableCell>
                  <TableCell>{r.color}</TableCell>
                  <TableCell>{r.lot}</TableCell>
                  <TableCell numeric>{fmt(r.meters)} m</TableCell>
                  <TableCell>{r.held}</TableCell>
                </TableRow>
              ))}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{String(r.tier).padStart(2, "0")}</TableCell>
                  <TableCell>{r.color}</TableCell>
                  <TableCell>{r.lot}</TableCell>
                  <TableCell numeric>{fmt(r.meters)} m</TableCell>
                  <TableCell>{r.order ? `${r.order} · ${lsxOf(r.order)}` : "Tự do"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

function RackView({ rack, onCell }: { rack: string; onCell: (id: string) => void }) {
  const cells = CELLS.filter((c) => c.rack === rack);
  const trim = rack.startsWith("P");
  const total = cells.reduce((s, c) => s + c.rolls, 0);
  return (
    <>
      <SheetHeader>
        <SheetTitle>Dãy kệ {rack}</SheetTitle>
        <SheetDescription>
          {cells.length} ô · {trim ? `${fmt(total)} lô phụ liệu` : `${fmt(total)} cuộn · ${fmt(cells.reduce((s, c) => s + c.meters, 0))} m`} · bấm một dòng để xem từng cuộn
        </SheetDescription>
      </SheetHeader>
      <div className="px-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ô</TableHead>
              <TableHead>Mặt hàng</TableHead>
              <TableHead numeric>{trim ? "Lô" : "Cuộn"}</TableHead>
              {!trim && <TableHead numeric>Mét</TableHead>}
              <TableHead>Tình trạng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cells.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => onCell(c.id)}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.mat.item} {c.mat.color}</TableCell>
                <TableCell numeric>{c.rolls}</TableCell>
                {!trim && <TableCell numeric>{fmt(c.meters)}</TableCell>}
                <TableCell><StatusBadge c={c} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

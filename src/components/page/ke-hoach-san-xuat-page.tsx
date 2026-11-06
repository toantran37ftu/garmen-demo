"use client";

import {
  Button,
  Card,
  CardHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatisticCard,
  ToggleGroup,
  ToggleGroupItem,
} from "@erp/miniapp-ui";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { type Detail, DetailSheet } from "@/components/features/ke-hoach-san-xuat/detail-sheet";
import { JourneyTab } from "@/components/features/ke-hoach-san-xuat/journey";
import { NewOrderTab } from "@/components/features/ke-hoach-san-xuat/new-order";
import { OrderGantt } from "@/components/features/ke-hoach-san-xuat/order-gantt";
import { CapacityTab, DailyTab, OrdersTab, WarningsTab } from "@/components/features/ke-hoach-san-xuat/tabs";
import {
  addOrder,
  buildOrders,
  CUSTOMERS,
  calc,
  curOnLine,
  dt,
  type Fit,
  INITIAL_SCHED,
  N,
  type NewSpec,
  newRaw,
  NOTES,
  type Note,
  type Sched,
  verdict,
  WARNS,
  WORKERS,
} from "@/data/ke-hoach-san-xuat";

const TABS = [
  { id: "bang", label: "Bảng kế hoạch" },
  { id: "moi", label: "Nhận đơn mới — có kịp không?" },
  { id: "ht", label: "Hành trình đơn hàng" },
  { id: "nl", label: "Năng lực chuyền" },
  { id: "lenh", label: "Lệnh sản xuất" },
  { id: "td", label: "Tiến độ hằng ngày" },
  { id: "cb", label: "Cảnh báo trễ", badge: WARNS.length },
];

const LEGEND: [string, string][] = [
  ["bg-[repeating-linear-gradient(45deg,#F59E0B_0_3px,#FDE68A_3px_6px)]", "Chờ NPL"],
  ["bg-[linear-gradient(90deg,#2563EB_50%,#2563EB80_50%)]", "Sản xuất (cắt → may → hoàn thiện; đậm = đã làm)"],
  ["bg-[linear-gradient(90deg,#B91C1C_50%,#B91C1C80_50%)]", "Sản xuất – đơn dự kiến trễ"],
  ["bg-[repeating-linear-gradient(45deg,#DC2626_0_3px,#FCA5A5_3px_6px)]", "Vượt ngày xuất"],
];

type Plan = { sched: Sched[]; undo: [number, Sched][] };

export function KeHoachSanXuatPage() {
  const [tab, setTab] = useState("bang");
  const [plan, setPlanState] = useState<Plan>({ sched: INITIAL_SCHED, undo: [] });
  const planRef = useRef(plan);
  const setPlan = (p: Plan) => {
    planRef.current = p;
    setPlanState(p);
  };
  const [cust, setCust] = useState("all");
  const [px, setPx] = useState("10");
  const [detail, setDetail] = useState<Detail>(null);
  const [done, setDone] = useState<(number | null)[]>(WARNS.map(() => null));
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [jo, setJo] = useState(4); // BM-7720

  const orders = useMemo(() => buildOrders(plan.sched), [plan.sched]);
  const nLsx = orders.reduce((s, o) => s + o.lsx.length, 0);
  const nLate = orders.filter((o) => o.late).length;
  const nUse = WORKERS.filter((_, i) => curOnLine(orders, i + 1).length).length;
  const shown = orders.filter((o) => cust === "all" || o.cust === +cust).length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: setPlan chỉ ghi ref + state
  const undoLast = useCallback(() => {
    const { sched, undo } = planRef.current;
    const u = undo.at(-1);
    if (!u) return;
    const next = sched.slice();
    next[u[0]] = u[1];
    setPlan({ sched: next, undo: undo.slice(0, -1) });
    const o = calc(u[0], u[1]);
    notify(`Đã hoàn tác ${o.po}: ${dt(o.start)} – ${dt(o.end - 1)} · ${verdict(o)}`, undo.length > 1);
  }, []);

  const notify = (msg: string, canUndo: boolean) =>
    toast(msg, { id: "khsx", duration: 7000, action: canUndo ? { label: "↺ Hoàn tác", onClick: undoLast } : undefined });

  // biome-ignore lint/correctness/useExhaustiveDependencies: đọc state qua ref
  const commit = useCallback((i: number, prev: Sched, next: Sched) => {
    const p = planRef.current;
    const sched = p.sched.slice();
    sched[i] = next;
    setPlan({ sched, undo: [...p.undo, [i, prev]] });
    const o = calc(i, next);
    const rz = next.sew !== prev.sew;
    notify(`Đã ${rz ? "đổi" : "dời"} ${o.po} ${rz ? "thành" : "sang"} ${dt(o.start)} – ${dt(o.end - 1)} · ${verdict(o)}`, true);
  }, []);

  const openOrder = useCallback((i: number) => setDetail({ kind: "order", i }), []);

  const save = () => {
    setPlan({ sched: plan.sched, undo: [] });
    notify("Đã lưu kế hoạch · đã báo Tổ cắt, Kho và các chuyền liên quan", false);
  };

  const addNew = (spec: NewSpec, fit: Fit) => {
    const raw = newRaw(orders, spec, fit);
    const sched = plan.sched.slice();
    for (const s of fit.shifts) sched[s.i] = { ...sched[s.i], start: sched[s.i].start + s.d };
    sched[addOrder(raw)] = { start: fit.start, sew: fit.se - fit.ss };
    setPlan({ sched, undo: plan.undo });
    toast.success(`Đã đưa PO ${raw[0]} vào kế hoạch · Chuyền ${fit.lines.map((n) => String(n).padStart(2, "0")).join(" + ")} · xong ${dt(fit.end - 1)}`, {
      description: fit.shifts.length ? `Đã dời ${fit.shifts.length} đơn khác · xem ở Bảng kế hoạch` : "Xem ở Bảng kế hoạch",
      action: { label: "Xem", onClick: () => setTab("bang") },
    });
  };

  const openJourney = (i: number) => {
    setJo(i);
    setDetail(null);
    setTab("ht");
  };

  const apply = (k: number, j: number) => {
    const w = WARNS[k];
    const o = orders[w.o];
    setDone((d) => d.map((x, i) => (i === k ? j : x)));
    setNotes((n) => [
      {
        who: "Kế hoạch",
        avatar: "KH",
        text: `PO ${o.po}: ${w.acts[j][1]}`,
        meta: `06/11 ${new Date().toTimeString().slice(0, 5)} · Đã báo Tổ cắt, Kho, Chuyền ${o.lines}`,
      },
      ...n,
    ]);
  };

  return (
    <AppFrame
      slug="ke-hoach-san-xuat"
      nav="tabs"
      items={TABS}
      active={tab}
      onChange={setTab}
      description="Kế hoạch 6 tháng (11/2026 – 04/2027) · theo khách hàng & đơn hàng · 2 xưởng · 15 chuyền"
      actions={
        <>
          <Button variant="outline">⬇ Xuất Excel</Button>
          <Button onClick={() => setTab("moi")}>＋ Xếp đơn mới</Button>
        </>
      }
    >
      {tab === "bang" && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatisticCard label="Đơn đang chạy" value={orders.length} hint={`${nLsx} lệnh sản xuất · ${CUSTOMERS.length} khách hàng`} />
            <StatisticCard label="Chuyền đang dùng" value={`${nUse}/${WORKERS.length}`} hint="Xem chỗ trống ở tab Năng lực chuyền" />
            <StatisticCard
              label="Đúng tiến độ"
              value={<span className="text-success">{orders.length - nLate}</span>}
              hint={`${Math.round(((orders.length - nLate) / orders.length) * 100)}% số đơn`}
            />
            <StatisticCard label="Dự kiến trễ" value={<span className="text-destructive">{nLate}</span>} hint="Bấm thanh đỏ để xem phương án" />
          </div>
          <Card className="gap-0 overflow-hidden py-0">
            <CardHeader className="border-b py-3">
              <div className="flex w-full flex-wrap items-center gap-2">
                <Select value={cust} onValueChange={setCust}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả khách hàng</SelectItem>
                    {CUSTOMERS.map((k, i) => (
                      <SelectItem key={k} value={String(i)}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ToggleGroup type="single" variant="outline" value={px} onValueChange={(v) => v && setPx(v)}>
                  <ToggleGroupItem value="10">Tuần</ToggleGroupItem>
                  <ToggleGroupItem value="3.5">Tháng</ToggleGroupItem>
                </ToggleGroup>
                <span className="grow" />
                <span className="text-muted-foreground">
                  {shown} đơn · {N / 7} tuần
                </span>
                <Button size="sm" disabled={!plan.undo.length} onClick={save}>
                  💾 Lưu kế hoạch
                </Button>
              </div>
            </CardHeader>
            <div className="flex flex-wrap gap-x-3.5 gap-y-1 border-b px-4 py-2.5 text-xs text-muted-foreground">
              {LEGEND.map(([c, l]) => (
                <span key={l} className="flex items-center gap-1">
                  <i className={`inline-block h-3 w-3.5 rounded-[3px] ${c}`} />
                  {l}
                </span>
              ))}
              <span>
                <b className="text-gray-900">⚑</b> Ngày xuất hàng
              </span>
              <span>
                <b className="text-success">▲</b> NPL về kịp · <b className="text-red-600">▲</b> NPL về sau ngày cắt
              </span>
              <span className="flex items-center gap-1">
                <i className="inline-block h-3 w-[3px] rounded-[3px] bg-primary" />
                Hôm nay 06/11
              </span>
            </div>
            <OrderGantt
              key={px}
              orders={orders}
              cust={cust === "all" ? "" : cust}
              px={+px}
              onOpen={openOrder}
              onCommit={commit}
            />
          </Card>
          <p className="text-muted-foreground">
            ⓘ Bấm tên khách hàng để thu gọn nhóm · bấm vào thanh để xem chi tiết đơn · kéo thanh để dời lịch, kéo mép phải để đổi số
            ngày sản xuất · rê chuột lên ▲ để xem từng loại nguyên liệu.
          </p>
        </>
      )}
      {tab === "moi" && <NewOrderTab orders={orders} onAdd={addNew} />}
      {tab === "ht" && <JourneyTab orders={orders} sel={jo} onSel={setJo} />}
      {tab === "nl" && <CapacityTab orders={orders} />}
      {tab === "lenh" && <OrdersTab orders={orders} onOpen={openOrder} />}
      {tab === "td" && <DailyTab orders={orders} />}
      {tab === "cb" && <WarningsTab orders={orders} done={done} notes={notes} onOpenWarn={(k) => setDetail({ kind: "warn", k })} />}

      <DetailSheet detail={detail} orders={orders} done={done} onClose={() => setDetail(null)} onOpen={setDetail} onApply={apply} onJourney={openJourney} />
    </AppFrame>
  );
}

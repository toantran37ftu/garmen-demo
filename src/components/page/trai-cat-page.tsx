"use client";

import { Badge, Button } from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame, type FrameNavItem } from "@/components/app-frame";
import { BoView } from "@/components/features/trai-cat/bo-view";
import { CutSheet } from "@/components/features/trai-cat/cut-sheet";
import { MarkerView } from "@/components/features/trai-cat/marker-view";
import { OrderView } from "@/components/features/trai-cat/order-view";
import { type Filter, Lk, type Nav, type View } from "@/components/features/trai-cat/shared";
import { CuonView, HaoHutView, LenhView, NangSuatView, PhieuView } from "@/components/features/trai-cat/views";
import { WorkerView } from "@/components/features/trai-cat/worker-view";
import { FIN, O } from "@/data/trai-cat";

const ITEMS: FrameNavItem[] = [
  { id: "order", label: "Order cắt" },
  { id: "lenh", label: "Lệnh cắt" },
  { id: "sd", label: "Sơ đồ cắt" },
  { id: "phieu", label: "Phiếu trải theo bàn" },
  { id: "cuon", label: "Cuộn vải đã quét" },
  { id: "hh", label: "Hao hụt vải" },
  { id: "bo", label: "Bó hàng giao chuyền" },
  { id: "ns", label: "Năng suất bàn cắt" },
  { id: "dt", label: "Màn hình công nhân 📱" },
];

export function TraiCatPage() {
  const [view, setView] = useState<View>("order");
  const [F, setF] = useState<Filter | null>(null);
  const [oi, setOi] = useState(0);
  const [boIdx, setBoIdx] = useState(0);
  const [sdIdx, setSdIdx] = useState(0);
  const [sheet, setSheet] = useState<{ lc: number; lay?: string } | null>(null);

  // Nhảy sang màn khác, lọc theo đơn (+ màu/size/lệnh cắt) và tô dòng khớp
  const goto = (v: View, flt?: Filter) => {
    setSheet(null);
    setView(v);
    setF(v === "order" ? null : (flt ?? null));
    if (v === "order" && flt) setOi(flt.o);
    if (v === "bo" && flt) {
      let i = FIN.findIndex((y) => y.lc.o === flt.o && (!flt.mau || y.mau === flt.mau));
      if (i < 0) i = FIN.findIndex((y) => y.lc.o === flt.o);
      if (i >= 0) setBoIdx(i);
    }
    window.scrollTo(0, 0);
  };
  const nav: Nav = { F, goto, openLC: (lc, lay) => setSheet({ lc, lay }), openSD: (lc) => { setSdIdx(lc); goto("sd"); } };

  return (
    <AppFrame
      slug="trai-cat"
      nav="sidebar"
      items={ITEMS}
      active={view}
      onChange={(id) => goto(id as View)}
      description="Hôm nay T6 06/11/2026 · Xưởng cắt · 8 bàn cắt (Bàn 01–08) · 55 công nhân"
      actions={
        <>
          <Button variant="outline" onClick={() => toast("Đang xuất Excel…")}>⬇ Xuất Excel</Button>
          <Button onClick={() => toast("Mở form lập lệnh cắt")}>＋ Lập lệnh cắt</Button>
        </>
      }
    >
      {F && view !== "order" && (
        <div className="flex flex-wrap items-center gap-3 font-semibold">
          <Lk on={() => goto("order", { o: F.o })}>← Quay lại Order {O[F.o].po}</Lk>
          <Badge variant="secondary" className="gap-1.5 bg-primary/10 py-1 pl-3 pr-1.5 text-primary">
            Đang lọc: {[O[F.o].po, F.lc, F.mau, F.sz && "Size " + F.sz].filter(Boolean).join(" · ")}
            <button type="button" aria-label="Bỏ lọc" title="Bỏ lọc" className="px-1" onClick={() => setF(null)}>✕</button>
          </Badge>
        </div>
      )}
      {view === "order" && <OrderView oi={oi} onSelect={setOi} nav={nav} />}
      {view === "lenh" && <LenhView nav={nav} />}
      {view === "sd" && <MarkerView idx={sdIdx} onPick={setSdIdx} nav={nav} />}
      {view === "phieu" && <PhieuView nav={nav} />}
      {view === "cuon" && <CuonView nav={nav} />}
      {view === "hh" && <HaoHutView nav={nav} />}
      {view === "bo" && <BoView idx={boIdx} onPick={setBoIdx} nav={nav} />}
      {view === "ns" && <NangSuatView />}
      {view === "dt" && <WorkerView />}
      <CutSheet open={sheet} nav={nav} onClose={() => setSheet(null)} />
    </AppFrame>
  );
}

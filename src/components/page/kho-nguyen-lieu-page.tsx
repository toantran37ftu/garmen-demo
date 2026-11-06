"use client";

import { Button } from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { type DocRef, KhoDocSheet } from "@/components/features/kho-nguyen-lieu/doc-sheet";
import { KhoMap } from "@/components/features/kho-nguyen-lieu/map-screen";
import { KhoScan } from "@/components/features/kho-nguyen-lieu/scan-screen";
import { KhoIssues } from "@/components/features/kho-nguyen-lieu/issues";
import { KhoNeeds } from "@/components/features/kho-nguyen-lieu/needs";
import { KhoOverview } from "@/components/features/kho-nguyen-lieu/overview";
import { KhoReceipts } from "@/components/features/kho-nguyen-lieu/receipts";
import { KhoStock } from "@/components/features/kho-nguyen-lieu/stock";
import { KhoStocktake } from "@/components/features/kho-nguyen-lieu/stocktake";

const NAV = [
  { id: "tq", label: "Tổng quan kho" },
  { id: "sodo", label: "Sơ đồ kho" },
  { id: "nhap", label: "Hàng về (nhập kho)" },
  { id: "xuat", label: "Xuất kho" },
  { id: "quet", label: "Quét mã xuất kho" },
  { id: "ton", label: "Tồn kho" },
  { id: "thieu", label: "Nhu cầu & cảnh báo thiếu", badge: 6 },
  { id: "kk", label: "Kiểm kê & tồn đọng" },
];

export function KhoNguyenLieuPage() {
  const [tab, setTab] = useState("tq");
  const [doc, setDoc] = useState<DocRef>(null);
  const [done, setDone] = useState<Record<string, number>>({});

  return (
    <AppFrame
      slug="kho-nguyen-lieu"
      description="Kho vải + kho phụ liệu · cập nhật 06/11/2026, 14:20"
      nav="sidebar"
      items={NAV}
      active={tab}
      onChange={setTab}
      actions={
        <>
          <Button variant="outline" onClick={() => setTab("ton")}>📷 Quét mã cuộn</Button>
          <Button onClick={() => toast.info("Chọn loại phiếu: nhập kho, xuất kho hoặc trả lại kho")}>＋ Lập phiếu</Button>
        </>
      }
    >
      {tab === "tq" && <KhoOverview />}
      {tab === "nhap" && <KhoReceipts onOpen={(i) => setDoc({ kind: "pn", i })} />}
      {tab === "sodo" && <KhoMap />}
      {tab === "xuat" && <KhoIssues done={done} onOpen={(i) => setDoc({ kind: "px", i })} />}
      {tab === "quet" && <KhoScan done={done} onDone={(no, out) => setDone((d) => ({ ...d, [no]: out }))} />}
      {tab === "ton" && <KhoStock />}
      {tab === "thieu" && <KhoNeeds />}
      {tab === "kk" && <KhoStocktake />}
      <KhoDocSheet doc={doc} onClose={() => setDoc(null)} />
    </AppFrame>
  );
}

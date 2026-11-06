"use client";

import { Button } from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { type Detail, DetailSheet } from "@/components/features/tinh-luong/detail-sheet";
import { MbView } from "@/components/features/tinh-luong/mb-view";
import { PayrollView } from "@/components/features/tinh-luong/payroll-view";
import { SpView } from "@/components/features/tinh-luong/sp-view";
import { SubView } from "@/components/features/tinh-luong/sub-view";
import { D, f } from "@/data/tinh-luong";

const TABS = [
  { id: "thang", label: "Bảng lương tháng" },
  { id: "sp", label: "Lương sản phẩm" },
  { id: "mb", label: "Mua – bán công đoạn" },
  { id: "con", label: "Bảng con" },
];

export function TinhLuongPage() {
  const [tab, setTab] = useState("thang");
  const [per, setPer] = useState("2"); // tuần 12–17/10: nhiều chuyền đổi mã hàng, CN có 2 dòng mã hàng
  const [detail, setDetail] = useState<Detail>(null);

  return (
    <AppFrame
      slug="tinh-luong"
      nav="tabs"
      items={TABS}
      active={tab}
      onChange={setTab}
      description={`Kỳ lương tháng 10/2026 · Công ty May Demo · ${f(D.length)} lao động`}
      actions={
        <>
          <Button variant="outline" onClick={() => toast.success("Đã xuất bảng lương ra Excel")}>
            ⬇ Xuất Excel
          </Button>
          <Button onClick={() => toast.success("Đã chốt bảng lương kỳ 10/2026")}>✓ Chốt bảng lương</Button>
        </>
      }
    >
      {tab === "thang" && <PayrollView onOpen={(ma) => setDetail({ kind: "pay", ma })} />}
      {tab === "sp" && <SpView per={per} setPer={setPer} onOpen={(i) => setDetail({ kind: "sp", i, per })} />}
      {tab === "mb" && <MbView />}
      {tab === "con" && <SubView />}
      <DetailSheet detail={detail} onChange={setDetail} />
    </AppFrame>
  );
}

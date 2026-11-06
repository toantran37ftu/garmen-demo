"use client";

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { HrTab, OrdersTab, ProductionTab, QualityTab, StockTab } from "@/components/features/theo-doi-van-hanh/other-tabs";
import { Overview } from "@/components/features/theo-doi-van-hanh/overview";
import { ScenarioDialog } from "@/components/features/theo-doi-van-hanh/scenario-dialog";

const TABS = [
  { id: "tq", label: "Tổng quan" },
  { id: "dh", label: "Đơn hàng" },
  { id: "sx", label: "Sản xuất" },
  { id: "kho", label: "Kho" },
  { id: "cl", label: "Chất lượng" },
  { id: "ns", label: "Nhân sự" },
];

export function TheoDoiVanHanhPage() {
  const [tab, setTab] = useState("tq");
  const [scope, setScope] = useState("all");
  const [scenario, setScenario] = useState<number | null>(null);

  return (
    <AppFrame
      slug="theo-doi-van-hanh"
      description="Công ty May Demo · cập nhật 07:15 hôm nay, 06/11/2026"
      nav="tabs"
      items={TABS}
      active={tab}
      onChange={setTab}
      actions={
        <div className="flex flex-wrap gap-2">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-56" aria-label="Phạm vi"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toàn nhà máy</SelectItem>
              <SelectItem value="x1">Xưởng 1 (Chuyền 01–08)</SelectItem>
              <SelectItem value="x2">Xưởng 2 (Chuyền 09–15)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast("Đang tạo báo cáo tuần…")}>⬇ Báo cáo tuần</Button>
        </div>
      }
    >
      {tab === "tq" && <Overview onOpen={setScenario} />}
      {tab === "dh" && <OrdersTab />}
      {tab === "sx" && <ProductionTab />}
      {tab === "kho" && <StockTab />}
      {tab === "cl" && <QualityTab />}
      {tab === "ns" && <HrTab />}
      <ScenarioDialog index={scenario} onIndexChange={setScenario} />
    </AppFrame>
  );
}

"use client";

import { Button, Card, CardAction, CardContent, CardHeader, CardTitle, Input, StatisticCard } from "@erp/miniapp-ui";
import { useState } from "react";
import { INSIGHTS, QA, QA_FALLBACK, SCENARIOS } from "@/data/theo-doi-van-hanh";
import {
  CustomerChart, DefectChart, EfficiencyChart, HiringChart, OrderProgressChart, OvertimeChart, ParetoChart, ProductionChart, RevenueChart, StockDaysChart,
} from "./charts";
import { RiskBadge, rich } from "./rich";

export function AiInsights({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle>✨ Mozy AI nhận định hôm nay</CardTitle>
        <CardAction className="text-muted-foreground">Tổng hợp lúc 07:15 từ 6 nguồn dữ liệu</CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {INSIGHTS.map(([i, lv, text]) => (
            <li key={i} className="flex items-start gap-3 border-b border-primary/15 px-4 py-3 leading-normal last:border-b-0 md:px-6">
              <span className={`mt-2 size-2.5 shrink-0 rounded-full ${lv === "cao" ? "bg-destructive" : "bg-warning"}`} aria-label={lv === "cao" ? "Rủi ro cao" : "Rủi ro trung bình"} />
              <div className="flex-1">{rich(text)}</div>
              <Button variant="link" className="h-auto shrink-0 p-0 font-semibold" onClick={() => onOpen(i)}>Xem →</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function QuickAsk() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const ask = (t: string) => {
    t = t.trim();
    if (!t) return;
    setQ(t);
    setAnswer(QA[t] ?? QA_FALLBACK);
  };
  return (
    <Card>
      <CardHeader><CardTitle>💬 Hỏi nhanh</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ câu hỏi bằng lời thường…" aria-label="Câu hỏi" className="min-w-0 flex-1" />
          <Button type="submit">Hỏi</Button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(QA).map((k) => (
            <Button key={k} variant="outline" size="sm" className="h-auto rounded-full py-1 text-left whitespace-normal" onClick={() => ask(k)}>{k}</Button>
          ))}
        </div>
        {answer && <div className="rounded-lg bg-muted px-3.5 py-3 leading-relaxed" aria-live="polite">{rich(answer)}</div>}
      </CardContent>
    </Card>
  );
}

const KPIS = [
  { label: "Đơn đúng tiến độ", value: "17/22", hint: <span className="text-warning">5 đơn có nguy cơ trễ</span> },
  { label: "Sản lượng hôm qua", value: "15.940", hint: <span className="text-destructive">▼ 4% so với kế hoạch 16.600</span> },
  { label: "Hiệu suất chuyền", value: "74,8%", hint: <span className="text-destructive">▼ 1,6 điểm so với tuần trước</span> },
  { label: "Tỷ lệ lỗi", value: "2,7%", hint: "Mục tiêu dưới 3%" },
  { label: "Lao động đi làm", value: "922/980", hint: "94,1% · 46 nghỉ phép" },
  { label: "Nguyên phụ liệu sắp thiếu", value: <span className="text-destructive">7</span>, hint: "Dưới 5 ngày sản xuất" },
];

export function DecisionCards({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quyết định cần chú ý hôm nay</CardTitle>
        <CardAction className="text-muted-foreground">Mỗi thẻ được suy ra từ chuỗi liên kết dữ liệu, không phải cảnh báo rời rạc</CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {SCENARIOS.map((s, i) => (
          <div key={s.t} className={`flex flex-col items-start gap-2 rounded-lg border border-l-4 p-3.5 ${s.lv === "cao" ? "border-l-destructive" : "border-l-warning"}`}>
            <RiskBadge lv={s.lv} />
            <h4 className="font-semibold leading-snug">{s.t}</h4>
            <p className="text-muted-foreground">{s.c}</p>
            <div className="text-base font-bold text-destructive">
              <small className="block font-normal text-muted-foreground">Ảnh hưởng ước tính</small>
              {s.m} ({s.n})
            </div>
            <Button variant="outline" className="mt-auto w-full" onClick={() => onOpen(i)}>Xem chi tiết &amp; phương án</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function Overview({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <AiInsights onOpen={onOpen} />
        <QuickAsk />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => <StatisticCard key={k.label} label={k.label} value={k.value} hint={k.hint} />)}
      </div>
      <DecisionCards onOpen={onOpen} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ProductionChart />
        <EfficiencyChart />
        <OvertimeChart />
        <DefectChart />
        <ParetoChart />
        <OrderProgressChart />
        <div className="flex min-w-0 flex-col gap-4">
          <CustomerChart />
          <StockDaysChart />
        </div>
        <HiringChart />
        <RevenueChart />
      </div>
      <p className="text-muted-foreground">ⓘ Số liệu lấy từ ERP đơn hàng, phần mềm kho, file Excel kế hoạch, máy chấm công và hệ thống đếm hàng trên 15 chuyền.</p>
    </div>
  );
}

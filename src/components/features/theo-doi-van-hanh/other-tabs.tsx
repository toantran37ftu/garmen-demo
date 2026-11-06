"use client";

import {
  Badge, Card, CardAction, CardContent, CardHeader, CardTitle, StatisticCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { DEPT_ATT, INSPECTIONS, LEVEL_LABEL, LINE_ROWS, ORDER_ROWS, STOCK_ROWS, TOP_DEFECTS, type Level } from "@/data/theo-doi-van-hanh";
import { fmt } from "@/lib/format";
import { AttendanceChart, DefectChart, EfficiencyChart, HiringChart, MeterBar, OvertimeChart, ParetoChart, StockDaysChart } from "./charts";

function LevelBadge({ level, children }: { level: Level | "info"; children: ReactNode }) {
  const cls = { ok: "border-success text-success", warn: "border-warning text-warning", bad: "", info: "border-primary text-primary" }[level];
  return level === "bad" ? <Badge variant="destructive">{children}</Badge> : <Badge variant="outline" className={cls}>{children}</Badge>;
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action && <CardAction className="text-muted-foreground">{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function OrdersTab() {
  return (
    <Section title="Tiến độ đơn hàng đang chạy" action="22 đơn · hiện 8 đơn cần chú ý và sắp giao">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Đơn</TableHead><TableHead>Khách hàng</TableHead><TableHead>Mã hàng</TableHead><TableHead numeric>Số lượng</TableHead>
            <TableHead>Đã xong</TableHead><TableHead>Ngày giao</TableHead><TableHead>Tình trạng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ORDER_ROWS.map(([po, c, sku, q, p, d, l]) => (
            <TableRow key={po}>
              <TableCell className="font-semibold">{po}</TableCell><TableCell>{c}</TableCell><TableCell>{sku}</TableCell>
              <TableCell numeric>{fmt(q)}</TableCell>
              <TableCell><div className="flex items-center gap-2"><div className="w-24"><MeterBar value={p} level={l} /></div>{p}%</div></TableCell>
              <TableCell>{d}</TableCell>
              <TableCell><LevelBadge level={l}>{LEVEL_LABEL[l]}</LevelBadge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

export function ProductionTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatisticCard label="Chuyền đang chạy" value="15/15" />
        <StatisticCard label="Chuyền chậm hơn kế hoạch" value={<span className="text-warning">4</span>} />
        <StatisticCard label="Giờ tăng ca tuần này" value="5.400" hint="▲ 12% so với tuần trước" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2"><EfficiencyChart /><OvertimeChart /></div>
      <Section title="Sản lượng theo chuyền hôm qua" action="Các chuyền cần chú ý">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chuyền</TableHead><TableHead>Mã hàng</TableHead><TableHead numeric>Kế hoạch</TableHead><TableHead numeric>Thực tế</TableHead>
              <TableHead>Đạt</TableHead><TableHead>Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LINE_ROWS.map(([line, sku, plan, act, note]) => {
              const p = Math.round((act / plan) * 100);
              return (
                <TableRow key={line}>
                  <TableCell>{line}</TableCell><TableCell>{sku}</TableCell><TableCell numeric>{fmt(plan)}</TableCell><TableCell numeric>{fmt(act)}</TableCell>
                  <TableCell><LevelBadge level={p >= 95 ? "ok" : p >= 85 ? "warn" : "bad"}>{p}%</LevelBadge></TableCell>
                  <TableCell className="text-muted-foreground">{note}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}

export function StockTab() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Nguyên phụ liệu cần theo dõi" action={<Badge variant="destructive">7 loại sắp thiếu</Badge>}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nguyên phụ liệu</TableHead><TableHead>Dùng cho đơn</TableHead><TableHead numeric>Tồn kho</TableHead><TableHead numeric>Đủ dùng</TableHead>
              <TableHead>Hàng về</TableHead><TableHead>Mức</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STOCK_ROWS.map(([n, po, qty, days, eta, ok]) => (
              <TableRow key={n}>
                <TableCell>{n}</TableCell><TableCell>{po}</TableCell><TableCell numeric>{qty}</TableCell><TableCell numeric>{days}</TableCell><TableCell>{eta}</TableCell>
                <TableCell><LevelBadge level={ok ? "ok" : "bad"}>{ok ? "Đủ" : "Sắp hết"}</LevelBadge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
      <StockDaysChart />
    </div>
  );
}

export function QualityTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2"><DefectChart /><ParetoChart /></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Lỗi hay gặp tuần này" action="Toàn nhà máy">
          <ul className="divide-y">
            {TOP_DEFECTS.map(([n, w, c, l]) => (
              <li key={n} className="flex items-center gap-3 py-2.5">
                <span className="flex-1">{n}</span>
                <div className="flex-1"><MeterBar value={w} level={l} /></div>
                <b className="w-12 text-right tabular-nums">{fmt(c)}</b>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Kiểm hàng của khách">
          <ul className="divide-y">
            {INSPECTIONS.map(([r, l, t, d]) => (
              <li key={t} className="flex items-center gap-3 py-2.5">
                <LevelBadge level={l}>{r}</LevelBadge>
                <span className="flex-1">{t}</span>
                <span className="text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

export function HrTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatisticCard label="Tổng lao động" value="980" hint="890 trực tiếp · 90 gián tiếp" />
        <StatisticCard label="Vắng không phép hôm nay" value={<span className="text-warning">12</span>} />
        <StatisticCard label="Nghỉ việc tháng 10" value={<span className="text-destructive">58</span>} hint="5,9% · tháng 9: 44 người" />
        <StatisticCard label="Đang tuyển" value="50" hint="Thợ may 40 · Cắt 6 · Hoàn thiện 4" />
      </div>
      <Section title="Đi làm theo bộ phận hôm nay">
        <ul>
          {DEPT_ATT.map(([n, v]) => (
            <li key={n} className="grid grid-cols-[86px_1fr_52px] items-center gap-2.5 py-1.5">
              <span>{n}</span>
              <MeterBar value={v} level={v >= 95 ? "ok" : v >= 90 ? "warn" : "bad"} />
              <b className="text-right tabular-nums">{v}%</b>
            </li>
          ))}
        </ul>
      </Section>
      <div className="grid gap-4 lg:grid-cols-2"><AttendanceChart /><HiringChart /></div>
    </div>
  );
}

"use client";

import {
  BarChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { LEAVE_REASONS, LINE_CHANGES, MONTHS } from "@/data/nhan-su";
import { ToneBadge } from "./ui";

const REASON_BAR = { bad: "bg-destructive", warn: "bg-warning" } as const;
const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

export function TurnoverReport() {
  const maxReason = LEAVE_REASONS[0].n;
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Tuyển mới và nghỉ việc — 12 tháng</CardTitle>
            <CardDescription>11/2025 → 10/2026</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              aria-label="Tuyển mới và nghỉ việc theo tháng"
              categories={MONTHS.map((m) => m.m)}
              series={[
                { name: "Tuyển mới", data: MONTHS.map((m) => m.hired), className: "bg-emerald-500" },
                { name: "Nghỉ việc", data: MONTHS.map((m) => m.left), className: "bg-red-500" },
              ]}
              height={180}
              showLegend
            />
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Nghỉ việc theo lý do</CardTitle>
            <CardDescription>12 tháng · 500 người</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {LEAVE_REASONS.map((r) => (
              <div key={r.reason} className="flex items-center gap-3">
                <div className="flex-[1.4]">{r.reason}</div>
                <Progress
                  value={(r.n / maxReason) * 100}
                  className="flex-1"
                  indicatorClassName={r.tone === "bad" || r.tone === "warn" ? REASON_BAR[r.tone] : undefined}
                  aria-label={`${r.reason}: ${r.n}`}
                />
                <b className="w-10 text-right tabular-nums">{r.n}</b>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Biến động theo chuyền — tháng 10</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chuyền</TableHead>
                <TableHead numeric>Đầu tháng</TableHead>
                <TableHead numeric>Tuyển mới</TableHead>
                <TableHead numeric>Nghỉ việc</TableHead>
                <TableHead numeric>Điều chuyển</TableHead>
                <TableHead numeric>Cuối tháng</TableHead>
                <TableHead>Tỉ lệ nghỉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LINE_CHANGES.map((r) => (
                <TableRow key={r.line}>
                  <TableCell className={r.total ? "font-semibold" : undefined}>{r.line}</TableCell>
                  <TableCell numeric>{r.start}</TableCell>
                  <TableCell numeric className="text-success">+{r.hired}</TableCell>
                  <TableCell numeric className="text-destructive">-{r.left}</TableCell>
                  <TableCell numeric>{signed(r.moved)}</TableCell>
                  <TableCell numeric className="font-semibold">{r.end}</TableCell>
                  <TableCell><ToneBadge tone={r.tone}>{r.rate}</ToneBadge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

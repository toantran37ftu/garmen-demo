"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { IO6, ZONES } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { KpiGrid, Note } from "./ui";

const FILL_BAR = { bad: "bg-destructive", warn: "bg-warning" } as const;

export function KhoOverview() {
  return (
    <>
      <KpiGrid
        items={[
          { label: "Tồn vải", value: "650.000 m", hint: "3.400 cuộn · 64 mã vải" },
          { label: "Phụ liệu", value: "1.400 mã", hint: "3.020 lô đang lưu" },
          { label: "Nhập hôm nay", value: "92 cuộn", hint: "6 phiếu · 9.727 m vải" },
          { label: "Xuất hôm nay", value: "104 cuộn", hint: "18 phiếu · 15 lệnh sản xuất" },
          { label: "Sắp thiếu", value: "6 mặt hàng", hint: "Ảnh hưởng 4 lệnh sản xuất", tone: "bad" },
          { label: "Tồn đọng > 90 ngày", value: "148 cuộn", hint: "24.800 m vải + 22 mã phụ liệu", tone: "warn" },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Tồn theo kho / khu / kệ</CardTitle>
            <CardDescription>Mức đầy so với sức chứa</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kho · khu</TableHead>
                  <TableHead>Dãy kệ</TableHead>
                  <TableHead numeric>Số cuộn</TableHead>
                  <TableHead numeric>Số mét</TableHead>
                  <TableHead className="min-w-40">Mức đầy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ZONES.map((z) => (
                  <TableRow key={z.name}>
                    <TableCell>
                      <div className="font-medium">{z.name}</div>
                      <div className="text-muted-foreground">{z.desc}</div>
                    </TableCell>
                    <TableCell>{z.racks}</TableCell>
                    <TableCell numeric fallback="—">{z.rolls != null ? fmt(z.rolls) : null}</TableCell>
                    <TableCell numeric className={z.rolls == null ? "text-muted-foreground" : undefined}>{z.meters}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={z.fill}
                          className="flex-1"
                          indicatorClassName={z.tone === "bad" || z.tone === "warn" ? FILL_BAR[z.tone] : undefined}
                        />
                        <span className="tabular-nums">{z.fill}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Tổng vải</TableCell>
                  <TableCell numeric>3.400</TableCell>
                  <TableCell numeric>650.000</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Nhập – xuất 6 ngày</CardTitle>
            <CardDescription>cuộn vải</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {IO6.map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <div className="w-20 shrink-0">{d.day}</div>
                <div className="flex flex-1 flex-col gap-1">
                  <Progress value={d.in / 1.2} indicatorClassName="bg-emerald-500" aria-label={`Nhập ${d.in}`} />
                  <Progress value={d.out / 1.2} indicatorClassName="bg-amber-500" aria-label={`Xuất ${d.out}`} />
                </div>
                <div className="w-14 text-right tabular-nums leading-tight">
                  <div className="text-success">+{d.in}</div>
                  <div className="text-warning">−{d.out}</div>
                </div>
              </div>
            ))}
            <Note>Xanh: nhập · Cam: xuất cho cắt. Xuất nhiều hơn nhập ~11 cuộn/ngày → tồn đang giảm dần.</Note>
          </CardContent>
        </Card>
      </div>
      <Note>Khu A sắp đầy — đề xuất chuyển 120 cuộn đã giữ cho đơn tháng 12 sang Khu C.</Note>
    </>
  );
}

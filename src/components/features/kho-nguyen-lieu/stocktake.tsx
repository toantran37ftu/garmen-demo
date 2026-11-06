"use client";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { toast } from "sonner";
import { COUNTS, DIFFS, STALE } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { ToneBadge } from "./ui";

export function KhoStocktake() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Phiếu kiểm kê</CardTitle>
            <CardAction>
              <Button size="sm" onClick={() => toast.success("Đã tạo đợt kiểm kê KK-2611-04")}>＋ Tạo đợt kiểm kê</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số phiếu</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Phạm vi</TableHead>
                  <TableHead numeric>Đã đếm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COUNTS.map((c) => (
                  <TableRow key={c.no}>
                    <TableCell className="font-medium">{c.no}</TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.scope}</TableCell>
                    <TableCell numeric>{c.counted}</TableCell>
                    <TableCell><ToneBadge tone={c.tone}>{c.status}</ToneBadge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Chênh lệch sổ sách – thực tế</CardTitle>
            <CardDescription>KK-2611-02</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mặt hàng</TableHead>
                  <TableHead numeric>Sổ sách</TableHead>
                  <TableHead numeric>Thực tế</TableHead>
                  <TableHead numeric>Chênh</TableHead>
                  <TableHead>Lý do</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DIFFS.map((d) => {
                  const diff = d.real - d.book;
                  return (
                    <TableRow key={d.item}>
                      <TableCell>{d.item}</TableCell>
                      <TableCell numeric>{fmt(d.book)}</TableCell>
                      <TableCell numeric>{fmt(d.real)}</TableCell>
                      <TableCell numeric className={diff < 0 ? "text-destructive" : "text-success"}>
                        {diff > 0 ? "+" : ""}{fmt(diff)}
                      </TableCell>
                      <TableCell>{d.reason}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Tồn đọng trên 90 ngày</CardTitle>
          <CardDescription>148 cuộn · 24.800 m · 22 mã phụ liệu · ≈ 1,1 tỷ đ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hàng</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead numeric>Tồn</TableHead>
                <TableHead numeric>Số ngày</TableHead>
                <TableHead numeric>Giá trị (đ)</TableHead>
                <TableHead>Gợi ý</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STALE.map((s) => (
                <TableRow key={s.item}>
                  <TableCell>{s.item}</TableCell>
                  <TableCell>{s.loc}</TableCell>
                  <TableCell numeric>{s.qty}</TableCell>
                  <TableCell numeric className={s.days > 150 ? "text-destructive" : "text-warning"}>{s.days}</TableCell>
                  <TableCell numeric>{fmt(s.value)}</TableCell>
                  <TableCell><ToneBadge tone={s.tone}>{s.hint}</ToneBadge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

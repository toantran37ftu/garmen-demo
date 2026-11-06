"use client";

import {
  Button,
  Card,
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
import { useState } from "react";
import { toast } from "sonner";
import { NEEDS, needOf, shortOf } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { KpiGrid, Note, ToneBadge } from "./ui";

export function KhoNeeds() {
  const [requested, setRequested] = useState<Set<number>>(new Set());

  const request = (i: number) => {
    const n = NEEDS[i];
    const qty = Math.ceil(shortOf(n) * 1.03); // thiếu + 3% hao hụt
    setRequested((s) => new Set(s).add(i));
    toast.success(`Đã tạo đề nghị mua ${fmt(qty)} ${n.unit} ${n.item}`, { description: `${n.lsx} · gửi phòng mua hàng` });
  };

  return (
    <>
      <KpiGrid
        items={[
          { label: "Lệnh sản xuất đang mở", value: "68", hint: "thuộc 22 đơn hàng" },
          { label: "Đủ nguyên liệu", value: "64", tone: "ok" },
          { label: "Thiếu nguyên liệu", value: "4 lệnh", hint: "6 mặt hàng", tone: "bad" },
          { label: "Đang về (đã đặt mua)", value: "8 PO", hint: "hẹn về trong 10 ngày" },
        ]}
      />
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Nhu cầu theo lệnh sản xuất</CardTitle>
          <CardDescription>Nhu cầu = định mức × số sản phẩm · Thiếu = nhu cầu − đã cấp − tồn khả dụng − đang về</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lệnh SX</TableHead>
                <TableHead>Đơn · mã hàng</TableHead>
                <TableHead numeric>Số SP</TableHead>
                <TableHead>Mặt hàng</TableHead>
                <TableHead numeric>Định mức /SP</TableHead>
                <TableHead numeric>Nhu cầu</TableHead>
                <TableHead numeric>Đã cấp</TableHead>
                <TableHead numeric>Tồn khả dụng</TableHead>
                <TableHead numeric>Đang về</TableHead>
                <TableHead numeric>Thiếu</TableHead>
                <TableHead>Vào chuyền</TableHead>
                <TableHead><span className="sr-only">Thao tác</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NEEDS.map((n, i) => {
                const short = shortOf(n);
                return (
                  <TableRow key={`${n.lsx}-${n.item}`} state={short ? "error" : undefined}>
                    <TableCell className="font-medium">{n.lsx}</TableCell>
                    <TableCell>{n.order}</TableCell>
                    <TableCell numeric>{fmt(n.qty)}</TableCell>
                    <TableCell>{n.item}</TableCell>
                    <TableCell numeric>{fmt(n.norm, n.norm % 1 ? 2 : 0)} {n.unit}</TableCell>
                    <TableCell numeric>{fmt(needOf(n))}</TableCell>
                    <TableCell numeric>{fmt(n.issued)}</TableCell>
                    <TableCell numeric>{fmt(n.free)}</TableCell>
                    <TableCell numeric>{fmt(n.incoming)}</TableCell>
                    <TableCell numeric className={short ? "font-semibold text-destructive" : "text-muted-foreground"}>
                      {short ? `${fmt(short)} ${n.unit}` : "0"}
                    </TableCell>
                    <TableCell>{n.line}</TableCell>
                    <TableCell>
                      {short ? (
                        requested.has(i) ? (
                          <ToneBadge tone="info">Đã gửi đề nghị</ToneBadge>
                        ) : (
                          <Button size="sm" onClick={() => request(i)}>Đề nghị mua</Button>
                        )
                      ) : n.incoming ? (
                        <ToneBadge tone="info">Đủ khi hàng về</ToneBadge>
                      ) : (
                        <ToneBadge tone="ok">Đủ</ToneBadge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Note>&quot;Đề nghị mua&quot; tạo sẵn phiếu đề nghị gửi phòng mua hàng, kèm số lượng thiếu + 3% hao hụt.</Note>
    </>
  );
}

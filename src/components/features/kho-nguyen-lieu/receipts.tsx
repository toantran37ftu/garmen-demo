"use client";

import {
  Card,
  CardContent,
  CardHeader,
  SearchField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { RECEIPTS, STATUS_TONE } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { FilterSelect, KpiGrid, Note, ToneBadge } from "./ui";

const ALL = "Tất cả trạng thái kiểm";

export function KhoReceipts({ onOpen }: { onOpen: (i: number) => void }) {
  const [period, setPeriod] = useState("7 ngày gần nhất");
  const [status, setStatus] = useState(ALL);
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const rows = RECEIPTS.map((p, i) => ({ p, i })).filter(
    ({ p }) =>
      (period !== "Hôm nay" || p.date === "06/11") &&
      (status === ALL || p.status === status) &&
      (!needle || [p.no, p.po, p.supplier].some((s) => s.toLowerCase().includes(needle))),
  );

  return (
    <>
      <KpiGrid
        items={[
          { label: "Phiếu nhập hôm nay", value: "6", hint: "92 cuộn + 9 lô phụ liệu" },
          { label: "Chờ kiểm vải", value: "160 cuộn", hint: "QA kiểm ~95 cuộn/ngày", tone: "warn" },
          { label: "Thiếu so với chứng từ", value: "-0,6%", hint: "Bình quân tháng 11" },
          { label: "Lỗi – trả NCC tháng này", value: "24 cuộn", hint: "2 phiếu · 2 nhà cung cấp", tone: "bad" },
        ]}
      />
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Thời gian" options={["7 ngày gần nhất", "Hôm nay"]} value={period} onChange={setPeriod} />
          <FilterSelect label="Trạng thái kiểm" options={[ALL, "Chờ kiểm vải", "Đạt", "Lỗi – trả NCC"]} value={status} onChange={setStatus} />
          <SearchField
            className="ml-auto w-full sm:w-72"
            placeholder="Tìm số phiếu, PO, nhà cung cấp…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số phiếu</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>PO mua</TableHead>
                <TableHead>Cho đơn hàng</TableHead>
                <TableHead>Mặt hàng</TableHead>
                <TableHead numeric>Cuộn / lô</TableHead>
                <TableHead numeric>Theo chứng từ</TableHead>
                <TableHead numeric>Thực nhận</TableHead>
                <TableHead numeric>Chênh lệch</TableHead>
                <TableHead>Kiểm</TableHead>
                <TableHead>Vị trí cất</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ p, i }) => {
                const d = p.actual - p.doc;
                return (
                  <TableRow key={p.no} className="cursor-pointer" onClick={() => onOpen(i)}>
                    <TableCell className="font-medium">{p.no}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.supplier}</TableCell>
                    <TableCell>{p.po}</TableCell>
                    <TableCell>{p.order}</TableCell>
                    <TableCell>{p.item}</TableCell>
                    <TableCell numeric>{p.fabric ? `${p.count} cuộn` : `${p.count} lô`}</TableCell>
                    <TableCell numeric>{fmt(p.doc)} {p.unit}</TableCell>
                    <TableCell numeric>{fmt(p.actual)} {p.unit}</TableCell>
                    <TableCell numeric className={d < 0 ? "text-destructive" : "text-muted-foreground"}>{d ? fmt(d) : "0"}</TableCell>
                    <TableCell><ToneBadge tone={STATUS_TONE[p.status]}>{p.status}</ToneBadge></TableCell>
                    <TableCell>{p.loc}</TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="py-6 text-center text-muted-foreground">Không có phiếu phù hợp.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Note>Bấm một phiếu để xem danh sách từng cuộn (packing list): lô nhuộm, khổ, mét trên tem và mét đo thực tế.</Note>
    </>
  );
}

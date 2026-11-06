"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SearchField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { FABRIC_FILTER, ROLLS, TRIMS } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { FilterSelect, ToneBadge } from "./ui";

const ALL_WH = "Tất cả kho";
const ALL_FAB = "Tất cả mã vải";
const ALL_HELD = "Giữ cho: tất cả";

export function KhoStock() {
  const [wh, setWh] = useState(ALL_WH);
  const [fab, setFab] = useState(ALL_FAB);
  const [held, setHeld] = useState(ALL_HELD);
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const rolls = ROLLS.filter(
    (r) =>
      (wh === ALL_WH || r.wh === wh) &&
      (fab === ALL_FAB || r.fabric.startsWith(FABRIC_FILTER[fab])) &&
      (held === ALL_HELD || r.held.startsWith("Tự do")) &&
      (!needle || r.id.toLowerCase().includes(needle)),
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Kho" options={[ALL_WH, "Kho vải 1", "Kho vải 2"]} value={wh} onChange={setWh} />
        <FilterSelect label="Mã vải" options={[ALL_FAB, ...Object.keys(FABRIC_FILTER)]} value={fab} onChange={setFab} />
        <FilterSelect label="Giữ cho" options={[ALL_HELD, "Chưa giữ (tự do)"]} value={held} onChange={setHeld} />
        <SearchField className="ml-auto w-full sm:w-72" placeholder="Quét / nhập mã cuộn…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Vải — theo cuộn</CardTitle>
          <CardDescription>3.400 cuộn · 650.000 m · 2.480 cuộn đã giữ cho đơn</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã cuộn</TableHead>
                <TableHead>Mã vải</TableHead>
                <TableHead>Màu</TableHead>
                <TableHead>Lô nhuộm</TableHead>
                <TableHead numeric>Khổ</TableHead>
                <TableHead numeric>Mét còn</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Ngày nhập</TableHead>
                <TableHead>Đã giữ cho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolls.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.fabric}</TableCell>
                  <TableCell>{r.color}</TableCell>
                  <TableCell>{r.lot}</TableCell>
                  <TableCell numeric>{r.width} cm</TableCell>
                  <TableCell numeric>{fmt(r.meters)} m</TableCell>
                  <TableCell>{r.loc}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    {r.held.startsWith("Tự do") ? (
                      <ToneBadge tone={r.held.includes("đọng") ? "warn" : "gray"}>{r.held}</ToneBadge>
                    ) : (
                      r.held
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {rolls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-6 text-center text-muted-foreground">Không tìm thấy cuộn phù hợp.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Phụ liệu — theo lô</CardTitle>
          <CardDescription>1.400 mã · 3.020 lô</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã PL</TableHead>
                <TableHead>Phụ liệu</TableHead>
                <TableHead>Lô</TableHead>
                <TableHead numeric>Tồn</TableHead>
                <TableHead numeric>Đã giữ</TableHead>
                <TableHead numeric>Khả dụng</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Ngày nhập</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRIMS.map((t) => (
                <TableRow key={t.code}>
                  <TableCell className="text-muted-foreground">{t.code}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.lot}</TableCell>
                  <TableCell numeric>{t.stock}</TableCell>
                  <TableCell numeric>{t.held}</TableCell>
                  <TableCell numeric className={t.free === "0" ? "text-warning" : undefined}>{t.free}</TableCell>
                  <TableCell>{t.loc}</TableCell>
                  <TableCell>{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

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
import { DEPTS, deptMatch, ISSUES, RETURNS, STATUS_TONE } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { FilterSelect, KpiGrid, ToneBadge } from "./ui";

const ALL_DEPT = "Tất cả bộ phận";
const ALL_ST = "Tất cả trạng thái";

export function KhoIssues({ onOpen, done = {} }: { onOpen: (i: number) => void; done?: Record<string, number> }) {
  const [dept, setDept] = useState(ALL_DEPT);
  const [status, setStatus] = useState(ALL_ST);
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  // phiếu vừa soạn xong ở màn "Quét mã xuất kho"
  const rows = ISSUES.map((p, i) => ({ p: p.no in done ? { ...p, status: "Đã soạn", out: done[p.no] } : p, i })).filter(
    ({ p }) =>
      (dept === ALL_DEPT || deptMatch(p.dept, dept)) &&
      (status === ALL_ST || p.status === status) &&
      (!needle || [p.no, p.lsx].some((s) => s.toLowerCase().includes(needle))),
  );

  return (
    <>
      <KpiGrid
        items={[
          { label: "Phiếu xuất hôm nay", value: "18", hint: "104 cuộn · 15 lệnh sản xuất" },
          { label: "Chờ soạn", value: "4", hint: "Cần xong trước 16:00", tone: "warn" },
          { label: "Đã soạn, chờ giao", value: "3" },
          { label: "Đã giao", value: "11", tone: "ok" },
        ]}
      />
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Ngày" options={["Hôm nay 06/11"]} />
          <FilterSelect label="Bộ phận" options={[ALL_DEPT, ...DEPTS]} value={dept} onChange={setDept} />
          <FilterSelect label="Trạng thái" options={[ALL_ST, "Chờ soạn", "Đã soạn", "Đã giao"]} value={status} onChange={setStatus} />
          <SearchField
            className="ml-auto w-full sm:w-72"
            placeholder="Tìm số phiếu, lệnh sản xuất…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số phiếu</TableHead>
                <TableHead>Giờ</TableHead>
                <TableHead>Theo lệnh sản xuất</TableHead>
                <TableHead>Xuất cho</TableHead>
                <TableHead>Mặt hàng</TableHead>
                <TableHead numeric>Yêu cầu</TableHead>
                <TableHead numeric>Thực xuất</TableHead>
                <TableHead>Người nhận</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ p, i }) => (
                <TableRow key={p.no} className="cursor-pointer" onClick={() => onOpen(i)}>
                  <TableCell className="font-medium">{p.no}</TableCell>
                  <TableCell>{p.time}</TableCell>
                  <TableCell>
                    <div className="font-medium">{p.lsx}</div>
                    <div className="text-muted-foreground">{p.order}</div>
                  </TableCell>
                  <TableCell>{p.dept}</TableCell>
                  <TableCell>{p.item}</TableCell>
                  <TableCell numeric>{fmt(p.req)} {p.unit}</TableCell>
                  <TableCell numeric className={p.out && p.out < p.req ? "text-destructive" : undefined}>
                    {p.out ? `${fmt(p.out)} ${p.unit}` : "—"}
                  </TableCell>
                  <TableCell>{p.receiver}</TableCell>
                  <TableCell><ToneBadge tone={STATUS_TONE[p.status]}>{p.status}</ToneBadge></TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-6 text-center text-muted-foreground">Không có phiếu phù hợp.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Trả lại kho</CardTitle>
          <CardDescription>Hàng thừa từ cắt, chuyền — nhập lại để dùng tiếp</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số phiếu</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Từ bộ phận</TableHead>
                <TableHead>Lệnh sản xuất</TableHead>
                <TableHead>Mặt hàng</TableHead>
                <TableHead numeric>Số lượng</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead>Cất vào</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RETURNS.map((r) => (
                <TableRow key={r.no}>
                  <TableCell className="font-medium">{r.no}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.from}</TableCell>
                  <TableCell>{r.lsx}</TableCell>
                  <TableCell>{r.item}</TableCell>
                  <TableCell numeric>{r.qty}</TableCell>
                  <TableCell><ToneBadge tone={r.tone}>{r.cond}</ToneBadge></TableCell>
                  <TableCell>{r.loc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

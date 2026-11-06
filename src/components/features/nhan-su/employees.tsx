"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { type MouseEvent, useState } from "react";
import {
  contractTone,
  DEPT_OPTIONS,
  type Employee,
  EMPLOYEES,
  LINE_FILTERS,
  PAGE_SIZE,
  STATUS_TONE,
  TOTAL_STAFF,
} from "@/data/nhan-su";
import { FilterSelect, KpiGrid, Note, ToneBadge } from "./ui";

const ALL_DEPT = "Tất cả bộ phận";
const ALL_LINE = "Tất cả chuyền (01–15)";
const ALL_ST = "Tất cả trạng thái";

export function EmployeeList({ onOpen }: { onOpen: (e: Employee) => void }) {
  const [dept, setDept] = useState(ALL_DEPT);
  const [line, setLine] = useState(ALL_LINE);
  const [status, setStatus] = useState(ALL_ST);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const needle = q.trim().toLowerCase();
  const rows = EMPLOYEES.filter(
    (p) =>
      (dept === ALL_DEPT || p.dept === dept) &&
      (line === ALL_LINE || LINE_FILTERS[line](p.team)) &&
      (status === ALL_ST || p.status === status) &&
      (!needle || p.name.toLowerCase().includes(needle) || p.id.toLowerCase().includes(needle)),
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const cur = Math.min(page, pages - 1);
  const from = cur * PAGE_SIZE;
  const shown = rows.slice(from, from + PAGE_SIZE);
  const filter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(0);
  };
  const go = (p: number) => (e: MouseEvent) => {
    e.preventDefault();
    if (p >= 0 && p < pages) setPage(p);
  };

  return (
    <>
      <KpiGrid
        items={[
          { label: "Đang làm việc", value: "980", hint: "May 675 (15 chuyền) · Cắt 55 · Hoàn thiện 110 · QA 28 · Kho 22 · Gián tiếp 90" },
          { label: "Vào làm tháng này", value: "9", hint: "Nghỉ việc: 7 · tháng 10: +52 / −41", tone: "ok" },
          { label: "Hợp đồng hết hạn trong 30 ngày", value: "28", tone: "warn" },
          { label: "Hồ sơ thiếu giấy tờ", value: "15", hint: "Thiếu giấy khám sức khỏe, bằng cấp", tone: "bad" },
        ]}
      />
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Bộ phận" options={[ALL_DEPT, ...DEPT_OPTIONS]} value={dept} onChange={filter(setDept)} />
          <FilterSelect label="Chuyền" options={[ALL_LINE, ...Object.keys(LINE_FILTERS)]} value={line} onChange={filter(setLine)} />
          <FilterSelect label="Trạng thái" options={[ALL_ST, "Đang làm", "Thử việc", "Nghỉ thai sản"]} value={status} onChange={filter(setStatus)} />
          <SearchField
            className="ml-auto w-full sm:w-72"
            placeholder="Tìm theo tên, mã NV, số CCCD…"
            value={q}
            onChange={(e) => filter(setQ)(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã NV</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Bộ phận</TableHead>
                <TableHead>Chuyền / tổ</TableHead>
                <TableHead>Ngày vào</TableHead>
                <TableHead>Hợp đồng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => onOpen(p)}>
                  <TableCell className="text-muted-foreground">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.dept}</TableCell>
                  <TableCell>{p.team}</TableCell>
                  <TableCell>{p.joined}</TableCell>
                  <TableCell><ToneBadge tone={contractTone(p.contract)}>{p.contract}</ToneBadge></TableCell>
                  <TableCell><ToneBadge tone={STATUS_TONE[p.status]}>{p.status}</ToneBadge></TableCell>
                </TableRow>
              ))}
              {shown.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">Không có nhân viên phù hợp.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <Note>
          {rows.length
            ? `Đang hiển thị ${from + 1}–${Math.min(from + PAGE_SIZE, rows.length)} trong ${rows.length} hồ sơ mẫu / ${TOTAL_STAFF} nhân viên. Bấm vào một dòng để xem hồ sơ.`
            : `0 hồ sơ mẫu / ${TOTAL_STAFF} nhân viên.`}
        </Note>
        <Pagination className="mx-0 ml-auto w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={go(cur - 1)} aria-disabled={cur === 0} className={cur === 0 ? "pointer-events-none opacity-50" : undefined} />
            </PaginationItem>
            {Array.from({ length: pages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={i === cur} onClick={go(i)}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={go(cur + 1)} aria-disabled={cur === pages - 1} className={cur === pages - 1 ? "pointer-events-none opacity-50" : undefined} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

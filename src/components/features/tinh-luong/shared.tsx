"use client";

import {
  Badge,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erp/miniapp-ui";
import type { MouseEvent, RefObject } from "react";
import { f, PAGE_SIZE } from "@/data/tinh-luong";

const TONE: Record<string, string> = {
  "Đã chốt": "bg-success/15 text-success",
  "Đã vào lương": "bg-success/15 text-success",
  "Tạm tính": "bg-warning/15 text-warning",
  "Chờ duyệt": "bg-warning/15 text-warning",
  "Cần kiểm tra": "bg-destructive/10 text-destructive",
  "Trả về rà soát": "bg-destructive/10 text-destructive",
};
export function StatusBadge({ st }: { st: string }) {
  return <Badge variant="secondary" className={TONE[st]}>{st}</Badge>;
}

export const Dash = () => <span className="text-muted-foreground">–</span>;

/** Mua–bán CĐ có dấu: + xanh, − đỏ. */
export function MbAmount({ v }: { v: number }) {
  if (!v) return <Dash />;
  return v > 0 ? <span className="text-success">+{f(v)}</span> : <span className="text-destructive">{f(v)}</span>;
}

/** Select lọc: value "" = tất cả (Radix không cho item value rỗng nên dùng "__all"). */
export function FilterSelect({
  value,
  onChange,
  all,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  all?: string;
  options: { v: string; lab: string }[] | string[];
  label: string;
}) {
  const opts = options.map((o) => (typeof o === "string" ? { v: o, lab: o } : o));
  return (
    <Select value={value || "__all"} onValueChange={(v) => onChange(v === "__all" ? "" : v)}>
      <SelectTrigger aria-label={label} className="w-auto min-w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {all && <SelectItem value="__all">{all}</SelectItem>}
        {opts.map((o) => (
          <SelectItem key={o.v} value={o.v}>
            {o.lab}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Phân trang 50 dòng/trang: chỉ render trang đang xem. Trả về chỉ số trang đã kẹp. */
export const clampPage = (page: number, n: number) => Math.min(page, Math.max(0, Math.ceil(n / PAGE_SIZE) - 1));

export function Pager({
  n,
  page,
  onPage,
  scrollRef,
}: {
  n: number;
  page: number;
  onPage: (p: number) => void;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const last = Math.max(0, Math.ceil(n / PAGE_SIZE) - 1);
  const go = (q: number) => (e: MouseEvent) => {
    e.preventDefault();
    if (q < 0 || q > last || q === page) return;
    scrollRef?.current?.querySelectorAll("div").forEach((el) => (el.scrollTop = 0));
    onPage(q);
  };
  const off = (dis: boolean) => (dis ? { "aria-disabled": true, className: "pointer-events-none opacity-40" } : {});
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t px-4 py-2 text-sm text-muted-foreground">
      <span className="tabular-nums">
        {n ? f(page * PAGE_SIZE + 1) : 0}–{f(Math.min(n, (page + 1) * PAGE_SIZE))} / {f(n)}
      </span>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Trang đầu" onClick={go(0)} {...off(page === 0)}>«</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={go(page - 1)} {...off(page === 0)} />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 tabular-nums">Trang {page + 1} / {last + 1}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={go(page + 1)} {...off(page >= last)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Trang cuối" onClick={go(last)} {...off(page >= last)}>»</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

import {
  Button, Card, CardContent, Pagination, PaginationContent, PaginationItem, PaginationLink,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@erp/miniapp-ui";
import { Info } from "lucide-react";
import { useState } from "react";
import { countSt, type Status, TP } from "@/data/quan-ly-mau";
import { TechpackTable } from "./techpack-table";

type Filter = "all" | Status;
const CHIPS: [Filter, string, number][] = [
  ["all", "Tất cả", TP.length], ["ok", "Hoàn tất", countSt("ok")], ["run", "Đang xử lý", countSt("run")],
  ["wait", "Đang chờ", countSt("wait")], ["rev", "Cần xem", countSt("rev")],
];

/** Thư viện techpack: chip lọc trạng thái, bảng, phân trang. `q` = ô tìm trên đầu trang. */
export function Library({ q, onOpen }: { q: string; onOpen: (i: number) => void }) {
  const [filt, setFilt] = useState<Filter>("all");
  const [page, setPage] = useState(0);
  const [per, setPer] = useState(25);
  const needle = q.toLowerCase().trim();
  const list = TP.filter((t) => (filt === "all" || t.st === filt) && (t.code + " " + t.name).toLowerCase().includes(needle));
  const pages = Math.max(1, Math.ceil(list.length / per));
  const p = Math.min(page, pages - 1);
  const a = p * per, b = Math.min(list.length, a + per);
  const go = (n: number) => (e: React.MouseEvent) => { e.preventDefault(); setPage(n); };

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {CHIPS.map(([id, label, n]) => (
          <Button key={id} size="sm" className="rounded-full" variant={filt === id ? "default" : "outline"} onClick={() => { setFilt(id); setPage(0); }}>
            {label}<span className="opacity-70">{n}</span>
          </Button>
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-2">
          <TechpackTable rows={list.slice(a, b)} full onOpen={onOpen} />
          <div className="flex flex-wrap items-center gap-2.5 text-muted-foreground">
            <span>{list.length ? a + 1 : 0}–{b} / {list.length}</span>
            <span className="flex items-center gap-1.5">· Mỗi trang
              <Select value={String(per)} onValueChange={(v) => { setPer(+v); setPage(0); }}>
                <SelectTrigger size="sm" className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>{["25", "50", "100"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </span>
            <Pagination className="mx-0 ml-auto w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" size="sm" aria-disabled={p === 0} className={`w-auto px-2.5 ${p === 0 ? "pointer-events-none opacity-50" : ""}`} onClick={go(p - 1)}>‹ Trước</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" size="sm" aria-disabled={p >= pages - 1} className={`w-auto px-2.5 ${p >= pages - 1 ? "pointer-events-none opacity-50" : ""}`} onClick={go(p + 1)}>Sau ›</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      <p className="flex items-center gap-1.5 text-muted-foreground">
        <Info className="size-4" /> Thời gian = thời gian AI đọc PDF và bóc tách bảng vật tư, bảng size.
      </p>
    </>
  );
}

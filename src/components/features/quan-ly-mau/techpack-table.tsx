import { Badge, Button, Spinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@erp/miniapp-ui";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CUS, ST, type Status, TP, type Techpack } from "@/data/quan-ly-mau";
import { FlatSketch } from "./flat-sketch";

export function CustomerChip({ cu, codeOnly }: { cu: number; codeOnly?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant="outline" className="px-1.5 font-bold">{CUS[cu][0]}</Badge>
      {!codeOnly && CUS[cu][1]}
    </span>
  );
}

const ST_CLASS: Record<Status, string> = {
  ok: "bg-success/10 text-success border-transparent",
  run: "bg-warning/10 text-warning border-transparent",
  wait: "",
  rev: "bg-destructive/10 text-destructive border-transparent",
};
export function StatusBadge({ st }: { st: Status }) {
  return (
    <Badge variant={st === "wait" ? "secondary" : "outline"} className={ST_CLASS[st]}>
      {st === "run" ? <Spinner className="size-3" /> : "●"} {ST[st]}
    </Badge>
  );
}

export function NameCell({ t }: { t: Techpack }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-[38px] w-[34px] shrink-0 rounded-sm border bg-white p-px" title="Hình phẳng mặt trước">
        <FlatSketch k={t.k} side="front" thumb />
      </span>
      <div>
        <div className="font-semibold">{t.code} · {t.name}</div>
        <div className="text-muted-foreground">{CUS[t.cu][1]} · SS27 · {t.files} file</div>
      </div>
    </div>
  );
}

/** Bảng techpack: rút gọn (Tổng quan) hoặc đầy đủ (Thư viện, `full`). */
export function TechpackTable({ rows, full, onOpen }: { rows: Techpack[]; full?: boolean; onOpen: (i: number) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead numeric>Dòng</TableHead>
          {full && <TableHead numeric>Hình</TableHead>}
          <TableHead numeric>Phối màu</TableHead>
          {full && <TableHead>Thời gian</TableHead>}
          <TableHead>Ngày</TableHead>
          {full && <TableHead>Thao tác</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((t) => (
          <TableRow key={t.code + t.date} className="cursor-pointer" onClick={() => onOpen(TP.indexOf(t))}>
            <TableCell><NameCell t={t} /></TableCell>
            <TableCell><CustomerChip cu={t.cu} /></TableCell>
            <TableCell><StatusBadge st={t.st} /></TableCell>
            <TableCell numeric fallback="—">{t.rows}</TableCell>
            {full && <TableCell numeric fallback="—">{t.img}</TableCell>}
            <TableCell numeric fallback="—">{t.cw}</TableCell>
            {full && (
              <TableCell fallback="—">
                {t.st === "run" ? <span className="text-warning">Đang đọc trang 9/16…</span> : t.time}
              </TableCell>
            )}
            <TableCell className="tabular-nums">{t.date}</TableCell>
            {full && (
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1">
                  <Button size="icon-sm" variant="outline" aria-label="Tải xuống" title="Tải xuống" onClick={() => toast(`Đang tải ${t.code}…`)}><Download /></Button>
                  <Button size="icon-sm" variant="outline" aria-label="Xóa" title="Xóa" onClick={() => toast(`Đã chuyển ${t.code} vào thùng rác`)}><Trash2 /></Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-muted-foreground">Không có techpack nào.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

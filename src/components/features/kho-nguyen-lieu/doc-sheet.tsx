"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { ISSUES, RECEIPTS, STATUS_TONE } from "@/data/kho-nguyen-lieu";
import { fmt } from "@/lib/format";
import { InfoRows, Note, ToneBadge } from "./ui";

export type DocRef = { kind: "pn" | "px"; i: number } | null;

const num = (n: number) => n.toLocaleString("vi-VN");

type View = {
  icon: string; title: string; sub: string; status: string; info: [string, ReactNode][];
  linesTitle: string; head: string[]; lines: ReactNode[][]; note: string; action: string;
};

function receiptView(i: number): View {
  const p = RECEIPTS[i];
  const v = p.fabric;
  const d = p.actual - p.doc;
  const defect = p.status === "Lỗi – trả NCC";
  const info: [string, ReactNode][] = [
    ["Nhà cung cấp", p.supplier], ["PO mua", p.po], ["Cho đơn hàng", p.order], ["Mặt hàng", p.item],
    ["Theo chứng từ", `${fmt(p.doc)} ${p.unit}`], ["Thực nhận", `${fmt(p.actual)} ${p.unit}`],
    ["Chênh lệch", `${d ? fmt(d) : "0"} ${p.unit} (${num(Math.round((d / p.doc) * 1000) / 10)}%)`],
    ["Vị trí cất", p.loc],
  ];
  let head: string[], lines: ReactNode[][], note: string;
  if (v) {
    head = ["Mã cuộn", "Lô nhuộm", "Shade", "Khổ", "Mét tem", "Mét đo"];
    lines = Array.from({ length: 8 }, (_, k) => {
      const tem = v.perRoll + (k % 3) - 1;
      const measured = tem - ((k * 7) % 4) / 2;
      return [
        `${v.code}-${p.no.slice(3)}-${String(k + 1).padStart(3, "0")}`,
        v.lots[k % v.lots.length],
        <span key="s" className="flex items-center gap-1.5">
          {k % v.lots.length ? "B" : "A"}
          {defect && k < 4 && <ToneBadge tone="bad">Loang màu</ToneBadge>}
        </span>,
        `${v.width} cm`,
        num(tem),
        num(measured),
      ];
    });
    lines.push([
      <span key="m" className="text-muted-foreground">… còn {p.count - 8} cuộn</span>, "", "", "",
      <b key="a">{fmt(p.doc)}</b>, <b key="b">{fmt(p.actual)}</b>,
    ]);
    note = defect
      ? "4 cuộn lô DL-3105 loang màu, lệch shade so với mẫu duyệt → lập biên bản trả nhà cung cấp."
      : "Mét đo bằng máy kiểm vải. Cuộn khác lô nhuộm/shade sẽ được cắt riêng bàn để tránh lệch màu.";
  } else {
    head = ["Lô", "Quy cách", "Đóng gói", "Theo CT", "Thực nhận"];
    lines = [[`L-${p.no.slice(3)}-01`, p.item, p.count > 1 ? `${p.count} pallet` : "1 pallet", fmt(p.doc), fmt(p.actual)]];
    note = "Phụ liệu đếm theo thùng, kiểm xác suất 10%.";
  }
  return {
    icon: "📥", title: `Phiếu nhập ${p.no}`, sub: `${p.date}/2026 · ${p.supplier}`, status: p.status, info,
    linesTitle: v ? "Packing list (từng cuộn)" : "Chi tiết lô", head, lines, note,
    action: p.status === "Chờ kiểm vải" ? "Chuyển QA kiểm vải" : defect ? "In biên bản trả hàng" : "",
  };
}

function issueView(i: number): View {
  const p = ISSUES[i];
  return {
    icon: "📤", title: `Phiếu xuất ${p.no}`, sub: `06/11/2026 · ${p.time}`, status: p.status,
    info: [
      ["Theo lệnh sản xuất", p.lsx], ["Đơn · mã hàng", p.order], ["Xuất cho", p.dept], ["Mặt hàng", p.item],
      ["Yêu cầu", `${fmt(p.req)} ${p.unit}`], ["Thực xuất", p.out ? `${fmt(p.out)} ${p.unit}` : "—"], ["Người nhận", p.receiver],
    ],
    linesTitle: "Chi tiết soạn hàng",
    head: ["Cuộn / lô", "Ghi chú", "Vị trí", "Số lượng"],
    lines: p.lines,
    note: p.unit === "m"
      ? "Xuất dư so với yêu cầu do giao nguyên cuộn; phần thừa sau cắt sẽ trả lại kho."
      : "Soạn theo lô nhập trước – xuất trước.",
    action: p.status === "Chờ soạn" ? "Bắt đầu soạn hàng" : p.status === "Đã soạn" ? "Xác nhận đã giao" : "",
  };
}

export function KhoDocSheet({ doc, onClose }: { doc: DocRef; onClose: () => void }) {
  const v = doc ? (doc.kind === "pn" ? receiptView(doc.i) : issueView(doc.i)) : null;
  return (
    <Sheet open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        {v && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <span aria-hidden>{v.icon}</span>
                {v.title}
              </SheetTitle>
              <SheetDescription>{v.sub}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              <div><ToneBadge tone={STATUS_TONE[v.status]}>{v.status}</ToneBadge></div>
              <InfoRows rows={v.info} />
              <h4 className="font-semibold">{v.linesTitle}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    {v.head.map((h, k) => <TableHead key={h} numeric={k > 2}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {v.lines.map((r, j) => (
                    <TableRow key={j}>
                      {r.map((c, k) => <TableCell key={k} numeric={k > 2}>{c}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Note>{v.note}</Note>
            </div>
            {v.action && (
              <SheetFooter>
                <Button
                  onClick={() => {
                    toast.success(`${v.action}: ${v.title}`);
                    onClose();
                  }}
                >
                  {v.action}
                </Button>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

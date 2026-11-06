"use client";

import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { DB, L, type Lay, lcM, lcSp, sum } from "@/data/trai-cat";
import { fmt } from "@/lib/format";
import { Chg, Lk, type Nav, Ratio, Tag } from "./shared";
import { RollNote, remTxt } from "./views";

const KV = ({ items }: { items: [string, ReactNode][] }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-x-4 gap-y-2.5">
    {items.map(([k, v]) => (
      <div key={k} className="text-muted-foreground">{k}<b className="mt-0.5 block text-foreground tabular-nums">{v}</b></div>
    ))}
  </div>
);
const Sec = ({ children }: { children: ReactNode }) => <div className="font-semibold uppercase text-muted-foreground">{children}</div>;

function LayBlock({ y }: { y: Lay }) {
  const head = (tone: Lay["st"][1], label: string) => (
    <h4 className="flex flex-wrap items-center gap-2 font-semibold">Phiếu trải {y.id} · {y.mau} <Tag tone={tone}>{label}</Tag></h4>
  );
  if (!y.tt)
    return (
      <div className="flex flex-col gap-3 rounded-xl border p-3.5">
        {head("gray", "Chờ trải")}
        <div className="text-muted-foreground">Kế hoạch {y.kh} lớp · chưa quét cuộn nào.</div>
      </div>
    );
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3.5">
      {head(y.st[1], y.st[0])}
      <KV
        items={[
          ["Lớp kế hoạch / thực tế", `${y.kh} / ${y.tt}`], ["Dài lớp", fmt(y.DL, 2) + " m"], ["Tổng chiều dài trải", fmt(y.dai, 1) + " m"],
          ["Người trải", y.ng], ["Bắt đầu – kết thúc", `${y.bd} – ${y.kt || "đang trải"}`], ["Hao hụt đầu bàn", fmt(y.dauban, 1) + " m"],
          ["Vải đầu tấm", fmt(y.dt, 1) + " m"], ["Đầu tấm dài trả kho", fmt(y.tra, 1) + " m"], ["Tổng mét tiêu thụ", fmt(y.tieu, 1) + " m"],
          ["Định mức", fmt(y.dm, 1) + " m"], ["Chênh lệch so định mức", <Chg key="c" y={y} />], ["Hao hụt", fmt(y.hh, 1) + "%"],
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã cuộn</TableHead><TableHead>Lô nhuộm · shade</TableHead><TableHead numeric>Mét tem</TableHead><TableHead numeric>Mét đo</TableHead>
            <TableHead numeric>Lớp</TableHead><TableHead numeric>Mét dùng</TableHead><TableHead numeric>Còn lại (m)</TableHead><TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {y.rolls.map((x) => (
            <TableRow key={x.ma}>
              <TableCell className="font-semibold">{x.ma}</TableCell><TableCell>{x.lot}</TableCell><TableCell numeric>{fmt(x.tem, 1)}</TableCell>
              <TableCell numeric className={x.tem - x.m >= 1 ? "text-destructive" : undefined}>{fmt(x.m, 1)}</TableCell>
              <TableCell numeric>{x.n}</TableCell><TableCell numeric>{fmt(x.m - x.rem, 1)}</TableCell><TableCell numeric>{remTxt(x)}</TableCell>
              <TableCell><RollNote x={x} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>{y.rolls.length} cuộn</TableCell>
            <TableCell numeric>{fmt(sum(y.rolls.map((x) => x.tem)), 1)}</TableCell><TableCell numeric>{fmt(sum(y.rolls.map((x) => x.m)), 1)}</TableCell>
            <TableCell numeric>{y.tt}</TableCell><TableCell numeric>{fmt(y.dai, 1)}</TableCell><TableCell colSpan={2} />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

/** Sheet phiếu cắt: thông tin lệnh cắt + chi tiết từng lần trải (hoặc 1 phiếu trải nếu có layId) */
export function CutSheet({ open, nav, onClose }: { open: { lc: number; lay?: string } | null; nav: Nav; onClose: () => void }) {
  const lc = open ? L[open.lc] : null;
  return (
    <Sheet open={!!open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[820px]">
        {lc && (
          <>
            <SheetHeader>
              <SheetTitle><span aria-hidden>✂️ </span>{open?.lay ? "Phiếu trải " + open.lay : "Lệnh cắt " + lc.id}</SheetTitle>
              <SheetDescription>{lc.O.po} · {lc.O.ma} · {lc.ban}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <Sec>Phiếu cắt</Sec>
              <KV
                items={[
                  ["Order (PO)", <Lk key="po" on={() => nav.goto("order", { o: lc.o })}>{lc.O.po}</Lk>], ["Khách hàng", lc.O.kh], ["Mã hàng", lc.O.ma],
                  ["Lệnh cắt số", lc.id], ["Ngày", "06/11/2026"], ["Bàn cắt", lc.ban], ["Sơ đồ", lc.O.sd[0]],
                  ["Chiều dài sơ đồ", fmt(lc.O.sd[1], 2) + " m"], ["Khổ vải", lc.O.sd[2] + " cm"], ["Hiệu suất sơ đồ", fmt(lc.O.sd[3], 1) + "%"],
                ]}
              />
              <div>Tỉ lệ size trên sơ đồ: <Ratio o={lc.O} /></div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Màu</TableHead><TableHead numeric>Số lớp</TableHead><TableHead numeric>SP/lớp</TableHead>
                    {lc.O.sz.map((s) => <TableHead key={s} numeric>{s}</TableHead>)}
                    <TableHead numeric>Tổng SP</TableHead><TableHead numeric>Mét vải cần</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lc.lays.map((y) => (
                    <TableRow key={y.id}>
                      <TableCell className="font-semibold">{y.mau}</TableCell><TableCell numeric>{y.kh}</TableCell><TableCell numeric>{lc.O.R}</TableCell>
                      {lc.O.r.map((r, i) => <TableCell key={i} numeric>{fmt(y.kh * r)}</TableCell>)}
                      <TableCell numeric className="font-semibold">{fmt(y.kh * lc.O.R)}</TableCell><TableCell numeric>{fmt(y.kh * lc.DL, 1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Tổng</TableCell><TableCell numeric>{sum(lc.lays.map((y) => y.kh))}</TableCell><TableCell />
                    {lc.O.r.map((r, i) => <TableCell key={i} numeric>{fmt(sum(lc.lays.map((y) => y.kh * r)))}</TableCell>)}
                    <TableCell numeric>{fmt(lcSp(lc))}</TableCell><TableCell numeric>{fmt(lcM(lc), 1)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <div className="rounded-lg bg-muted px-2.5 py-2 text-muted-foreground">
                Tổng SP size = số lớp × số sp size đó trên sơ đồ · Mét vải cần = số lớp × (dài sơ đồ {fmt(lc.O.sd[1], 2)} m + 2 đầu bàn {fmt(DB, 2)} m) = số lớp × {fmt(lc.DL, 2)} m
              </div>
              <Sec>Chi tiết trải</Sec>
              {(open?.lay ? lc.lays.filter((y) => y.id === open.lay) : lc.lays).map((y) => <LayBlock key={y.id} y={y} />)}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

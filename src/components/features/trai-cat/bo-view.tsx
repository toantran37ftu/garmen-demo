"use client";

import {
  Alert, AlertDescription, Card, CardContent, EmptyState, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  StatisticCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { FIN, L } from "@/data/trai-cat";
import { fmt } from "@/lib/format";
import { FRow, Lk, type Nav, Tag } from "./shared";

/** Bó hàng giao chuyền của 1 phiếu trải đã xong — tối đa 30 lớp/bó, mỗi xấp đánh số riêng */
export function BoView({ idx, onPick, nav }: { idx: number; onPick: (i: number) => void; nav: Nav }) {
  const F = nav.F;
  const opts = FIN.map((y, i) => ({ y, i })).filter(({ y }) => !F || y.lc.o === F.o);
  const y = FIN[idx];
  const empty = !!F && !opts.length;

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={String(idx)} onValueChange={(v) => onPick(+v)} disabled={empty}>
        <SelectTrigger className="w-96 max-w-full" aria-label="Phiếu trải đã xong"><SelectValue placeholder="—" /></SelectTrigger>
        <SelectContent>
          {opts.map(({ y, i }) => <SelectItem key={y.id} value={String(i)}>{y.id} · {y.o.ma} · {y.mau} · {y.tt} lớp</SelectItem>)}
        </SelectContent>
      </Select>
      {!empty && (
        <span>
          <Lk on={() => nav.goto("order", { o: y.lc.o })}>{y.o.po}</Lk> · <Lk on={() => nav.openLC(L.indexOf(y.lc), y.id)}>{y.lc.id}</Lk> · {y.lc.ban}
        </span>
      )}
      <span className="grow" />
      <Tag tone="info">Đánh số bó tự động · tối đa 30 lớp/bó</Tag>
    </div>
  );

  if (empty) {
    return (
      <>
        {toolbar}
        <Card><CardContent><EmptyState title="Chưa có phiếu trải xong cho đơn này — chưa đánh số bó." /></CardContent></Card>
      </>
    );
  }

  const o = y.o, rows: ReactNode[] = [];
  let no = 0;
  o.sz.forEach((s, si) => {
    for (let x = 1; x <= o.r[si]; x++)
      for (let a = 1; a <= y.tt; a += 30) {
        const b = Math.min(a + 29, y.tt);
        no++;
        const id = `B-${y.lc.id.slice(3)}${y.id.slice(-2).replace("/", "-")}-${String(no).padStart(3, "0")}`;
        rows.push(
          <FRow key={id} F={F} d={{ o: y.lc.o, m: [y.mau], sz: s, lc: y.lc.id }}>
            <TableCell className="font-semibold">{id}</TableCell><TableCell className="font-semibold">{s}</TableCell>
            <TableCell>Xấp {x}/{o.r[si]}</TableCell><TableCell className="tabular-nums">{a} – {b}</TableCell>
            <TableCell numeric>{b - a + 1}</TableCell><TableCell>{o.ch}</TableCell>
            <TableCell>
              {no <= 4 ? <Tag tone="ok">✓ Chuyền đã nhận</Tag> : no <= 8 ? <Tag tone="info">Đang giao</Tag> : <Tag tone="gray">Chờ giao</Tag>}
            </TableCell>
          </FRow>,
        );
      }
  });

  return (
    <>
      {toolbar}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <StatisticCard label="Tổng sp cắt" value={fmt(y.tt * o.R)} hint={`${y.tt} lớp × ${o.R} sp/lớp`} />
        {o.sz.map((s, si) => <StatisticCard key={s} label={`Size ${s}`} value={fmt(y.tt * o.r[si])} hint={`${o.r[si]} xấp × ${y.tt} lớp`} />)}
        <StatisticCard label="Số bó" value={no} hint={`Giao ${o.ch}`} />
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số bó</TableHead><TableHead>Size</TableHead><TableHead>Xấp</TableHead><TableHead>Lớp từ – đến</TableHead>
                <TableHead numeric>Số sp/bó</TableHead><TableHead>Giao chuyền</TableHead><TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{rows}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <Alert><AlertDescription>ⓘ Size có 2 sp trên 1 lớp sơ đồ cắt ra 2 xấp — mỗi xấp đánh số bó riêng.</AlertDescription></Alert>
    </>
  );
}

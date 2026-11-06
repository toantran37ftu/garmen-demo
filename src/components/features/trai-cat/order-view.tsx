"use client";

import {
  Alert, AlertDescription, Card, CardAction, CardContent, CardHeader, CardTitle, StatisticCard,
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import { Fragment } from "react";
import { FIN, L, LAYS, O, ROLLS, boCount, hhO, layNeed, need, sum } from "@/data/trai-cat";
import { fmt } from "@/lib/format";
import { Lk, type Nav, Prog, Ratio } from "./shared";

export function OrderView({ oi, onSelect, nav }: { oi: number; onSelect: (i: number) => void; nav: Nav }) {
  const o = O[oi];
  const G = (v: Parameters<Nav["goto"]>[0], x?: { mau?: string; sz?: string; lc?: string }) => () => nav.goto(v, { o: oi, ...x });
  const colT = o.sz.map((_, si) => sum(o.cells.map((r) => r[si])));
  const rel: [Parameters<Nav["goto"]>[0], string, number][] = [
    ["lenh", "lệnh cắt", L.filter((lc) => lc.o === oi).length],
    ["phieu", "phiếu trải", LAYS.filter((y) => y.o === o).length],
    ["cuon", "cuộn vải", ROLLS.filter((x) => x.y.o === o).length],
    ["bo", "bó hàng", sum(FIN.filter((y) => y.o === o).map(boCount))],
  ];
  const hh = hhO(o).hh;
  const totCan = sum(O.map((x) => x.can)), totDa = sum(O.map((x) => x.da));

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatisticCard label="Đơn đang cắt" value={O.length} hint="trong 22 đơn đang chạy · cắt cấp cho 15 chuyền" />
        <StatisticCard label="SP cần cắt (6 đơn)" value={fmt(totCan)} hint="Đã cộng % hao hụt cho phép" />
        <StatisticCard label="SP đã cắt" value={fmt(totDa)} hint={`${Math.round((totDa / totCan) * 100)}% số cần cắt`} />
        <StatisticCard
          label="Lệnh cắt hôm nay"
          value={L.length}
          hint={`${LAYS.length} lần trải trên ${new Set(L.map((lc) => lc.ban)).size} bàn · KH ${fmt(sum(LAYS.map((y) => y.kh * y.o.R)))} sp`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng chờ cắt</CardTitle>
          <CardAction className="text-muted-foreground">Bấm vào đơn để xem chi tiết màu × size</CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order (PO)</TableHead><TableHead>Khách hàng</TableHead><TableHead>Mã hàng</TableHead>
                <TableHead numeric>SL đặt</TableHead><TableHead numeric>Hao hụt cho phép</TableHead><TableHead numeric>SL cần cắt</TableHead>
                <TableHead numeric>Đã cắt</TableHead><TableHead>Tiến độ</TableHead><TableHead>Giao hàng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {O.map((x, j) => (
                <TableRow key={x.po} state={j === oi ? "selected" : undefined} className="cursor-pointer" onClick={() => onSelect(j)}>
                  <TableCell className="font-semibold">{x.po}</TableCell><TableCell>{x.kh}</TableCell><TableCell>{x.ma}</TableCell>
                  <TableCell numeric>{fmt(x.qty)}</TableCell><TableCell numeric>{fmt(x.hh, 1)}%</TableCell><TableCell numeric>{fmt(x.can)}</TableCell>
                  <TableCell numeric>{fmt(x.da)}</TableCell><TableCell><Prog a={x.da} b={x.can} /></TableCell><TableCell>{x.giao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tỉ lệ màu × size — {o.po} · {o.ma}</CardTitle>
          <CardAction><span className="text-muted-foreground">Sơ đồ {o.sd[0]} · </span><Ratio o={o} /></CardAction>
        </CardHeader>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b px-6 pb-3">
          <span className="text-muted-foreground">Liên quan:</span>
          {rel.map(([v, t, n]) => (
            <Fragment key={v}>
              {n ? <Lk on={G(v)}>{n} {t}</Lk> : <span className="text-muted-foreground">0 {t}</span>}
              <span className="text-muted-foreground">·</span>
            </Fragment>
          ))}
          {hh === null ? <span className="text-muted-foreground">hao hụt —</span> : <Lk on={G("hh")}>hao hụt {fmt(hh, 1)}%</Lk>}
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Màu \ Size</TableHead>
                {o.sz.map((s) => <TableHead key={s} numeric><Lk on={G("bo", { sz: s })}>{s}</Lk></TableHead>)}
                <TableHead numeric>Tổng đặt</TableHead><TableHead numeric>Cần cắt (+{fmt(o.hh, 1)}%)</TableHead><TableHead numeric>Lớp cần</TableHead>
                <TableHead numeric>Lớp đã cắt</TableHead><TableHead numeric>Lớp còn lại</TableHead><TableHead numeric>Lần trải còn (≤100 lớp)</TableHead>
                <TableHead>Lệnh cắt hôm nay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {o.c.map((c, ci) => {
                const lc = layNeed(o, ci), con = Math.max(0, lc - c.done), m = c.mau;
                const lcs = L.filter((x) => x.o === oi && x.lays.some((y) => y.mau === m));
                return (
                  <TableRow key={m}>
                    <TableCell><Lk on={G("phieu", { mau: m })}><b>{m}</b></Lk></TableCell>
                    {o.cells[ci].map((q, si) => <TableCell key={si} numeric><Lk on={G("bo", { mau: m, sz: o.sz[si] })}>{fmt(q)}</Lk></TableCell>)}
                    <TableCell numeric className="font-semibold">{fmt(sum(o.cells[ci]))}</TableCell>
                    <TableCell numeric>{fmt(sum(o.cells[ci].map((q) => need(o, q))))}</TableCell>
                    <TableCell numeric>{fmt(lc)}</TableCell>
                    <TableCell numeric><Lk on={G("phieu", { mau: m })}>{fmt(c.done)}</Lk></TableCell>
                    <TableCell numeric>{con ? <Lk on={G("lenh", { mau: m })}>{fmt(con)}</Lk> : <span className="text-success">✓ Đủ</span>}</TableCell>
                    <TableCell numeric>{Math.ceil(con / 100)}</TableCell>
                    <TableCell>
                      {lcs.length ? lcs.map((x, k) => (
                        <Fragment key={x.id}>{k > 0 && ", "}<Lk on={G("lenh", { mau: m, lc: x.id })}>{x.id}</Lk></Fragment>
                      )) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Tổng</TableCell>
                {colT.map((q, i) => <TableCell key={i} numeric>{fmt(q)}</TableCell>)}
                <TableCell numeric>{fmt(o.qty)}</TableCell><TableCell numeric>{fmt(o.can)}</TableCell><TableCell colSpan={5} />
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Tỉ lệ size</TableCell>
                {colT.map((q, i) => <TableCell key={i} numeric className="text-muted-foreground">{fmt((q / o.qty) * 100, 1)}%</TableCell>)}
                <TableCell colSpan={7} />
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết theo màu × size</CardTitle>
          <CardAction className="text-muted-foreground">Lớp cần = SL cần cắt ÷ số sp size đó trên 1 lớp sơ đồ</CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Màu</TableHead><TableHead>Size</TableHead><TableHead numeric>SL đặt</TableHead><TableHead numeric>Hao hụt cho phép</TableHead>
                <TableHead numeric>SL cần cắt</TableHead><TableHead numeric>Sp size này/lớp</TableHead><TableHead numeric>Lớp cần</TableHead>
                <TableHead numeric>Lớp đã cắt</TableHead><TableHead numeric>Lớp còn lại</TableHead><TableHead numeric>SP đã cắt</TableHead>
                <TableHead numeric>SP còn thiếu</TableHead><TableHead>Tiến độ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {o.c.flatMap((c, ci) =>
                o.sz.map((s, si) => {
                  const q = o.cells[ci][si], n = need(o, q), lc = Math.ceil(n / o.r[si]), dc = c.done * o.r[si], m = c.mau;
                  return (
                    <TableRow key={m + s}>
                      <TableCell>{si ? "" : <Lk on={G("phieu", { mau: m })}><b>{m}</b></Lk>}</TableCell>
                      <TableCell><Lk on={G("bo", { mau: m, sz: s })}><b>{s}</b></Lk></TableCell>
                      <TableCell numeric>{fmt(q)}</TableCell><TableCell numeric>+{fmt(n - q)}</TableCell><TableCell numeric>{fmt(n)}</TableCell>
                      <TableCell numeric>{o.r[si]}</TableCell><TableCell numeric>{fmt(lc)}</TableCell>
                      <TableCell numeric><Lk on={G("phieu", { mau: m })}>{fmt(c.done)}</Lk></TableCell>
                      <TableCell numeric>{lc > c.done ? <Lk on={G("lenh", { mau: m })}>{fmt(lc - c.done)}</Lk> : <span className="text-success">0</span>}</TableCell>
                      <TableCell numeric>{fmt(Math.min(dc, n))}</TableCell>
                      <TableCell numeric>{n > dc ? fmt(n - dc) : <span className="text-success">0</span>}</TableCell>
                      <TableCell><Prog a={dc} b={n} /></TableCell>
                    </TableRow>
                  );
                }),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Alert><AlertDescription>ⓘ Size có &quot;Lớp còn lại&quot; lớn hơn các size khác sẽ được bù bằng sơ đồ phụ ở lệnh cắt cuối.</AlertDescription></Alert>
    </>
  );
}

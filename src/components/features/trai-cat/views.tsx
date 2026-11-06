"use client";

import {
  Alert, AlertDescription, Card, CardAction, CardContent, CardHeader, CardTitle, Progress,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, StatisticCard,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { BAN, BSP, L, LAYS, O, ROLLS, type Roll, banName, hhO, lcM, lcSp, sum } from "@/data/trai-cat";
import { fmt } from "@/lib/format";
import { Chg, FRow, Lk, type Nav, Prog, Ratio, Tag } from "./shared";

export const RollNote = ({ x }: { x: Roll }) =>
  x.kind === "dang" ? <Tag tone="info">Đang trải</Tag> : x.ps ? <Tag tone="warn">＋ Phát sinh</Tag> : <Tag tone="gray">Theo kế hoạch</Tag>;
export const remTxt = (x: Roll) => (x.kind === "dang" ? "đang dùng" : x.kind === "tra" ? `${fmt(x.rem, 1)} · trả kho` : `${fmt(x.rem, 1)} · đầu tấm`);
const short = (x: Roll) => x.tem - x.m >= 1;

// ---------- LỆNH CẮT ----------
export function LenhView({ nav }: { nav: Nav }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lệnh cắt ngày 06/11/2026</CardTitle>
          <CardAction className="text-muted-foreground">Mỗi màu là 1 lần trải trên bàn</CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lệnh cắt</TableHead><TableHead>Order (PO)</TableHead><TableHead>Mã hàng</TableHead><TableHead>Bàn</TableHead>
                <TableHead>Sơ đồ</TableHead><TableHead numeric>Dài sơ đồ</TableHead><TableHead numeric>Khổ</TableHead><TableHead numeric>Hiệu suất</TableHead>
                <TableHead>Tỉ lệ size</TableHead><TableHead>Màu · lớp</TableHead><TableHead numeric>SP kế hoạch</TableHead><TableHead numeric>Mét vải cần</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {L.map((lc, i) => {
                const o = lc.O;
                return (
                  <FRow key={lc.id} F={nav.F} d={{ o: lc.o, m: lc.lays.map((y) => y.mau), lc: lc.id }} onClick={() => nav.openLC(i)}>
                    <TableCell className="font-semibold">{lc.id}</TableCell>
                    <TableCell><Lk on={() => nav.goto("order", { o: lc.o })}>{o.po}</Lk></TableCell>
                    <TableCell>{o.ma}</TableCell><TableCell>{lc.ban}</TableCell><TableCell>{o.sd[0]} <Lk on={() => nav.openSD(i)}>· Xem sơ đồ</Lk></TableCell>
                    <TableCell numeric>{fmt(o.sd[1], 2)} m</TableCell><TableCell numeric>{o.sd[2]} cm</TableCell><TableCell numeric>{fmt(o.sd[3], 1)}%</TableCell>
                    <TableCell><Ratio o={o} /></TableCell>
                    <TableCell>{lc.lays.map((y) => <div key={y.id}>{y.mau} · {y.kh}</div>)}</TableCell>
                    <TableCell numeric>{fmt(lcSp(lc))}</TableCell><TableCell numeric>{fmt(lcM(lc), 1)}</TableCell>
                  </FRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Alert><AlertDescription>ⓘ Bấm vào lệnh cắt để xem toàn bộ phiếu: thông tin sơ đồ, số sp từng size, mét vải và chi tiết từng lần trải.</AlertDescription></Alert>
    </>
  );
}

// ---------- PHIẾU TRẢI ----------
export function PhieuView({ nav }: { nav: Nav }) {
  const [ban, setBan] = useState("all");
  const [st, setSt] = useState("all");
  const ttAll = sum(LAYS.map((y) => y.tt)), khAll = sum(LAYS.map((y) => y.kh)), done = LAYS.filter((y) => y.tt);
  const hhAll = (sum(done.map((y) => y.dt + y.dauban)) / sum(done.map((y) => y.tieu))) * 100;
  const rows = LAYS.filter((y) => (ban === "all" || y.lc.ban === ban) && (st === "all" || y.st[0] === st));
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatisticCard
          label="Phiếu trải hôm nay"
          value={LAYS.length}
          hint={`${LAYS.filter((y) => y.st[0] === "Đã xong").length} xong · ${LAYS.filter((y) => y.st[0] === "Đang trải").length} đang trải · ${LAYS.filter((y) => !y.tt).length} chờ`}
        />
        <StatisticCard label="Lớp đã trải" value={`${fmt(ttAll)}/${fmt(khAll)}`} hint={`${Math.round((ttAll / khAll) * 100)}% kế hoạch ngày`} />
        <StatisticCard label="Cuộn phát sinh" value={ROLLS.filter((x) => x.ps).length} hint={`Lấy thêm ngoài kế hoạch / ${ROLLS.length} cuộn`} />
        <StatisticCard label="Hao hụt bình quân" value={`${fmt(hhAll, 1)}%`} hint="Đầu bàn + đầu tấm" />
      </div>
      <Card>
        <CardHeader className="flex flex-wrap items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-40" aria-label="Ngày"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="today">Hôm nay 06/11</SelectItem></SelectContent>
          </Select>
          <Select value={ban} onValueChange={setBan}>
            <SelectTrigger className="w-40" aria-label="Bàn cắt"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bàn cắt</SelectItem>
              {BAN.map((_, i) => <SelectItem key={i} value={banName(i)}>{banName(i)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={st} onValueChange={setSt}>
            <SelectTrigger className="w-44" aria-label="Trạng thái"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Đang trải">Đang trải</SelectItem>
              <SelectItem value="Đã xong">Đã xong</SelectItem>
            </SelectContent>
          </Select>
          <span className="grow" />
          <Tag tone="info">Số liệu về ngay khi công nhân bấm xác nhận</Tag>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phiếu trải</TableHead><TableHead>Bàn</TableHead><TableHead>Order · mã hàng · màu</TableHead><TableHead>Người trải</TableHead>
                <TableHead>Lớp thực tế / kế hoạch</TableHead><TableHead numeric>Dài lớp</TableHead><TableHead numeric>Tổng dài trải</TableHead>
                <TableHead numeric>Cuộn</TableHead><TableHead numeric>Tiêu thụ</TableHead><TableHead numeric>So định mức</TableHead>
                <TableHead>Giờ</TableHead><TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((y) => {
                const li = L.indexOf(y.lc), ps = y.rolls.filter((x) => x.ps).length;
                return (
                  <FRow key={y.id} F={nav.F} d={{ o: y.lc.o, m: [y.mau], lc: y.lc.id }} onClick={() => nav.openLC(li, y.id)}>
                    <TableCell className="font-semibold">{y.id}</TableCell>
                    <TableCell><Lk on={() => nav.openLC(li)}>{y.lc.ban}</Lk></TableCell>
                    <TableCell><Lk on={() => nav.goto("order", { o: y.lc.o })}>{y.o.po}</Lk> · {y.o.ma} · {y.mau}</TableCell>
                    <TableCell>{y.ng}</TableCell>
                    <TableCell><Prog a={y.tt} b={y.kh} label={`${y.tt}/${y.kh}`} /></TableCell>
                    <TableCell numeric>{fmt(y.DL, 2)} m</TableCell><TableCell numeric>{fmt(y.dai, 1)} m</TableCell>
                    <TableCell numeric>{y.rolls.length}{ps > 0 && <> <Tag tone="warn">+{ps} phát sinh</Tag></>}</TableCell>
                    <TableCell numeric>{y.tt ? fmt(y.tieu, 1) + " m" : "—"}</TableCell>
                    <TableCell numeric>{y.st[0] === "Đã xong" ? <Chg y={y} /> : "—"}</TableCell>
                    <TableCell>{y.bd ? `${y.bd} – ${y.kt || "…"}` : "—"}</TableCell>
                    <TableCell><Tag tone={y.st[1]}>{y.st[0]}</Tag></TableCell>
                  </FRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Alert><AlertDescription>ⓘ Bấm vào một phiếu để xem phiếu cắt đầy đủ và từng cuộn vải đã trải.</AlertDescription></Alert>
    </>
  );
}

// ---------- CUỘN VẢI ----------
export function CuonView({ nav }: { nav: Nav }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cuộn vải đã quét hôm nay</CardTitle>
        <CardAction className="text-muted-foreground">
          {ROLLS.length} cuộn · {ROLLS.filter((x) => x.ps).length} cuộn phát sinh · {ROLLS.filter(short).length} cuộn ngắn hơn tem ≥ 1 m
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã cuộn</TableHead><TableHead>Phiếu trải · bàn</TableHead><TableHead>Màu</TableHead><TableHead>Lô nhuộm · shade</TableHead>
              <TableHead numeric>Mét trên tem</TableHead><TableHead numeric>Mét đo thực</TableHead><TableHead numeric>Lớp trải</TableHead>
              <TableHead numeric>Mét dùng</TableHead><TableHead numeric>Còn lại</TableHead><TableHead>Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLLS.map((x) => {
              const li = L.indexOf(x.y.lc);
              return (
                <FRow key={x.ma} F={nav.F} d={{ o: x.y.lc.o, m: [x.y.mau], lc: x.y.lc.id }}>
                  <TableCell className="font-semibold">{x.ma}</TableCell>
                  <TableCell><Lk on={() => nav.openLC(li, x.y.id)}>{x.y.id}</Lk> · <Lk on={() => nav.openLC(li)}>{x.y.lc.ban}</Lk></TableCell>
                  <TableCell>{x.y.mau}</TableCell><TableCell>{x.lot}</TableCell>
                  <TableCell numeric>{fmt(x.tem, 1)}</TableCell>
                  <TableCell numeric className={short(x) ? "text-destructive" : undefined}>{fmt(x.m, 1)}</TableCell>
                  <TableCell numeric>{x.n}</TableCell><TableCell numeric>{fmt(x.m - x.rem, 1)}</TableCell><TableCell numeric>{remTxt(x)}</TableCell>
                  <TableCell>
                    <span className="flex flex-wrap gap-1"><RollNote x={x} />{short(x) && <Tag tone="bad">Ngắn hơn tem {fmt(x.tem - x.m, 1)} m</Tag>}</span>
                  </TableCell>
                </FRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ---------- HAO HỤT ----------
export function HaoHutView({ nav }: { nav: Nav }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hao hụt theo đơn hàng — hôm nay</CardTitle>
          <CardAction className="text-muted-foreground">Định mức = lớp × dài sơ đồ × 1,02</CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order · mã hàng</TableHead><TableHead numeric>Lớp trải</TableHead><TableHead numeric>Dài trải (m)</TableHead>
                <TableHead numeric>Đầu bàn (m)</TableHead><TableHead numeric>Đầu tấm (m)</TableHead><TableHead numeric>Trả kho (m)</TableHead>
                <TableHead numeric>Tiêu thụ (m)</TableHead><TableHead numeric>Định mức (m)</TableHead><TableHead numeric>Chênh lệch</TableHead><TableHead numeric>Hao hụt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {O.map((o, i) => {
                const { ys, g, hh } = hhO(o);
                if (!ys.length || hh === null) return null;
                const ch = g("ch");
                return (
                  <FRow key={o.po} F={nav.F} d={{ o: i }}>
                    <TableCell><Lk on={() => nav.goto("order", { o: i })}><b>{o.po}</b></Lk> · {o.ma}</TableCell>
                    <TableCell numeric>{fmt(g("tt"))}</TableCell><TableCell numeric>{fmt(g("dai"), 1)}</TableCell><TableCell numeric>{fmt(g("dauban"), 1)}</TableCell>
                    <TableCell numeric>{fmt(g("dt"), 1)}</TableCell><TableCell numeric>{fmt(g("tra"), 1)}</TableCell><TableCell numeric>{fmt(g("tieu"), 1)}</TableCell>
                    <TableCell numeric>{fmt(g("dm"), 1)}</TableCell>
                    <TableCell numeric className={ch > 0 ? "text-destructive" : "text-success"}>{ch > 0 ? "+" : ""}{fmt(ch, 1)}</TableCell>
                    <TableCell numeric className={hh > 2 ? "text-destructive" : "text-success"}>{fmt(hh, 1)}%</TableCell>
                  </FRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hao hụt theo bàn cắt — tuần 45</CardTitle>
          <CardAction className="text-muted-foreground">Mục tiêu ≤ 2,0%</CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {BAN.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">{banName(i)}</div>
              <Progress
                value={(b[5] / 3) * 100}
                className="flex-[2]"
                indicatorClassName={b[5] > 2.2 ? "bg-destructive" : b[5] > 2 ? "bg-warning" : "bg-success"}
              />
              <b className={`w-12 text-right tabular-nums ${b[5] > 2.2 ? "text-destructive" : ""}`}>{fmt(b[5], 1)}%</b>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

// ---------- NĂNG SUẤT ----------
export function NangSuatView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Năng suất bàn cắt — tuần 45</CardTitle>
        <CardAction className="text-muted-foreground">Tính tự động từ phiếu trải đã xác nhận</CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bàn</TableHead><TableHead>Tổ trưởng</TableHead><TableHead numeric>Phiếu xong</TableHead><TableHead numeric>Lớp trải</TableHead>
              <TableHead numeric>SP cắt</TableHead><TableHead numeric>Lớp/giờ</TableHead><TableHead numeric>Hao hụt</TableHead><TableHead>So với mục tiêu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BAN.map((b, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold">{banName(i)}</TableCell><TableCell>{b[0]}</TableCell><TableCell numeric>{b[1]}</TableCell>
                <TableCell numeric>{fmt(b[2])}</TableCell><TableCell numeric>{fmt(b[2] * BSP[i])}</TableCell><TableCell numeric>{b[3]}</TableCell>
                <TableCell numeric>{fmt(b[5], 1)}%</TableCell><TableCell><Tag tone={b[4] >= 95 ? "ok" : "warn"}>{b[4]}%</Tag></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-bold">
              <TableCell colSpan={2}>Tổng {BAN.length} bàn</TableCell>
              <TableCell numeric>{sum(BAN.map((b) => b[1]))}</TableCell>
              <TableCell numeric>{fmt(sum(BAN.map((b) => b[2])))}</TableCell>
              <TableCell numeric>{fmt(sum(BAN.map((b, i) => b[2] * BSP[i])))}</TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

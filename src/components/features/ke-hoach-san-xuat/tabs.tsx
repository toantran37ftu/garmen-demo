"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  SearchField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import {
  CAP,
  CUSTOMERS,
  curOnLine,
  DAILY,
  dt,
  f,
  HOURLY,
  ln,
  N,
  type Note,
  type Order,
  onLine,
  TODAY,
  WARNS,
  WORKERS,
} from "@/data/ke-hoach-san-xuat";

export const okBadge = "border-success/30 bg-success/10 text-success";
export const warnBadge = "border-warning/30 bg-warning/10 text-warning";
const bar = (cls: "ok" | "warn" | "bad" | "") =>
  cls === "ok" ? "bg-success" : cls === "warn" ? "bg-warning" : cls === "bad" ? "bg-destructive" : undefined;

function StaticSelect({ options, width = "w-56" }: { options: string[]; width?: string }) {
  return (
    <Select defaultValue={options[0]}>
      <SelectTrigger className={width}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
const LINE_OPTS = ["Cả 2 xưởng · 15 chuyền", "Xưởng 1 · Chuyền 01–08", "Xưởng 2 · Chuyền 09–15"];

function PctBar({ value, cls }: { value: number; cls: "ok" | "warn" | "bad" | "" }) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={Math.min(value, 100)} indicatorClassName={bar(cls)} className="flex-1" />
      <span className="w-11 text-right tabular-nums">{value}%</span>
    </div>
  );
}

// ---------- Năng lực chuyền ----------
export function CapacityTab({ orders }: { orders: Order[] }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <StaticSelect options={["Tuần 45 (02–08/11)"]} />
        <StaticSelect options={LINE_OPTS} />
        <span className="grow" />
        <Badge variant="secondary">Tính theo số công nhân × thời gian may chuẩn của mã hàng</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Năng lực từng chuyền</CardTitle>
          <CardAction className="text-muted-foreground">8 giờ/ngày · 6 ngày/tuần</CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chuyền</TableHead>
                <TableHead numeric>Công nhân</TableHead>
                <TableHead>Đơn đang may</TableHead>
                <TableHead numeric>Năng lực (SP/ngày)</TableHead>
                <TableHead numeric>Kế hoạch giao</TableHead>
                <TableHead>Mức sử dụng</TableHead>
                <TableHead>Khoảng trống</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WORKERS.map((w, i) => {
                const n = i + 1;
                const c = CAP[i];
                const p = Math.round((c[1] / c[0]) * 100);
                const cls = p > 100 ? "bad" : p >= 90 ? "ok" : "warn";
                const cu = curOnLine(orders, n);
                const e = cu.length ? Math.max(...cu.map((o) => o.se)) : TODAY;
                const nx = Math.min(...onLine(orders, n).filter((o) => o.ss >= e).map((o) => o.ss));
                const free = nx - e > 1 ? `${dt(e)} → ${nx < N ? dt(nx - 1) : "…"}` : null;
                return (
                  <TableRow key={n}>
                    <TableCell className="font-semibold">{ln(n)}</TableCell>
                    <TableCell numeric>{w}</TableCell>
                    <TableCell>{cu.map((o) => `${o.code} · ${o.po}`).join(", ") || "—"}</TableCell>
                    <TableCell numeric>{f(c[0])}</TableCell>
                    <TableCell numeric>{f(c[1])}</TableCell>
                    <TableCell className="min-w-40">
                      <PctBar value={p} cls={cls} />
                    </TableCell>
                    <TableCell>{free ? <Badge variant="secondary">{free}</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

// ---------- Lệnh sản xuất ----------
const nplBadge = (o: Order) =>
  o.nplDay <= TODAY ? (
    <Badge variant="outline" className={okBadge}>✓ Đủ</Badge>
  ) : o.nplDay > o.start ? (
    <Badge variant="destructive">⚠ Về {dt(o.nplDay)}</Badge>
  ) : (
    <Badge variant="secondary">Về {dt(o.nplDay)}</Badge>
  );

export function OrdersTab({ orders, onOpen }: { orders: Order[]; onOpen: (i: number) => void }) {
  const [xuong, setXuong] = useState("all");
  const [st, setSt] = useState("all");
  const [q, setQ] = useState("");
  const all = orders.flatMap((o) => o.lsx.map((l) => ({ o, l })));
  const rows = all.filter(({ o, l }) => {
    if (xuong !== "all" && (xuong === "1") !== l.line <= 8) return false;
    if (st === "sew" && !(o.ss <= TODAY && o.se > TODAY)) return false;
    if (st === "npl" && o.nplDay <= TODAY) return false;
    const s = q.trim().toLowerCase();
    return !s || [l.code, o.code, o.po].some((x) => x.toLowerCase().includes(s));
  });
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex w-full flex-wrap items-center gap-2">
            <Select value={xuong} onValueChange={setXuong}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả xưởng</SelectItem>
                <SelectItem value="1">Xưởng 1</SelectItem>
                <SelectItem value="2">Xưởng 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={st} onValueChange={setSt}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="sew">Đang may</SelectItem>
                <SelectItem value="npl">Chờ nguyên liệu</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">
              {all.length} lệnh của {orders.length} đơn
            </span>
            <span className="grow" />
            <SearchField className="w-64" placeholder="Tìm mã lệnh, mã hàng, PO…" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button>＋ Ra lệnh sản xuất</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã lệnh</TableHead>
                <TableHead>PO</TableHead>
                <TableHead>Mã hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Chuyền</TableHead>
                <TableHead numeric>Số lượng</TableHead>
                <TableHead>Nguyên liệu</TableHead>
                <TableHead>Đã may</TableHead>
                <TableHead>Ngày xuất</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ o, l }) => (
                <TableRow key={l.code} className="cursor-pointer" onClick={() => onOpen(o.i)}>
                  <TableCell className="font-semibold">{l.code}</TableCell>
                  <TableCell>{o.po}</TableCell>
                  <TableCell>{o.code}</TableCell>
                  <TableCell>{CUSTOMERS[o.cust]}</TableCell>
                  <TableCell>{ln(l.line)}</TableCell>
                  <TableCell numeric>{f(l.qty)}</TableCell>
                  <TableCell>{nplBadge(o)}</TableCell>
                  <TableCell className="min-w-36">
                    <PctBar value={l.pct} cls={l.pct >= 80 ? "ok" : ""} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {dt(o.ship, true)} {o.late > 0 && <Badge variant="destructive">trễ {o.late} ngày</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-muted-foreground">ⓘ Bấm vào một lệnh để xem chi tiết đơn hàng và tiến độ từng khâu.</p>
    </>
  );
}

// ---------- Tiến độ hằng ngày ----------
export function DailyTab({ orders }: { orders: Order[] }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <StaticSelect options={["Hôm nay – T6 06/11"]} />
        <StaticSelect options={LINE_OPTS} />
        <span className="grow" />
        <Badge variant="secondary">Sản lượng tự về từ chuyền · cập nhật 10:00</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thực tế so với kế hoạch — hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chuyền</TableHead>
                  <TableHead>Mã hàng · PO</TableHead>
                  <TableHead numeric>Kế hoạch</TableHead>
                  <TableHead numeric>Thực tế</TableHead>
                  <TableHead>Đạt</TableHead>
                  <TableHead numeric>Lệch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAILY.map(([n, plan, act]) => {
                  const p = Math.round((act / plan) * 100);
                  const cls = p >= 95 ? "ok" : p >= 85 ? "warn" : "bad";
                  const o = curOnLine(orders, n)[0];
                  const txt = cls === "ok" ? "text-success" : cls === "warn" ? "text-warning" : "text-destructive";
                  return (
                    <TableRow key={n}>
                      <TableCell>{ln(n)}</TableCell>
                      <TableCell>{o ? `${o.code} · ${o.po}` : "—"}</TableCell>
                      <TableCell numeric>{f(plan)}</TableCell>
                      <TableCell numeric className="font-semibold">{f(act)}</TableCell>
                      <TableCell className="min-w-24">
                        <Progress value={Math.min(p, 100)} indicatorClassName={bar(cls)} />
                      </TableCell>
                      <TableCell numeric className={txt}>
                        {act - plan > 0 ? "+" : ""}
                        {f(act - plan)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="self-start">
          <CardHeader>
            <CardTitle>Theo giờ — Chuyền 03 · VAY-XOE-1105</CardTitle>
            <CardAction className="text-muted-foreground">KH 125 SP/giờ</CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {HOURLY.map(([h, p, v]) => (
              <div key={h} className="flex items-center gap-3">
                <div className="flex-1">{h}</div>
                <Progress
                  value={p}
                  className="flex-[2]"
                  indicatorClassName={v == null ? undefined : bar(p >= 85 ? "ok" : p >= 75 ? "warn" : "bad")}
                />
                <b className={`w-16 text-right tabular-nums ${v == null ? "font-normal text-muted-foreground" : ""}`}>{v ?? "đang may"}</b>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// ---------- Cảnh báo trễ ----------
export function WarningsTab({
  orders,
  done,
  notes,
  onOpenWarn,
}: {
  orders: Order[];
  done: (number | null)[];
  notes: Note[];
  onOpenWarn: (k: number) => void;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Đơn có nguy cơ trễ</CardTitle>
          <CardAction className="text-muted-foreground">Cập nhật mỗi sáng từ sản lượng thực tế & lịch về NPL</CardAction>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          {WARNS.map((w, k) => {
            const o = orders[w.o];
            const d = done[k];
            return (
              <div key={o.po} className="flex items-start gap-3 py-3">
                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${d != null ? "bg-success" : "bg-destructive"}`} />
                <div className="min-w-0 flex-1">
                  <b>
                    PO {o.po} · {o.code} · {CUSTOMERS[o.cust]}
                  </b>
                  <div className="text-muted-foreground">
                    {w.why} → <b className="text-destructive">dự kiến trễ {o.late} ngày</b> (xuất {dt(o.ship)} → {dt(o.end)}) · {f(w.q)} sp
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {d != null ? (
                      <Badge variant="outline" className={okBadge}>✓ Đã áp dụng: {w.acts[d][0]}</Badge>
                    ) : (
                      w.acts.map((a) => (
                        <Badge key={a[0]} variant="secondary">{a[0]}</Badge>
                      ))
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={() => onOpenWarn(k)}>Xem chi tiết</Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Thông báo đã gửi khi đổi kế hoạch</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          {notes.map((n) => (
            <div key={n.meta + n.text} className="flex items-start gap-3 py-3">
              <Avatar>
                <AvatarFallback>{n.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <b>{n.who}</b> — {n.text}
                <div className="text-muted-foreground">{n.meta}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

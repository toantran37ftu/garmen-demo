"use client";

import {
  Badge,
  Card,
  CardContent,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erp/miniapp-ui";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ClipboardList,
  type LucideIcon,
  Package,
  PackageCheck,
  Ruler,
  ScanSearch,
  Scissors,
  Shirt,
  Ship,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CUSTOMERS, dt, f, type Order, TODAY } from "@/data/ke-hoach-san-xuat";

type Step = {
  title: string;
  icon: LucideIcon;
  who: string;
  time: string;
  from: number; // ngày bắt đầu thực tế / dự kiến
  plan: number; // ngày xong theo kế hoạch
  act: number; // ngày xong thực tế / dự kiến
  pct: number;
  nums: string[];
  app?: [string, string];
  note?: string;
};

const APP_MAU: [string, string] = ["/apps/quan-ly-mau/", "Quản lý mẫu"];
const APP_KHO: [string, string] = ["/apps/kho-nguyen-lieu/", "Kho nguyên liệu"];
const APP_CAT: [string, string] = ["/apps/trai-cat/", "Trải – cắt"];
const APP_VH: [string, string] = ["/apps/theo-doi-van-hanh/", "Theo dõi vận hành"];
const APP_KT: [string, string] = ["/apps/ke-toan/", "Kế toán"];

/** Dựng 9 bước hành trình từ dữ liệu đơn (tất định theo đơn). */
function steps(o: Order): Step[] {
  const [d0, , d2] = o.days;
  const [p0, p1, p2] = o.prog;
  const fab = o.npl[0][1];
  const lateNpl = o.npl.filter(([, d]) => d > o.start);
  const cut = o.start + o.w;
  const err = (1 + (o.i % 5) * 0.2).toFixed(1).replace(".", ",");
  const by = (d: number) => (d <= TODAY ? 100 : 0);
  return [
    { title: "Nhận đơn", icon: ClipboardList, who: "Phòng Kinh doanh · chị Hằng", time: "09:15", from: o.start - 35, plan: o.start - 35, act: o.start - 35, pct: 100,
      nums: [`${f(o.qty)} sp`, `$${f(o.qty * o.usd)}`, `${o.lsx.length} lệnh SX`], app: APP_KT },
    { title: "Mẫu duyệt", icon: Ruler, who: "Phòng Kỹ thuật · anh Tuấn", time: "15:40", from: o.start - 30, plan: o.start - 21, act: o.start - 21, pct: by(o.start - 21),
      nums: ["Mẫu PP lần 2", "Bảng size 6 cỡ", "Khách duyệt qua email"], app: APP_MAU },
    { title: "Vải về kho", icon: Package, who: "Kho NPL · chị Mai", time: "10:20", from: fab, plan: o.start - 2, act: fab, pct: by(fab),
      nums: [`${f(o.qty * 0.04133)} m vải`, `${o.npl.length} loại NPL`],
      note: lateNpl.length ? lateNpl.map(([n, d]) => `${n} về ${dt(d)} — sau ngày cắt ${d - o.start} ngày`).join(" · ") : undefined, app: APP_KHO },
    { title: "Kiểm vải", icon: ScanSearch, who: "QC kho · anh Phúc", time: "14:00", from: fab + 1, plan: o.start - 1, act: Math.max(fab + 1, cut - 1), pct: by(Math.max(fab + 1, cut - 1)),
      nums: ["Kiểm 10% số cuộn", `lỗi ${err}%`], app: APP_KHO },
    { title: "Trải cắt", icon: Scissors, who: `Tổ cắt · bàn ${(o.i % 8) + 1}`, time: "16:30", from: cut, plan: o.start + d0 - 1, act: cut + d0 - 1, pct: p0,
      nums: [`${f((o.qty * p0) / 100)}/${f(o.qty)} sp đã cắt`, `${o.lsx.length * 12} bó`], app: APP_CAT },
    { title: `May (Chuyền ${o.lines})`, icon: Shirt, who: `Xưởng ${+o.lines.slice(0, 2) <= 8 ? 1 : 2} · tổ trưởng chuyền`, time: "17:00", from: o.ss, plan: o.ship - d2 - 1, act: o.se - 1, pct: p1,
      nums: [`${f(o.done)} sp đã may`, `lỗi may ${err}%`], app: APP_VH },
    { title: "Hoàn thiện", icon: Sparkles, who: "Tổ hoàn thiện · KCS", time: "17:00", from: o.se, plan: o.ship - 1, act: o.end - 1, pct: p2,
      nums: ["Cắt chỉ · là · gắn thẻ bài", "KCS kiểm 100%"], app: APP_VH },
    { title: "Đóng gói", icon: PackageCheck, who: "Tổ đóng gói", time: "11:00", from: o.end - 1, plan: o.ship - 1, act: o.end - 1, pct: p2 === 100 ? 100 : 0,
      nums: [`${f(Math.ceil(o.qty / 24))} thùng`, "Kiểm AQL 2.5"], app: APP_VH },
    { title: "Xuất hàng", icon: Ship, who: "Phòng Xuất nhập khẩu", time: "08:00", from: Math.max(o.ship, o.end), plan: o.ship, act: Math.max(o.ship, o.end), pct: by(Math.max(o.ship, o.end)),
      nums: [`${Math.ceil(o.qty / 12000)} cont 40'`, "Cảng Cát Lái"], app: APP_KT },
  ];
}

export function JourneyTab({ orders, sel, onSel }: { orders: Order[]; sel: number; onSel: (i: number) => void }) {
  const o = orders[sel];
  const st = steps(o);
  const cur = st.findIndex((s) => s.pct < 100);
  const origin = st.findIndex((s) => s.act > s.plan || s.note);
  const fill = cur < 0 ? 100 : ((cur + st[cur].pct / 100) / (st.length - 1)) * 100;
  const [shown, setShown] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: chạy lại khi đổi đơn
  useEffect(() => {
    setShown(0);
    const t = setTimeout(() => setShown(fill), 150);
    return () => clearTimeout(t);
  }, [sel, fill]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={String(sel)} onValueChange={(v) => onSel(+v)}>
          <SelectTrigger className="w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {orders.map((x) => (
              <SelectItem key={x.po} value={String(x.i)}>
                {x.po} · {x.code} · {CUSTOMERS[x.cust].split(" (")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">Hôm nay {dt(TODAY, true)}</span>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
            <div className="grow">
              <div className="text-muted-foreground">{CUSTOMERS[o.cust]}</div>
              <div className="text-2xl font-bold">
                PO {o.po} · {o.code}
              </div>
              <div className="text-muted-foreground">
                {f(o.qty)} sp · Chuyền {o.lines} · đã làm {o.pct}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Ngày xuất kế hoạch</div>
              <div className="text-xl font-semibold">{dt(o.ship, true)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Dự kiến xuất</div>
              <div className={`text-xl font-semibold ${o.late ? "text-destructive" : "text-success"}`}>
                {dt(Math.max(o.ship, o.end), true)} {o.late ? `(trễ ${o.late} ngày)` : "✓"}
              </div>
            </div>
          </div>
          {/* tổng quan ngang */}
          <div className="relative px-4 pt-1 pb-8">
            <div className="absolute top-[22px] right-8 left-8 h-1.5 rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-[width] duration-[1500ms] ease-out ${o.late ? "bg-gradient-to-r from-success to-destructive" : "bg-success"}`}
                style={{ width: `${shown}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {st.map((s, k) => (
                <div key={s.title} className="flex w-0 flex-col items-center">
                  <Dot s={s} k={k} cur={cur} small />
                  <span className="mt-1.5 hidden text-center text-xs whitespace-nowrap text-muted-foreground lg:block">{s.title.split(" (")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <ol className="relative">
            <span className="absolute top-6 bottom-6 left-[23px] w-1 rounded-full bg-muted" aria-hidden />
            <span
              className={`absolute top-6 left-[23px] w-1 rounded-full transition-[height] duration-[1500ms] ease-out ${o.late ? "bg-gradient-to-b from-success to-destructive" : "bg-success"}`}
              style={{ height: `calc((100% - 48px) * ${shown / 100})` }}
              aria-hidden
            />
            {st.map((s, k) => {
              const done = s.pct === 100;
              const doing = !done && s.from <= TODAY;
              const late = s.act - s.plan;
              return (
                <li key={s.title} className="relative flex gap-4 pb-5 last:pb-0">
                  <Dot s={s} k={k} cur={cur} />
                  <div
                    className={`grow rounded-xl border p-3.5 transition-shadow ${k === cur ? "border-primary/50 shadow-md" : ""} ${
                      k === origin ? "border-destructive/50 bg-destructive/5" : ""
                    } ${!done && !doing ? "opacity-70" : ""}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <b className="text-base">{s.title}</b>
                      {done ? (
                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                          ✓ Xong
                        </Badge>
                      ) : doing ? (
                        <Badge variant={late > 0 ? "destructive" : "default"}>Đang làm {s.pct}%</Badge>
                      ) : (
                        <Badge variant="secondary">Chưa tới</Badge>
                      )}
                      {late > 0 && !done && <Badge variant="destructive">Trễ {late} ngày</Badge>}
                      <span className="grow" />
                      {s.app && (
                        <Link href={s.app[0]} className="flex items-center gap-1 text-primary hover:underline">
                          Mở app {s.app[1]} <ArrowUpRight className="size-4" />
                        </Link>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground">
                      <span>
                        KH {dt(s.plan)} · {done ? "Xong" : "Dự kiến"}{" "}
                        <b className={late > 0 ? "text-destructive" : "text-foreground"}>
                          {dt(s.act)}
                          {done && ` ${s.time}`}
                        </b>
                        {late > 0 && <span className="text-destructive"> (+{late} ngày)</span>}
                      </span>
                      <span>👤 {s.who}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.nums.map((n) => (
                        <span key={n} className="rounded-md bg-muted px-2 py-0.5 font-medium">
                          {n}
                        </span>
                      ))}
                    </div>
                    {doing && <Progress value={s.pct} className="mt-2.5" indicatorClassName={late > 0 ? "bg-destructive" : undefined} />}
                    {k === origin && (
                      <div className="mt-2.5 flex items-start gap-2 font-medium text-destructive">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        Trễ bắt đầu từ đây{s.note ? `: ${s.note}` : `: xong ${dt(s.act)}, kế hoạch ${dt(s.plan)}`}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}

function Dot({ s, k, cur, small }: { s: Step; k: number; cur: number; small?: boolean }) {
  const Icon = s.pct === 100 ? Check : s.icon;
  const late = s.act > s.plan && s.pct < 100;
  const size = small ? "size-9" : "size-12";
  const tone =
    s.pct === 100 ? "bg-success text-white" : late && k <= cur ? "bg-destructive text-white" : k === cur ? "bg-primary text-primary-foreground" : "border-2 bg-background text-muted-foreground";
  return (
    <span className={`relative z-[1] flex ${size} shrink-0 items-center justify-center rounded-full ${tone}`}>
      {k === cur && <span className={`absolute inset-0 animate-ping rounded-full opacity-40 ${late ? "bg-destructive" : "bg-primary"}`} />}
      <Icon className={small ? "size-4" : "size-5"} />
    </span>
  );
}

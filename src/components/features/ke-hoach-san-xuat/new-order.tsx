"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DatePicker,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erp/miniapp-ui";
import { CheckCircle2, Clock, Factory, Loader2, PackageSearch, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CAP,
  CUSTOMERS,
  calc,
  dt,
  f,
  type Fit,
  FIN,
  fitNew,
  ln,
  type NewSpec,
  type Order,
  onLine,
  p2,
  TODAY,
  WORKERS,
} from "@/data/ke-hoach-san-xuat";

const day = (d: Date) => Math.round((d.getTime() - new Date(2026, 10, 2).getTime()) / 864e5);
const date = (n: number) => new Date(2026, 10, 2 + n);
const CODES = ["AO-POLO-2611", "AO-KHOAC-1150", "QUAN-KAKI-0932", "QUAN-SHORT-0715", "SOMI-NU-1210", "AO-THUN-2402", "VAY-XOE-1105"];
const STEPS = ["Đang xem năng lực 15 chuyền…", "Kiểm tra nguyên liệu…", "Tính ngày hoàn thành…"];
const STEP_END = [15, 27, 40]; // mốc tick của từng bước
const W = 56; // 8 tuần
const OPTS = ["Phương án đề xuất", "Tăng ca 2 giờ/ngày + T7", "Thêm 1 chuyền"];

type Check = { spec: NewSpec; orders: Order[]; fits: Fit[] };

export function NewOrderTab({ orders, onAdd }: { orders: Order[]; onAdd: (spec: NewSpec, fit: Fit) => void }) {
  const [cust, setCust] = useState("2");
  const [code, setCode] = useState("SOMI-NU-1210");
  const [qty, setQty] = useState("30000");
  const [ship, setShip] = useState<Date | undefined>(date(46));
  const [npl, setNpl] = useState<Date | undefined>(date(23));
  const [chk, setChk] = useState<Check | null>(null);
  const [tick, setTick] = useState(0);
  const [opt, setOpt] = useState(0);
  const [slid, setSlid] = useState(false);
  const [added, setAdded] = useState(false);

  const q = Math.round(+qty.replace(/\D/g, ""));
  const valid = q >= 1000 && q <= 200000 && ship && npl && code.trim();
  const scanning = chk != null && tick < STEP_END[2];

  const run = () => {
    if (!valid) return;
    const spec: NewSpec = { cust: +cust, code: code.trim().toUpperCase(), qty: q, ship: day(ship), npl: day(npl) };
    setChk({ spec, orders, fits: [fitNew(orders, spec), fitNew(orders, spec, 2, 1.25), fitNew(orders, spec, 3)] });
    setTick(0);
    setOpt(0);
    setSlid(false);
    setAdded(false);
  };

  useEffect(() => {
    if (!scanning) return;
    const t = setInterval(() => setTick((x) => x + 1), 70);
    return () => clearInterval(t);
  }, [scanning]);

  // replay hiệu ứng trượt mỗi khi có kết quả mới / đổi phương án
  // biome-ignore lint/correctness/useExhaustiveDependencies: chạy lại theo opt
  useEffect(() => {
    if (scanning || !chk) return;
    setSlid(false);
    const t = setTimeout(() => setSlid(true), 350);
    return () => clearTimeout(t);
  }, [scanning, chk, opt]);

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>📥 Đơn khách vừa hỏi</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Khách hàng</FieldLabel>
            <Select value={cust} onValueChange={setCust}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMERS.map((k, i) => (
                  <SelectItem key={k} value={String(i)}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="nd-code">Mã hàng</FieldLabel>
            <Input id="nd-code" list="nd-codes" value={code} onChange={(e) => setCode(e.target.value)} />
            <datalist id="nd-codes">
              {CODES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field>
            <FieldLabel htmlFor="nd-qty">Số lượng (sp)</FieldLabel>
            <Input id="nd-qty" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} aria-invalid={!q || q < 1000} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Ngày xuất</FieldLabel>
              <DatePicker value={ship} onChange={setShip} displayFormat="dd/MM/yyyy" aria-label="Ngày xuất" />
            </Field>
            <Field>
              <FieldLabel>Ngày NPL về</FieldLabel>
              <DatePicker value={npl} onChange={setNpl} displayFormat="dd/MM/yyyy" aria-label="Ngày nguyên phụ liệu về" />
            </Field>
          </div>
          <Button size="lg" disabled={!valid || scanning} onClick={run}>
            {scanning ? <Loader2 className="animate-spin" /> : <Search />} Kiểm tra
          </Button>
          <p className="text-muted-foreground">Tính từ lịch hiện tại của 15 chuyền, năng lực chuẩn và ngày nguyên liệu về. Đổi số lượng / ngày rồi bấm lại để so sánh.</p>
        </CardContent>
      </Card>

      {!chk ? (
        <Card className="flex min-h-80 items-center justify-center text-center text-muted-foreground">
          <div>
            <PackageSearch className="mx-auto mb-3 size-12 opacity-40" />
            Nhập đơn rồi bấm <b>Kiểm tra</b> để biết có kịp ngày xuất không.
          </div>
        </Card>
      ) : scanning ? (
        <Scan chk={chk} tick={tick} />
      ) : (
        <Result chk={chk} opt={opt} setOpt={setOpt} slid={slid} added={added} onAdd={() => {
            setAdded(true);
            onAdd(chk.spec, chk.fits[opt]);
          }} />
      )}
    </div>
  );
}

function Scan({ chk, tick }: { chk: Check; tick: number }) {
  const fit = chk.fits[0];
  const min = Math.min(...fit.free);
  const step = STEP_END.findIndex((e) => tick < e);
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-2.5">
          {STEPS.map((s, k) => (
            <div key={s} className={`flex items-center gap-2.5 text-base transition-opacity ${k > step ? "opacity-35" : ""}`}>
              {k < step ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : k === step ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : (
                <Clock className="size-5" />
              )}
              {s}
              {k < step && k === 1 && (
                <span className="text-muted-foreground">
                  NPL về {dt(chk.spec.npl)} → cắt được từ {dt(Math.max(TODAY + 1, chk.spec.npl))}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-15">
          {CAP.map((c, k) => {
            const lit = tick > k;
            const ok = fit.free[k] <= min;
            return (
              <div
                key={ln(k + 1)}
                className={`flex flex-col items-center rounded-lg border p-2 transition-all duration-300 ${
                  !lit ? "opacity-30" : ok ? "border-success/40 bg-success/10 scale-105" : "border-warning/40 bg-warning/10"
                }`}
              >
                <Factory className={`size-5 ${lit ? (ok ? "text-success" : "text-warning") : ""}`} />
                <b>C{p2(k + 1)}</b>
                <small className="text-xs text-muted-foreground">{lit ? `rảnh ${dt(fit.free[k])}` : `${f(c[0])}/ng`}</small>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Result({
  chk,
  opt,
  setOpt,
  slid,
  added,
  onAdd,
}: {
  chk: Check;
  opt: number;
  setOpt: (n: number) => void;
  slid: boolean;
  added: boolean;
  onAdd: () => void;
}) {
  const { spec, orders } = chk;
  const fit = chk.fits[opt];
  const ok = !fit.late;
  const ahead = spec.ship - fit.end + 1;
  const shifted = fit.shifts.map((s) => {
    const o = orders[s.i];
    return { s, o, a: calc(o.i, { start: o.start + s.d, sew: o.days[1] }) };
  });

  // Tách 2 đợt: phần may kịp trước hạn xuất
  const base = chk.fits[0];
  const q1 = Math.min(spec.qty, Math.max(0, Math.floor(((spec.ship - FIN - base.ss + 1) * base.capDay) / 500) * 500));
  const otCost = Math.round((base.lines.reduce((s, n) => s + WORKERS[n - 1], 0) * (chk.fits[1].se - chk.fits[1].ss) * 2 * 40000) / 1e6);
  const extra = chk.fits[2].lines.find((n) => !base.lines.includes(n));
  const alt = (k: number) => {
    const x = chk.fits[k];
    return x.late ? `Trễ ${x.late} ngày (xong ${dt(x.end - 1)})` : `Kịp — xong ${dt(x.end - 1)}`;
  };
  const shiftTxt = (x: Fit) =>
    x.shifts.length ? `Đẩy ${x.shifts.map((s) => `${orders[s.i].po} lùi ${s.d} ngày`).join(", ")}` : "Không phải dời đơn nào";

  return (
    <div className="flex flex-col gap-4">
      <Card className={`border-2 ${ok ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"}`}>
        <CardContent className="flex flex-wrap items-center gap-5">
          {ok ? <CheckCircle2 className="size-14 text-success" /> : <XCircle className="size-14 text-destructive" />}
          <div className="grow">
            <div className={`text-3xl font-bold ${ok ? "text-success" : "text-destructive"}`}>
              {ok ? `Kịp — xong ${dt(fit.end - 1)}, trước hạn ${ahead} ngày` : `Trễ ${fit.late} ngày`}
            </div>
            <div className="mt-1 text-base text-muted-foreground">
              {CUSTOMERS[spec.cust]} · {spec.code} · {f(spec.qty)} sp · xuất {dt(spec.ship, true)}
              {!ok && ` · dự kiến xong ${dt(fit.end - 1)}`}
              {opt > 0 && ` · ${OPTS[opt]}`}
            </div>
          </div>
          <Button size="lg" disabled={added} onClick={onAdd}>
            {added ? "✓ Đã đưa vào kế hoạch" : "Đưa vào kế hoạch"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              Xếp vào
              {fit.lines.map((n) => (
                <Badge key={n} className="text-sm">
                  {ln(n)}
                </Badge>
              ))}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
              <span>✂ Cắt {dt(fit.start)} – {dt(fit.start + fit.cut - 1)}</span>
              <span>🧵 May {dt(fit.ss)} – {dt(fit.se - 1)} ({fit.se - fit.ss} ngày · {f(fit.capDay)} sp/ngày)</span>
              <span>✨ Hoàn thiện {dt(fit.se)} – {dt(fit.end - 1)}</span>
            </div>
            <MiniGantt chk={chk} fit={fit} slid={slid} />
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>Ảnh hưởng đến đơn khác</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {shifted.length ? (
              shifted.map(({ s, o, a }) => (
                <div key={o.po} className="rounded-lg border border-warning/40 bg-warning/10 p-2.5">
                  <b>{o.po}</b> · {o.code}
                  <div className="text-muted-foreground">
                    {ln(s.line)} · may {dt(o.ss)} → <b className="text-foreground">{dt(a.ss)}</b>
                  </div>
                  <div>
                    Xong {dt(o.end - 1)} → <b>{dt(a.end - 1)}</b>{" "}
                    {a.late > o.late ? <Badge variant="destructive">Trễ {a.late} ngày</Badge> : <Badge variant="secondary">vẫn kịp</Badge>}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="size-5" /> Không đơn nào bị dời
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setOpt(opt === k ? 0 : k)}
            className={`rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 ${opt === k ? "border-primary ring-2 ring-primary/30" : ""}`}
          >
            <div className="font-semibold">{OPTS[k]}</div>
            <div className={chk.fits[k].late ? "text-destructive" : "text-success"}>→ {alt(k)}</div>
            <div className="mt-1 text-muted-foreground">
              ⚖{" "}
              {k === 1
                ? `Chi phí tăng ca ~${otCost} triệu đ; công nhân ${base.lines.map(ln).join(", ")} thêm ${(chk.fits[1].se - chk.fits[1].ss) * 2} giờ`
                : `Dùng thêm ${extra ? ln(extra) : "1 chuyền"}; ${shiftTxt(chk.fits[2])}`}
            </div>
            <div className="mt-2 text-sm text-primary">{opt === k ? "✓ Đang xem phương án này" : "Bấm để xem"}</div>
          </button>
        ))}
        <div className="rounded-xl border border-dashed p-4">
          <div className="font-semibold">Tách 2 đợt xuất</div>
          {base.late ? (
            <div className="text-success">
              → Xuất {f(q1)} sp ngày {dt(spec.ship)}, {f(spec.qty - q1)} sp ngày {dt(base.end)}
            </div>
          ) : (
            <div className="text-success">→ Không cần, đã kịp cả đơn</div>
          )}
          <div className="mt-1 text-muted-foreground">⚖ Cần khách đồng ý, thêm 1 lô hàng lẻ (LCL) ~1.200 USD</div>
        </div>
      </div>
    </div>
  );
}

function MiniGantt({ chk, fit, slid }: { chk: Check; fit: Fit; slid: boolean }) {
  const at = (d: number) => `${((Math.max(TODAY, Math.min(TODAY + W, d)) - TODAY) / W) * 100}%`;
  const wd = (a: number, b: number) => `${((Math.max(TODAY, Math.min(TODAY + W, b)) - Math.max(TODAY, Math.min(TODAY + W, a))) / W) * 100}%`;
  const shift = new Map(fit.shifts.map((s) => [s.i, s.d]));
  const bar = "absolute top-1.5 flex h-7 items-center overflow-hidden rounded-md px-2 text-xs font-medium whitespace-nowrap text-white transition-all duration-1000 ease-out";
  return (
    <div className="text-sm">
      <div className="relative ml-24 h-5 text-xs text-muted-foreground">
        {Array.from({ length: W / 7 }, (_, k) => (
          <span key={k} className="absolute border-l pl-1" style={{ left: `${((k * 7) / W) * 100}%` }}>
            {dt(TODAY + k * 7)}
          </span>
        ))}
      </div>
      {fit.lines.map((n) => (
        <div key={n} className="flex items-center border-t">
          <span className="w-24 shrink-0 font-semibold">{ln(n)}</span>
          <div className="relative h-10 grow bg-muted/40">
            {onLine(chk.orders, n).map((o) => {
              const d = slid ? (shift.get(o.i) ?? 0) : 0;
              if (o.se + d <= TODAY || o.ss > TODAY + W) return null;
              return (
                <i
                  key={o.po}
                  className={`${bar} ${shift.has(o.i) ? "bg-amber-500 ring-2 ring-amber-300" : "bg-slate-400"}`}
                  style={{ left: at(o.ss + d), width: wd(o.ss + d, o.se + d) }}
                  title={`${o.po}: may ${dt(o.ss + d)} – ${dt(o.se + d - 1)}`}
                >
                  {o.po}
                  {shift.has(o.i) && slid && ` → lùi ${shift.get(o.i)} ngày`}
                </i>
              );
            })}
            <i
              className={`${bar} bg-primary shadow-lg ${slid ? "opacity-100" : "opacity-0"}`}
              style={{ left: at(slid ? fit.ss : TODAY + W), width: slid ? wd(fit.ss, fit.se) : "0%" }}
            >
              Đơn mới · {f(chk.spec.qty / fit.lines.length)} sp
            </i>
            <i className="absolute top-0 bottom-0 w-0.5 bg-gray-900" style={{ left: at(chk.spec.ship) }} title={`Xuất ${dt(chk.spec.ship)}`} />
          </div>
        </div>
      ))}
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <i className="inline-block h-3 w-4 rounded bg-primary" /> Đơn mới (may)
        </span>
        <span className="flex items-center gap-1">
          <i className="inline-block h-3 w-4 rounded bg-slate-400" /> Đơn đang có
        </span>
        <span className="flex items-center gap-1">
          <i className="inline-block h-3 w-4 rounded bg-amber-500" /> Đơn phải dời
        </span>
        <span>
          <b className="text-gray-900">|</b> Ngày xuất {dt(chk.spec.ship)}
        </span>
      </div>
    </div>
  );
}

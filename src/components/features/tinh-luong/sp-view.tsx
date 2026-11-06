"use client";

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SearchField,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
} from "@erp/miniapp-ui";
import { Fragment, useMemo, useRef, useState } from "react";
import {
  ADD, CHUYEN, f, fTr, MH, MHK, PAGE_SIZE, PERIODS, R, range, type SpItem, type SpVal, spCols, spMatrix, V, XUONG,
} from "@/data/tinh-luong";
import { clampPage, Dash, FilterSelect, MbAmount, Pager } from "./shared";

const PIN1 = { pinned: "left" as const, pinOffset: 0, className: "min-w-[84px] max-w-[84px]" };
const PIN2 = { pinned: "left" as const, pinOffset: 84, className: "min-w-[170px] border-r" };

function Cells({ v, dg }: { v: SpVal; dg?: number }) {
  return (
    <>
      {v.c.map((x, i) => (
        <TableCell key={i} numeric className="min-w-[58px]">{x ? f(x) : <Dash />}</TableCell>
      ))}
      <TableCell numeric className="border-l">{f(v.sl)}</TableCell>
      <TableCell numeric>{dg ? f(dg) : ""}</TableCell>
      <TableCell numeric>{f(v.tt)}</TableCell>
      <TableCell numeric className="border-l">{f(v.tg)}</TableCell>
      <TableCell numeric>{v.ng ? f(v.ng) : <Dash />}</TableCell>
      <TableCell numeric><MbAmount v={v.mb} /></TableCell>
      <TableCell numeric className="border-l font-bold">{f(v.tong)}</TableCell>
    </>
  );
}


export function SpView({ onOpen, per, setPer }: { onOpen: (i: number) => void; per: string; setPer: (p: string) => void }) {
  const [x, setX] = useState("");
  const [c, setC] = useState("");
  const [m, setM] = useState("");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"mc" | "nv">("mc");
  const [page, setPage] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const reset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(0); };

  const cols = useMemo(() => spCols(per), [per]);
  const inP = useMemo<SpItem[]>(() => R.map((r, i) => ({ r, i, ...V(r, cols) })).filter((o) => o.sl || o.mb), [cols]); // có sản lượng trong kỳ
  const mx = useMemo(() => spMatrix(inP, x), [inP, x]);
  const perLab = PERIODS.find((p) => p.v === per)!.lab.replace(/ \(.*/, "");

  const { rows, G, key } = useMemo(() => {
    const s = q.trim().toLowerCase();
    const rows = inP.filter((o) => (!x || o.r.x === x) && (!c || o.r.ch === c) && (!m || o.r.mh === m) && (!s || (o.r.ma + " " + o.r.ten).toLowerCase().includes(s)));
    rows.sort(mode === "mc"
      ? (a, b) => a.r.ch.localeCompare(b.r.ch) || a.r.first - b.r.first || a.r.mh.localeCompare(b.r.mh) || a.r.ma.localeCompare(b.r.ma)
      : (a, b) => a.r.ma.localeCompare(b.r.ma) || a.r.first - b.r.first);
    const key = (o: SpItem) => (mode === "mc" ? o.r.mh + " · " + o.r.ch : o.r.ma);
    const G = new Map<string, SpItem[]>();
    rows.forEach((o) => { const k = key(o); G.has(k) ? G.get(k)!.push(o) : G.set(k, [o]); });
    return { rows, G, key };
  }, [inP, x, c, m, q, mode]);
  const n = cols.length;
  const T = useMemo(() => ADD(rows, n), [rows, n]);
  const p = clampPage(page, rows.length);
  const pageRows = rows.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
  const pick = (h: string, k: string) => { const same = m === h && c === k; setM(same ? "" : h); setC(same ? "" : k); setPage(0); };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Kỳ" value={per} onChange={reset(setPer)} options={PERIODS.map((p) => ({ v: p.v, lab: p.lab }))} />
        <FilterSelect label="Xưởng" value={x} onChange={reset(setX)} all="Tất cả xưởng" options={["Xưởng 1", "Xưởng 2"]} />
        <FilterSelect label="Chuyền" value={c} onChange={reset(setC)} all="Tất cả chuyền" options={CHUYEN} />
        <FilterSelect label="Mã hàng" value={m} onChange={reset(setM)} all="Tất cả mã hàng" options={MHK} />
        <SearchField className="min-w-56 flex-1 sm:flex-none" placeholder="Tìm công nhân (tên, mã NV)…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} aria-label="Tìm công nhân" />
        <span className="grow" />
        <Badge variant="secondary" className="bg-primary/10 text-primary">Sản lượng tự lấy từ hệ thống chuyền · cập nhật 06:00</Badge>
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-3">
          <CardTitle>Tiền lương SP theo mã hàng × chuyền</CardTitle>
          <CardDescription>· {perLab}</CardDescription>
          <CardAction className="text-sm text-muted-foreground">Bấm một ô để lọc bảng bên dưới</CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table density="compact" className="whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>Mã hàng</TableHead>
                {mx.chs.map((k) => (
                  <TableHead key={k} numeric>
                    {k.replace("Chuyền", "C")}
                    <span className="block text-xs text-muted-foreground">{XUONG[k]}</span>
                  </TableHead>
                ))}
                <TableHead numeric>Cộng mã hàng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mx.mhs.map((h) => (
                <TableRow key={h}>
                  <TableCell>
                    <b>{h}</b>
                    <span className="block text-xs text-muted-foreground">{MH[h][0]}</span>
                  </TableCell>
                  {mx.chs.map((k) => {
                    const z = mx.cell[h + "|" + k];
                    if (!z) return <TableCell key={k} numeric><Dash /></TableCell>;
                    return (
                      <TableCell key={k} numeric className={`cursor-pointer hover:bg-primary/10 ${m === h && c === k ? "bg-primary/10" : ""}`}>
                        <button type="button" className="text-right" onClick={() => pick(h, k)}>
                          <b>{fTr(z.tong)}</b>
                          <span className="block text-xs text-muted-foreground">{f(z.sl)} sp · {z.cn.size} CN</span>
                        </button>
                      </TableCell>
                    );
                  })}
                  <TableCell numeric className="bg-muted/50 font-bold">{fTr(mx.tot(h))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Cộng chuyền</TableCell>
                {mx.chs.map((k) => <TableCell key={k} numeric>{fTr(mx.tot("", k))}</TableCell>)}
                <TableCell numeric>{fTr(mx.tot())}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-wrap items-center gap-3 border-b py-3">
          <CardTitle>Bảng lương sản phẩm theo mã hàng – chuyền</CardTitle>
          <span className="text-sm text-muted-foreground">Nhóm theo:</span>
          <ToggleGroup type="single" variant="outline" size="sm" value={mode} onValueChange={(v) => { if (v) { setMode(v as "mc" | "nv"); setPage(0); } }} aria-label="Nhóm theo">
            <ToggleGroupItem value="mc" className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary">Mã hàng – Chuyền</ToggleGroupItem>
            <ToggleGroupItem value="nv" className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary">Công nhân</ToggleGroupItem>
          </ToggleGroup>
          <Badge variant="secondary" className="ml-auto bg-warning/15 text-warning">Tạm tính · chưa chốt kỳ</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={box} className="flex max-h-[64vh] flex-col">
            <Table stickyHeader stickyFooter density="compact" className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead {...PIN1}>Mã NV</TableHead>
                  <TableHead {...PIN2}>Họ tên</TableHead>
                  <TableHead>Chuyền</TableHead>
                  <TableHead>Mã hàng</TableHead>
                  <TableHead>Công đoạn</TableHead>
                  {cols.map((col) => <TableHead key={col.lab} numeric className="min-w-[58px]">{col.lab}</TableHead>)}
                  <TableHead numeric className="border-l">Tổng SL</TableHead>
                  <TableHead numeric title="Tổng đơn giá các CĐ được phân công">ĐG CĐ</TableHead>
                  <TableHead numeric title="= Tổng SL × ĐG CĐ">Thành tiền</TableHead>
                  <TableHead numeric className="border-l">Lương SP trong giờ</TableHead>
                  <TableHead numeric>Lương SP ngoài giờ</TableHead>
                  <TableHead numeric>Mua–bán CĐ</TableHead>
                  <TableHead numeric className="border-l">Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={n + 12} className="text-muted-foreground">Không có công nhân phù hợp</TableCell>
                  </TableRow>
                )}
                {pageRows.map((o, idx) => {
                  const g = G.get(key(o))!, r0 = g[0].r;
                  // nhóm: dòng tiêu đề + cộng nhóm tính trên cả nhóm (kể cả phần nằm ở trang khác)
                  const head = mode === "mc" && (idx === 0 || key(pageRows[idx - 1]) !== key(o));
                  const sub = mode === "nv" && g.length > 1 && g[g.length - 1] === o;
                  return (
                    <Fragment key={o.i}>
                      {head && (
                        <TableRow className="bg-primary/5 font-bold">
                          <TableCell colSpan={2} pinned="left" pinOffset={0} className="max-w-[254px] bg-sky-50">
                            {r0.mh} · {r0.ch}{g[0] !== o ? " (tiếp)" : ""}
                          </TableCell>
                          <TableCell colSpan={3} className="font-medium text-muted-foreground">
                            {MH[r0.mh][0]} · {range(g.map((z) => z.r))} · {g.length} CN
                          </TableCell>
                          <Cells v={ADD(g, n)} />
                        </TableRow>
                      )}
                      <TableRow className="cursor-pointer" onClick={() => onOpen(o.i)}>
                        <TableCell {...PIN1} className={`${PIN1.className} text-muted-foreground`}>{o.r.ma}</TableCell>
                        <TableCell {...PIN2} className={`${PIN2.className} font-semibold`}>{o.r.ten}</TableCell>
                        <TableCell>{o.r.ch}</TableCell>
                        <TableCell>{o.r.mh}</TableCell>
                        <TableCell title={o.r.cd.map((z) => `${z[0]}: ${f(z[1])} đ`).join("\n")}>
                          {o.r.cd.length} CĐ · <span className="text-muted-foreground">{o.r.cd.map((z) => z[0]).join(", ")}</span>
                        </TableCell>
                        <Cells v={o} dg={o.r.dg} />
                      </TableRow>
                      {sub && (
                        <TableRow className="bg-muted/50 font-semibold italic">
                          <TableCell {...PIN1}>{r0.ma}</TableCell>
                          <TableCell {...PIN2}>Cộng {r0.ten.split(" ").pop()}</TableCell>
                          <TableCell colSpan={3} className="text-muted-foreground">
                            {g.length} dòng: {g.map((z) => z.r.mh + " / " + z.r.ch.replace("Chuyền ", "C")).join(" · ")}
                          </TableCell>
                          <Cells v={ADD(g, n)} />
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell {...PIN1}>Cộng</TableCell>
                  <TableCell {...PIN2}>{f(rows.length)} dòng · {f(new Set(rows.map((o) => o.r.ma)).size)} CN</TableCell>
                  <TableCell colSpan={3} className="text-muted-foreground">{G.size} {mode === "mc" ? "nhóm mã hàng – chuyền" : "công nhân"}</TableCell>
                  <Cells v={T} />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <Pager n={rows.length} page={p} onPage={setPage} scrollRef={box} />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        ⓘ Như file ĐG NGAY: TN trong giờ = SL ÷ (8 + giờ TC − 0,33) × 7,67 × ĐG CĐ · TN ngoài giờ = SL ÷ (8 + giờ TC − 0,33) × giờ TC × ĐG CĐ × 1,5. Tổng = trong giờ + ngoài giờ + mua bán CĐ → vào cột W, X của Bảng lương tháng.
      </p>
    </>
  );
}

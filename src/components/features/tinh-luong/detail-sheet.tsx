"use client";

import {
  Avatar,
  AvatarFallback,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { COLS, dd, DM, dow, f, f2, fmtCol, GROUPS, INC, MH, PERIODS, R, RED, spCols, TH, V, val } from "@/data/tinh-luong";
import { MbAmount, StatusBadge } from "./shared";

export type Detail = { kind: "pay"; ma: string } | { kind: "sp"; i: number; per: string } | null;

function Hero({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-md bg-primary/10 p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}
const Sec = ({ children }: { children: ReactNode }) => (
  <h4 className="mt-5 mb-1 text-sm font-semibold uppercase text-muted-foreground">{children}</h4>
);
const Note = ({ children }: { children: ReactNode }) => <p className="mt-4 text-sm text-muted-foreground">{children}</p>;

function PayBody({ ma }: { ma: string }) {
  const d = DM[ma];
  const grp = (g: string) => COLS.filter((c) => c[2] === g && (g === "cong" || val(d, c[0]) || c[0] === "AR" || c[0] === "AY"));
  return (
    <>
      <Hero
        label="Thực lĩnh tháng 10/2026"
        value={`${f(d.AY)} đ`}
        sub={`Tổng lương ${f(d.AR)} · Bình quân ${f(d.AZ)}/ngày · Xếp loại ${d.BD}`}
      />
      {GROUPS.map(([g, lab]) => (
        <div key={g}>
          <Sec>{lab}</Sec>
          <div className="divide-y divide-dashed text-sm">
            {grp(g).map((c) => {
              const red = RED.includes(c[0]), v = val(d, c[0]);
              return (
                <div key={c[0]} className="flex justify-between gap-3 py-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-help">
                        {c[1]} <span className="text-muted-foreground">({c[0]})</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm whitespace-pre-line">{c[3]}</TooltipContent>
                  </Tooltip>
                  <b className={`tabular-nums ${red ? "text-destructive" : ""}`}>
                    {red && v ? "−" : ""}
                    {fmtCol(c, v)}
                  </b>
                </div>
              );
            })}
            {(g === "luong" || g === "pc") && (
              <div className="flex justify-between py-1.5 font-bold">
                <span>Cộng {lab.toLowerCase()}</span>
                <span className="tabular-nums">
                  {f(grp(g).filter((c) => INC.includes(c[0])).reduce((a, c) => a + (val(d, c[0]) as number), 0))}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
      <Note>ⓘ Lương tối thiểu (S) dùng để so sánh, không cộng vào tổng lương; chỉ phần bù (T) được cộng.</Note>
    </>
  );
}

function SpBody({ i, per }: { i: number; per: string }) {
  const r = R[i], cols = spCols(per), v = V(r, cols);
  const days = cols.flatMap((c) => c.days).filter((d) => r.day[d]);
  const perLab = PERIODS.find((p) => p.v === per)!.lab.replace(/ \(.*/, "");
  return (
    <>
      <Hero
        label={`Tiền lương SP · ${perLab}`}
        value={`${f(v.tong)} đ`}
        sub={`Trong giờ ${f(v.tg)} · ngoài giờ ${f(v.ng)} · mua–bán CĐ ${v.mb > 0 ? "+" : ""}${f(v.mb)}`}
      />
      <Sec>Công đoạn được phân công · {MH[r.mh][0]}</Sec>
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Công đoạn</TableHead>
            <TableHead numeric>Đơn giá</TableHead>
            <TableHead numeric>SL</TableHead>
            <TableHead numeric>Thành tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {r.cd.map((c) => (
            <TableRow key={c[0]}>
              <TableCell>{c[0]}</TableCell>
              <TableCell numeric>{f(c[1])}</TableCell>
              <TableCell numeric>{f(v.sl)}</TableCell>
              <TableCell numeric>{f(v.sl * c[1])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Cộng {r.cd.length} CĐ</TableCell>
            <TableCell numeric>{f(r.dg)}</TableCell>
            <TableCell numeric>{f(v.sl)}</TableCell>
            <TableCell numeric>{f(v.tt)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Sec>Sản lượng & thu nhập từng ngày</Sec>
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Ngày</TableHead>
            <TableHead numeric>Giờ TC</TableHead>
            <TableHead numeric>SL</TableHead>
            <TableHead numeric>TN trong giờ</TableHead>
            <TableHead numeric>TN ngoài giờ</TableHead>
            <TableHead numeric>MB</TableHead>
            <TableHead numeric>TN ngày</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((d) => {
            const x = r.day[d];
            return (
              <TableRow key={d}>
                <TableCell>
                  {TH[dow(d)]} {dd(d)}/10
                </TableCell>
                <TableCell numeric>{f2(x.o)}</TableCell>
                <TableCell numeric>{f(x.sl)}</TableCell>
                <TableCell numeric>{f(x.tg)}</TableCell>
                <TableCell numeric>{f(x.ng)}</TableCell>
                <TableCell numeric>
                  <MbAmount v={x.mb} />
                </TableCell>
                <TableCell numeric className="font-bold">
                  {f(x.tg + x.ng + x.mb)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Cộng {days.length} ngày</TableCell>
            <TableCell />
            <TableCell numeric>{f(v.sl)}</TableCell>
            <TableCell numeric>{f(v.tg)}</TableCell>
            <TableCell numeric>{f(v.ng)}</TableCell>
            <TableCell numeric>
              <MbAmount v={v.mb} />
            </TableCell>
            <TableCell numeric>{f(v.tong)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Note>ⓘ Thành tiền = SL × đơn giá CĐ; chia trong giờ / ngoài giờ theo giờ TC từng ngày (ngoài giờ × 1,5).</Note>
    </>
  );
}

/** Drawer chi tiết: lương tháng một người, hoặc một dòng lương SP (mã hàng × chuyền). */
export function DetailSheet({ detail, onChange }: { detail: Detail; onChange: (d: Detail) => void }) {
  let ten = "";
  let sub: ReactNode = null;
  let body: ReactNode = null;
  if (detail?.kind === "pay") {
    const d = DM[detail.ma];
    ten = d.ten;
    sub = (
      <>
        {d.ma} · {d.bp} · {d.cd} <StatusBadge st={d.st} />
      </>
    );
    body = <PayBody ma={detail.ma} />;
  } else if (detail?.kind === "sp") {
    const r = R[detail.i], per = detail.per;
    const other = R.map((o, j) => [o, j] as const).filter(([o]) => o.ma === r.ma && o !== r);
    ten = r.ten;
    sub = (
      <>
        {r.ma} · {r.ch} ({r.x}) · <b>{r.mh}</b>
        {other.length > 0 && (
          <span className="block">
            Cũng làm:{" "}
            {other.map(([o, j], k) => (
              <span key={j}>
                {k > 0 && ", "}
                <button
                  type="button"
                  className="text-primary underline-offset-2 hover:underline"
                  onClick={() => onChange({ kind: "sp", i: j, per })}
                >
                  {o.mh} · {o.ch}
                </button>
              </span>
            ))}
          </span>
        )}
      </>
    );
    body = <SpBody i={detail.i} per={per} />;
  }
  return (
    <Sheet open={!!detail} onOpenChange={(o) => !o && onChange(null)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[480px]">
        {detail && (
          <>
            <SheetHeader className="flex-row items-start gap-3">
              <Avatar>
                <AvatarFallback>{ten.split(" ").pop()![0]}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>{ten}</SheetTitle>
                <SheetDescription asChild>
                  <div>{sub}</div>
                </SheetDescription>
              </div>
            </SheetHeader>
            <div className="px-4 pb-6">{body}</div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

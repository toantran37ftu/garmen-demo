"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  SearchField,
  StatisticCard,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@erp/miniapp-ui";
import { toast } from "sonner";
import { useMemo, useRef, useState } from "react";
import {
  BOLD, BPS, COLS, D, f, fmtCol, fTr, fTy, GROUPS, inBp, PAGE_SIZE, PAY_KPI, RED, sum, val,
} from "@/data/tinh-luong";
import { clampPage, FilterSelect, Pager, StatusBadge } from "./shared";

const ALL_GROUPS = GROUPS.map((g) => g[0]);
const PIN1 = { pinned: "left" as const, pinOffset: 0, className: "min-w-[84px] max-w-[84px]" };
const PIN2 = { pinned: "left" as const, pinOffset: 84, className: "min-w-[170px] border-r" };

export function PayrollKpis() {
  const k = PAY_KPI;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatisticCard label="Tổng quỹ lương" value={fTy(k.quy)} trend={2.4} trendLabel="so với tháng 9" />
      <StatisticCard label="Lao động hưởng lương" value={f(k.n)} hint={`${f(k.tt)} trực tiếp · ${f(k.n - k.tt)} gián tiếp · 15 chuyền`} />
      <StatisticCard label="Lương sản phẩm" value={fTy(k.lsp)} hint={`${Math.round((k.lsp / k.quy) * 100)}% quỹ lương`} />
      <StatisticCard label="Thu nhập bình quân" value={fTr(k.quy / k.n)} hint={`Thực lĩnh BQ CN trực tiếp ${fTr(k.thucLinhTT)}`} />
      <StatisticCard label="Cần kiểm tra" value={<span className="text-warning">{f(k.canKT)}</span>} hint="Bù lương tối thiểu / chênh >15%" />
    </div>
  );
}

export function PayrollView({ onOpen }: { onOpen: (ma: string) => void }) {
  const [ky, setKy] = useState("Kỳ lương 10/2026");
  const [bp, setBp] = useState("");
  const [st, setSt] = useState("");
  const [q, setQ] = useState("");
  const [on, setOn] = useState<string[]>(ALL_GROUPS);
  const [page, setPage] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return D.filter((d) => inBp(d, bp) && (!st || d.st === st) && (!s || (d.ma + " " + d.ten).toLowerCase().includes(s)));
  }, [bp, st, q]);
  const cols = COLS.filter((c) => on.includes(c[2]));
  const totals = useMemo(() => Object.fromEntries(COLS.filter((c) => "mh".includes(c[4])).map((c) => [c[0], sum(rows, (d) => val(d, c[0]) as number)])), [rows]);
  const p = clampPage(page, rows.length);
  const pageRows = rows.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
  const gs = (i: number) => (i === 0 || cols[i][2] !== cols[i - 1][2] ? "border-l" : "");
  const num = (k: string) => (RED.includes(k) ? "text-destructive" : "");
  const reset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(0); };

  return (
    <>
      <PayrollKpis />
      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-col gap-3 border-b py-3">
          <div className="flex w-full flex-wrap items-center gap-2">
            <FilterSelect label="Kỳ lương" value={ky} onChange={setKy} options={["Kỳ lương 10/2026", "Kỳ lương 09/2026", "Kỳ lương 08/2026"]} />
            <FilterSelect label="Xưởng / chuyền" value={bp} onChange={reset(setBp)} all="Tất cả xưởng / chuyền" options={["Xưởng 1", "Xưởng 2", ...BPS]} />
            <FilterSelect label="Trạng thái" value={st} onChange={reset(setSt)} all="Tất cả trạng thái" options={["Đã chốt", "Tạm tính", "Cần kiểm tra"]} />
            <SearchField className="min-w-56 flex-1 sm:flex-none" placeholder="Tìm theo tên, mã nhân viên…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} aria-label="Tìm nhân viên" />
            <span className="grow" />
            <Button variant="outline" onClick={() => toast.success("Đã xuất bảng lương ra Excel")}>⬇ Xuất Excel</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Nhóm cột:</span>
            <ToggleGroup type="multiple" variant="outline" size="sm" spacing={6} value={on} onValueChange={setOn} aria-label="Nhóm cột">
              {GROUPS.map(([id, lab, bg]) => (
                <ToggleGroupItem key={id} value={id} className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                  <i className={`mr-1 inline-block size-2.5 rounded-sm border ${bg}`} />
                  {lab} ({COLS.filter((c) => c[2] === id).length})
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button variant="ghost" size="sm" onClick={() => setOn(ALL_GROUPS)}>Hiện tất cả</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={box} className="flex max-h-[64vh] flex-col">
            <Table stickyHeader stickyFooter density="compact" className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} {...PIN1}>Mã NV</TableHead>
                  <TableHead rowSpan={2} {...PIN2}>Họ tên</TableHead>
                  <TableHead rowSpan={2}>Bộ phận</TableHead>
                  <TableHead rowSpan={2}>Chức danh</TableHead>
                  <TableHead rowSpan={2}>Trạng thái</TableHead>
                  {GROUPS.filter((g) => on.includes(g[0])).map(([id, lab, bg]) => (
                    <TableHead key={id} colSpan={cols.filter((c) => c[2] === id).length} className={`border-l text-center font-bold text-foreground ${bg}`}>
                      {lab}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  {cols.map((c, i) => (
                    <TableHead key={c[0]} numeric className={gs(i)}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={0} className="cursor-help">
                            <span className="block text-xs font-bold text-muted-foreground">{c[0]}</span>
                            {c[1]}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm whitespace-pre-line">
                          <b>{c[0]} · {c[1]}</b>
                          {"\n" + c[3]}
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-muted-foreground">Không có nhân viên phù hợp</TableCell>
                  </TableRow>
                )}
                {pageRows.map((d) => (
                  <TableRow key={d.ma} className="cursor-pointer" onClick={() => onOpen(d.ma)}>
                    <TableCell {...PIN1} className={`${PIN1.className} text-muted-foreground`}>{d.ma}</TableCell>
                    <TableCell {...PIN2} className={`${PIN2.className} font-semibold`}>{d.ten}</TableCell>
                    <TableCell>{d.bp}</TableCell>
                    <TableCell>{d.cd}</TableCell>
                    <TableCell><StatusBadge st={d.st} /></TableCell>
                    {cols.map((c, i) => {
                      const v = fmtCol(c, val(d, c[0]));
                      return (
                        <TableCell key={c[0]} numeric={c[4] !== "t"} className={`${gs(i)} ${num(c[0])} ${v === "–" ? "text-muted-foreground" : ""}`}>
                          {BOLD.includes(c[0]) ? <b>{v}</b> : v}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell {...PIN1}>Cộng</TableCell>
                  <TableCell {...PIN2}>{f(rows.length)} nhân viên</TableCell>
                  <TableCell colSpan={3} />
                  {cols.map((c, i) => (
                    <TableCell key={c[0]} numeric className={`${gs(i)} ${num(c[0])}`}>
                      {c[0] in totals ? fmtCol(c, totals[c[0]]) : ""}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <Pager n={rows.length} page={p} onPage={setPage} scrollRef={box} />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        ⓘ Rê chuột vào tiêu đề cột để xem công thức · bấm một dòng để xem chi tiết lương từng người. Dòng Cộng tính trên toàn bộ nhân viên đang lọc, không chỉ trang đang xem.
      </p>
    </>
  );
}

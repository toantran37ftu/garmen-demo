"use client";

import {
  Button, Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import { toast } from "sonner";
import { useMemo, useRef, useState } from "react";
import { f, f2, PAGE_SIZE, SUB_COUNTS, SUBS, sum } from "@/data/tinh-luong";
import { clampPage, Dash, Pager } from "./shared";

export function SubView() {
  const [cur, setCur] = useState(0);
  const [page, setPage] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const [name, desc, hd, fn] = SUBS[cur];
  const rows = useMemo(() => fn(), [fn]);
  const num = rows.length ? rows[0].map((v) => typeof v === "number") : [];
  const tot = sum(rows, (r) => Number(r[r.length - 1]) || 0);
  const p = clampPage(page, rows.length);

  return (
    <div className="grid items-start gap-4 md:grid-cols-[230px_1fr]">
      <Card className="flex-row gap-0.5 overflow-x-auto p-1.5 md:flex-col">
        {SUBS.map((s, i) => (
          <button
            key={s[0]}
            type="button"
            aria-current={i === cur}
            onClick={() => { setCur(i); setPage(0); }}
            className={`flex shrink-0 justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left font-medium hover:bg-muted ${i === cur ? "bg-primary/10 font-semibold text-primary" : ""}`}
          >
            {s[0]}
            <span className="text-muted-foreground">{f(SUB_COUNTS[i])}</span>
          </button>
        ))}
      </Card>
      <Card className="min-w-0 gap-0 py-0">
        <CardHeader className="border-b py-3">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{desc}</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => toast("Nhập Excel (demo)")}>⬆ Nhập Excel</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={box} className="flex max-h-[64vh] flex-col">
            <Table stickyHeader stickyFooter density="compact" className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  {hd.map((h, i) => <TableHead key={h} numeric={num[i]}>{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE).map((r, k) => (
                  <TableRow key={k}>
                    {r.map((v, i) => (
                      <TableCell key={i} numeric={num[i]} className={!num[i] && i === 0 ? "text-muted-foreground" : ""}>
                        {typeof v === "number" ? (v ? f2(v) : <Dash />) : i === 1 ? <b>{v}</b> : v}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={hd.length - 1}>Cộng {f(rows.length)} dòng</TableCell>
                  <TableCell numeric>{f2(tot)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <Pager n={rows.length} page={p} onPage={setPage} scrollRef={box} />
        </CardContent>
      </Card>
    </div>
  );
}

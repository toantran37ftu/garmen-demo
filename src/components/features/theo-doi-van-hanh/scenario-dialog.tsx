"use client";

import {
  Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { SCENARIOS } from "@/data/theo-doi-van-hanh";
import { fmt } from "@/lib/format";
import { RiskBadge, rich } from "./rich";

export function ScenarioDialog({ index, onIndexChange }: { index: number | null; onIndexChange: (i: number | null) => void }) {
  // phương án đã duyệt theo từng tình huống
  const [approved, setApproved] = useState<Record<number, string>>({});
  const s = index == null ? null : SCENARIOS[index];

  return (
    <Dialog open={s != null} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent className="flex h-[calc(100vh-40px)] max-w-[1240px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[1240px]">
        <DialogHeader className="border-b px-5 py-3.5">
          <DialogTitle>Quyết định cần chú ý · 06/11/2026</DialogTitle>
          <DialogDescription className="sr-only">Chi tiết tình huống, nguyên nhân và phương án xử lý</DialogDescription>
        </DialogHeader>
        {s && index != null && (
          <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] md:grid-cols-[270px_1fr] md:grid-rows-1">
            <nav className="flex overflow-x-auto border-b bg-muted/40 md:flex-col md:overflow-y-auto md:border-r md:border-b-0">
              {SCENARIOS.map((x, k) => (
                <button
                  key={x.t}
                  type="button"
                  onClick={() => onIndexChange(k)}
                  aria-current={k === index}
                  className={`flex min-w-52 flex-col items-start gap-1 border-r p-3 px-4 text-left leading-snug md:min-w-0 md:border-r-0 md:border-b ${k === index ? "bg-background shadow-[inset_3px_0_0] shadow-primary" : "hover:bg-muted"}`}
                >
                  <RiskBadge lv={x.lv} />
                  {x.t}
                  <span className="font-semibold text-destructive">{x.m}</span>
                </button>
              ))}
            </nav>

            <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4 md:px-6 md:py-5" key={index}>
              <div className="flex flex-col items-start gap-1.5">
                <RiskBadge lv={s.lv} />
                <h2 className="text-xl font-semibold leading-snug">{s.t}</h2>
                <p className="text-muted-foreground">{s.c}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 rounded-lg bg-destructive/10 px-4 py-3">
                <div>
                  <div className="text-muted-foreground">Ảnh hưởng ước tính</div>
                  <div className="text-2xl font-bold text-destructive">{s.m}</div>
                </div>
                <div className="text-muted-foreground">{s.n} bị ảnh hưởng</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Đơn</TableHead><TableHead>Khách hàng</TableHead><TableHead>Mã hàng</TableHead>
                    <TableHead numeric>Số lượng</TableHead><TableHead>Ngày giao</TableHead><TableHead>Tác động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.orders.map((o) => (
                    <TableRow key={o[0]}>
                      <TableCell className="font-semibold">{o[0]}</TableCell><TableCell>{o[1]}</TableCell><TableCell>{o[2]}</TableCell>
                      <TableCell numeric>{fmt(o[3])}</TableCell><TableCell>{o[4]}</TableCell>
                      <TableCell><Badge variant="destructive">{o[5]}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h3 className="text-base font-bold">Vì sao? — chuỗi liên kết dữ liệu</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
                {s.steps.map(([t, d, objs], k) => (
                  <div key={t} className="flex flex-col gap-1.5 rounded-lg border p-3">
                    <span className="font-bold tracking-wide text-primary">BƯỚC {k + 1}</span>
                    <b>{t}</b>
                    <p className="text-muted-foreground">{d}</p>
                    <div className="flex flex-wrap gap-1">
                      {objs.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>

              <Alert variant="destructive" className="border-2 border-destructive">
                <AlertTitle>Nguyên nhân gốc</AlertTitle>
                <AlertDescription className="text-foreground">{rich(s.root)}</AlertDescription>
              </Alert>

              <p className="text-muted-foreground">
                <b className="text-foreground">Dữ liệu dùng để kết luận:</b> {s.src.join(" · ")}
              </p>

              <h3 className="text-base font-bold">Phải làm gì? — Phương án &amp; đánh đổi</h3>
              <p className="text-muted-foreground">ⓘ Hệ thống chỉ gợi ý dựa trên dữ liệu. Ban lãnh đạo là người quyết định.</p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 pt-2">
                {s.opts.map((o) => {
                  const done = approved[index];
                  return (
                    <Card key={o.k} className={`relative overflow-visible ${o.rec ? "border-2 border-success" : ""}`}>
                      {o.rec && <Badge className="absolute -top-2.5 right-3 bg-success text-success-foreground">Đề xuất</Badge>}
                      <CardContent className="flex h-full flex-col gap-2">
                        <h4 className="font-semibold leading-snug">Phương án {o.k}: {o.t}</h4>
                        <p className="text-muted-foreground">{o.d}</p>
                        <dl className="divide-y">
                          {([["Đơn cứu được", o.save, "text-success"], ["Đơn bị ảnh hưởng", o.hit, "text-warning"], ["Chi phí", o.cost, ""], ["Kết quả", o.res, ""]] as const).map(([k, v, c]) => (
                            <div key={k} className="flex justify-between gap-2.5 py-1.5">
                              <dt className="text-muted-foreground">{k}</dt>
                              <dd className={`text-right font-semibold ${c}`}>{v}</dd>
                            </div>
                          ))}
                        </dl>
                        <Button
                          className={`mt-auto ${done === o.k ? "border-success bg-success/10 text-success" : ""}`}
                          variant={done === o.k ? "outline" : o.rec ? "default" : "outline"}
                          disabled={done != null}
                          onClick={() => {
                            setApproved((a) => ({ ...a, [index]: o.k }));
                            toast.success(`Đã duyệt phương án ${o.k} · đã giao việc`);
                          }}
                        >
                          {done === o.k ? `✓ Đã duyệt phương án ${o.k} · đã giao việc` : `Duyệt phương án ${o.k}`}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

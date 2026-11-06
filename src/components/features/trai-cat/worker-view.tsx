"use client";

import { Button, Card, CardContent, Progress } from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { LAYS } from "@/data/trai-cat";
import { fmt } from "@/lib/format";
import { Tag } from "./shared";

const py = LAYS.find((y) => y.id === "LC-6061/2")!;
const cur = py.rolls[py.rolls.length - 1];
const suggest = Math.floor((cur.m - 0.2) / py.DL); // số lớp tự gợi ý = mét đo ÷ dài lớp

const STEPS: [string, string][] = [
  ["Mở app, thấy phiếu của bàn mình", "Không cần tìm phiếu giấy."],
  ["Quét tem cuộn vải", 'Cuộn lấy thêm tự gắn nhãn "Phát sinh".'],
  ["Nhập mét đo & đầu tấm khi hết cuộn", "App tự tính hao hụt, không phải cộng tay."],
  ["Bấm 1 lần để xác nhận", "Số liệu lên văn phòng chưa tới 5 phút."],
];

/** Mô phỏng màn hình điện thoại của công nhân trải vải */
export function WorkerView() {
  const [n, setN] = useState(suggest);
  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <div className="w-full max-w-[360px] overflow-hidden rounded-[36px] border-[10px] border-foreground bg-background shadow-lg">
        <div className="bg-primary px-5 pb-4 pt-5 text-primary-foreground">
          <div className="opacity-85">{py.lc.ban} · Phiếu {py.id}</div>
          <div className="mt-1.5 text-2xl font-bold">Lớp {py.tt} / {py.kh}</div>
          <Progress value={Math.round((py.tt / py.kh) * 100)} className="mt-2.5 bg-primary-foreground/30" indicatorClassName="bg-primary-foreground" />
          <div className="mt-2 opacity-85">{py.o.ma} · {py.mau} · Sơ đồ {py.o.sd[0]} · {fmt(py.DL, 2)} m/lớp</div>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <button
            type="button"
            className="rounded-2xl border-2 border-dashed border-primary bg-primary/10 p-4 text-center font-semibold text-primary"
            onClick={() => toast("Đang mở camera quét tem…")}
          >
            <div className="text-4xl" aria-hidden>📷</div>Bấm để quét tem cuộn vải
          </button>
          <div className="rounded-xl border p-3">
            <div className="text-muted-foreground">Cuộn vừa quét</div>
            <b>{cur.ma}</b> · tem {fmt(cur.tem, 1)} m · đo {fmt(cur.m, 1)} m
            <div className="text-muted-foreground">{cur.lot}</div>
            {cur.ps && <Tag tone="warn">＋ Cuộn phát sinh — đã tự ghi nhận</Tag>}
          </div>
          <div className="flex items-center justify-between">
            <span>Số lớp cuộn này</span>
            <span className="flex items-center gap-3">
              <Button variant="outline" size="icon-lg" className="rounded-full" aria-label="Bớt 1 lớp" onClick={() => setN((v) => Math.max(0, v - 1))}>−</Button>
              <b className="w-10 text-center text-3xl tabular-nums">{n}</b>
              <Button variant="outline" size="icon-lg" className="rounded-full" aria-label="Thêm 1 lớp" onClick={() => setN((v) => v + 1)}>＋</Button>
            </span>
          </div>
          <Button
            className="h-16 rounded-2xl bg-success text-xl font-bold text-success-foreground hover:bg-success/90"
            onClick={() => toast.success(`Đã xác nhận ${n} lớp cho cuộn ${cur.ma}`)}
          >
            ✓ Xác nhận
          </Button>
          <div className="text-center text-muted-foreground">Số lớp tự gợi ý = mét đo ÷ dài lớp — đúng thì chỉ cần bấm Xác nhận</div>
        </div>
      </div>
      <div className="flex max-w-xs flex-col gap-3">
        {STEPS.map(([t, d], i) => (
          <Card key={t}>
            <CardContent className="flex gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
              <div><b>{t}</b><div className="text-muted-foreground">{d}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

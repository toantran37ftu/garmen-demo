"use client";

import { Button, Card, CardContent } from "@erp/miniapp-ui";
import { toast } from "sonner";
import { KANBAN } from "@/data/nhan-su";
import { FilterSelect, ToneBadge } from "./ui";

export function Recruitment() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Đợt tuyển" options={["Đợt tuyển tháng 11 · Công nhân may"]} />
        <ToneBadge tone="info">Cần 50 người · đã nhận 9</ToneBadge>
        <Button className="ml-auto" onClick={() => toast.info("Mở form thêm ứng viên vào cột Mới nộp")}>＋ Thêm ứng viên</Button>
      </div>
      <div className="grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2">
        {KANBAN.map((col) => (
          <section key={col.title} className="flex flex-col gap-2 rounded-lg bg-muted p-2.5" aria-label={col.title}>
            <h4 className="flex justify-between px-1 font-semibold">
              {col.title} <span className="font-normal text-muted-foreground">{col.count}</span>
            </h4>
            {col.cards.map((c) => (
              <Card key={c.name} size="sm" className="py-2.5">
                <CardContent className="flex flex-col items-start gap-1 px-2.5">
                  <b>{c.name}</b>
                  <div className="text-muted-foreground">{c.info}</div>
                  {c.badge && <ToneBadge tone={c.badge.tone}>{c.badge.text}</ToneBadge>}
                </CardContent>
              </Card>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

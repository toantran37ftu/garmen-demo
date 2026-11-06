"use client";

import { Alert, AlertAction, AlertDescription, Badge, BarChart, Button, Card, CardContent, Progress } from "@erp/miniapp-ui";
import { useState } from "react";
import { COND, KPI, REV, TASKS } from "@/data/ke-toan";
import { Chips, Kpis, Section } from "./ui";

export function Conditions({ go, detailed }: { go?: (id: string) => void; detailed?: boolean }) {
  return (
    <div className="flex flex-col">
      {COND.map(([ok, label, detail]) => (
        <div key={label} className="flex items-center gap-2.5 border-b border-dashed py-2 last:border-0">
          <span className={ok ? "text-success" : "text-destructive"} aria-label={ok ? "Đạt" : "Chưa đạt"}>
            {ok ? "✓" : "✕"}
          </span>
          <span className="flex-1">
            {detailed && !ok ? (
              <>
                <b>{label}</b>
                <div className="text-muted-foreground">{detail}</div>
              </>
            ) : (
              label
            )}
          </span>
          {detailed && !ok && go && (
            <Button size="sm" variant="outline" onClick={() => go("quy")}>
              Mở
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export function Overview({ go }: { go: (id: string) => void }) {
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState("*");
  const drop = (t: (typeof TASKS)[number]) => setTasks((all) => all.filter((x) => x !== t));
  const shown = tasks.filter((t) => filter === "*" || t[1] === filter);

  return (
    <>
      <Alert className="border-warning/40 bg-warning/10">
        <AlertDescription>
          ⚠ <b>Thuế suất GTGT 8% (giảm 2%) hết hiệu lực ngày 31/12/2026</b> · còn 55 ngày · 6 hóa đơn mua vào tháng này
          đang áp 8%
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={() => go("thue")}>
            Xem thuế suất
          </Button>
        </AlertAction>
      </Alert>
      <Alert className="border-primary/30 bg-primary/5">
        <AlertDescription>ⓘ Còn 2 bước thiết lập: khai số dư đầu kỳ TK 242 và kết nối sao kê ngân hàng BIDV</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={() => go("tl")}>
            Tiếp tục thiết lập
          </Button>
        </AlertAction>
      </Alert>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-2xl" aria-hidden>
            🤖
          </span>
          <div className="min-w-64 flex-1">
            <div className="text-sm font-bold text-success">● ĐÃ XONG LƯỢT QUÉT</div>
            <b>AI quét sổ tháng 10/2026</b>
            <p className="mb-2 mt-0.5 text-muted-foreground">
              Đã kiểm 642 chứng từ, 3 tài khoản ngân hàng, 168 hóa đơn đầu vào. Phát hiện 1 lỗi chặn khóa sổ và 4 việc cần
              xem.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Chứng từ", "Ngân hàng", "Thuế GTGT", "Khóa sổ", "Danh mục"].map((x) => (
                <Badge key={x} variant="outline">
                  <span className="text-success">✓</span> {x}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="border-transparent bg-warning/15 text-warning">
              Chờ duyệt 1
            </Badge>
            <div className="mt-1.5 text-muted-foreground">Quét lúc 08:42 · 06/11</div>
          </div>
        </CardContent>
      </Card>

      <Kpis items={KPI.tq} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="Việc cần làm"
          action={
            <Chips
              items={[
                [`Tất cả ${tasks.length}`, "*"],
                [`Khóa sổ ${tasks.filter((t) => t[1] === "Khóa sổ").length}`, "Khóa sổ"],
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
        >
          <div className="flex flex-col">
            {shown.map((t) => (
              <div key={t[2]} className="flex flex-wrap items-start gap-3 border-b py-3.5 last:border-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted" aria-hidden>
                  {t[0]}
                </span>
                <div className="min-w-56 flex-1">
                  <div className="mb-1 flex flex-wrap gap-1.5">
                    {t[1] === "Khóa sổ" ? (
                      <Badge variant="outline" className="border-transparent bg-primary/10 text-primary">
                        {t[1]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t[1]}</Badge>
                    )}
                    {t[4] && <Badge variant="destructive">Chặn khóa sổ</Badge>}
                  </div>
                  <b>{t[2]}</b>
                  <div className="text-muted-foreground">{t[3]}</div>
                </div>
                <div className="flex gap-1.5 self-center">
                  <Button size="sm" onClick={() => go(t[5])}>
                    Mở
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => drop(t)}>
                    Bỏ qua
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => drop(t)}>
                    Đã xem
                  </Button>
                </div>
              </div>
            ))}
            {shown.length === 0 && <p className="py-4 text-muted-foreground">Không còn việc nào.</p>}
          </div>
        </Section>

        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Đường tới khóa sổ">
            <div className="mb-1.5 flex justify-between">
              <b>4/5 điều kiện đạt</b>
              <span className="text-muted-foreground">80%</span>
            </div>
            <Progress value={80} indicatorClassName="bg-success" aria-label="Tiến độ khóa sổ" />
            <div className="mt-2.5">
              <Conditions />
            </div>
          </Section>
          <Section title="Doanh thu và chi phí 6 tháng">
            <BarChart
              aria-label="Doanh thu và chi phí 6 tháng"
              categories={REV.months}
              series={[
                { name: "Doanh thu", data: REV.rev, className: "bg-primary" },
                { name: "Chi phí", data: REV.cost, className: "bg-primary/40" },
              ]}
              showLegend
            />
            <p className="mt-2 text-muted-foreground">Đơn vị: tỷ đồng</p>
          </Section>
        </div>
      </div>
    </>
  );
}

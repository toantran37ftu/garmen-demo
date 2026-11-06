"use client";

import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@erp/miniapp-ui";
import { ChevronRightIcon } from "lucide-react";
import { dm, hrs, initials, ME, MONTHS, p2, slip, WD, WEEKS, type Worker } from "@/data/app-cong-nhan";
import { fmt } from "@/lib/format";
import { BigStat, Box, ClosedBadge, Fold, type Go, Note, Row, SectionTitle, Signed, StatusBadge } from "./ui";

/* ---------- Lương: tuần SP / tháng ---------- */
export function PayScreen({ go }: { go: Go }) {
  return (
    <Tabs defaultValue="sp" className="gap-3.5">
      <TabsList className="h-13 w-full">
        <TabsTrigger value="sp" className="h-11 text-base">Lương sản phẩm</TabsTrigger>
        <TabsTrigger value="thang" className="h-11 text-base">Lương tháng</TabsTrigger>
      </TabsList>
      <TabsContent value="sp" className="flex flex-col gap-3.5">
        <Note>Lương sản phẩm tính theo tuần (Thứ Hai – Thứ Bảy). Chạm 1 tuần để xem từng ngày, từng công đoạn.</Note>
        <Box>
          {WEEKS.map((w, i) => (
            <Row
              key={i}
              onClick={() => go({ id: "wk", arg: i })}
              label={`Tuần ${dm(w.mon)} – ${dm(w.sat)}`}
              sub={<span className="mt-1 inline-block">{w.cur ? <StatusBadge tone="gray">Đang làm</StatusBadge> : <ClosedBadge tmp={w.tmp} />}</span>}
              value={fmt(w.tong)}
            />
          ))}
        </Box>
      </TabsContent>
      <TabsContent value="thang" className="flex flex-col gap-3.5">
        <BigStat label="Tổng thực lĩnh 12 tháng gần nhất" value={`${fmt(MONTHS.reduce((a, M) => a + M.net, 0))} đ`} />
        <Box>
          {MONTHS.map((M, i) => (
            <Row
              key={i}
              onClick={() => go({ id: "phieu", arg: i })}
              label={`Tháng ${M.m}/${M.y}`}
              sub={`${M.cong} ngày công · ${i ? "Đã chi trả" : "Đã chốt"}`}
              value={fmt(M.net)}
            />
          ))}
        </Box>
      </TabsContent>
    </Tabs>
  );
}

export const weekTitle = (i: number) => `Lương SP tuần ${dm(WEEKS[i].mon)} – ${dm(WEEKS[i].sat)}`;

/* ---------- Lương SP tuần → ngày → mã hàng / công đoạn ---------- */
export function WeekDetail({ i }: { i: number }) {
  const w = WEEKS[i];
  const agg = new Map<string, [string, string, number, number, number]>();
  for (const x of w.days)
    for (const l of x.lines) {
      const a = agg.get(l[0] + l[1]) ?? [l[0], l[1], l[2], 0, 0];
      a[3] += l[3];
      a[4] += l[4];
      agg.set(l[0] + l[1], a);
    }
  return (
    <>
      <BigStat tone="ok" label={<>Tổng cả tuần <ClosedBadge tmp={w.tmp} /></>} value={`${fmt(w.tong)} đ`} />
      <Box>
        <Row label="Thu nhập trong giờ" value={fmt(w.tg)} />
        <Row label="Thu nhập ngoài giờ" value={fmt(w.ng)} />
        <Row label="Mua bán trong giờ" value={<Signed n={w.mbT} />} />
        <Row label="Mua bán ngoài giờ" value={<Signed n={w.mbN} />} />
      </Box>

      <SectionTitle>Chi tiết từng ngày</SectionTitle>
      <Box>
        {w.days.map((x) => {
          const day = (
            <div className="min-w-0 flex-1">
              {WD[x.d.getDay()]}
              <div className="text-muted-foreground text-sm">{dm(x.d)}</div>
            </div>
          );
          if (!x.tong && !x.lines.length)
            return (
              <Row
                key={+x.d}
                label={WD[x.d.getDay()]}
                sub={dm(x.d)}
                value={
                  <span className="font-medium text-muted-foreground">
                    {x.a.k === "t" || x.a.k === "f" ? "Chưa có số" : x.a.k === "p" ? "Nghỉ phép" : "Không có công"}
                  </span>
                }
              />
            );
          return (
            <Fold key={+x.d} head={<>{day}<b className="tabular-nums">{fmt(x.tong)} đ</b></>}>
              <Row label="Công trong giờ" value={x.a.gio ? `${hrs(x.a.gio)} giờ` : ""} />
              <Row label="Công ngoài giờ" value={x.a.tc ? `${hrs(x.a.tc)} giờ` : ""} />
              <Row label="Số lượng" value={`${fmt(x.sl)} sp`} />
              <Row label="Thu nhập trong giờ" value={fmt(x.tg)} />
              <Row label="Thu nhập ngoài giờ" value={x.ng ? fmt(x.ng) : ""} />
              <Row label="Mua bán trong giờ" value={<Signed n={x.mbT} />} />
              <Row label="Mua bán ngoài giờ" value={<Signed n={x.mbN} />} />
              {x.lines.map((l) => (
                <Row key={l[1]} label={l[1]} sub={`${l[0]} · ${fmt(l[2])} đ × ${l[3]} sp`} value={fmt(l[4])} />
              ))}
              <Row label={<b>Thu nhập ngày</b>} value={`${fmt(x.tong)} đ`} />
            </Fold>
          );
        })}
      </Box>

      <SectionTitle>Theo mã hàng, công đoạn</SectionTitle>
      <Box>
        {agg.size ? (
          [...agg.values()].map((l) => (
            <Row key={l[0] + l[1]} label={<b>{l[1]}</b>} sub={`${l[0]} · đơn giá ${fmt(l[2])} đ · ${fmt(l[3])} sp`} value={fmt(l[4])} />
          ))
        ) : (
          <Row label={<span className="text-muted-foreground">Chưa có sản lượng</span>} />
        )}
      </Box>
      <Note>Số tạm tính từ sản lượng chuyền và phiếu mua bán. Số chính thức nằm trong phiếu lương tháng sau khi Phòng Nhân sự chốt.</Note>
    </>
  );
}

/* ---------- Phiếu lương tháng ---------- */
export const slipTitle = (i: number) => `Phiếu lương tháng ${MONTHS[i].m}/${MONTHS[i].y}`;
export const slipPeriod = (i: number) => {
  const M = MONTHS[i], last = new Date(M.y, M.m, 0).getDate();
  return `01/${p2(M.m)}/${M.y} – ${last}/${p2(M.m)}/${M.y}`;
};

/** Khối thu (sọc xanh) / trừ (sọc đỏ) — gập được như phiếu giấy. */
function SlipBlock({ name, total, lines, neg }: { name: string; total: number; lines: [string, number][]; neg?: boolean }) {
  const tone = neg ? "bad" : "ok";
  const sign = neg ? "− " : "";
  return (
    <Collapsible
      className={cn(
        "group/blk overflow-hidden rounded-xl border border-l-[5px] bg-card",
        neg ? "border-l-destructive" : "border-l-success",
      )}
    >
      <CollapsibleTrigger className={cn("flex min-h-13 w-full items-center gap-3 px-4 py-3 text-left text-base", neg ? "bg-destructive/10" : "bg-success/10")}>
        <b className="flex-1">{name}</b>
        <b className={cn("tabular-nums", neg ? "text-destructive" : "text-success")}>
          {sign}
          {fmt(total)}
        </b>
        <ChevronRightIcon className="size-5 text-muted-foreground transition-transform group-data-[state=open]/blk:rotate-90" aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent className="divide-y border-t">
        {lines.map((l) => (
          <Row key={l[0]} label={l[0]} value={sign + fmt(l[1])} tone={tone} />
        ))}
        {neg ? (
          <>
            <Row label="Số người phụ thuộc" value="1 người" />
            <Row label="Thu nhập chịu thuế" value="0" />
            <Row label="Thuế thu nhập cá nhân" value="0" tone="bad" />
          </>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PayslipDetail({ i, viewing, go }: { i: number; viewing: Worker | null; go: Go }) {
  const M = MONTHS[i], s = slip(M), who = viewing ?? ME;
  return (
    <>
      <Box>
        <Fold
          head={
            <>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{initials(who.ten)}</span>
              <div>
                <b>{who.ten}</b>
                <div className="text-muted-foreground text-sm">Mã nhân viên {who.ma}</div>
              </div>
            </>
          }
        >
          <Row label="Bộ phận" value="Xưởng 1 · Chuyền 05" />
          <Row label="Chức danh" value="Công nhân may" />
          <Row label="Bậc lương" value="Bậc 3" />
          <Row label="Hạng KPI" value="A" />
          <Row label="Lương cơ bản" value="5.300.000 đ" />
          <Row label="Tài khoản nhận lương" value={<>****6789<div className="font-normal text-muted-foreground text-sm">Ngân hàng Demo</div></>} />
        </Fold>
      </Box>
      <BigStat
        tone="info"
        label={<>Thực lĩnh {i ? <StatusBadge tone="ok">Đã chi trả</StatusBadge> : <StatusBadge tone="info">Đã chốt · chuyển khoản 10/11</StatusBadge>}</>}
        value={`${fmt(M.net)} đ`}
      >
        <div className="text-muted-foreground text-sm">= Tổng thu nhập − Tổng khoản trừ</div>
      </BigStat>
      <SlipBlock name="B. Tổng thu nhập" total={s.T} lines={s.thu} />
      <SlipBlock name="C. Tổng khoản trừ" total={s.R} lines={s.tru} neg />

      <SectionTitle>A. Ngày công & giờ làm</SectionTitle>
      <Box>
        <Row label="Ngày công thực tế" value={`${M.cong} ngày`} />
        <Row label="Ngày nghỉ có lương" value="1,5 ngày" />
        <Row label="Giờ làm theo sản phẩm" value={`${hrs(M.cong * 8 - 4)} giờ`} />
        <Row label="Giờ tăng ca theo sản phẩm" value="14 giờ" />
        <Row label="Giờ làm theo thời gian" value="4 giờ" />
        <Row label="Giờ nghỉ giữa ca" value={`${hrs(M.cong * 0.5)} giờ`} />
        <Row label="Giờ hưởng chế độ lao động nữ" value="13 giờ" />
      </Box>
      <Button variant="outline" className="h-14 rounded-xl border-primary text-lg text-primary" onClick={() => go({ id: "ts" })}>
        📮 Thắc mắc, gửi tra soát phiếu này
      </Button>
      <Button variant="outline" className="h-14 rounded-xl border-primary text-lg text-primary" onClick={() => go({ id: "hoi" })}>
        💬 Hỏi về các khoản trong phiếu
      </Button>
      <Note>Mọi thắc mắc về phiếu lương vui lòng gửi tra soát ngày công / sản phẩm trên app hoặc liên hệ Phòng Nhân sự.</Note>
    </>
  );
}

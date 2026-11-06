"use client";

import { Button, Card, cn } from "@erp/miniapp-ui";
import { useState } from "react";
import { type Att, att, D, dm, hrs, type Leave, WD } from "@/data/app-cong-nhan";
import { Box, ClosedBadge, type Go, MiniStat, Note, Row, SectionTitle, StatusBadge, Stepper, type Tone } from "./ui";

/*
 * Lịch tháng: theo cong-nhan `attendance-month-calendar.tsx` (tuần bắt đầu Thứ Hai,
 * chạm 1 ngày để xem chi tiết bên dưới), nhưng mỗi ô tô màu theo loại công như bản HTML.
 */
const HEAD: Record<string, string> = {
  w: "bg-emerald-500 text-white",
  l: "bg-amber-500 text-white",
  h: "bg-sky-500 text-white",
  p: "bg-sky-500 text-white",
  x: "bg-orange-500 text-white",
};
const LEGEND: [string, string][] = [
  ["bg-emerald-500", "Có mặt"],
  ["bg-amber-500", "Đi muộn, về sớm"],
  ["bg-sky-500", "Nghỉ phép, lễ"],
  ["bg-orange-500", "Không có công"],
];
export const CAL_MIN = 9, CAL_MAX = 11;

function DayCell({ day, a, selected, onPick, m }: { day: number; a: Att; selected: boolean; onPick: () => void; m: number }) {
  const centered = a.k === "s" || a.k === "f" || a.k === "t";
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      aria-label={`Ngày ${day}/${m}`}
      className={cn(
        "flex min-h-[58px] flex-col overflow-hidden rounded-lg border bg-card text-muted-foreground text-xs leading-tight",
        centered && "justify-center",
        a.k === "s" && "bg-muted",
        a.k === "t" && "outline-2 outline-primary",
        selected && "outline-[3px] outline-foreground -outline-offset-1",
      )}
    >
      <i className={cn("py-0.5 font-bold text-sm not-italic", HEAD[a.k] ?? "font-semibold text-foreground")}>{day}</i>
      {a.gio ? (
        <>
          <small className="text-[11px]">{hrs(a.gio)} giờ</small>
          {a.tc ? <small className="text-[11px]">TC {hrs(a.tc)}</small> : null}
        </>
      ) : a.k === "p" ? (
        <small className="text-[11px]">Nghỉ</small>
      ) : a.k === "x" ? (
        <small className="text-[11px]">0 giờ</small>
      ) : null}
    </button>
  );
}

function DayInfo({ d, a, closed, go }: { d: Date; a: Att; closed: boolean; go: Go }) {
  const head = (label: string, tone: Tone) => (
    <Row label={<b>{`${WD[d.getDay()]}, ${dm(d)}`}</b>} value={<StatusBadge tone={tone}>{label}</StatusBadge>} />
  );
  const lv = (l?: Leave) =>
    l ? (
      <>
        <Row label="Loại nghỉ" value={(l.buoi !== "Cả ngày" ? "Nửa ngày " : "") + l.type.toLowerCase()} />
        <Row label="Số công" value={l.buoi === "Cả ngày" ? "1 công" : "0,5 công"} />
        <Row label="Có lương" value={/không/.test(l.type) ? "Không" : "Có"} />
      </>
    ) : null;
  const report = (
    <div className="px-4 py-3">
      <Button variant="outline" className="h-12 w-full rounded-full text-base" onClick={() => go({ id: "ts" })}>
        ⚠️ Báo sai ngày công
      </Button>
    </div>
  );
  const note = (text: string) => (
    <div className="px-4 py-3">
      <Note>{text}</Note>
    </div>
  );

  if (a.gio)
    return (
      <Box>
        {head(a.k === "l" ? "Đi muộn" : a.k === "h" ? "Nửa ngày" : "Có mặt", a.k === "l" ? "warn" : "ok")}
        <Row label="Ca làm việc" value="SX 07:30 – 16:30" />
        <Row label="Giờ vào – ra" value={`${a.vao} – ${a.ra}`} />
        {a.muon ? <Row label="Đi muộn" value={`${a.muon} phút`} tone="warn" /> : null}
        <Row label="Về sớm" value="—" />
        <Row label="Giờ làm trong ca" value={`${hrs(a.gio)} giờ`} />
        {a.tc ? <Row label="Tăng ca ngày thường" value={`${hrs(a.tc)} giờ`} /> : null}
        <Row label="Loại công" value={a.cong} />
        {lv(a.lv)}
        <Row label="Chốt công" value={<ClosedBadge tmp={!closed} />} />
        {report}
      </Box>
    );
  if (a.k === "p")
    return (
      <Box>
        {head(a.fut ? "Đã đăng ký" : "Nghỉ có đơn", "info")}
        {lv(a.lv)}
      </Box>
    );
  if (a.k === "x")
    return (
      <Box>
        {head("Không có công", "bad")}
        {note("Không có giờ vào / ra và không có đơn nghỉ. Nếu chị có đi làm, hãy báo sai ngày công.")}
        {report}
      </Box>
    );
  if (a.k === "s")
    return (
      <Box>
        {head("Nghỉ tuần", "gray")}
        {note("Chủ nhật — ngày nghỉ hằng tuần.")}
      </Box>
    );
  return (
    <Box>
      {head(a.k === "t" ? "Hôm nay" : "Chưa tới", "gray")}
      {note("Dữ liệu chấm công về sau ngày làm việc. Hôm nay sẽ có vào sáng mai.")}
    </Box>
  );
}

export function AttendanceScreen({
  month,
  onMonth,
  leaves,
  go,
}: {
  month: number;
  onMonth: (m: number) => void;
  leaves: Leave[];
  go: Go;
}) {
  const m = month, n = new Date(2026, m, 0).getDate(), pad = (D(1, m).getDay() + 6) % 7;
  const days = Array.from({ length: n }, (_, i) => ({ day: i + 1, a: att(D(i + 1, m), leaves) }));
  const cnt = { w: 0, l: 0, h: 0, p: 0, x: 0 };
  let gio = 0, tc = 0;
  for (const { a } of days) {
    if (a.k in cnt && !a.fut) cnt[a.k as keyof typeof cnt]++;
    gio += a.gio ?? 0;
    tc += a.tc ?? 0;
  }
  const fallback = (days.find((x) => x.a.k === "t") ?? days.find((x) => x.a.k === "w"))?.day ?? 1;
  const [sel, setSel] = useState<{ m: number; day: number } | null>(null);
  const day = sel?.m === m ? sel.day : fallback;
  const closed = m < CAL_MAX;
  const step = (k: number) => onMonth(Math.max(CAL_MIN, Math.min(CAL_MAX, m + k)));

  return (
    <>
      <Stepper label={`Tháng ${m}/2026`} onPrev={() => step(-1)} onNext={() => step(1)} />
      <div className="grid grid-cols-3 gap-2.5">
        <MiniStat label="Ngày công" value={hrs(cnt.w + cnt.l + cnt.h / 2)} />
        <MiniStat label="Giờ trong ca" value={hrs(gio)} />
        <MiniStat label="Tăng ca" value={`${hrs(tc)} giờ`} />
        <MiniStat label="Đi muộn" value={`${cnt.l} lần`} tone={cnt.l ? "warn" : undefined} />
        <MiniStat label="Nghỉ có đơn" value={`${hrs(cnt.p + cnt.h / 2)} ngày`} />
        <MiniStat label="Không có công" value={cnt.x} tone={cnt.x ? "bad" : undefined} />
      </div>
      <Card className="gap-0 py-0">
        <div className="grid grid-cols-7 gap-1 p-2.5">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((h) => (
            <div key={h} className="py-1 text-center font-semibold text-muted-foreground text-sm">
              {h}
            </div>
          ))}
          {Array.from({ length: pad }, (_, i) => (
            <div key={`e${i}`} />
          ))}
          {days.map((x) => (
            <DayCell key={x.day} m={m} day={x.day} a={x.a} selected={x.day === day} onPick={() => setSel({ m, day: x.day })} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 px-3.5 pb-3 text-muted-foreground text-sm">
          {LEGEND.map(([c, l]) => (
            <span key={l} className="flex items-center gap-1">
              <i className={cn("inline-block size-3 rounded-sm", c)} aria-hidden />
              {l}
            </span>
          ))}
        </div>
      </Card>
      <DayInfo d={D(day, m)} a={att(D(day, m), leaves)} closed={closed} go={go} />
      <SectionTitle>Tổng hợp tháng</SectionTitle>
      <Box>
        <Row label="Đi làm" value={`${cnt.w + cnt.l} ngày`} />
        <Row label="Nửa ngày việc riêng có lương" value={`${cnt.h} ngày`} />
        <Row label="Phép năm" value={`${cnt.p} ngày`} />
        <Row label="Không có công" value={`${cnt.x} ngày`} tone={cnt.x ? "bad" : undefined} />
        <Row label="Thiếu giờ vào / ra" value="0 ngày" />
        <Row label="Giờ làm đêm" value="0 giờ" />
      </Box>
    </>
  );
}

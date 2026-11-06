"use client";

import { Button, Field, FieldError, FieldLabel, Input, Textarea } from "@erp/miniapp-ui";
import { useState } from "react";
import { addD, dm, hrs, LEADER, type Leave, LEAVE_BALANCE, LEAVE_FLOW, LEAVE_PARTS, LEAVE_TYPES } from "@/data/app-cong-nhan";
import { Box, Chips, Fold, type Go, MiniStat, Note, Row, SectionTitle, StatusBadge, Steps, type Tone } from "./ui";

const ST_TONE: Record<string, Tone> = { "Đã duyệt": "ok", "Từ chối": "bad", "Chờ duyệt": "warn", "Đã hủy": "gray" };

/* ---------- Nghỉ phép: số dư + đơn của tôi ---------- */
export function LeaveScreen({ leaves, onCancel, go }: { leaves: Leave[]; onCancel: (id: string) => void; go: Go }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2.5">
        {LEAVE_BALANCE.map(([name, total, used]) => (
          <MiniStat key={name} label={name} value={`Còn ${hrs(total - used)}`} tone="ok" sub={`Đã dùng ${hrs(used)}/${total} ngày`} />
        ))}
      </div>
      <Button className="h-14 rounded-xl font-bold text-lg" onClick={() => go({ id: "donmoi" })}>
        ＋ Xin nghỉ phép
      </Button>
      <SectionTitle>Đơn của tôi</SectionTitle>
      <Box>
        {leaves.map((r) => (
          <Fold
            key={r.id}
            head={
              <>
                <div className="min-w-0 flex-1">
                  {r.type}
                  <div className="text-muted-foreground text-sm">
                    {r.from === r.to ? r.from : `${r.from} – ${r.to}`} · {r.buoi}
                  </div>
                </div>
                <StatusBadge tone={ST_TONE[r.st]}>{r.st}</StatusBadge>
              </>
            }
          >
            <Row label="Mã đơn" value={r.id} />
            <Row label="Gửi lúc" value={r.sent} />
            <Row label="Lý do" sub={r.why} />
            <Steps steps={LEAVE_FLOW.map((s, j) => ({ label: j === 1 ? `${s} · ${LEADER}` : s, state: r.flow[j] }))} />
            {r.note ? (
              <div className="px-4 py-3">
                <Note>Lý do từ chối: {r.note}</Note>
              </div>
            ) : null}
            {r.st === "Chờ duyệt" ? (
              <div className="px-4 py-3">
                <Button variant="outline" className="h-12 w-full rounded-full text-base" onClick={() => onCancel(r.id)}>
                  Hủy đơn
                </Button>
              </div>
            ) : null}
          </Fold>
        ))}
      </Box>
    </>
  );
}

/* ---------- Xin nghỉ phép ---------- */
export function LeaveForm({ count, onSubmit }: { count: number; onSubmit: (l: Leave) => void }) {
  const [type, setType] = useState(LEAVE_TYPES[0]);
  const [part, setPart] = useState(LEAVE_PARTS[0]);
  const [from, setFrom] = useState("2026-11-20");
  const [to, setTo] = useState("2026-11-20");
  const [why, setWhy] = useState("");
  const [err, setErr] = useState("");

  const send = () => {
    const a = new Date(`${from}T00:00`), b = new Date(`${to}T00:00`), reason = why.trim();
    const e =
      Number.isNaN(+a) || Number.isNaN(+b) || b < a
        ? "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu."
        : reason.length < 3
          ? "Nhập lý do ngắn gọn (tối thiểu 3 ký tự)."
          : "";
    setErr(e);
    if (e) return;
    const days: string[] = [];
    for (let d = a; d <= b; d = addD(d, 1)) days.push(dm(d));
    const now = new Date();
    onSubmit({
      id: `NP-2611-00${43 + count}`, type, from: days[0], to: days[days.length - 1], days, buoi: part, why: reason,
      st: "Chờ duyệt", sent: `06/11 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      flow: ["done", "now", ""],
    });
  };

  return (
    <>
      <Field>
        <FieldLabel className="text-[15px]">Loại nghỉ</FieldLabel>
        <Chips options={LEAVE_TYPES} value={type} onChange={setType} label="Loại nghỉ" />
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field>
          <FieldLabel htmlFor="lv-from" className="text-[15px]">Từ ngày</FieldLabel>
          <Input id="lv-from" type="date" className="h-13 text-base" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="lv-to" className="text-[15px]">Đến ngày</FieldLabel>
          <Input id="lv-to" type="date" className="h-13 text-base" value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
      </div>
      <Field>
        <FieldLabel className="text-[15px]">Buổi</FieldLabel>
        <Chips options={LEAVE_PARTS} value={part} onChange={setPart} label="Buổi" />
      </Field>
      <Field data-invalid={!!err || undefined}>
        <FieldLabel htmlFor="lv-why" className="text-[15px]">Lý do</FieldLabel>
        <Textarea id="lv-why" className="min-h-24 text-base" maxLength={200} placeholder="Ví dụ: Đưa con đi khám" value={why} onChange={(e) => setWhy(e.target.value)} />
        {err ? <FieldError className="text-base">{err}</FieldError> : null}
      </Field>
      <Box>
        <Row label={<b>Đơn sẽ đi qua</b>} />
        <Steps steps={["Trưởng chuyền duyệt (trong ngày)", "Phòng Nhân sự xác nhận", "Báo kết quả về app"].map((label) => ({ label, state: "" }))} />
      </Box>
      <Button className="h-14 rounded-xl font-bold text-lg" onClick={send}>
        Gửi đơn
      </Button>
    </>
  );
}

"use client";

import { Badge, Button, Card, Field, FieldLabel, Input, Progress, SearchField, Switch, Textarea, cn } from "@erp/miniapp-ui";
import { SendIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ASSIGNS, KPI_BARS, KPI_HISTORY, LINE_WORKERS, ME, MORE, NOTICE_FILTERS, NOTICES, type Notice, norm, PROFILE,
  PROFILE_STATS, QA, QA_FALLBACK, REVIEW_KINDS, type Review, reviewTarget, SKILLS, type Worker,
} from "@/data/app-cong-nhan";
import { fmt } from "@/lib/format";
import { BigStat, Bold, Box, Chips, Fold, type Go, Initials, Note, Row, SectionTitle, StatusBadge, Tiles, type Tone } from "./ui";

/* ---------- Hồ sơ (theo cong-nhan profile-hero + profile-records) ---------- */
export function ProfileScreen() {
  return (
    <>
      <Box>
        <div className="flex items-center gap-3 px-4 py-3">
          <Initials name={ME.ten} className="size-16 text-[22px]" />
          <div>
            <b className="text-[19px]">{ME.ten}</b>
            <div className="text-muted-foreground text-sm">Mã nhân viên {ME.ma}</div>
            <div className="text-muted-foreground text-sm">Công nhân may · Chuyền 05</div>
          </div>
        </div>
      </Box>
      <div className="grid grid-cols-3 gap-2.5">
        {PROFILE_STATS.map(([l, v]) => (
          <Card key={l} className="gap-1 p-3 text-center">
            <div className="text-muted-foreground text-sm">{l}</div>
            <b className="text-xl">{v}</b>
          </Card>
        ))}
      </div>
      {PROFILE.map((g) => (
        <Box key={g.title}>
          <Fold defaultOpen={g.open} head={<><span className="text-[22px]" aria-hidden>{g.icon}</span><b>{g.title}</b></>}>
            {g.rows.map(([l, v]) => (
              <Row key={l} label={l} value={v === "Đang đóng" ? <StatusBadge tone="ok">{v}</StatusBadge> : v} />
            ))}
          </Fold>
        </Box>
      ))}
      <Note>Thông tin chưa đúng? Liên hệ Phòng Nhân sự để cập nhật.</Note>
    </>
  );
}

/* ---------- Phân công công đoạn ---------- */
export function AssignScreen() {
  return (
    <>
      <BigStat tone="info" label="Đang làm hôm nay · Chuyền 05">
        <div className="mt-1 font-bold text-2xl text-primary">CĐ 18 – Tra cổ</div>
        <div className="text-muted-foreground text-sm">AO-POLO-2611 · Trạm 12 · đơn giá 1.100 đ/sp</div>
      </BigStat>
      {ASSIGNS.map((p) => (
        <Box key={p.mh + p.stt}>
          <Fold
            head={
              <>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    Mã hàng <b className="rounded-md bg-primary px-2 py-0.5 text-base text-primary-foreground">{p.mh}</b>
                  </div>
                  <b className="mt-1.5 block">
                    CĐ {p.stt} – {p.buoc}
                  </b>
                  <div className="text-muted-foreground text-sm">
                    {p.cum} · {p.tram} · {p.tu} – {p.den}
                  </div>
                </div>
                <b className="tabular-nums">{fmt(p.dgTh)} đ</b>
              </>
            }
          >
            <Row label="Khách hàng" value={p.kh} />
            <Row label="Cụm / Trạm" value={`${p.cum} · ${p.tram}`} />
            <Row label="STT công đoạn" value={p.stt} />
            <Row label="Bước công việc" value={p.buoc} />
            <Row label="Thiết bị" value={p.tb} />
            <Row label="Bậc công việc" value={`Bậc ${p.bac}`} />
            <Row label="% thực hiện" value={`${p.pct}%`} />
            <Row label="Đơn giá chuẩn" value={`${fmt(p.dgChuan)} đ`} />
            <Row label="Đơn giá tháng" value={`${fmt(p.dgThang)} đ`} />
            <Row label="Đơn giá thực hiện" value={`${fmt(p.dgTh)} đ`} />
            <Row label="Từ – đến" value={`${p.tu} – ${p.den}`} />
          </Fold>
        </Box>
      ))}
      <Note>Phân công do trưởng chuyền lập theo ngày. Đổi công đoạn giữa ngày thì lương tính theo từng công đoạn.</Note>
    </>
  );
}

/* ---------- Tay nghề & KPI ---------- */
export function KpiScreen() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <BigStat tone="ok" label="Hạng KPI tháng 10" value="A" />
        <BigStat
          label="Bậc thợ"
          value={
            <>
              3<span className="font-normal text-muted-foreground text-sm">/7</span>
            </>
          }
        />
      </div>
      <Box>
        {KPI_BARS.map((b) => (
          <div key={b.label} className="px-4 py-3 text-base">
            <div className="flex justify-between">
              {b.label}
              <b className={cn(b.warn && "text-warning")}>{b.value}</b>
            </div>
            <Progress value={b.pct} className="mt-1.5 h-2.5" indicatorClassName={b.warn ? "bg-warning" : "bg-success"} />
          </div>
        ))}
      </Box>
      <SectionTitle>Công đoạn biết làm</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((s) => (
          <Badge key={s} variant="outline" className="h-11 rounded-full px-4 font-normal text-base">
            {s}
          </Badge>
        ))}
      </div>
      <SectionTitle>6 tháng gần nhất</SectionTitle>
      <Box>
        {KPI_HISTORY.map(([m, r, pct]) => (
          <Row
            key={m}
            label={
              <>
                Tháng {m}
                <span className="ml-2 text-muted-foreground text-sm">hiệu suất {pct}</span>
              </>
            }
            value={<StatusBadge tone={r === "A" ? "ok" : "info"}>Hạng {r}</StatusBadge>}
          />
        ))}
      </Box>
      <Note>Hạng A: +200.000 đ thưởng tháng. Thi nâng bậc thợ đợt tới: 12/2026, đăng ký với trưởng chuyền.</Note>
    </>
  );
}

/* ---------- Tra soát & góp ý ---------- */
const TS_TONE: Record<string, Tone> = { "Đã gửi": "info", "Đang xử lý": "warn", "Đã xử lý": "ok", "Từ chối": "bad", "Đã hủy": "gray" };
export function ReviewScreen({ reviews, onSubmit }: { reviews: Review[]; onSubmit: (r: Review) => void }) {
  const [kind, setKind] = useState(REVIEW_KINDS[0]);
  const [date, setDate] = useState("05/11/2026");
  const [content, setContent] = useState("");
  const [ok, setOk] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const send = () => {
    const c = content.trim();
    if (c.length < 3) return contentRef.current?.focus();
    if ((fileRef.current?.files?.length ?? 0) > 3) return void toast.error("Chỉ gửi tối đa 3 ảnh.");
    const to = reviewTarget(kind);
    onSubmit({ ma: `YC-04${13 + reviews.length}`, k: kind, dt: date, c, to, st: "Đã gửi", at: "06/11" });
    setContent("");
    if (fileRef.current) fileRef.current.value = "";
    setOk(`✓ Đã gửi tới ${to}. Kết quả báo về mục Thông báo.`);
  };

  return (
    <>
      <Box>
        <Row label={<b>Gửi yêu cầu mới</b>} />
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <Chips options={REVIEW_KINDS} value={kind} onChange={setKind} label="Loại yêu cầu" />
          <Field>
            <FieldLabel htmlFor="ts-d" className="text-[15px]">Ngày / phiếu liên quan</FieldLabel>
            <Input id="ts-d" className="h-13 text-base" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="ts-c" className="text-[15px]">Nội dung</FieldLabel>
            <Textarea
              id="ts-c"
              ref={contentRef}
              className="min-h-24 text-base"
              maxLength={500}
              placeholder="Ví dụ: Ngày 05/11 em quẹt thẻ 07:20 nhưng app ghi đi muộn"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ts-p" className="text-[15px]">Ảnh chụp (tối đa 3)</FieldLabel>
            <Input id="ts-p" ref={fileRef} type="file" accept="image/*" multiple className="h-13 pt-3 text-base" />
          </Field>
          <Button className="h-14 rounded-xl font-bold text-lg" onClick={send}>
            Gửi
          </Button>
        </div>
      </Box>
      {ok ? <div className="rounded-xl bg-success/10 px-3.5 py-3 font-semibold text-success">{ok}</div> : null}
      <SectionTitle>Yêu cầu đã gửi</SectionTitle>
      <Box>
        {reviews.map((t) => (
          <Fold
            key={t.ma}
            head={
              <>
                <div className="min-w-0 flex-1">
                  {t.k}
                  <div className="text-muted-foreground text-sm">
                    {t.ma} · gửi {t.at} · {t.dt}
                  </div>
                </div>
                <StatusBadge tone={TS_TONE[t.st]}>{t.st}</StatusBadge>
              </>
            }
          >
            <Row label="Nội dung" sub={t.c} />
            <Row label="Chuyển tới" value={t.to} />
            {t.rep ? <Row label="Phản hồi" sub={t.rep} /> : null}
          </Fold>
        ))}
      </Box>
    </>
  );
}

/* ---------- Thông báo ---------- */
export function NoticeList({ items, go }: { items: Notice[]; go: Go }) {
  return (
    <Box>
      {items.map((t) => (
        <Row
          key={t.text}
          className={cn(t.unread && "bg-primary/10")}
          onClick={t.to ? () => go(t.to!) : undefined}
          label={
            <span className="flex gap-3">
              <span className="text-[22px]" aria-hidden>
                {t.icon}
              </span>
              <span>
                {t.text}
                <span className="block text-muted-foreground text-sm">{t.meta}</span>
              </span>
            </span>
          }
        />
      ))}
    </Box>
  );
}
export function NoticeScreen({ go }: { go: Go }) {
  const [f, setF] = useState("Tất cả");
  return (
    <>
      <Chips options={NOTICE_FILTERS} value={f} onChange={setF} label="Lọc thông báo" />
      <NoticeList items={NOTICES.filter((t) => f === "Tất cả" || t.cat === f)} go={go} />
    </>
  );
}

/* ---------- Hỏi đáp chính sách ---------- */
export type ChatMsg = { me: boolean; text: string; src?: string };
export function ChatScreen({ msgs, onAsk }: { msgs: ChatMsg[]; onAsk: (q: string) => void }) {
  const [q, setQ] = useState("");
  const ask = (text: string) => {
    if (!text.trim()) return;
    onAsk(text.trim());
    setQ("");
  };
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border bg-card px-3.5 py-3 text-base leading-normal">
          Chào chị Hoa 👋 Chị muốn hỏi gì về lương, chế độ, phụ cấp, nội quy? Chọn câu hỏi bên dưới hoặc tự gõ.
        </div>
        {msgs.map((m, i) =>
          m.me ? (
            <div key={i} className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-primary px-3.5 py-3 text-base text-primary-foreground leading-normal">
              {m.text}
            </div>
          ) : (
            <div key={i} className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border bg-card px-3.5 py-3 text-base leading-normal">
              <Bold text={m.text} />
              <span className="mt-2 block font-semibold text-primary text-sm">📄 {m.src}</span>
            </div>
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(QA).map((k) => (
          <Button key={k} variant="outline" className="h-auto min-h-11 whitespace-normal rounded-full px-3.5 py-2 text-left text-[15px] font-normal" onClick={() => ask(k)}>
            {k}
          </Button>
        ))}
      </div>
      <form
        className="sticky bottom-24 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <Input className="h-13 flex-1 bg-card text-base" placeholder="Gõ câu hỏi…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Câu hỏi" />
        <Button type="submit" size="icon-lg" className="size-13 rounded-xl" aria-label="Gửi">
          <SendIcon className="size-5" />
        </Button>
      </form>
    </>
  );
}
export const answer = (q: string): ChatMsg => {
  const [text, src] = QA[q] ?? QA_FALLBACK;
  return { me: false, text, src };
};

/* ---------- Thêm ---------- */
export function MenuScreen({ go, lead, onLead }: { go: Go; lead: boolean; onLead: (v: boolean) => void }) {
  return (
    <>
      <Box>
        <Row
          onClick={() => go({ id: "hoso" })}
          label={
            <span className="flex items-center gap-3">
              <Initials name={ME.ten} className="size-13 text-lg" />
              <span>
                <b className="text-lg">{ME.ten}</b>
                <span className="block text-muted-foreground text-sm">{ME.ma} · Công nhân may · Chuyền 05</span>
              </span>
            </span>
          }
        />
      </Box>
      <Tiles items={MORE} go={go} />
      <SectionTitle>Chế độ trưởng chuyền</SectionTitle>
      <Box>
        <label htmlFor="lead-on" className="flex min-h-13 cursor-pointer items-center gap-3 px-4 py-3 text-base">
          <div className="flex-1">
            Xem lương, chấm công của công nhân trong chuyền
            <div className="text-muted-foreground text-sm">Chỉ trưởng / phó chuyền. Chỉ xem.</div>
          </div>
          <Switch id="lead-on" checked={lead} onCheckedChange={onLead} />
        </label>
      </Box>
      <Note>Quên mật khẩu? Liên hệ Phòng Nhân sự để cấp lại. Phiên bản demo 06/11/2026.</Note>
    </>
  );
}

/* ---------- Trưởng chuyền: tìm công nhân trong chuyền (theo cong-nhan line-worker-picker) ---------- */
export function LeadBox({
  q,
  onQ,
  viewing,
  onPick,
}: {
  q: string;
  onQ: (v: string) => void;
  viewing: Worker | null;
  onPick: (w: Worker) => void;
}) {
  const hits = LINE_WORKERS.filter((w) => norm(`${w.ma} ${w.ten}`).includes(norm(q)));
  const workerRow = (w: Worker, click?: boolean) => (
    <Row
      key={w.ma}
      onClick={click ? () => onPick(w) : undefined}
      label={
        <span className="flex items-center gap-3">
          <Initials name={w.ten} />
          <span>
            <b>{w.ten}</b>
            <span className="block text-muted-foreground text-sm">{w.ma} · Công nhân may · Chuyền 05</span>
          </span>
        </span>
      }
    />
  );
  return (
    <section className="flex flex-col gap-2 rounded-xl bg-accent p-3">
      <SearchField className="h-13 bg-card text-base" placeholder="Tìm công nhân: mã NV hoặc tên" value={q} onChange={(e) => onQ(e.target.value)} aria-label="Tìm công nhân" />
      {viewing && !q ? (
        <>
          <div className="text-muted-foreground text-sm">Đang xem</div>
          <Box>{workerRow(viewing)}</Box>
          <Note>Chỉ xem. Thấy sai, hướng dẫn công nhân gửi tra soát trên app của họ.</Note>
        </>
      ) : (
        <Box>{hits.length ? hits.map((w) => workerRow(w, true)) : <Row label={<span className="text-muted-foreground">Không có công nhân này trong chuyền</span>} />}</Box>
      )}
    </section>
  );
}

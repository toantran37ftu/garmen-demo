"use client";

import { Badge, Card } from "@erp/miniapp-ui";
import { Check, ChevronRightIcon, Clock3, type LucideIcon, MinusCircle, RotateCcw, Send, ShoppingBag, Undo2 } from "lucide-react";
import { useState } from "react";
import { COUNTER, D, LEADER, TRADE_FILTERS, TRADE_MONTHS, TRADES, type Trade, WD } from "@/data/app-cong-nhan";
import { fmt } from "@/lib/format";
import { Box, Chips, type Go, MiniStat, Note, Row, SectionTitle, Signed, Stepper } from "./ui";

/* Badge loại / trạng thái — chép từ cong-nhan `trade-badges.tsx` (cùng màu, cùng icon). */
const KIND: Record<string, [LucideIcon, string]> = {
  Mua: [ShoppingBag, "bg-success/15 text-success"],
  Bán: [RotateCcw, "bg-destructive/10 text-destructive"],
  "Trả hàng": [Undo2, "bg-warning/15 text-warning"],
  "Trừ hàng": [MinusCircle, "bg-muted text-muted-foreground"],
  "Kiểm hàng": [Check, "bg-muted text-muted-foreground"],
};
const STATUS: Record<string, [LucideIcon, string]> = {
  "Chờ chốt SL": [Clock3, "bg-warning/15 text-warning"],
  "Chờ xác nhận": [Send, "bg-primary/10 text-primary"],
  "Hoàn thành": [Check, "bg-success/15 text-success"],
};
function IconBadge({ map, value }: { map: Record<string, [LucideIcon, string]>; value: string }) {
  const [Icon, cls] = map[value] ?? [ShoppingBag, "bg-muted text-muted-foreground"];
  return (
    <Badge className={`h-7 px-2.5 text-sm ${cls}`}>
      <Icon className="size-3.5" aria-hidden /> {value}
    </Badge>
  );
}
export const TradeTypeBadge = ({ type }: { type: string }) => <IconBadge map={KIND} value={type} />;
export const TradeStatusBadge = ({ status }: { status: string }) => <IconBadge map={STATUS} value={status} />;

function TradeItem({ t, onOpen }: { t: Trade; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="w-full px-4 py-3 text-left active:bg-muted">
      <div className="flex flex-wrap items-center gap-1.5 text-base">
        <TradeTypeBadge type={t.type} />
        <b>
          CĐ {t.cd} – {t.ten}
        </b>
        {t.ot ? <Badge variant="secondary" className="h-7 text-sm">Ngoài giờ</Badge> : null}
      </div>
      <div className="mt-2 flex justify-between">
        <div className="text-muted-foreground text-sm">
          Số lượng
          <b className={`block text-lg tabular-nums ${t.sign > 0 ? "text-success" : "text-destructive"}`}>
            {t.sign > 0 ? "+ " : "− "}
            {t.sl} sp
          </b>
        </div>
        <div className="text-right text-muted-foreground text-sm">
          Thành tiền
          <b className="block text-lg">
            <Signed n={t.tien} unit=" đ" />
          </b>
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-muted-foreground text-sm">
        Phiếu {t.ma} · <span className={t.st === "Hoàn thành" ? "text-success" : "text-warning"}>{t.st}</span>
        <ChevronRightIcon className="size-4" aria-hidden />
      </div>
    </button>
  );
}

/* ---------- Mua bán công đoạn ---------- */
export function TradesScreen({ go }: { go: Go }) {
  const [mi, setMi] = useState(TRADE_MONTHS.length - 1);
  const [fil, setFil] = useState("Tất cả");
  const m = TRADE_MONTHS[mi];
  const all = TRADES.filter((t) => +t.d.slice(3) === m);
  const list = all.filter((t) => fil === "Tất cả" || t.type === fil);
  const buy = all.filter((t) => t.sign > 0).reduce((a, t) => a + t.sl, 0);
  const sell = all.filter((t) => t.sign < 0).reduce((a, t) => a + t.sl, 0);
  const total = all.reduce((a, t) => a + t.tien, 0);
  const days = [...new Set(list.map((t) => t.d))].reverse();
  const step = (n: number) => setMi((v) => Math.max(0, Math.min(TRADE_MONTHS.length - 1, v + n)));

  return (
    <>
      <Stepper label={`Tháng ${m}/2026`} onPrev={() => step(-1)} onNext={() => step(1)} />
      <div className="grid grid-cols-3 gap-2.5">
        <MiniStat label="SL mua" value={`+ ${buy}`} tone="ok" />
        <MiniStat label="SL bán, trừ" value={`− ${sell}`} tone="bad" />
        <MiniStat label="Thành tiền" value={total ? <Signed n={total} /> : 0} />
      </div>
      <Chips options={TRADE_FILTERS} value={fil} onChange={setFil} label="Lọc loại giao dịch" />
      <div className="flex flex-col gap-2.5">
        {days.length ? (
          days.map((k) => {
            const ts = list.filter((t) => t.d === k);
            return (
              <div key={k} className="flex flex-col gap-2.5">
                <div className="flex items-baseline gap-2 border-b py-2">
                  <b className="text-xl">{k}</b>
                  <span className="text-base text-muted-foreground">{WD[D(+k.slice(0, 2), +k.slice(3)).getDay()]}</span>
                </div>
                {[...new Set(ts.map((t) => t.mh))].map((mh) => (
                  <Card key={mh} className="gap-0 divide-y overflow-hidden py-0">
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2.5 text-muted-foreground text-sm">
                      Mã hàng <b className="rounded-md bg-primary px-2.5 py-1 text-lg text-primary-foreground">{mh}</b>
                    </div>
                    {ts
                      .filter((t) => t.mh === mh)
                      .map((t) => (
                        <TradeItem key={t.ma} t={t} onOpen={() => go({ id: "voucher", arg: TRADES.indexOf(t) })} />
                      ))}
                  </Card>
                ))}
              </div>
            );
          })
        ) : (
          <Box>
            <Row label={<span className="text-muted-foreground">Chưa có phiếu mua bán</span>} />
          </Box>
        )}
      </div>
      <Note>
        Phiếu sai? Báo trưởng chuyền hoặc gửi{" "}
        <button type="button" className="font-semibold text-primary underline" onClick={() => go({ id: "ts" })}>
          tra soát sản phẩm
        </button>
        , ghi rõ mã phiếu.
      </Note>
    </>
  );
}

/* ---------- Chi tiết phiếu (chỉ xem) ---------- */
export function VoucherDetail({ i }: { i: number }) {
  const t = TRADES[i], o = COUNTER[t.type], done = t.st === "Hoàn thành";
  return (
    <>
      <Box>
        <Row label="Ngày giao dịch" value={`${t.d}/2026`} />
        <Row label="Mã hàng" value={t.mh} />
        <Row label="Chuyền" value="Chuyền 05" />
        <Row label="Trưởng chuyền lập phiếu" value={LEADER} />
        <Row label="Trạng thái" value={<TradeStatusBadge status={t.st} />} />
        <Row label="Ngày hoàn thành" value={done ? `${t.d}/2026` : "—"} />
      </Box>
      <SectionTitle>Giao dịch trên phiếu</SectionTitle>
      <Box>
        <Row label={<><TradeTypeBadge type={t.type} /> <b>Bạn</b></>} sub={`CĐ ${t.cd} – ${t.ten} · đơn giá ${fmt(t.dg)} đ`} value={`${t.sl} sp`} />
        <Row label={<><TradeTypeBadge type={o[1]} /> {o[0]}</>} sub={`CĐ ${t.cd} – ${t.ten}`} value={`${t.sl} sp`} />
      </Box>
      <Box>
        <Row label="SL thực tế" value={`${t.sl} sp`} />
        <Row label="SL trừ" value="0" />
        <Row label="SL trả" value="0" />
        <Row label="SL sau đối ứng" value={`${t.sl} sp`} />
        <Row label="Thành tiền" value={<Signed n={t.tien} unit=" đ" />} />
      </Box>
      <Note>Chờ chốt SL → Chờ xác nhận → Hoàn thành. Chỉ phiếu Hoàn thành mới vào lương sản phẩm.</Note>
    </>
  );
}

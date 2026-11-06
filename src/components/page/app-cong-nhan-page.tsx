"use client";

import { Button } from "@erp/miniapp-ui";
import { ChevronLeftIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { AttendanceScreen, CAL_MAX } from "@/components/features/app-cong-nhan/attendance-screen";
import { BottomNav, TABS } from "@/components/features/app-cong-nhan/bottom-nav";
import { HomeScreen } from "@/components/features/app-cong-nhan/home-screen";
import { LeaveForm, LeaveScreen } from "@/components/features/app-cong-nhan/leave-screens";
import {
  AssignScreen, answer, type ChatMsg, ChatScreen, KpiScreen, LeadBox, MenuScreen, NoticeScreen, ProfileScreen, ReviewScreen,
} from "@/components/features/app-cong-nhan/misc-screens";
import { PayScreen, PayslipDetail, slipPeriod, slipTitle, WeekDetail, weekTitle } from "@/components/features/app-cong-nhan/pay-screens";
import { TradesScreen, VoucherDetail } from "@/components/features/app-cong-nhan/trade-screens";
import { ClosedBadge } from "@/components/features/app-cong-nhan/ui";
import { LEAVES, type Nav, REVIEWS, type ScreenId, TRADES, type Worker } from "@/data/app-cong-nhan";

const TITLES: Partial<Record<ScreenId, string>> = {
  luong: "Lương", trades: "Mua bán công đoạn", cong: "Chấm công", nghi: "Nghỉ phép", donmoi: "Xin nghỉ phép",
  hoso: "Hồ sơ", pc: "Phân công công đoạn", kpi: "Tay nghề & KPI", ts: "Tra soát & góp ý", hoi: "Hỏi đáp chính sách",
  tb: "Thông báo", menu: "Thêm",
};
/** Màn có ô "Chế độ trưởng chuyền" khi bật. */
const LEAD_SCREENS: ScreenId[] = ["luong", "trades", "cong"];

export function AppCongNhanPage() {
  // Ngăn xếp màn: 5 tab gốc + màn chi tiết đè lên (nút ‹ quay lại).
  const [stack, setStack] = useState<Nav[]>([{ id: "home" }]);
  const [leaves, setLeaves] = useState(LEAVES);
  const [reviews, setReviews] = useState(REVIEWS);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [calMonth, setCalMonth] = useState(CAL_MAX);
  const [lead, setLead] = useState(false);
  const [viewing, setViewing] = useState<Worker | null>(null);
  const [lq, setLq] = useState("");

  const cur = stack[stack.length - 1];
  const go = (to: Nav) => {
    setStack((s) => (TABS.some((t) => t.id === to.id) ? [to] : [...s, to]));
    window.scrollTo(0, 0);
  };
  const back = () => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    window.scrollTo(0, 0);
  };
  const arg = cur.arg ?? 0;
  const viewingSub = viewing ? `${viewing.ten} · ${viewing.ma}` : "";

  let title = TITLES[cur.id] ?? "";
  let sub = "";
  let right: ReactNode = null;
  let body: ReactNode;
  switch (cur.id) {
    case "home": body = <HomeScreen go={go} />; break;
    case "luong": body = <PayScreen go={go} />; break;
    case "wk": title = weekTitle(arg); sub = viewingSub; body = <WeekDetail i={arg} />; break;
    case "phieu": title = slipTitle(arg); sub = slipPeriod(arg); body = <PayslipDetail i={arg} viewing={viewing} go={go} />; break;
    case "trades": body = <TradesScreen go={go} />; break;
    case "voucher": title = `Phiếu ${TRADES[arg].ma}`; sub = "Chỉ xem"; body = <VoucherDetail i={arg} />; break;
    case "cong":
      right = <ClosedBadge tmp={calMonth >= CAL_MAX} />;
      body = <AttendanceScreen month={calMonth} onMonth={setCalMonth} leaves={leaves} go={go} />;
      break;
    case "nghi":
      body = (
        <LeaveScreen
          leaves={leaves}
          go={go}
          onCancel={(id) => setLeaves((ls) => ls.map((l) => (l.id === id ? { ...l, st: "Đã hủy", flow: ["done", "", ""] } : l)))}
        />
      );
      break;
    case "donmoi":
      body = (
        <LeaveForm
          count={leaves.length}
          onSubmit={(l) => {
            setLeaves((ls) => [l, ...ls]);
            toast.success("Đã gửi đơn, chờ trưởng chuyền duyệt.");
            back();
          }}
        />
      );
      break;
    case "hoso": body = <ProfileScreen />; break;
    case "pc": body = <AssignScreen />; break;
    case "kpi": body = <KpiScreen />; break;
    case "ts": body = <ReviewScreen reviews={reviews} onSubmit={(r) => setReviews((rs) => [r, ...rs])} />; break;
    case "hoi": body = <ChatScreen msgs={chat} onAsk={(q) => setChat((c) => [...c, { me: true, text: q }, answer(q)])} />; break;
    case "tb": body = <NoticeScreen go={go} />; break;
    case "menu":
      body = (
        <MenuScreen
          go={go}
          lead={lead}
          onLead={(v) => {
            setLead(v);
            setViewing(null);
            setLq("");
          }}
        />
      );
      break;
  }

  return (
    <AppFrame slug="app-cong-nhan" nav="none" description="Bản mô phỏng trên khung điện thoại — dữ liệu giả.">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border bg-surface text-base shadow-lg">
        {cur.id !== "home" ? (
          <header className="flex min-h-17 items-center gap-3 border-b bg-card px-4 py-3">
            <Button
              variant="secondary"
              size="icon-lg"
              className={`size-11 rounded-full ${stack.length > 1 ? "" : "invisible"}`}
              onClick={back}
              aria-label="Quay lại"
            >
              <ChevronLeftIcon className="size-6" />
            </Button>
            <div className="min-w-0">
              <h1 className="font-bold text-xl leading-tight">{title}</h1>
              {sub ? <div className="text-muted-foreground text-sm">{sub}</div> : null}
            </div>
            {right ? <span className="ml-auto">{right}</span> : null}
          </header>
        ) : null}
        <section className="flex flex-1 flex-col gap-3.5 p-4 pb-28">
          {lead && LEAD_SCREENS.includes(cur.id) ? (
            <LeadBox
              q={lq}
              onQ={setLq}
              viewing={viewing}
              onPick={(w) => {
                setViewing(w);
                setLq("");
              }}
            />
          ) : null}
          {body}
        </section>
      </div>
      <BottomNav active={stack[0].id} onSelect={(id) => go({ id })} />
    </AppFrame>
  );
}

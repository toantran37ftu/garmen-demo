"use client";

import { Badge, Card } from "@erp/miniapp-ui";
import { BellIcon, ChevronRightIcon, PackageIcon, WalletIcon } from "lucide-react";
import type { ReactNode } from "react";
import { dm, ME, MONTHS, NOTICES, SHORTCUTS, slip, WEEKS } from "@/data/app-cong-nhan";
import { fmt } from "@/lib/format";
import { NoticeList } from "./misc-screens";
import { ClosedBadge, type Go, Initials, SectionTitle, StatusBadge, Tiles } from "./ui";

/*
 * Chuyển từ cong-nhan `home-overview.tsx`: hai thẻ số (tuần / tháng) — tiêu đề, một số
 * to và các ô dữ kiện; chân thẻ là link mở chi tiết.
 */
function PayCard({
  icon,
  title,
  badge,
  amount,
  children,
  footer,
  tone,
}: {
  icon: ReactNode;
  title: string;
  badge?: ReactNode;
  amount: number;
  children?: ReactNode;
  footer: ReactNode;
  tone: "ok" | "info";
}) {
  return (
    <Card className={tone === "ok" ? "gap-0 overflow-hidden border-transparent bg-success/10 py-0" : "gap-0 overflow-hidden border-transparent bg-primary/10 py-0"}>
      <div className="p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background [&_svg]:size-5">{icon}</span>
          <h2 className="min-w-0 flex-1 font-semibold text-base">{title}</h2>
          {badge}
        </div>
        <p className={`mt-3.5 font-bold text-[2.125rem] tabular-nums leading-tight tracking-tight ${tone === "ok" ? "text-success" : "text-primary"}`}>
          {fmt(amount)}
          <span className="font-semibold text-xl"> đ</span>
        </p>
        {children}
      </div>
      {footer}
    </Card>
  );
}

function FooterLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-13 w-full items-center justify-between gap-2 border-t border-foreground/10 px-4 font-semibold text-base text-primary active:bg-background/50"
    >
      {children}
      <ChevronRightIcon className="size-5" aria-hidden />
    </button>
  );
}

export function HomeScreen({ go }: { go: Go }) {
  const w = WEEKS[1], M = MONTHS[0], S = slip(M);
  const unread = NOTICES.filter((n) => n.unread).length;
  return (
    <>
      <div className="-mx-4 -mt-4 flex items-center gap-3 border-b bg-card px-4 py-3">
        <button type="button" onClick={() => go({ id: "hoso" })} aria-label="Hồ sơ">
          <Initials name={ME.ten} />
        </button>
        <div>
          <div className="text-muted-foreground text-sm">Chào buổi sáng 👋</div>
          <h1 className="font-bold text-xl">{ME.goi}</h1>
        </div>
        <button
          type="button"
          onClick={() => go({ id: "tb" })}
          aria-label={`Thông báo, ${unread} chưa đọc`}
          className="relative ml-auto flex size-11 items-center justify-center rounded-full bg-muted"
        >
          <BellIcon className="size-5" aria-hidden />
          {unread ? (
            <Badge variant="destructive" className="-top-1 -right-1.5 absolute h-5 min-w-5 px-1.5">
              {unread}
            </Badge>
          ) : null}
        </button>
      </div>

      <PayCard
        tone="ok"
        icon={<PackageIcon />}
        title={`Lương sản phẩm tuần ${dm(w.mon)} – ${dm(w.sat)}`}
        badge={<ClosedBadge tmp={w.tmp} />}
        amount={w.tong}
        footer={<FooterLink onClick={() => go({ id: "wk", arg: 1 })}>Xem chi tiết</FooterLink>}
      />
      <PayCard
        tone="info"
        icon={<WalletIcon />}
        title={`Lương tháng ${M.m}/${M.y} · Thực lĩnh`}
        badge={<StatusBadge tone="ok">Đã chốt</StatusBadge>}
        amount={M.net}
        footer={<FooterLink onClick={() => go({ id: "phieu", arg: 0 })}>Xem phiếu lương</FooterLink>}
      >
        <dl className="mt-3.5 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-background px-3 py-2.5">
            <dt className="text-muted-foreground text-sm">Tổng thu nhập</dt>
            <dd className="font-semibold text-lg tabular-nums">{fmt(S.T)}</dd>
          </div>
          <div className="rounded-xl bg-background px-3 py-2.5">
            <dt className="text-muted-foreground text-sm">Ngày công</dt>
            <dd className="font-semibold text-lg tabular-nums">{M.cong} ngày</dd>
          </div>
        </dl>
      </PayCard>

      <SectionTitle>Lối tắt</SectionTitle>
      <Tiles items={SHORTCUTS} go={go} />

      <SectionTitle
        action={
          <button type="button" className="min-h-11 font-semibold text-base text-primary" onClick={() => go({ id: "tb" })}>
            Xem tất cả ›
          </button>
        }
      >
        Thông báo mới
      </SectionTitle>
      <NoticeList items={NOTICES.slice(0, 3)} go={go} />
    </>
  );
}

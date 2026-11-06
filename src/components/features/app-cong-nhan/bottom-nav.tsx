"use client";

import { cn } from "@erp/miniapp-ui";
import { ArrowLeftRightIcon, ClockIcon, HomeIcon, type LucideIcon, MenuIcon, WalletIcon } from "lucide-react";
import type { ScreenId } from "@/data/app-cong-nhan";

export const TABS: { id: ScreenId; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Trang chủ", icon: HomeIcon },
  { id: "luong", label: "Lương", icon: WalletIcon },
  { id: "trades", label: "Mua bán", icon: ArrowLeftRightIcon },
  { id: "cong", label: "Chấm công", icon: ClockIcon },
  { id: "menu", label: "Thêm", icon: MenuIcon },
];

/*
 * Chuyển từ cong-nhan `mobile-bottom-nav.tsx`: thanh kính mờ nổi sát đáy, mỗi tab có
 * icon VÀ tên (công nhân ít dùng app không đọc được icon trơn). Ở đây là nút đổi màn
 * trong cùng trang thay cho Link, và giới hạn theo bề rộng khung điện thoại.
 */
const TAB =
  "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function BottomNav({ active, onSelect }: { active: ScreenId; onSelect: (id: ScreenId) => void }) {
  return (
    <nav className="fixed inset-x-2 bottom-[max(0.375rem,env(safe-area-inset-bottom))] z-40" aria-label="Điều hướng chính">
      <ul className="mx-auto grid h-16 max-w-[404px] grid-cols-5 items-stretch rounded-3xl border border-border/60 bg-background/70 p-1 shadow-black/10 shadow-lg backdrop-blur-xl backdrop-saturate-150">
        {TABS.map(({ id, label, icon: Icon }) => {
          const on = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={on ? "page" : undefined}
                onClick={() => onSelect(id)}
                className={cn(TAB, on ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <span className={cn("flex h-7 w-11 items-center justify-center rounded-full transition-colors", on && "bg-primary/10")}>
                  <Icon className={cn("size-6", on && "stroke-[2.5]")} aria-hidden />
                </span>
                {/* 13px: năm tên tab phải vừa một dòng trên máy 360px (như bản gốc 12px). */}
                <span className={cn("max-w-full truncate whitespace-nowrap text-[13px] leading-none", on ? "font-semibold" : "font-medium")}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import {
  Avatar,
  AvatarFallback,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { type Employee, STATUS_TONE } from "@/data/nhan-su";
import { InfoRows, ToneBadge } from "./ui";

function Section({ title, rows }: { title: string; rows: [string, ReactNode][] }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="font-semibold">{title}</h4>
      <InfoRows rows={rows} />
    </section>
  );
}

export function ProfileSheet({ emp, onClose }: { emp: Employee | null; onClose: () => void }) {
  return (
    <Sheet open={!!emp} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {emp && (
          <>
            <SheetHeader className="flex-row items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>{emp.name.split(" ").pop()?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>{emp.name}</SheetTitle>
                <SheetDescription>{emp.id} · {emp.team}</SheetDescription>
              </div>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <div><ToneBadge tone={STATUS_TONE[emp.status]}>{emp.status}</ToneBadge></div>
              <Section
                title="Thông tin cá nhân"
                rows={[["Ngày sinh", `15/07/${emp.birthYear}`], ["Số CCCD", "0381······12"], ["Quê quán", "Thanh Hoá"], ["Số điện thoại", "09·· ··· 482"]]}
              />
              <Section
                title="Công việc"
                rows={[
                  ["Bộ phận / chuyền", `${emp.dept} · ${emp.team}`],
                  ["Ngày vào làm", emp.joined],
                  ["Hợp đồng", emp.contract],
                  ["Bậc tay nghề", "Bậc 3"],
                  ["Phép năm còn lại", "7 ngày"],
                ]}
              />
              <Section
                title="Giấy tờ"
                rows={[
                  ["Sơ yếu lý lịch", <ToneBadge key="a" tone="ok">Có</ToneBadge>],
                  ["CCCD (2 mặt)", <ToneBadge key="b" tone="ok">Có</ToneBadge>],
                  ["Giấy khám sức khỏe", <ToneBadge key="c" tone="warn">Hết hạn 09/2026</ToneBadge>],
                  ["Sổ BHXH", <ToneBadge key="d" tone="ok">Đang đóng</ToneBadge>],
                ]}
              />
              <Section
                title="Quá trình làm việc"
                rows={[["03/2024", "Điều chuyển Chuyền 02 → hiện tại"], ["06/2023", "Lên bậc 3"]]}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

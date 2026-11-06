"use client";

import { Button } from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { Attendance } from "@/components/features/nhan-su/attendance";
import { Contracts } from "@/components/features/nhan-su/contracts";
import { EmployeeList } from "@/components/features/nhan-su/employees";
import { QuickIntake } from "@/components/features/nhan-su/intake";
import { ProfileSheet } from "@/components/features/nhan-su/profile-sheet";
import { Recruitment } from "@/components/features/nhan-su/recruit";
import { TurnoverReport } from "@/components/features/nhan-su/report";
import { StaffMap } from "@/components/features/nhan-su/staff-map";
import type { Employee } from "@/data/nhan-su";

const NAV = [
  { id: "bd", label: "Bản đồ nhân lực hôm nay" },
  { id: "ds", label: "Danh sách nhân viên" },
  { id: "nhap", label: "Nhập hồ sơ nhanh" },
  { id: "hd", label: "Hợp đồng" },
  { id: "cc", label: "Chấm công & nghỉ phép" },
  { id: "td", label: "Tuyển dụng" },
  { id: "bc", label: "Báo cáo biến động" },
];

/** Hồ sơ cũ trùng CCCD (bấm "Xem hồ sơ cũ" ở màn Nhập hồ sơ nhanh) */
const OLD_PROFILE: Employee = {
  id: "NV0915", name: "Đặng Văn Long", dept: "Cắt", team: "Tổ cắt 1", joined: "12/05/2021",
  contract: "Đã chấm dứt 03/2026", status: "Nghỉ việc", birthYear: "1990",
};

export function NhanSuPage() {
  const [tab, setTab] = useState("bd");
  const [emp, setEmp] = useState<Employee | null>(null);

  return (
    <AppFrame
      slug="nhan-su"
      description="Toàn nhà máy · 980 người · cập nhật 06/11/2026"
      nav="sidebar"
      items={NAV}
      active={tab}
      onChange={setTab}
      actions={
        <>
          <Button variant="outline" onClick={() => toast.success("Đã xuất danh sách 980 nhân viên ra Excel")}>⬇ Xuất Excel</Button>
          <Button onClick={() => setTab("nhap")}>＋ Thêm nhân viên</Button>
        </>
      }
    >
      {tab === "bd" && <StaffMap />}
      {tab === "ds" && <EmployeeList onOpen={setEmp} />}
      {tab === "nhap" && <QuickIntake onOpenOld={() => setEmp(OLD_PROFILE)} />}
      {tab === "hd" && <Contracts />}
      {tab === "cc" && <Attendance />}
      {tab === "td" && <Recruitment />}
      {tab === "bc" && <TurnoverReport />}
      <ProfileSheet emp={emp} onClose={() => setEmp(null)} />
    </AppFrame>
  );
}

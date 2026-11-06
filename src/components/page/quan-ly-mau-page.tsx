"use client";

import { Button, PageHeader, SearchField } from "@erp/miniapp-ui";
import { Bot, FileText, LayoutGrid, Plus, Tag, Trash2, Upload, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame, type FrameNavItem } from "@/components/app-frame";
import { CustomersTable, TrashTable, UsersTable } from "@/components/features/quan-ly-mau/admin-tables";
import { Assistant } from "@/components/features/quan-ly-mau/assistant";
import { TechpackDetail } from "@/components/features/quan-ly-mau/detail";
import { Library } from "@/components/features/quan-ly-mau/library";
import { Overview } from "@/components/features/quan-ly-mau/overview";
import { DEFAULT_TP, TP } from "@/data/quan-ly-mau";

const NAV: FrameNavItem[] = [
  { id: "home", label: "Tổng quan", icon: <LayoutGrid /> },
  { id: "lib", label: "Techpack", icon: <FileText /> },
  { id: "cust", label: "Khách hàng", icon: <Tag /> },
  { id: "ai", label: "Trợ lý AI", icon: <Bot /> },
  { id: "trash", label: "Thùng rác", icon: <Trash2 /> },
  { id: "users", label: "Người dùng", icon: <Users /> },
];
type View = "home" | "lib" | "detail" | "cust" | "ai" | "trash" | "users";

export function QuanLyMauPage() {
  const [view, setView] = useState<View>("home");
  const [tp, setTp] = useState(DEFAULT_TP);
  const [q, setQ] = useState("");
  const go = (v: View) => { setView(v); window.scrollTo(0, 0); };
  const open = (i: number) => { setTp(i); go("detail"); };
  const upload = () => toast("Chọn file techpack (PDF, kèm Excel BOM) để tải lên");

  return (
    <AppFrame
      slug="quan-ly-mau"
      nav="sidebar"
      items={NAV}
      active={view === "detail" ? "lib" : view}
      onChange={(id) => go(id as View)}
      description="Công ty May Demo · Phòng mẫu"
      actions={
        <SearchField
          className="w-72 max-w-full"
          placeholder="Tìm techpack theo tên hoặc file…"
          value={q}
          onChange={(e) => { setQ(e.target.value); if (view !== "lib") go("lib"); }}
        />
      }
    >
      {view === "home" && (
        <>
          <PageHeader title="Tổng quan" description="Tình trạng xử lý và các techpack gần đây" />
          <Overview onOpen={open} onSeeAll={() => go("lib")} />
        </>
      )}
      {view === "lib" && (
        <>
          <PageHeader title="Techpack" description={`${TP.length} techpack · Mùa Xuân – Hè 2027`} actions={<Button onClick={upload}><Upload /> Tải techpack lên</Button>} />
          <Library q={q} onOpen={open} />
        </>
      )}
      {view === "detail" && <TechpackDetail key={tp} index={tp} onBack={() => go("lib")} />}
      {view === "cust" && (
        <>
          <PageHeader title="Khách hàng" description="6 khách hàng · 140 techpack · 52 tài liệu yêu cầu"
            actions={<Button onClick={() => toast("Thêm khách hàng")}><Plus /> Thêm khách hàng</Button>} />
          <CustomersTable onOpen={() => { setQ(""); go("lib"); }} />
        </>
      )}
      {view === "ai" && <Assistant />}
      {view === "trash" && (
        <>
          <PageHeader title="Thùng rác" description="Techpack đã xóa được giữ 30 ngày trước khi xóa hẳn" />
          <TrashTable />
        </>
      )}
      {view === "users" && (
        <>
          <PageHeader title="Người dùng" description="6 người dùng" actions={<Button onClick={() => toast("Mời người dùng")}><Plus /> Mời người dùng</Button>} />
          <UsersTable />
        </>
      )}
    </AppFrame>
  );
}

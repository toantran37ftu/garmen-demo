"use client";

import { Button, PageHeader, SearchField } from "@erp/miniapp-ui";
import { Bot, FileText, LayoutGrid, Plus, Tag, Trash2, Upload, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppFrame, type FrameNavItem } from "@/components/app-frame";
import { CustomersTable, TrashTable, UsersTable } from "@/components/features/quan-ly-mau/admin-tables";
import { AiRead, READ_CODE } from "@/components/features/quan-ly-mau/ai-read";
import { Assistant } from "@/components/features/quan-ly-mau/assistant";
import { Compare } from "@/components/features/quan-ly-mau/compare";
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
type View = "home" | "lib" | "detail" | "read" | "compare" | "cust" | "ai" | "trash" | "users";

export function QuanLyMauPage() {
  const [view, setView] = useState<View>("home");
  const [tp, setTp] = useState(DEFAULT_TP);
  const [q, setQ] = useState("");
  const go = (v: View) => { setView(v); window.scrollTo(0, 0); };
  const open = (i: number) => { setTp(i); go("detail"); };
  const upload = () => go("read");
  const save = () => {
    // shortcut: thêm thẳng vào mảng dữ liệu giả trong bộ nhớ (mất khi tải lại trang), thay bằng API khi nối ERP.
    if (TP[0].code !== READ_CODE) {
      TP.unshift({ code: READ_CODE, name: "Áo khoác gió có mũ", cu: 0, st: "ok", files: 1, rows: 25, img: 16, cw: 4, time: "2 phút 10 giây", date: "06/11/2026", k: "khoac" });
      setTp((i) => i + 1);
    }
    toast.success(`Đã lưu ${READ_CODE} vào thư viện`, { description: "25 dòng vật tư · 12 điểm đo · trạng thái Hoàn tất" });
    setQ("");
    go("lib");
  };

  return (
    <AppFrame
      slug="quan-ly-mau"
      nav="sidebar"
      items={NAV}
      active={view === "detail" || view === "compare" || view === "read" ? "lib" : view}
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
          <Overview onOpen={open} onSeeAll={() => go("lib")} onUpload={upload} />
        </>
      )}
      {view === "lib" && (
        <>
          <PageHeader title="Techpack" description={`${TP.length} techpack · Mùa Xuân – Hè 2027`} actions={<Button onClick={upload}><Upload /> Tải techpack lên</Button>} />
          <Library q={q} onOpen={open} />
        </>
      )}
      {view === "detail" && <TechpackDetail key={tp} index={tp} onBack={() => go("lib")} onCompare={() => go("compare")} />}
      {view === "compare" && <Compare index={tp} onBack={() => go("detail")} />}
      {view === "read" && (
        <>
          <PageHeader title="AI đọc tech pack" description="AI đọc PDF của khách, bóc tách thông tin chung, vật tư, bảng thông số và vị trí nhãn" />
          <AiRead onSave={save} onCancel={() => go("home")} />
        </>
      )}
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

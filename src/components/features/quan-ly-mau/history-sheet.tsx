import { Badge, Button, Sheet, SheetContent, SheetHeader, SheetTitle } from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { BOMS, CWS, POMS, type Techpack } from "@/data/quan-ly-mau";

function Version({ title, cur, meta, items, action }: { title: string; cur?: boolean; meta: string; items: ReactNode[]; action?: string }) {
  return (
    <div className={`rounded-lg border p-3 ${cur ? "border-primary bg-primary/5" : ""}`}>
      <b>{title}</b> <Badge variant={cur ? "default" : "secondary"}>{cur ? "Đang dùng" : "Bản cũ"}</Badge>
      <div className="text-xs text-muted-foreground">{meta}</div>
      <ul className="mt-1.5 list-disc pl-5">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      {action && <Button size="sm" variant="outline" className="mt-2" onClick={() => toast(action)}>{action}</Button>}
    </div>
  );
}

/** Lịch sử phiên bản techpack. */
export function HistorySheet({ tp, open, onOpenChange }: { tp: Techpack; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader><SheetTitle>Lịch sử phiên bản</SheetTitle></SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-4">
          <Version cur title="Phiên bản 3" meta="Sửa tay · Trần Thu Hà · 04/11/2026 16:12" items={[
            <>Dây kéo nẹp trước: 64 cm → <b>66 cm</b> (DK-5066)</>,
            <>Thêm phối màu <b>358 Xanh rêu</b> (cột mới, 25 ô)</>,
            "Bảng size: dài tay M 63 → 64 cm",
          ]} />
          <Version title="Phiên bản 2" meta="Tải bản mới · AI bóc tách · 28/10/2026 09:40 · 2 phút 51 giây" action="So sánh với bản 3" items={[
            "Khách gửi PDF rev B (16 trang)", "Nhãn HDSD đổi sang satin 5 ngôn ngữ", "Thêm băng ép seam chống thấm; bỏ cúc bấm cổ", "4 dòng thay đổi, 1 dòng mới",
          ]} />
          <Version title="Phiên bản 1" meta="AI bóc tách · 14/10/2026 10:05 · 2 phút 37 giây" action="Khôi phục bản này" items={[
            `Tạo từ TP_${tp.code}_revA.pdf + BOM.xlsx`,
            `${BOMS[tp.k].length} dòng vật tư, ${CWS[tp.k].length} phối màu, ${POMS[tp.k].length} điểm đo`,
          ]} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

import {
  Button, Dialog, DialogContent, DialogDescription, DialogTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsList, TabsTrigger,
} from "@erp/miniapp-ui";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sheetData, type Techpack } from "@/data/quan-ly-mau";

const col = (i: number) => String.fromCharCode(65 + i);

/** Chế độ chỉnh sửa toàn màn hình: 2 sheet (Vật tư & yêu cầu, Bảng size POM), ô sửa trực tiếp. */
export function EditDialog({ tp, open, onOpenChange }: { tp: Techpack; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [sheet, setSheet] = useState<"0" | "1">("0");
  const d = sheetData(tp.k, sheet === "0" ? 0 : 1);
  const save = () => { onOpenChange(false); toast.success("Đã lưu phiên bản 4"); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-screen max-h-none w-screen max-w-none flex-col gap-0 rounded-none p-0 sm:max-w-none"
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); } }}
      >
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-2.5">
          <Button size="icon-sm" variant="outline" aria-label="Đóng" onClick={() => onOpenChange(false)}><X /></Button>
          <div>
            <DialogTitle className="text-base">{tp.code} · {tp.name} — Chỉnh sửa</DialogTitle>
            <DialogDescription className="text-xs">
              Sửa từ phiên bản 3 · chuột phải để thêm/xóa dòng, cột · dán được từ Excel · Ctrl+Z hoàn tác · Ctrl+S lưu
            </DialogDescription>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toast("Tìm trong sheet")}><Search /> Tìm trong sheet</Button>
            <Button size="sm" variant="outline" onClick={() => toast("Mở Thông tin chung")}>Thông tin chung</Button>
            <Button size="sm" onClick={save}>Lưu phiên bản mới</Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-white">
          <Table density="compact" className="w-auto [&_td]:border [&_td]:whitespace-nowrap [&_th]:border">
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-10 bg-muted" />
                {d[0].map((_, i) => <TableHead key={i} className="text-center">{col(i)}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.map((r, i) => (
                <TableRow key={`${sheet}-${i}`} className={i ? "" : "bg-primary/5 font-bold"}>
                  <TableCell className="sticky left-0 min-w-10 bg-muted text-center text-muted-foreground">{i + 1}</TableCell>
                  {r.map((v, j) => (
                    <TableCell key={j} contentEditable suppressContentEditableWarning className="h-7 focus:outline-2 focus:-outline-offset-2 focus:outline-primary">
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Tabs value={sheet} onValueChange={(v) => setSheet(v as "0" | "1")} className="border-t bg-muted/50 px-2.5">
          <TabsList variant="line">
            <TabsTrigger value="0">Vật tư &amp; yêu cầu</TabsTrigger>
            <TabsTrigger value="1">Bảng size (POM)</TabsTrigger>
          </TabsList>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

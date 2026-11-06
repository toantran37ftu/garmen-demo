import { Button, Card, CardAction, CardContent, CardHeader, CardTitle, StatisticCard } from "@erp/miniapp-ui";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { countSt, TP } from "@/data/quan-ly-mau";
import { TechpackTable } from "./techpack-table";

export function UploadDropzone() {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary"><Upload /></div>
      <b className="text-base">Kéo thả techpack vào bất kỳ đâu</b>
      <div className="text-muted-foreground">File PDF, kèm Excel BOM nếu có. Hệ thống xử lý từng techpack một, theo thứ tự tải lên.</div>
      <Button className="mt-2" onClick={() => toast("Chọn file PDF / Excel để tải lên")}><Plus /> Chọn file</Button>
    </div>
  );
}

const Dot = ({ c }: { c: string }) => <i className={`mr-1.5 inline-block size-2 rounded-full ${c}`} />;

export function Overview({ onOpen, onSeeAll }: { onOpen: (i: number) => void; onSeeAll: () => void }) {
  return (
    <>
      <UploadDropzone />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Tổng techpack" value={TP.length} hint="Mùa Xuân – Hè 2027" />
        <StatisticCard label={<><Dot c="bg-success" />Hoàn tất</>} value={countSt("ok")} hint="Đã bóc tách xong" />
        <StatisticCard label={<><Dot c="bg-warning" />Trong hàng đợi</>} value={countSt("wait") + countSt("run")} hint={`1 đang xử lý · ${countSt("wait")} đang chờ`} />
        <StatisticCard label={<><Dot c="bg-destructive" />Cần xem</>} value={countSt("rev")} hint="AI không chắc, cần người kiểm" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gần đây</CardTitle>
          <CardAction><Button variant="link" onClick={onSeeAll}>Xem tất cả →</Button></CardAction>
        </CardHeader>
        <CardContent><TechpackTable rows={TP.slice(0, 8)} onOpen={onOpen} /></CardContent>
      </Card>
    </>
  );
}

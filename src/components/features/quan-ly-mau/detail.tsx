import {
  Badge, Button, Card, CardAction, CardContent, CardHeader, CardTitle, Input, StatisticCard,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsList, TabsTrigger, ToggleGroup, ToggleGroupItem,
} from "@erp/miniapp-ui";
import { ChevronLeft, Download, GitCompare, History, Info, Pencil, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BOMS, CATS, CUS, CWS, NPG, POMS, sizesOf, TP } from "@/data/quan-ly-mau";
import { BomIcon } from "./bom-icon";
import { EditDialog } from "./edit-dialog";
import { FlatSketch } from "./flat-sketch";
import { Gallery } from "./gallery";
import { HistorySheet } from "./history-sheet";
import { CustomerChip } from "./techpack-table";

/** Chi tiết một techpack. Dùng `key={index}` ở nơi gọi để reset bộ lọc khi đổi techpack. */
export function TechpackDetail({ index, onBack, onCompare }: { index: number; onBack: () => void; onCompare: () => void }) {
  const cur = TP[index], k = cur.k;
  const CW = CWS[k], BOM = BOMS[k], POM = POMS[k], SZ = sizesOf(k);
  const [sd, setSd] = useState<"front" | "back">("front");
  const [cwi, setCwi] = useState(-1);
  const [cat, setCat] = useState("Tất cả");
  const [bq, setBq] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const color = cwi >= 0 ? CW[cwi][1] : null;

  const n = (c: string) => (c === "Tất cả" ? BOM.length : c === "Hình ảnh" ? NPG(k) : BOM.filter((r) => r[0] === c).length);
  const rows = BOM.filter((r) => (cat === "Tất cả" || r[0] === cat) && (r[2] + r[6] + r[1]).toLowerCase().includes(bq.toLowerCase()));
  const ic = CW[Math.max(cwi, 0)][1];
  const kv: [string, string][] = [
    ["Mã style", cur.code], ["Tên style", cur.name], ["Nhãn hàng", CUS[cur.cu][1]], ["Mùa", "Xuân – Hè 2027 (SS27)"],
    ["Giai đoạn mẫu", "Mẫu duyệt size (size set)"], ["Nhà cung cấp", "Công ty May Demo"], ["Ngày phát hành", cur.date], ["Ngôn ngữ", "Tiếng Anh → đã dịch Việt"],
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="link" className="px-0" onClick={onBack}><ChevronLeft /> Techpack</Button>
        <Badge variant="outline" className="border-transparent bg-success/10 text-success">● Hoàn tất</Badge>
        <span className="text-muted-foreground">Phiên bản 3 · Sửa tay từ phiên bản 2 · 04/11/2026 16:12</span>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h2 className="text-xl font-semibold">{cur.code} · {cur.name} · SS27</h2>
          <p className="mt-1 text-muted-foreground">
            Khách hàng <CustomerChip cu={cur.cu} />{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => toast("Chọn khách hàng khác")}>Đổi</Button>
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button onClick={() => setEditOpen(true)}><Pencil /> Chỉnh sửa</Button>
          <Button variant="outline" onClick={() => setHistOpen(true)}><History /> Lịch sử</Button>
          {k === "khoac" && <Button variant="outline" onClick={onCompare}><GitCompare /> So sánh</Button>}
          <Button variant="outline" onClick={() => toast("Chọn PDF bản mới để tải lên")}><Upload /> Tải bản mới</Button>
          <Button variant="outline" onClick={() => toast(`Đang tải ${cur.code}…`)}><Download /> Tải xuống</Button>
          <Button variant="outline" className="text-destructive" onClick={() => toast(`Đã chuyển ${cur.code} vào thùng rác`)}><Trash2 /> Xóa</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
          <CardAction><Button size="sm" variant="outline" onClick={() => setEditOpen(true)}><Pencil /> Sửa</Button></CardAction>
        </CardHeader>
        <CardContent className="grid items-start gap-5 md:grid-cols-[260px_1fr]">
          <div className="flex max-w-[260px] flex-col items-center gap-1 rounded-lg border bg-white p-2.5 text-center">
            <ToggleGroup type="single" variant="outline" size="sm" value={sd} onValueChange={(v) => v && setSd(v as "front" | "back")}>
              <ToggleGroupItem value="front">Mặt trước</ToggleGroupItem>
              <ToggleGroupItem value="back">Mặt sau</ToggleGroupItem>
            </ToggleGroup>
            <FlatSketch k={k} side={sd} color={color} className="h-[270px] w-full" />
            <div className="flex flex-wrap justify-center gap-2 py-1">
              <button
                type="button"
                title="Hình gốc"
                aria-label="Hình gốc"
                aria-pressed={cwi < 0}
                onClick={() => setCwi(-1)}
                className={`size-5 rounded-full border-2 border-white bg-[linear-gradient(135deg,#fff_44%,#DC2626_44%_56%,#fff_56%)] ${cwi < 0 ? "ring-2 ring-primary" : "ring-1 ring-border"}`}
              />
              {CW.map(([name, hex], i) => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-label={name}
                  aria-pressed={cwi === i}
                  onClick={() => setCwi(i)}
                  style={{ background: hex }}
                  className={`size-5 rounded-full border-2 border-white ${cwi === i ? "ring-2 ring-primary" : "ring-1 ring-border"}`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">{cwi >= 0 ? "Phối màu " + CW[cwi][0] : "Hình gốc · chọn phối màu để tô"}</div>
            <Button size="sm" variant="outline" className="mt-1.5" onClick={() => toast("Chọn hình phẳng mới")}>Đổi hình</Button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-5 gap-y-3.5">
            {kv.map(([l, v]) => (
              <div key={l}>
                <small className="block text-muted-foreground">{l}</small>
                <b className="font-semibold">{v}</b>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Dòng dữ liệu" value={BOM.length} />
        <StatisticCard label="Phối màu" value={4} />
        <StatisticCard label="Điểm đo" value={POM.length} hint={`${SZ[0]} – ${SZ[5]}`} />
        <StatisticCard label="Trang hình vẽ" value={NPG(k)} hint="Hình phẳng, chi tiết, nhãn" />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
          <Tabs value={cat} onValueChange={setCat} className="min-w-0 overflow-x-auto">
            <TabsList>
              {CATS.map((c) => (
                <TabsTrigger key={c} value={c} className="gap-1">
                  {c}<Badge variant="secondary" className="px-1.5">{n(c)}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Input className="ml-auto h-8 w-56" placeholder="Tìm trong bảng…" value={bq} onChange={(e) => setBq(e.target.value)} />
        </div>
        {cat === "Hình ảnh" ? (
          <Gallery k={k} color={color} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mục</TableHead><TableHead>Loại</TableHead><TableHead>Mô tả</TableHead><TableHead>Hình</TableHead>
                <TableHead>KT</TableHead><TableHead>NCC</TableHead><TableHead>Mã</TableHead><TableHead numeric>SL</TableHead>
                {CW.map(([name, hex]) => (
                  <TableHead key={name}>
                    <span className="inline-flex items-center gap-1.5">
                      <i className="size-3 rounded-[3px] border border-black/15" style={{ background: hex }} />{name}
                    </span>
                  </TableHead>
                ))}
                <TableHead>Vị trí dùng</TableHead><TableHead numeric>Tr.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{r[0]}</TableCell>
                  <TableCell><Badge variant="secondary">{r[1]}</Badge></TableCell>
                  <TableCell className="min-w-[220px] whitespace-normal">{r[2]}</TableCell>
                  <TableCell>{r[3] && <BomIcon t={r[3]} col={ic} />}</TableCell>
                  <TableCell>{r[4]}</TableCell>
                  <TableCell>{r[5]}</TableCell>
                  <TableCell className="tabular-nums">{r[6]}</TableCell>
                  <TableCell numeric>{r[7]}</TableCell>
                  {r[8].map((v, j) => <TableCell key={j}>{v}</TableCell>)}
                  <TableCell>{r[9]}</TableCell>
                  <TableCell numeric>
                    <Button variant="link" className="h-auto p-0" onClick={() => toast(`Mở trang ${r[10]} của PDF gốc`)}>{r[10]}</Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={15} className="text-muted-foreground">Không có dòng nào trong mục này.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
      <p className="flex items-center gap-1.5 text-muted-foreground">
        <Info className="size-4 shrink-0" /> Mỗi cột phối màu ghi màu / mã vật tư dùng cho phối màu đó. &quot;Tr.&quot; = trang trong PDF gốc của khách.
      </p>

      <EditDialog tp={cur} open={editOpen} onOpenChange={setEditOpen} />
      <HistorySheet tp={cur} open={histOpen} onOpenChange={setHistOpen} onCompare={k === "khoac" ? onCompare : undefined} />
    </>
  );
}

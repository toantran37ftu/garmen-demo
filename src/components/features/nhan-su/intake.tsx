"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Field,
  FieldLabel,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { BATCH, BATCH_COUNTS, type BatchRow, SCAN_FIELDS, SCAN_LABELS } from "@/data/nhan-su";
import { KpiGrid, Note, ToneBadge } from "./ui";

const RESULT_TONE = { "Cần xem": "warn", "Sẵn sàng": "ok", "Lỗi file": "bad", "Đã xác nhận": "info" } as const;
type Result = BatchRow["result"] | "Đã xác nhận";

export function QuickIntake({ onOpenOld }: { onOpenOld: () => void }) {
  const [sel, setSel] = useState("name");
  const [values, setValues] = useState(() => Object.fromEntries(SCAN_FIELDS.map((f) => [f.key, f.value])));
  const [checked, setChecked] = useState<Set<string>>(new Set()); // ô vàng đã được người dùng xem lại
  const [currentDone, setCurrentDone] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);

  // ô vàng hết "chưa chắc" khi đã sửa/xem; ô đỏ hết "không đọc được" khi đã nhập tay
  const stateOf = (key: string) => {
    const f = SCAN_FIELDS.find((x) => x.key === key)!;
    if (f.state === "r") return values[key].trim() ? undefined : "r";
    if (f.state === "y") return checked.has(key) ? undefined : "y";
    return undefined;
  };
  const yellow = SCAN_FIELDS.filter((f) => stateOf(f.key) === "y").length;
  const red = SCAN_FIELDS.filter((f) => stateOf(f.key) === "r").length;

  const resultOf = (r: BatchRow, i: number): Result =>
    (i === 0 && currentDone) || (bulkDone && r.result === "Sẵn sàng") ? "Đã xác nhận" : r.result;
  const ready = bulkDone ? 0 : BATCH_COUNTS.ready;
  const review = BATCH_COUNTS.review - (currentDone ? 1 : 0);

  const confirmCurrent = () => {
    if (red) {
      toast.error(`Còn ${red} ô không đọc được — nhập tay trước khi xác nhận.`);
      return;
    }
    setCurrentDone(true);
    toast.success("Đã xác nhận hồ sơ Trịnh Thị Hương", { description: "Tạo nhân viên mới · May · Chuyền 05" });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => toast.info("Mở camera / chọn ảnh hồ sơ")}>📷 Chụp / tải ảnh hồ sơ</Button>
        <Button variant="outline" onClick={() => toast.info("Chọn nhiều file PDF để đọc cả lô")}>📁 Tải cả lô (nhiều file PDF)</Button>
        <span className="ml-auto"><ToneBadge tone="info">Lô 06/11 · 12 bộ hồ sơ · đã đọc xong</ToneBadge></span>
      </div>
      <KpiGrid
        items={[
          { label: "Sẵn sàng", value: String(ready), hint: bulkDone ? "Đã xác nhận 8 hồ sơ" : "Không có ô nào cần xem", tone: "ok" },
          { label: "Cần xem", value: String(review), hint: "Có ô tô vàng / đỏ", tone: "warn" },
          { label: "Lỗi file", value: String(BATCH_COUNTS.error), hint: "Ảnh mờ, thiếu trang", tone: "bad" },
        ]}
      />
      <Alert variant="destructive">
        <AlertTitle>⚠ Trùng số CCCD</AlertTitle>
        <AlertDescription>
          <p>
            Hồ sơ <b>Đặng Văn Long</b> có số CCCD giống nhân viên <b>NV0915 – Đặng Văn Long</b> (nghỉ việc 03/2026). Có thể là người cũ quay lại.{" "}
            <Button variant="link" className="h-auto p-0" onClick={onOpenOld}>Xem hồ sơ cũ</Button>
          </p>
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Ảnh gốc — Sơ yếu lý lịch</CardTitle>
            <CardDescription>Trang 1 / 4</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Ảnh scan giả: giấy kem, chữ viết tay; khung xanh đánh dấu dòng của ô đang chọn */}
            <div className="relative flex min-h-[440px] flex-col gap-3.5 rounded-md border bg-muted/50 p-6 text-muted-foreground" aria-label="Ảnh hồ sơ gốc">
              <b className="text-center text-foreground">SƠ YẾU LÝ LỊCH</b>
              <div className="absolute right-6 top-6 grid h-21 w-16 place-items-center border border-dashed border-muted-foreground/40">Ảnh 3×4</div>
              {SCAN_FIELDS.filter((f) => f.scan).map((f) => (
                <div key={f.key} className="relative flex items-center gap-2 pr-20">
                  <span className="shrink-0">{SCAN_LABELS[f.key]}</span>
                  <i className="flex-1 border-b border-dotted border-muted-foreground/40 font-[cursive] text-foreground">{f.scan}</i>
                  {sel === f.key && (
                    <span className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 rounded border-2 border-primary bg-primary/10" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Thông tin tự điền</CardTitle>
            <CardAction className="flex gap-1.5">
              {yellow > 0 && <ToneBadge tone="warn">{yellow} chưa chắc</ToneBadge>}
              {red > 0 && <ToneBadge tone="bad">{red} không đọc được</ToneBadge>}
              {!yellow && !red && <ToneBadge tone="ok">Đã xem hết</ToneBadge>}
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {SCAN_FIELDS.map((f) => {
              const st = stateOf(f.key);
              return (
                <Field key={f.key}>
                  <FieldLabel htmlFor={`f-${f.key}`}>
                    {f.label}
                    {st === "y" && " · chưa chắc"}
                    {st === "r" && " · không đọc được"}
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id={`f-${f.key}`}
                      value={values[f.key]}
                      placeholder={f.state === "r" ? "Nhập tay…" : undefined}
                      aria-invalid={st === "r" || undefined}
                      onFocus={() => f.scan && setSel(f.key)}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, [f.key]: e.target.value }));
                        if (f.state === "y") setChecked((s) => new Set(s).add(f.key));
                      }}
                      onBlur={() => f.state === "y" && sel === f.key && setChecked((s) => new Set(s).add(f.key))}
                      className={cn(
                        "pr-8",
                        st === "y" && "border-warning bg-warning/15",
                        st === "r" && "border-destructive/50 bg-destructive/10",
                        sel === f.key && "ring-2 ring-primary",
                      )}
                    />
                    {st && (
                      <span aria-hidden className={cn("absolute right-2.5 top-1/2 -translate-y-1/2", st === "r" ? "text-destructive" : "text-warning")}>
                        {st === "r" ? "✕" : "⚠"}
                      </span>
                    )}
                  </div>
                </Field>
              );
            })}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center gap-2 border-t">
            <Note>Bấm vào một ô để xem đúng chỗ đó trên ảnh gốc.</Note>
            <span className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => toast("Đã bỏ qua hồ sơ, chuyển sang bộ tiếp theo")}>Bỏ qua</Button>
              <Button onClick={confirmCurrent} disabled={currentDone}>✓ Xác nhận hồ sơ</Button>
            </span>
          </CardFooter>
        </Card>
      </div>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Các bộ hồ sơ trong lô</CardTitle>
          <CardAction>
            <Button
              size="sm"
              disabled={bulkDone}
              onClick={() => {
                setBulkDone(true);
                toast.success(`Đã xác nhận ${BATCH_COUNTS.ready} hồ sơ sẵn sàng`);
              }}
            >
              ✓ Xác nhận {BATCH_COUNTS.ready} hồ sơ sẵn sàng
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Số trang</TableHead>
                <TableHead>Giấy tờ đọc được</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Kết quả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BATCH.map((r, i) => {
                const res = resultOf(r, i);
                return (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.pages}</TableCell>
                    <TableCell>{r.docs}</TableCell>
                    <TableCell className={r.noteBad ? "text-destructive" : "text-muted-foreground"}>
                      {i === 0 ? (yellow || red ? `${yellow} ô chưa chắc, ${red} ô không đọc được` : "Đã xem hết các ô") : r.note}
                    </TableCell>
                    <TableCell><ToneBadge tone={RESULT_TONE[res]}>{res}</ToneBadge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

import { Badge, Button, Card, CardContent, Progress } from "@erp/miniapp-ui";
import { CheckCircle2, FastForward, RotateCcw, ScanLine, Sparkles } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BOMS, POMS, sizesOf } from "@/data/quan-ly-mau";
import { FlatSketch, LabelOverlay } from "./flat-sketch";

/* Mô phỏng AI đọc một PDF techpack áo khoác (cùng bộ dữ liệu "khoac": 25 dòng vật tư, 12 điểm đo). */
export const READ_CODE = "AO-KHOAC-1186";
const BOM = BOMS.khoac, POM = POMS.khoac, SZ = sizesOf("khoac");
const PAGES = ["Trang bìa", "Bảng vật tư", "Bảng thông số", "Vị trí nhãn"];
/** Mốc thời gian (ms) mỗi trang bắt đầu được quét; phần tử cuối = kết thúc. */
const PT = [0, 1800, 5000, 7600, 9000];
const END = 9200;

type Field = { id: string; pg: number; at: number; sec: string; label: string; value: string; sub?: string; conf: number };
const conf = (i: number) => 95 + ((i * 7) % 5);
const FIELDS: Field[] = [
  ...([
    ["Mã style", READ_CODE, 99], ["Tên style", "Áo khoác gió có mũ", 98], ["Khách hàng", "Nordvik Outdoor (Thụy Điển)", 97],
    ["Mùa", "Xuân – Hè 2027 (SS27)", 99], ["Giai đoạn mẫu", "Mẫu duyệt size (size set)", 91],
  ] as const).map(([label, value, c], i): Field => ({ id: "h" + i, pg: 0, at: 300 + i * 300, sec: "Thông tin chung", label, value, conf: c })),
  ...BOM.map((r, i): Field => ({
    id: "b" + i, pg: 1, at: 2000 + i * 115, sec: "Vật tư", label: r[1], value: r[2], sub: `${r[6]} · ${r[4]} · ${r[7]}`, conf: i === 18 ? 87 : conf(i),
  })),
  ...POM.map((p, i): Field => ({
    id: "p" + i, pg: 2, at: 5200 + i * 190, sec: "Bảng thông số", label: `${p[0]} · ${p[1]}`, value: `${String(p[6]).replace(".", ",")} cm (size M)`,
    sub: `Dung sai ±${String(p[4]).replace(".", ",")} · nhảy size ${String(p[7]).replace(".", ",")}`, conf: i === 10 ? 89 : conf(i + 3),
  })),
  ...([
    ["Nhãn chính", "Giữa cổ sau, dưới viền mũ"], ["Nhãn size", "Dưới nhãn chính"], ["Nhãn HDSD", "Sườn trái, mặt trong, cách gấu 15 cm"], ["Nhãn PO", "Sau nhãn HDSD"],
  ] as const).map(([label, value], i): Field => ({ id: "l" + i, pg: 3, at: 7800 + i * 280, sec: "Vị trí nhãn", label, value, conf: conf(i + 1) })),
];
const REVIEW = FIELDS.filter((f) => f.conf < 95).length;
console.assert(FIELDS.length === 5 + 25 + 12 + 4 && REVIEW === 3, "ai-read fields");

function ConfChip({ c }: { c: number }) {
  return c >= 95
    ? <Badge variant="outline" className="border-transparent bg-success/10 text-success">{c}%</Badge>
    : <Badge variant="outline" className="border-transparent bg-warning/15 text-warning">{c}% · cần xem</Badge>;
}

/* ---------- Trang PDF giả ---------- */
type Mark = (id: string) => string;
const Pg = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <>
    <div className="mb-3 flex items-center justify-between border-b-2 border-neutral-800 pb-1.5 text-neutral-800">
      <b className="tracking-wide">NORDVIK OUTDOOR · TECH PACK</b>
      <span className="text-xs">{title} · Page {n}/4</span>
    </div>
    {children}
  </>
);

function PdfPage({ pg, mark }: { pg: number; mark: Mark }) {
  if (pg === 0)
    return (
      <Pg n={1} title="Cover">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <dl className="grid content-start gap-1.5 text-sm text-neutral-700">
            {[["Style No.", READ_CODE], ["Description", "Hooded wind jacket"], ["Customer", "Nordvik Outdoor AB"], ["Season", "SS27"], ["Stage", "Size set"]].map(([k, v], i) => (
              <div key={k} className={`rounded px-1.5 py-0.5 ${mark("h" + i)}`}>
                <dt className="text-xs uppercase text-neutral-400">{k}</dt>
                <dd className="font-semibold text-neutral-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-1">
            <FlatSketch k="khoac" side="front" className="h-56 w-40" />
            <FlatSketch k="khoac" side="back" className="h-56 w-40" />
          </div>
        </div>
        <p className="mt-3 text-xs text-neutral-400">File: TP_{READ_CODE}_revA.pdf · Issued 05/11/2026 · Designer: K. Lindqvist</p>
      </Pg>
    );
  if (pg === 1)
    return (
      <Pg n={2} title="Bill of materials">
        <table className="w-full text-xs leading-tight text-neutral-700">
          <thead><tr className="bg-neutral-100 text-left">{["#", "Type", "Description", "Code", "Qty"].map((h) => <th key={h} className="px-1 py-1">{h}</th>)}</tr></thead>
          <tbody>
            {BOM.map((r, i) => (
              <tr key={i} className={`border-b border-neutral-100 ${mark("b" + i)}`}>
                <td className="px-1 py-0.5">{i + 1}</td><td className="px-1">{r[1]}</td><td className="max-w-[220px] truncate px-1">{r[2]}</td>
                <td className="px-1 tabular-nums">{r[6]}</td><td className="px-1 tabular-nums">{r[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Pg>
    );
  if (pg === 2)
    return (
      <Pg n={3} title="Size specification (cm)">
        <table className="w-full text-xs text-neutral-700">
          <thead><tr className="bg-neutral-100 text-left"><th className="px-1 py-1">POM</th><th className="px-1">Tol ±</th>{SZ.map((s) => <th key={s} className="px-1 text-right">{s}</th>)}</tr></thead>
          <tbody>
            {POM.map((p, i) => (
              <tr key={p[0]} className={`border-b border-neutral-100 ${mark("p" + i)}`}>
                <td className="px-1 py-1"><b>{p[0]}</b> {p[2]}</td><td className="px-1">{p[4]}</td>
                {SZ.map((s, j) => <td key={s} className="px-1 text-right tabular-nums">{Math.round((p[6] + (j - 2) * p[7]) * 10) / 10}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Pg>
    );
  return (
    <Pg n={4} title="Label placement">
      <div className="grid grid-cols-[auto_1fr] items-start gap-4">
        <FlatSketch k="khoac" side="back" className="h-72 w-56" overlay={<LabelOverlay k="khoac" />} />
        <ol className="grid gap-2 text-sm text-neutral-700">
          {["Main label — CB neck, under hood seam", "Size label — below main label", "Care label — L side seam inside, 15 cm above hem", "PO label — behind care label"].map((t, i) => (
            <li key={t} className={`rounded px-1.5 py-1 ${mark("l" + i)}`}><b className="text-red-600">{i + 1}.</b> {t}</li>
          ))}
        </ol>
      </div>
    </Pg>
  );
}

/** Màn "AI đọc tech pack": PDF bên trái, kết quả điền dần bên phải. */
export function AiRead({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [t, setT] = useState(0);
  const [hover, setHover] = useState<Field | null>(null);
  const [onlyRev, setOnlyRev] = useState(false);
  const [saved, setSaved] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const done = t >= END;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setT((x) => Math.min(END, x + 50)), 50);
    return () => clearInterval(id);
  }, [done]);

  const shown = FIELDS.filter((f) => f.at <= t && (!onlyRev || f.conf < 95));
  useEffect(() => {
    if (!done && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [shown.length, done]);

  const nx = PT.findIndex((x) => x > t), scanPg = nx < 1 ? 3 : nx - 1;
  const pg = hover ? hover.pg : scanPg;
  const scanY = done ? -1 : Math.min(100, ((t - PT[scanPg]) / (PT[scanPg + 1] - PT[scanPg])) * 100);
  const mark: Mark = (id) => {
    const f = FIELDS.find((x) => x.id === id)!;
    if (hover?.id === id) return "outline outline-2 outline-primary bg-primary/15";
    if (f.at > t) return "";
    return f.conf < 95 ? "outline outline-2 outline-amber-500/80 bg-amber-100/60" : "outline outline-1 outline-sky-500/70 bg-sky-50/60";
  };
  const typed = (f: Field) => f.value.slice(0, Math.max(1, Math.ceil((t - f.at) / 25)));

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">{done ? <CheckCircle2 /> : <ScanLine className="animate-pulse" />}</span>
          <div>
            <b className="block">TP_{READ_CODE}_revA.pdf</b>
            <span className="text-muted-foreground">{done ? "Đã đọc xong" : `Đang đọc trang ${scanPg + 1}/4 · ${PAGES[scanPg]}`}</span>
          </div>
        </div>
        <Progress value={(t / END) * 100} className="h-2 min-w-40 flex-1" />
        {!done && <Button variant="outline" onClick={() => setT(END)}><FastForward /> Bỏ qua</Button>}
        {done && <Button variant="outline" onClick={() => { setT(0); setOnlyRev(false); setSaved(false); }}><RotateCcw /> Xem lại</Button>}
        <Button variant="ghost" onClick={onCancel}>Đóng</Button>
      </div>

      {done && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-3">
            <Sparkles className="text-primary" />
            <b className="text-base">Đọc xong 4 trang · 25 dòng vật tư · 12 điểm đo · {REVIEW} ô cần xem · 2 phút 10 giây <span className="font-normal text-muted-foreground">(làm tay ~2 giờ)</span></b>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => setOnlyRev((v) => !v)}>{onlyRev ? "Xem tất cả" : "Xem ô cần kiểm"}</Button>
              <Button disabled={saved} onClick={() => { setSaved(true); onSave(); }}><CheckCircle2 /> Duyệt &amp; lưu</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {PAGES.map((p, i) => (
              <Badge key={p} variant={i === pg ? "default" : "outline"} className={i < scanPg || done ? "" : i > scanPg ? "opacity-50" : ""}>
                {i < scanPg || done ? "✓ " : ""}Tr. {i + 1} · {p}
              </Badge>
            ))}
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-md border bg-white p-5 shadow-md">
            <PdfPage pg={pg} mark={mark} />
            {scanY >= 0 && !hover && (
              <div className="pointer-events-none absolute inset-x-0 h-10 transition-[top] duration-75 ease-linear-translate-y-full bg-gradient-to-b from-transparent to-sky-400/30" style={{ top: `${scanY}%` }}>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-500 shadow-[0_0_8px_2px_rgba(14,165,233,0.6)]" />
              </div>
            )}
          </div>
        </div>

        <Card className="gap-0 py-0">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <b>Kết quả bóc tách</b>
            <span className="text-muted-foreground">{shown.length}/{onlyRev ? REVIEW : FIELDS.length} ô</span>
            <span className="ml-auto text-muted-foreground">Rê chuột vào ô để xem vị trí trên PDF</span>
          </div>
          <div ref={listRef} className="max-h-[620px] overflow-y-auto px-2 py-2">
            {shown.map((f, i) => (
              <div key={f.id}>
                {(i === 0 || shown[i - 1].sec !== f.sec) && <div className="px-2 pb-1 pt-3 text-sm font-semibold text-muted-foreground">{f.sec}</div>}
                <div
                  onMouseEnter={() => setHover(f)}
                  onMouseLeave={() => setHover(null)}
                  style={done ? undefined : { opacity: Math.min(1, (t - f.at) / 300), transform: `translateX(${Math.max(0, 12 - (t - f.at) / 25)}px)` }}
                  className={`flex items-start gap-3 rounded-md px-2 py-1.5 transition-all duration-150 ${hover?.id === f.id ? "bg-primary/10" : f.conf < 95 ? "bg-warning/5" : "hover:bg-muted"}`}
                >
                  <span className="w-36 shrink-0 text-muted-foreground">{f.label}</span>
                  <span className="min-w-0 flex-1">
                    <b className="font-medium">{done ? f.value : typed(f)}</b>
                    {f.sub && <span className="block text-sm text-muted-foreground">{f.sub}</span>}
                  </span>
                  <ConfChip c={f.conf} />
                </div>
              </div>
            ))}
            {shown.length === 0 && <p className="p-4 text-muted-foreground">Đang nhận diện bố cục trang…</p>}
          </div>
        </Card>
      </div>
    </>
  );
}

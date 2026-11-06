import {
  Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { type Diff, type DiffCell, DIFFS, TP, VERS } from "@/data/quan-ly-mau";
import { FlatSketch } from "./flat-sketch";

const RED = "#DC2626";
const T_LABEL: Record<Diff["t"], [string, string]> = {
  add: ["Thêm", "border-transparent bg-success/10 text-success"],
  del: ["Bỏ", "border-transparent bg-destructive/10 text-destructive"],
  chg: ["Sửa", "border-transparent bg-warning/15 text-warning"],
};

function Cell({ c, t }: { c: DiffCell; t: Diff["t"] }) {
  if (typeof c === "string") return <span className={t === "del" ? "text-destructive line-through" : ""}>{c}</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span className="text-muted-foreground line-through">{c[0]}</span>
      <ArrowRight className="size-3.5 text-muted-foreground" />
      <b className="rounded bg-warning/15 px-1">{c[1]}</b>
    </span>
  );
}

/** Vòng đỏ đánh số; bản cũ vẽ nét đứt. */
function Marks({ marks, old }: { marks: NonNullable<Diff["mark"]>[]; old?: boolean }) {
  return (
    <>
      {marks.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={old ? "none" : "#DC262614"} stroke={RED} strokeWidth={1.4} strokeDasharray={old ? "3 2" : undefined} className={old ? "" : "animate-pulse"} />
          <circle cx={x + r * 0.75} cy={y - r * 0.75} r={5} fill="#fff" stroke={RED} strokeWidth={1} />
          <text x={x + r * 0.75} y={y - r * 0.75 + 2.3} fontSize={6.5} fontWeight={700} fill={RED} textAnchor="middle" fontFamily="system-ui,sans-serif">{i + 1}</text>
        </g>
      ))}
    </>
  );
}

/** Túi ngực khóa giấu có từ bản 3. */
const ChestPocket = () => <path d="M117 88 L130 104" fill="none" stroke="#1F2329" strokeWidth={2.6} strokeDasharray="1 1" strokeLinecap="butt" />;

/** So sánh 2 phiên bản techpack: hình phẳng khoanh vùng đổi + bảng khác biệt BOM/POM. */
export function Compare({ index, onBack }: { index: number; onBack: () => void }) {
  const cur = TP[index];
  const [a, setA] = useState("2");
  const [b, setB] = useState("3");
  const ok = +a < +b;
  const diffs = ok ? DIFFS.slice(+a - 1, +b - 1).flat() : [];
  const marks = diffs.flatMap((d) => (d.mark ? [d.mark] : []));
  const nDm = diffs.filter((d) => d.imp === "dm").length, nGia = diffs.filter((d) => d.imp === "gia").length;

  const pick = (v: string, set: (v: string) => void, label: string) => (
    <Select value={v} onValueChange={set}>
      <SelectTrigger className="w-56" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>{VERS.map((x, i) => <SelectItem key={i} value={String(i + 1)}>Phiên bản {i + 1} · {x[0]}</SelectItem>)}</SelectContent>
    </Select>
  );
  const sketch = (v: string, old?: boolean) => (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Phiên bản {v} {!old && +v === 3 && <Badge className="ml-1">Đang dùng</Badge>}</CardTitle>
        <p className="text-muted-foreground">{VERS[+v - 1][0]} · {VERS[+v - 1][1]}</p>
      </CardHeader>
      <CardContent className="flex justify-center">
        <FlatSketch k={cur.k} side="front" className="h-[320px] w-full max-w-[300px]"
          overlay={<>{+v >= 3 && <ChestPocket />}<Marks marks={marks} old={old} /></>} />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Button variant="link" className="self-start px-0" onClick={onBack}><ChevronLeft /> {cur.code}</Button>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold">So sánh phiên bản · {cur.code} · {cur.name}</h2>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {pick(a, setA, "Bản cũ")}<ArrowRight className="text-muted-foreground" />{pick(b, setB, "Bản mới")}
        </div>
      </div>

      {!ok ? (
        <EmptyState title="Chọn bản cũ ở bên trái, bản mới ở bên phải" description="Ví dụ: phiên bản 2 → phiên bản 3." />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm">{diffs.length} thay đổi</Badge>
            <Badge variant="outline" className="border-transparent bg-warning/15 px-3 py-1 text-sm text-warning">{nDm} ảnh hưởng định mức</Badge>
            <Badge variant="outline" className="border-transparent bg-destructive/10 px-3 py-1 text-sm text-destructive">{nGia} ảnh hưởng giá</Badge>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            {sketch(a, true)}
            {sketch(b)}
          </div>
          {marks.length > 0 ? (
            <ol className="flex flex-wrap gap-x-6 gap-y-1">
              {marks.map((m, i) => <li key={i}><b className="text-red-600">{i + 1}.</b> {m[3]}</li>)}
            </ol>
          ) : <p className="text-muted-foreground">Không có thay đổi trên hình phẳng.</p>}

          <Card className="gap-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thay đổi</TableHead><TableHead>Bảng</TableHead><TableHead>Mô tả / điểm đo</TableHead><TableHead>Quy cách</TableHead>
                  <TableHead>Mã</TableHead><TableHead>SL / số đo (M)</TableHead><TableHead>Vị trí dùng</TableHead><TableHead>Ảnh hưởng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diffs.map((d, i) => (
                  <TableRow key={i} className={d.t === "add" ? "bg-success/5" : d.t === "del" ? "bg-destructive/5" : ""}>
                    <TableCell><Badge variant="outline" className={T_LABEL[d.t][1]}>{T_LABEL[d.t][0]}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{d.tbl}</TableCell>
                    {d.cells.map((c, j) => <TableCell key={j} className={j === 0 ? "min-w-[220px] whitespace-normal" : ""}><Cell c={c} t={d.t} /></TableCell>)}
                    <TableCell>
                      {d.imp === "dm" && <Badge variant="outline" className="border-transparent bg-warning/15 text-warning">Định mức</Badge>}
                      {d.imp === "gia" && <Badge variant="outline" className="border-transparent bg-destructive/10 text-destructive">Giá</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </>
  );
}

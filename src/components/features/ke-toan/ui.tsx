"use client";

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  StatisticCard,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
} from "@erp/miniapp-ui";
import type { ReactNode } from "react";
import { type Kpi, type RepRow, type Tone, statusTone } from "@/data/ke-toan";
import { fmt } from "@/lib/format";

/** Số kế toán: âm hiển thị trong ngoặc. */
export const fm = (n: number) => (n < 0 ? `(${fmt(-n)})` : fmt(n));

export const toneText: Record<Tone, string> = {
  ok: "text-success",
  warn: "text-warning",
  bad: "text-destructive",
  info: "text-primary",
  violet: "text-primary",
  gray: "",
};

export function StatusBadge({ s, tone = statusTone(s) }: { s: string; tone?: Tone }) {
  if (tone === "bad") return <Badge variant="destructive">{s}</Badge>;
  if (tone === "gray") return <Badge variant="outline">{s}</Badge>;
  if (tone === "violet") return <Badge variant="secondary">{s}</Badge>;
  const cls = { ok: "bg-success/15 text-success", warn: "bg-warning/15 text-warning", info: "bg-primary/10 text-primary" }[tone];
  return (
    <Badge variant="outline" className={`border-transparent ${cls}`}>
      {s}
    </Badge>
  );
}

export function Kpis({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
      {items.map(([l, v, s, t]) => (
        <StatisticCard key={l} label={l} value={<span className={t ? toneText[t] : ""}>{v}</span>} hint={s || undefined} />
      ))}
    </div>
  );
}

export function Section({ title, action, children }: { title: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * Bảng chung. Tiền tố tiêu đề cột: "#" số (căn phải, âm trong ngoặc), "!" huy hiệu trạng thái,
 * "*" chữ đậm, "~" chữ mờ. `foot` thêm dòng cộng các cột số.
 */
export function Tbl({ head, rows, foot }: { head: string[]; rows: ReactNode[][]; foot?: string }) {
  const kind = head.map((h) => ("#!*~".includes(h[0] ?? "") ? h[0] : ""));
  const label = head.map((h, i) => (kind[i] ? h.slice(1) : h));
  const cell = (c: ReactNode, i: number) => {
    const v = typeof c === "number" ? fm(c) : c;
    if (kind[i] === "!" && typeof c === "string") return c ? <StatusBadge s={c} /> : null;
    if (kind[i] === "*") return <span className="font-semibold">{v}</span>;
    if (kind[i] === "~") return <span className="text-muted-foreground">{v}</span>;
    return v;
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {label.map((h, i) => (
            <TableHead key={i} numeric={kind[i] === "#"}>
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, j) => (
          <TableRow key={j}>
            {r.map((c, i) => (
              <TableCell key={i} numeric={kind[i] === "#"}>
                {cell(c, i)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {foot && (
        <TableFooter>
          <TableRow>
            {head.map((_, i) => (
              <TableCell key={i} numeric={kind[i] === "#"} className="font-semibold">
                {i === 0
                  ? foot
                  : kind[i] === "#"
                    ? fm(rows.reduce((s, r) => s + (typeof r[i] === "number" ? (r[i] as number) : 0), 0))
                    : null}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

/** Báo cáo tài chính: chỉ tiêu thụt lề theo cấp, cấp 0 in đậm. */
export function ReportTable({ rows, cols }: { rows: RepRow[]; cols: [string, string] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã số</TableHead>
          <TableHead>Chỉ tiêu</TableHead>
          <TableHead numeric>{cols[0]}</TableHead>
          <TableHead numeric>{cols[1]}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i} className={r[2] === 0 ? "bg-muted/50 font-semibold" : ""}>
            <TableCell className="text-muted-foreground">{r[0]}</TableCell>
            <TableCell className="whitespace-normal" style={{ paddingLeft: 12 + r[2] * 20 }}>
              {r[1]}
            </TableCell>
            <TableCell numeric>{r[3] == null ? "" : fm(r[3])}</TableCell>
            <TableCell numeric>{r[4] == null ? "" : fm(r[4])}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Danh sách nhãn – giá trị; dòng `total` có gạch trên và in đậm. */
export function KV({ rows }: { rows: [ReactNode, ReactNode, boolean?][] }) {
  return (
    <div className="flex flex-col">
      {rows.map(([l, v, total], i) => (
        <div key={i} className={`flex justify-between gap-3 py-2 ${total ? "mt-1 border-t font-semibold" : ""}`}>
          <span>{l}</span>
          <span className="text-right font-semibold tabular-nums">{v}</span>
        </div>
      ))}
    </div>
  );
}

/** Nhóm "chip" lọc chọn một (thay cho .chips của bản HTML). */
export function Chips({
  items,
  value,
  onChange,
}: {
  items: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ToggleGroup type="single" variant="outline" size="sm" value={value} onValueChange={(v) => v && onChange(v)}>
      {items.map(([l, v]) => (
        <ToggleGroupItem key={v} value={v}>
          {l}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

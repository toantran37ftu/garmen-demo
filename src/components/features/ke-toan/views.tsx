"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Field,
  FieldLabel,
  Input,
  SearchField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@erp/miniapp-ui";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
  AGING,
  ALLOC_627,
  B01,
  B02,
  B03,
  BANK_ACCS,
  BANK_STMT,
  CIT_Q4,
  CLOSING_ENTRIES,
  COSTING,
  CT,
  DEBTS,
  DM_ACCOUNTS,
  DM_DIMS,
  DM_GOODS,
  EINVOICES,
  FIXED_ASSETS,
  KH,
  KPI,
  LCT_LINES,
  NCC,
  PAYROLL,
  PAYROLL_CHECKS,
  PERIOD_LIST,
  PURCHASES,
  QUY_ROWS,
  REOPENS,
  SALES,
  SIMPLE,
  STOCK,
  TAX_CAL,
  VAT_T10,
  viewName,
} from "@/data/ke-toan";
import { Conditions } from "./overview";
import { Chips, fm, KV, Kpis, ReportTable, Section, StatusBadge, Tbl, toneText } from "./ui";

type Go = { go: (id: string) => void };

function Opts({ items, label }: { items: string[]; label: string }) {
  return (
    <Select defaultValue={items[0]}>
      <SelectTrigger aria-label={label} className="w-auto min-w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const Note = ({ children }: { children: ReactNode }) => <p className="mt-3 text-muted-foreground">{children}</p>;

/* ---------- Chứng từ ---------- */
export function Vouchers() {
  const [f, setF] = useState("*");
  const rows = CT.filter((r) => f === "*" || r[7] === f);
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chips items={[["Tất cả 642", "*"], ["Nháp 21", "Nháp"], ["Đã ghi sổ 621", "Đã ghi sổ"]]} value={f} onChange={setF} />
          <span className="flex-1" />
          <Opts label="Loại chứng từ" items={["Tất cả loại chứng từ", "Phiếu thu / chi", "Báo nợ / báo có", "Hóa đơn bán / mua", "Phiếu nhập / xuất kho", "Chứng từ khác"]} />
          <SearchField placeholder="Tìm số, đối tượng, diễn giải…" aria-label="Tìm chứng từ" className="w-64" />
        </div>
        <Tbl
          head={["*Số CT", "Ngày", "Loại", "Đối tượng", "Diễn giải", "~TK Nợ / Có", "#Số tiền", "!Trạng thái"]}
          rows={rows.map((r) => [r[0], `${r[1]}/2026`, r[2], r[3], r[4], r[5], r[6], r[7]])}
        />
        <Note>Hiển thị 13 / 642 chứng từ · 598 chứng từ tự sinh từ Kho, Tính lương, Bán hàng, Mua hàng</Note>
      </CardContent>
    </Card>
  );
}

/* ---------- Lập chứng từ ---------- */
export function NewVoucher() {
  const total = LCT_LINES.reduce((s, l) => s + l[5], 0);
  const fld = (label: string, el: ReactNode, wide = false) => (
    <Field className={wide ? "md:col-span-2" : ""}>
      <FieldLabel>{label}</FieldLabel>
      {el}
    </Field>
  );
  return (
    <>
      <Alert className="border-primary/30 bg-primary/5">
        <AlertDescription>
          ✨ <b>Nhập tự động với AI</b> — Thả hoá đơn XML, PDF, ảnh hay JSON… AI đọc và định khoản sẵn, bạn chỉ việc duyệt
        </AlertDescription>
        <AlertAction>
          <Button size="sm" onClick={() => toast("Chọn file hóa đơn để AI đọc")}>
            Chọn file
          </Button>
        </AlertAction>
      </Alert>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Thông tin chứng từ">
            <div className="grid gap-3 md:grid-cols-2">
              {fld("Nghiệp vụ", <Opts label="Nghiệp vụ" items={["Bán hàng chưa thu tiền", "Bán hàng thu tiền ngay", "Mua hàng chưa trả tiền", "Phiếu thu", "Phiếu chi"]} />)}
              {fld("Khách hàng", <Opts label="Khách hàng" items={KH.map((k) => `${k[0]} · ${k[1]}`)} />)}
              {fld("Ngày chứng từ", <Input defaultValue="31/10/2026" />)}
              {fld("Hạn thanh toán", <Input defaultValue="30/12/2026 (60 ngày)" />)}
              {fld("Loại tiền", <Opts label="Loại tiền" items={["USD · tỷ giá 25.380", "VND"]} />)}
              {fld("Hợp đồng", <Opts label="Hợp đồng" items={["HĐ-NVK-2026-07 · FOB"]} />)}
              {fld("Diễn giải", <Input defaultValue="Xuất khẩu lô hàng AO-POLO-2611, AO-THUN-2402 theo PO 4500-2611" />, true)}
            </div>
          </Section>
          <Section title="Dòng chứng từ">
            <Tbl
              head={["Hàng hóa", "#Số lượng", "#Đơn giá (VND)", "Thuế suất", "#Thành tiền"]}
              rows={LCT_LINES.map((l) => [
                <span key="n">
                  <b>{l[0]}</b> · {l[1]}
                </span>,
                <Input key="q" defaultValue={l[2]} aria-label={`Số lượng ${l[0]}`} className="h-8 w-28 text-right" />,
                <Input key="p" defaultValue={l[3]} aria-label={`Đơn giá ${l[0]}`} className="h-8 w-28 text-right" />,
                l[4],
                l[5],
              ])}
              foot="Cộng"
            />
            <Button size="sm" variant="outline" className="mt-3" onClick={() => toast("Đã thêm dòng trống")}>
              ＋ Thêm dòng
            </Button>
          </Section>
        </div>
        <Section title="Bút toán sẽ ghi">
          <KV
            rows={[
              ["Nợ 131 – Phải thu khách hàng", fm(total)],
              ["Có 5111 – Doanh thu bán hàng", fm(total)],
              ["Tiền hàng", fm(total)],
              ["Thuế GTGT (0%)", "0"],
              ["Tổng thanh toán", `${fm(total)} đ`, true],
            ]}
          />
          <p className="py-1.5 text-muted-foreground">
            Bằng chữ: Một tỷ, bốn trăm bảy mươi chín triệu, tám trăm bốn mươi nghìn đồng (≈ 58.307,33 USD)
          </p>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" onClick={() => toast("Đã lưu nháp")}>
              Lưu nháp
            </Button>
            <Button className="flex-1" onClick={() => toast.success("Đã lưu và ghi sổ chứng từ")}>
              Lưu và ghi sổ
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}

/* ---------- Danh mục ---------- */
export function Catalog() {
  const sub = (t: ReactNode) => <div className="text-muted-foreground">{t}</div>;
  const edit = <Button variant="link" size="sm" onClick={() => toast("Mở form sửa đối tượng")}>Sửa</Button>;
  const parties: ReactNode[][] = [
    ...KH.map((k) => [k[0], <span key="n"><b>{k[1]}</b>{sub("Khách nước ngoài · thanh toán USD")}</span>, "Khách hàng", k[2], 0, k[3], edit]),
    ...NCC.map((n) => [
      n[0],
      <span key="n">
        <b>{n[1]}</b>
        {sub(<>MST {n[2]}{n[0] === "NCC-TC" && <> · <span className="text-destructive">Tạm ngừng hoạt động</span></>}</>)}
      </span>,
      "Nhà cung cấp", 0, n[3], n[4], edit,
    ]),
  ];
  const tabs: [string, ReactNode][] = [
    ["Đối tượng (58)", <Tbl key="a" head={["*Mã", "Tên", "!Vai trò", "#Phải thu", "#Phải trả", "Hoạt động gần nhất", ""]} rows={parties} />],
    ["Hàng hóa (1.486)", <Tbl key="b" {...DM_GOODS} />],
    ["Hệ thống tài khoản (194)", <Tbl key="c" {...DM_ACCOUNTS} />],
    ["Chiều phân tích (5)", <Tbl key="d" {...DM_DIMS} />],
  ];
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="0">
          <TabsList variant="line" className="overflow-x-auto">
            {tabs.map(([t], i) => (
              <TabsTrigger key={t} value={String(i)}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(([t, body], i) => (
            <TabsContent key={t} value={String(i)}>
              {body}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

/* ---------- Quỹ tiền mặt ---------- */
export function Cash() {
  return (
    <>
      <Alert className="border-warning/40 bg-warning/10">
        <AlertDescription>
          ⚠ <b>Quỹ xưởng đang âm 3.971.160 đ</b> từ ngày 29/10 — chặn khóa sổ. Ghi sổ PT-0219 (hoàn tạm ứng 4.500.000 đ) để xử lý.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" onClick={() => toast.success("Đã ghi sổ PT-0219")}>
            Ghi sổ PT-0219
          </Button>
        </AlertAction>
      </Alert>
      <Kpis items={KPI.quy} />
      <Section title="Sổ quỹ – Quỹ xưởng (TK 1111-X)" action={<Opts label="Chọn quỹ" items={["Quỹ xưởng", "Quỹ văn phòng"]} />}>
        <Tbl
          head={["Ngày", "Số phiếu", "Diễn giải", "Người nộp / nhận", "#Thu", "#Chi", "#Tồn", "!"]}
          rows={QUY_ROWS.map((r) => [
            r[0], r[1],
            r[1] ? r[2] : <span key="d" className="text-muted-foreground">{r[2]}</span>,
            r[3], r[4], r[5],
            typeof r[6] === "number" && r[6] < 0 ? <b key="t" className="text-destructive">{fm(r[6])}</b> : r[6],
            r[7],
          ])}
        />
      </Section>
    </>
  );
}

/* ---------- Ngân hàng ---------- */
export function Bank() {
  const [f, setF] = useState("*");
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        {BANK_ACCS.map((a) => (
          <Card key={a[1]}>
            <CardContent>
              <div className="flex justify-between text-muted-foreground">
                <span>{a[0]}</span>
                <span>{a[1]}</span>
              </div>
              <div className="my-1.5 text-xl font-bold tabular-nums">{a[2]}</div>
              <div className="text-muted-foreground">{a[3]}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Section
        title="Đối chiếu sao kê – VCB USD ****8826"
        action={<Chips items={[["Tất cả", "*"], ["Chưa khớp 3", "Chưa"], ["Gợi ý AI", "Gợi ý"]]} value={f} onChange={setF} />}
      >
        <Tbl head={BANK_STMT.head} rows={BANK_STMT.rows.filter((r) => f === "*" || String(r[5]).includes(f))} />
      </Section>
    </>
  );
}

/* ---------- Bán hàng ---------- */
export function Sales() {
  return (
    <>
      <Kpis items={KPI.ban} />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Section title="Hóa đơn bán & hạn thanh toán">
          <Tbl {...SALES} />
        </Section>
        <Section title="Tuổi nợ phải thu">
          <KV
            rows={[
              ...AGING.map(([l, v, t]): [ReactNode, ReactNode] => [l, <span key="v" className={t ? toneText[t] : ""}>{v.toLocaleString("vi-VN")} tỷ</span>]),
              ["Tổng", "78,42 tỷ", true],
            ]}
          />
          <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Đã gửi nhắc nợ 3 khách hàng")}>
            ✉ Gửi nhắc nợ 3 khách
          </Button>
        </Section>
      </div>
    </>
  );
}

/* ---------- Mua hàng / HĐĐT / Kho / Giá thành / TSCĐ ---------- */
export const Purchases = () => (
  <>
    <Kpis items={KPI.mua} />
    <Section title="Hóa đơn mua vào & lịch trả">
      <Tbl {...PURCHASES} />
    </Section>
  </>
);

export const EInvoices = () => (
  <>
    <Kpis items={KPI.hddt} />
    <Section title="Hóa đơn đầu ra">
      <Tbl {...EINVOICES} />
    </Section>
  </>
);

export const Stock = () => (
  <>
    <Kpis items={KPI.kho} />
    <Section
      title="Nhập – xuất – tồn giá trị NPL tháng 10/2026"
      action={<span className="text-muted-foreground">Nguồn: app Kho nguyên liệu · đồng bộ 06/11 07:00</span>}
    >
      <Tbl {...STOCK} />
    </Section>
  </>
);

export const Costing = () => (
  <>
    <Kpis items={KPI.gt} />
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <Section title="Giá thành sản xuất theo lệnh sản xuất">
        <Tbl {...COSTING} />
      </Section>
      <Section title="Tiêu thức phân bổ 627">
        <KV rows={ALLOC_627.map(([k, v]) => [v, k])} />
        <Note>ⓘ Giờ công lấy từ app Theo dõi vận hành, sản lượng từ Kế hoạch sản xuất</Note>
      </Section>
    </div>
  </>
);

export const FixedAssets = () => (
  <>
    <Kpis items={KPI.tscd} />
    <Section title="Sổ tài sản cố định">
      <Tbl {...FIXED_ASSETS} />
    </Section>
  </>
);

/* ---------- Tiền lương ---------- */
export const Payroll = () => (
  <>
    <Alert className="border-primary/30 bg-primary/5">
      <AlertDescription>
        🔗 Đã nhận <b>bảng lương tháng 10/2026</b> từ app Tính lương lúc 05/11 17:20 · 980 người · khớp tổng quỹ lương
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={() => toast("Mở bảng lương tháng 10 trong app Tính lương")}>
          Mở bảng lương
        </Button>
      </AlertAction>
    </Alert>
    <Kpis items={KPI.luong} />
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <Section title="Bút toán lương tháng 10">
        <Tbl {...PAYROLL} />
      </Section>
      <Section title="Đối chiếu với Tính lương">
        {PAYROLL_CHECKS.map((c) => (
          <div key={c} className="flex gap-2.5 border-b border-dashed py-2 last:border-0">
            <span className="text-success">✓</span>
            {c}
          </div>
        ))}
      </Section>
    </div>
  </>
);

/* ---------- Thuế ---------- */
export const Tax = () => (
  <>
    <Alert className="border-warning/40 bg-warning/10">
      <AlertDescription>
        ⚠ Thuế suất GTGT 8% hết hiệu lực 31/12/2026 · 6 hóa đơn mua vào tháng 10 đang áp 8% · 1 hóa đơn của NCC tạm ngừng MST
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={() => toast("Lọc 7 hóa đơn mua vào cần xem")}>
          Xem hóa đơn
        </Button>
      </AlertAction>
    </Alert>
    <Kpis items={KPI.thue} />
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title="Lịch khai và nộp thuế">
        <Tbl {...TAX_CAL} />
      </Section>
      <div className="flex min-w-0 flex-col gap-4">
        <Section title="Thuế GTGT tháng 10">
          <KV rows={VAT_T10.map(([l, v, t]) => [l, t ? <span key="v" className="text-success">{v}</span> : v, t])} />
        </Section>
        <Section title="Thuế TNDN tạm nộp">
          <KV rows={CIT_Q4} />
        </Section>
      </div>
    </div>
  </>
);

/* ---------- Báo cáo tài chính ---------- */
export function Statements() {
  const [method, setMethod] = useState("direct");
  const tabs: [string, ReactNode][] = [
    ["B01-DN Tình hình tài chính", <ReportTable key="b01" rows={B01} cols={["Cuối kỳ", "Số đầu năm"]} />],
    ["B02-DN Kết quả kinh doanh", <ReportTable key="b02" rows={B02} cols={["Tháng 10/2026", "Lũy kế năm"]} />],
    [
      "B03-DN Lưu chuyển tiền tệ",
      <div key="b03" className="flex flex-col gap-3">
        <Chips items={[["Trực tiếp", "direct"], ["Gián tiếp", "indirect"]]} value={method} onChange={setMethod} />
        <ReportTable rows={B03} cols={["Tháng 10/2026", "Lũy kế năm"]} />
      </div>,
    ],
    ["Công nợ", <Tbl key="cn" {...DEBTS} />],
  ];
  return (
    <>
      <Kpis items={KPI.bctc} />
      <Card>
        <CardContent>
          <Tabs defaultValue="0">
            <TabsList variant="line" className="overflow-x-auto">
              {tabs.map(([t], i) => (
                <TabsTrigger key={t} value={String(i)}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(([t, body], i) => (
              <TabsContent key={t} value={String(i)}>
                {body}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

/* ---------- Khóa sổ ---------- */
export function Closing({ go }: Go) {
  const [ran, setRan] = useState<string[]>([]);
  return (
    <>
      <Kpis items={KPI.ks} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Điều kiện khóa sổ">
            <Conditions go={go} detailed />
          </Section>
          <Section title="Các bút toán cuối kỳ">
            <Tbl
              head={["Bút toán", "~Nợ / Có", "#Số tiền", "!Trạng thái", ""]}
              rows={CLOSING_ENTRIES.map(([n, acc, amt, st]) => {
                const done = st === "Đã chạy" || ran.includes(n);
                return [
                  n, acc, amt, done ? "Đã chạy" : st,
                  done ? "" : (
                    <Button key="r" size="sm" variant="outline" onClick={() => { setRan((r) => [...r, n]); toast.success(`Đã chạy: ${n}`); }}>
                      Chạy
                    </Button>
                  ),
                ];
              })}
            />
          </Section>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Các kỳ kế toán">
            {PERIOD_LIST.map(([p, s]) => (
              <div key={p} className="flex items-center border-b py-2 last:border-0">
                <span className="flex-1">{p}</span>
                <StatusBadge s={s} />
              </div>
            ))}
          </Section>
          <Section title="Lịch sử mở lại kỳ">
            {REOPENS.map(([p, when, why]) => (
              <div key={p} className="flex gap-2.5 border-b py-2.5 last:border-0">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
                <div>
                  <b>{p}</b> {when}
                  <div className="text-muted-foreground">{why}</div>
                </div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </>
  );
}

/* ---------- màn hình đơn giản (một bảng) ---------- */
export function Simple({ id }: { id: string }) {
  const p = SIMPLE[id];
  return (
    <Section title={viewName(id)}>
      <Tbl head={p.head} rows={p.rows} foot={p.foot} />
    </Section>
  );
}

import { Button, Input } from "@erp/miniapp-ui";
import { Info, Paperclip } from "lucide-react";
import { type ReactNode, useState } from "react";
import { CUS } from "@/data/quan-ly-mau";

/** [câu hỏi gợi ý, trả lời, nguồn] */
const QA: [string, ReactNode, string][] = [
  ["Công ty đang có tài liệu của những khách hàng nào?", (
    <>Wiki đang có <b>52 tài liệu</b> của 6 khách hàng:
      <ul>{CUS.map((c) => <li key={c[0]}>{c[1]} — {c[4]} tài liệu, {c[3]} techpack</li>)}</ul>
      Nhiều nhất là Nordvik Outdoor (Thụy Điển) (RSL, hướng dẫn nhãn, tiêu chuẩn đóng gói).</>
  ), "Wiki: Danh mục tài liệu khách hàng"],
  ["Techpack mới nhất dùng những loại dây kéo nào?", (
    <>Techpack hoàn tất gần nhất là <b>AO-KHOAC-1150</b> (Áo khoác gió có mũ), dùng 2 loại:
      <ul>
        <li><b>DK-5066</b> — dây kéo nhựa #5, 2 chiều, dài 66 cm, nẹp trước. Màu theo phối: 580 Đen · 560 Navy · 501 Trắng · 566 Rêu.</li>
        <li><b>DK-3018</b> — dây kéo nylon răng ẩn chống nước #3, dài 18 cm, túi sườn (2 cái/áo).</li>
      </ul>NCC: Phụ liệu Á Đông.</>
  ), "Techpack AO-KHOAC-1150 · trang 6; Excel BOM dòng 5–6"],
  ["Yêu cầu về hoá chất cấm (RSL) của khách hàng gồm những gì?", (
    <>Theo RSL của <b>Nordvik Outdoor (Thụy Điển)</b> (bản 2026) và ghi chú trong techpack AO-KHOAC-1150:
      <ul>
        <li>Thuốc nhuộm azo giải phóng amin: ≤ 20 mg/kg.</li>
        <li>Formaldehyde: ≤ 75 mg/kg (tiếp xúc da), ≤ 16 mg/kg (hàng trẻ em).</li>
        <li>Niken thôi ra từ cúc, đầu khóa: ≤ 0,5 µg/cm²/tuần — techpack ghi rõ <i>cúc dập không niken</i>.</li>
        <li>PFAS: cấm hoàn toàn; lớp chống thấm vải taslan phải là loại không PFC.</li>
        <li>DMF trong gói hút ẩm: cấm (≤ 0,1 mg/kg).</li>
      </ul>Mỗi lô vải chính cần kèm chứng nhận test của phòng thí nghiệm được khách duyệt.</>
  ), "Techpack AO-KHOAC-1150 · trang 12; Wiki: Yêu cầu RSL Nordvik Outdoor"],
  ["Quy trình kiểm soát kim loại trong xưởng thế nào?", (
    <>Theo quy định nội bộ <b>QT-QA-07</b>:
      <ul>
        <li>Kim gãy phải tìm đủ mảnh, dán vào sổ kim gãy của chuyền, tổ trưởng ký trước khi đổi kim mới.</li>
        <li>Không tìm đủ mảnh: cách ly bó hàng, cho qua máy dò kim loại riêng.</li>
        <li>100% thành phẩm qua máy dò kim loại sau đóng túi PE; hiệu chuẩn máy mỗi 2 giờ bằng mẫu thử Fe 1,0 mm.</li>
        <li>Kazeyama Sports (Nhật) yêu cầu thêm: ghi nhật ký dò kim theo từng thùng carton.</li>
      </ul></>
  ), "Wiki: QT-QA-07 Kiểm soát kim loại; Wiki: Yêu cầu đóng gói Kazeyama Sports"],
];

/** Chọn câu trả lời mẫu theo từ khóa câu hỏi tự gõ. */
const pick = (t: string) => {
  const l = t.toLowerCase();
  return /dây kéo|khóa kéo/.test(l) ? 1 : /kim loại|kim gãy/.test(l) ? 3 : /khách hàng nào|tài liệu/.test(l) ? 0 : 2;
};

export function Assistant() {
  const [log, setLog] = useState<{ q: string; i: number }[]>([]);
  const [text, setText] = useState("");
  const send = () => {
    const t = text.trim();
    if (!t) return;
    setLog((l) => [...l, { q: t, i: pick(t) }]);
    setText("");
  };

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-3.5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Trợ lý AI</h2>
          <p className="mt-1 text-muted-foreground">
            Hỏi về techpack và tài liệu khách hàng — Trợ lý đọc wiki công ty (yêu cầu của khách hàng, quy định nội bộ) và bảng vật tư của các techpack, rồi trả lời kèm nguồn.
          </p>
        </div>
        <Button variant="outline" onClick={() => setLog([])}>＋ Mới</Button>
      </div>
      {log.length === 0 && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {QA.map(([q], i) => (
            <Button key={q} variant="outline" className="h-auto justify-start whitespace-normal px-3.5 py-3 text-left font-normal" onClick={() => setLog([{ q, i }])}>
              {q}
            </Button>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {log.map((m, n) => (
          <div key={n} className="contents">
            <div className="max-w-[88%] self-end rounded-xl bg-primary px-3.5 py-3 text-primary-foreground">{m.q}</div>
            <div className="max-w-[88%] rounded-xl border bg-card px-3.5 py-3 leading-relaxed [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5">
              {QA[m.i][1]}
              <div className="mt-2 flex items-center gap-1 border-t border-dashed pt-1.5 text-xs text-muted-foreground">
                <Paperclip className="size-3" /> Nguồn: {QA[m.i][2]}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input className="h-11 flex-1" placeholder="Hỏi về techpack, vật tư, yêu cầu khách hàng…" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
        <Button className="h-11" onClick={send}>Gửi</Button>
      </div>
      <p className="flex items-center justify-center gap-1.5 text-muted-foreground">
        <Info className="size-4" /> Trợ lý trả lời từ wiki và techpack; đối chiếu tài liệu gốc trước khi dùng.
      </p>
    </div>
  );
}

/** Dữ liệu giả cho "App cho công nhân" — port từ demo-det-may/apps/app-cong-nhan.html. */

export const p2 = (n: number) => String(n).padStart(2, "0");
export const D = (d: number, m: number, y = 2026) => new Date(y, m - 1, d);
export const addD = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dm = (d: Date) => `${p2(d.getDate())}/${p2(d.getMonth() + 1)}`;
/** 7.5 → "7,5" */
export const hrs = (n: number) => String(n).replace(".", ",");
export const WD = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
export const TODAY = D(6, 11);
export const initials = (name: string) => {
  const w = name.split(" ");
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};

export const ME = { ten: "Nguyễn Thị Hoa", ma: "004120", goi: "Chị Hoa" };
export const LEADER = "Trần Văn Bình";

/* ---------- Mua bán công đoạn ---------- */
export type TradeType = "Mua" | "Bán" | "Trừ hàng" | "Trả hàng";
export type Trade = {
  d: string; type: TradeType; mh: string; cd: number; ten: string; sl: number; dg: number;
  ma: string; st: string; ot: boolean; sign: 1 | -1; tien: number;
};
export const TRADES: Trade[] = (
  [
    ["29/09", "Mua", "AO-POLO-2611", 18, "Tra cổ", 30, 1100, "MB-05-0871", "Hoàn thành", 0],
    ["06/10", "Bán", "AO-POLO-2611", 12, "May vai con", 20, 1000, "MB-05-0902", "Hoàn thành", 0],
    ["13/10", "Mua", "AO-POLO-2611", 18, "Tra cổ", 40, 1100, "MB-05-0934", "Hoàn thành", 1],
    ["20/10", "Trừ hàng", "AO-POLO-2611", 18, "Tra cổ", 6, 1100, "MB-05-0961", "Hoàn thành", 0],
    ["27/10", "Mua", "AO-POLO-2611", 18, "Tra cổ", 22, 1100, "MB-05-0988", "Hoàn thành", 0],
    ["29/10", "Bán", "AO-POLO-2611", 12, "May vai con", 15, 1000, "MB-05-0995", "Hoàn thành", 0],
    ["29/10", "Mua", "SOMI-NU-1210", 7, "Diễu nẹp áo", 30, 650, "MB-05-0996", "Hoàn thành", 1],
    ["03/11", "Mua", "SOMI-NU-1210", 7, "Diễu nẹp áo", 24, 650, "MB-05-1004", "Chờ xác nhận", 0],
    ["04/11", "Trả hàng", "AO-POLO-2611", 18, "Tra cổ", 5, 1100, "MB-05-1011", "Hoàn thành", 0],
    ["05/11", "Bán", "SOMI-NU-1210", 9, "Mí cổ", 18, 700, "MB-05-1019", "Chờ chốt SL", 0],
  ] as const
).map((t) => {
  const sign = t[1] === "Mua" || t[1] === "Trả hàng" ? 1 : -1;
  return { d: t[0], type: t[1], mh: t[2], cd: t[3], ten: t[4], sl: t[5], dg: t[6], ma: t[7], st: t[8], ot: !!t[9], sign, tien: sign * t[5] * t[6] };
});
/** Bên đối ứng trên phiếu theo loại giao dịch. */
export const COUNTER: Record<TradeType, [string, string]> = {
  Mua: ["Lê Thị Thu", "Bán"],
  Bán: ["Phạm Thị Lan", "Mua"],
  "Trừ hàng": ["QC chuyền 05", "Kiểm hàng"],
  "Trả hàng": ["QC chuyền 05", "Kiểm hàng"],
};
export const TRADE_MONTHS = [9, 10, 11];
export const TRADE_FILTERS = ["Tất cả", "Mua", "Bán", "Trừ hàng", "Trả hàng"];

/* ---------- Nghỉ phép ---------- */
export type FlowStep = "done" | "now" | "no" | "";
export type Leave = {
  id: string; type: string; from: string; to: string; days: string[]; buoi: string; why: string;
  st: string; sent: string; flow: FlowStep[]; note?: string;
};
export const LEAVES: Leave[] = [
  { id: "NP-2611-0042", type: "Phép năm", from: "12/11", to: "12/11", days: ["12/11"], buoi: "Cả ngày", why: "Đưa mẹ đi khám mắt", st: "Đã duyệt", sent: "02/11 07:12", flow: ["done", "done", "done"] },
  { id: "NP-2610-0388", type: "Phép năm", from: "17/10", to: "17/10", days: ["17/10"], buoi: "Cả ngày", why: "Về quê đám cưới em", st: "Đã duyệt", sent: "12/10 16:40", flow: ["done", "done", "done"] },
  { id: "NP-2610-0301", type: "Việc riêng có lương", from: "14/10", to: "14/10", days: ["14/10"], buoi: "Buổi chiều", why: "Đám hiếu bên chồng", st: "Đã duyệt", sent: "14/10 06:55", flow: ["done", "done", "done"] },
  { id: "NP-2609-0215", type: "Việc riêng không lương", from: "26/09", to: "26/09", days: ["26/09"], buoi: "Cả ngày", why: "Việc gia đình", st: "Từ chối", sent: "24/09 17:02", flow: ["done", "no", ""], note: "Chuyền đang gấp hàng Nordvik, đổi sang ngày khác" },
];
export const LEAVE_FLOW = ["Gửi đơn", "Trưởng chuyền duyệt", "Phòng Nhân sự xác nhận"];
export const LEAVE_BALANCE: [string, number, number][] = [["Phép năm", 12, 5], ["Việc riêng có lương", 3, 0.5], ["Nghỉ bù", 2, 0]];
export const LEAVE_TYPES = ["Phép năm", "Việc riêng có lương", "Việc riêng không lương", "Nghỉ ốm", "Con ốm", "Nghỉ bù"];
export const LEAVE_PARTS = ["Cả ngày", "Buổi sáng", "Buổi chiều"];

/* ---------- Chấm công 1 ngày: ghép chấm công + đơn nghỉ ---------- */
const SPEC: Record<string, "x" | "l" | "h"> = { "07/10": "x", "09/10": "l", "14/10": "h", "22/10": "l", "03/11": "l" };
/** w có mặt · l đi muộn · h nửa ngày · p nghỉ phép · x không công · s chủ nhật · t hôm nay · f chưa tới */
export type DayKind = "w" | "l" | "h" | "p" | "x" | "s" | "t" | "f";
export type Att = {
  k: DayKind; fut?: boolean; lv?: Leave; gio?: number; tc?: number; vao?: string; ra?: string; muon?: number; cong?: string;
};
export function att(d: Date, leaves: Leave[] = LEAVES): Att {
  const k = dm(d), n = d.getDate(), dow = d.getDay();
  const lv = leaves.find((r) => r.days.includes(k) && r.st !== "Từ chối" && r.st !== "Đã hủy");
  if (d > TODAY) return lv && lv.buoi === "Cả ngày" ? { k: "p", fut: true, lv } : { k: "f" };
  if (+d === +TODAY) return { k: "t" };
  if (dow === 0) return { k: "s" };
  const t = (SPEC[k] || (lv && lv.buoi === "Cả ngày" ? "p" : "w")) as DayKind;
  if (t === "p") return { k: "p", lv };
  if (t === "x") return { k: "x" };
  const tc = dow === 6 ? 0 : n % 3 === 0 ? 2 : n % 5 === 0 ? 1.5 : 0;
  const gio = t === "h" ? 4 : t === "l" ? 7.5 : 8;
  const raM = t === "h" ? 690 : 990 + tc * 60 + (n % 6);
  return {
    k: t, gio, tc, vao: t === "l" ? "07:46" : `07:${p2(10 + (n % 12))}`, ra: `${p2(Math.floor(raM / 60))}:${p2(raM % 60)}`,
    muon: t === "l" ? 16 : 0, cong: t === "h" ? "Nửa ngày việc riêng có lương + nửa ngày đi làm" : "Đi làm", lv,
  };
}

/* ---------- Lương SP theo ngày / tuần ---------- */
const OPS: [string, number, string, number][] = [["AO-POLO-2611", 18, "Tra cổ", 1100], ["AO-POLO-2611", 21, "Mí cổ", 450]];
/** [mã hàng, công đoạn, đơn giá, SL, thành tiền] */
export type PayLine = [string, string, number, number, number];
export type DayPay = { d: Date; a: Att; lines: PayLine[]; tg: number; ng: number; mbT: number; mbN: number; sl: number; tong: number };
function dayPay(d: Date): DayPay {
  const a = att(d), k = dm(d);
  const r: DayPay = { d, a, lines: [], tg: 0, ng: 0, mbT: 0, mbN: 0, sl: 0, tong: 0 };
  for (const t of TRADES.filter((t) => t.d === k)) t.ot ? (r.mbN += t.tien) : (r.mbT += t.tien);
  if (a.gio) {
    const v = d.getDate() % 9;
    OPS.forEach((o, i) => {
      const sl = Math.round(a.gio! * (i ? 7 : 31 + v / 3)), tn = sl * o[3];
      r.lines.push([o[0], `CĐ ${o[1]} – ${o[2]}`, o[3], sl, tn]);
      r.tg += tn; r.sl += sl;
    });
    if (a.tc) {
      const sl = Math.round(a.tc * 30), tn = sl * OPS[0][3] * 1.5;
      r.lines.push([OPS[0][0], `CĐ ${OPS[0][1]} – ${OPS[0][2]} (ngoài giờ ×1,5)`, OPS[0][3] * 1.5, sl, tn]);
      r.ng = tn; r.sl += sl;
    }
  }
  r.tong = r.tg + r.ng + r.mbT + r.mbN;
  return r;
}
export type WeekPay = { mon: Date; sat: Date; days: DayPay[]; tg: number; ng: number; mbT: number; mbN: number; tong: number; tmp: boolean; cur: boolean };
function weekPay(mon: Date): WeekPay {
  const days = [0, 1, 2, 3, 4, 5].map((i) => dayPay(addD(mon, i)));
  const s = (k: "tg" | "ng" | "mbT" | "mbN" | "tong") => days.reduce((a, x) => a + x[k], 0);
  return { mon, sat: addD(mon, 5), days, tg: s("tg"), ng: s("ng"), mbT: s("mbT"), mbN: s("mbN"), tong: s("tong"), tmp: addD(mon, 5) >= D(1, 11), cur: addD(mon, 5) >= TODAY };
}
export const WEEKS = [0, 1, 2, 3, 4, 5].map((i) => weekPay(addD(D(2, 11), -7 * i)));

/* ---------- Lương tháng + phiếu lương ---------- */
export type Month = { m: number; y: number; net: number; cong: number };
export const MONTHS: Month[] = (
  [[10, 8863500, 26], [9, 8412300, 25], [8, 8655800, 26], [7, 8120400, 25], [6, 8371900, 26], [5, 7980600, 24],
   [4, 8243000, 25], [3, 8090100, 26], [2, 7012500, 20], [1, 8530200, 26], [12, 8701400, 26], [11, 8264800, 25]] as const
).map(([m, net, cong], i) => ({ m, y: i > 9 ? 2025 : 2026, net, cong }));
export function slip(M: Month) {
  const base = 7678000 + (M.net - 8863500);
  const thu: [string, number][] = [["Lương sản phẩm", base], ["Lương sản phẩm tăng ca", 812000], ["Lương thời gian (họp, đào tạo)", 165000], ["Lương ngày nghỉ (phép, lễ, việc riêng)", 310000],
    ["Lương nghỉ giữa ca", 248000], ["Vệ sinh phụ nữ", 60000], ["Trợ cấp con nhỏ", 100000], ["Phụ cấp an toàn vệ sinh viên", 100000], ["Hỗ trợ xăng xe", 200000], ["Thưởng chuyên cần", 300000]];
  const tru: [string, number][] = [[`Tạm ứng lương (15/${p2(M.m)})`, 500000], ["Bảo hiểm xã hội (8%)", 424000], ["Bảo hiểm y tế (1,5%)", 79500], ["Bảo hiểm thất nghiệp (1%)", 53000], ["Đoàn phí công đoàn (1%)", 53000]];
  return { thu, tru, T: thu.reduce((a, x) => a + x[1], 0), R: tru.reduce((a, x) => a + x[1], 0) };
}
console.assert(MONTHS.every((M) => { const s = slip(M); return s.T - s.R === M.net; }), "phiếu lương: thu − trừ ≠ thực lĩnh");

/* ---------- Hồ sơ ---------- */
export type ProfileGroup = { icon: string; title: string; rows: [string, string][]; open?: boolean };
export const PROFILE_STATS: [string, string][] = [["Giờ công T10", "205h"], ["Ngoài giờ", "14h"], ["Thiếu dấu", "0"]];
export const PROFILE: ProfileGroup[] = [
  { icon: "💼", title: "Công việc", open: true, rows: [["Bộ phận", "Xưởng 1 · Chuyền 05"], ["Chức danh", "Công nhân may"], ["Bậc thợ", "Bậc 3/7"], ["Ngày vào công ty", "04/08/2014"], ["Thâm niên", "12 năm 3 tháng"]] },
  { icon: "🪪", title: "Thông tin cá nhân", rows: [["Giới tính", "Nữ"], ["Ngày sinh", "12/03/1979"], ["Nơi sinh", "Đông Sơn"], ["Nguyên quán", "Thanh Hóa"], ["Dân tộc", "Kinh"], ["Tôn giáo", "Không"], ["Hôn nhân", "Đã kết hôn"], ["Học vấn", "9/12"]] },
  { icon: "📞", title: "Liên hệ", rows: [["Điện thoại", "09** *** 268"], ["Email", "—"], ["Thường trú", "Xã Tân Hòa, huyện Đông Sơn"], ["Tạm trú", "Như thường trú"], ["Khi khẩn cấp", "Lê Văn Tâm (chồng) · 09** *** 551"]] },
  { icon: "📄", title: "Giấy tờ", rows: [["Số CCCD", "********5678"], ["Ngày cấp", "10/05/2021"], ["Nơi cấp", "Cục CS QLHC về TTXH"], ["Mã số thuế", "********21"]] },
  { icon: "🏥", title: "Bảo hiểm", rows: [["Số sổ BHXH", "38** *** 4521"], ["Nơi khám chữa bệnh", "TTYT huyện Đông Sơn"], ["Mức lương đóng BH", "5.300.000 đ"], ["Trạng thái", "Đang đóng"], ["Thời gian đã đóng", "12 năm 2 tháng"]] },
  { icon: "🏦", title: "Tài khoản nhận lương", rows: [["Số tài khoản", "****6789"], ["Ngân hàng", "Ngân hàng Demo – CN Thanh Hóa"]] },
  { icon: "✍️", title: "Hợp đồng lao động", rows: [["Số hợp đồng", "HĐLĐ-2017/0412"], ["Loại hợp đồng", "Không xác định thời hạn"], ["Ngày ký", "04/08/2017"], ["Hiệu lực từ", "04/08/2017"], ["Phụ lục PL-03", "Điều chỉnh lương · ký 01/01/2026"], ["Phụ lục PL-02", "Đổi chức danh · ký 01/06/2019"]] },
  { icon: "🧭", title: "Quá trình công tác", rows: [["01/06/2019 – nay", "Chuyền 05 · Công nhân may"], ["04/08/2016 – 31/05/2019", "Chuyền 03 · Công nhân may"], ["04/08/2014 – 03/08/2016", "Hoàn thiện · Công nhân đóng gói"]] },
  { icon: "👨‍👩‍👧", title: "Gia đình & người phụ thuộc", rows: [["Lê Văn Tâm", "Chồng · 1977"], ["Lê Thị Mai", "Con · 2020 · Phụ thuộc thuế"], ["Lê Minh Quân", "Con · 2008"]] },
  { icon: "🎓", title: "Bằng cấp & huấn luyện", rows: [["Chứng chỉ may công nghiệp", "Cấp 2014"], ["An toàn vệ sinh lao động nhóm 4", "Hết hạn 03/2027"], ["PCCC cơ sở", "Cấp 09/2025"]] },
];

/* ---------- Phân công công đoạn ---------- */
export type Assign = { mh: string; kh: string; cum: string; tram: string; stt: number; buoc: string; tb: string; bac: number; pct: number; dgChuan: number; dgThang: number; dgTh: number; tu: string; den: string };
export const ASSIGNS: Assign[] = (
  [["AO-POLO-2611", "Bellmont Apparel", "Cụm cổ", "Trạm 12", 18, "Tra cổ vào thân", "1 kim điện tử", 3, 100, 1050, 1100, 1100, "19/10", "nay"],
   ["AO-POLO-2611", "Bellmont Apparel", "Cụm cổ", "Trạm 13", 21, "Mí cổ 0,1 cm", "1 kim điện tử", 2, 40, 430, 450, 450, "19/10", "nay"],
   ["SOMI-NU-1210", "Kazeyama Sports", "Cụm nẹp", "Trạm 07", 7, "Diễu nẹp áo", "1 kim điện tử", 3, 0, 620, 650, 650, "28/10", "15/11"]] as const
).map((p) => ({ mh: p[0], kh: p[1], cum: p[2], tram: p[3], stt: p[4], buoc: p[5], tb: p[6], bac: p[7], pct: p[8], dgChuan: p[9], dgThang: p[10], dgTh: p[11], tu: p[12], den: p[13] }));

/* ---------- Tay nghề & KPI ---------- */
export const KPI_BARS: { label: string; value: string; pct: number; warn?: boolean }[] = [
  { label: "Hiệu suất cá nhân", value: "92%", pct: 92 },
  { label: "Hàng đạt chất lượng", value: "98,7%", pct: 98.7 },
  { label: "Chuyên cần", value: "25/26 ngày", pct: 96 },
  { label: "Hàng bị trả sửa", value: "6 sp", pct: 12, warn: true },
];
export const SKILLS = ["Tra cổ ★★★", "Mí cổ ★★★", "Diễu nẹp ★★", "May vai con ★★", "Tra tay ★"];
export const KPI_HISTORY: [string, string, string][] = [["10/2026", "A", "92%"], ["09/2026", "A", "90%"], ["08/2026", "B", "84%"], ["07/2026", "A", "89%"], ["06/2026", "A", "91%"], ["05/2026", "B", "82%"]];

/* ---------- Tra soát & góp ý ---------- */
export type Review = { ma: string; k: string; dt: string; c: string; to: string; st: string; at: string; rep?: string };
export const REVIEW_KINDS = ["Sai ngày công", "Sai sản phẩm", "Góp ý, khiếu nại"];
export const reviewTarget = (k: string) => ({ "Sai ngày công": "Phòng Nhân sự", "Sai sản phẩm": "Phòng Công nghệ" })[k] ?? "Ban giám đốc xưởng";
export const REVIEWS: Review[] = [
  { ma: "YC-0412", k: "Sai sản phẩm", dt: "Phiếu lương 10/2026", c: "Ngày 27/10 thiếu 20 sp CĐ 18 so với phiếu giấy", to: "Phòng Công nghệ", st: "Đang xử lý", at: "05/11" },
  { ma: "YC-0377", k: "Sai ngày công", dt: "22/10/2026", c: "Quẹt thẻ 07:28 nhưng app ghi đi muộn", to: "Phòng Nhân sự", st: "Đã xử lý", at: "23/10", rep: "Máy chấm công cổng 2 lệch giờ, đã sửa thành có mặt." },
  { ma: "YC-0301", k: "Góp ý, khiếu nại", dt: "—", c: "Quạt trạm 12 hỏng, nóng", to: "Ban giám đốc xưởng", st: "Đã xử lý", at: "02/10", rep: "Đã thay quạt 04/10." },
];

/* ---------- Điều hướng ---------- */
export type ScreenId =
  | "home" | "luong" | "wk" | "phieu" | "trades" | "voucher" | "cong" | "nghi" | "donmoi"
  | "hoso" | "pc" | "kpi" | "ts" | "hoi" | "tb" | "menu";
/** `arg`: chỉ số tuần (wk), tháng (phieu), phiếu (voucher). */
export type Nav = { id: ScreenId; arg?: number };

/* ---------- Thông báo ---------- */
export type Notice = { icon: string; cat: string; text: string; meta: string; unread: boolean; to?: Nav };
export const NOTICE_FILTERS = ["Tất cả", "Lương", "Mua bán", "Nghỉ phép", "Tra soát", "Nhà máy"];
export const NOTICES: Notice[] = [
  { icon: "💰", cat: "Lương", text: "Phiếu lương tháng 10/2026 đã có. Thực lĩnh 8.863.500 đ", meta: "05/11 · Phòng Nhân sự", unread: true, to: { id: "phieu", arg: 0 } },
  { icon: "🔁", cat: "Mua bán", text: "Ngày 04/11: Trả hàng 5 sp CĐ 18 – Tra cổ (Hoàn thành)", meta: "04/11 · Chuyền 05", unread: true, to: { id: "trades" } },
  { icon: "📢", cat: "Nhà máy", text: "Tăng ca 2 giờ/ngày 09–12/11, Xưởng 1 chuyền 03–08", meta: "06/11 · Phòng sản xuất", unread: true },
  { icon: "✅", cat: "Nghỉ phép", text: "Đơn nghỉ phép ngày 12/11 đã được duyệt", meta: `03/11 · ${LEADER}`, unread: false, to: { id: "nghi" } },
  { icon: "🩺", cat: "Nhà máy", text: "Khám sức khỏe định kỳ từ 16/11 theo chuyền", meta: "02/11 · Phòng Nhân sự", unread: false },
  { icon: "🔁", cat: "Mua bán", text: "Ngày 29/10: Mua 30 sp CĐ 7 – Diễu nẹp áo (Hoàn thành)", meta: "30/10 · Chuyền 05", unread: false, to: { id: "trades" } },
  { icon: "📮", cat: "Tra soát", text: "YC-0377 đã xử lý: đã sửa ngày 22/10 thành có mặt", meta: "24/10 · Phòng Nhân sự", unread: false, to: { id: "ts" } },
  { icon: "🎉", cat: "Nhà máy", text: "Lịch nghỉ Tết Dương lịch: 01/01/2027", meta: "20/10 · Phòng Nhân sự", unread: false },
];

/* ---------- Lối tắt ---------- */
export type Shortcut = { icon: string; label: string; to: Nav };
export const SHORTCUTS: Shortcut[] = [
  { icon: "💰", label: "Phiếu lương", to: { id: "phieu", arg: 0 } },
  { icon: "📈", label: "Lương sản phẩm", to: { id: "wk", arg: 1 } },
  { icon: "🔁", label: "Mua bán CĐ", to: { id: "trades" } },
  { icon: "🗓️", label: "Chấm công", to: { id: "cong" } },
  { icon: "📝", label: "Xin nghỉ phép", to: { id: "nghi" } },
  { icon: "🧵", label: "Phân công", to: { id: "pc" } },
  { icon: "⭐", label: "Tay nghề & KPI", to: { id: "kpi" } },
  { icon: "📮", label: "Tra soát, góp ý", to: { id: "ts" } },
  { icon: "💬", label: "Hỏi đáp", to: { id: "hoi" } },
];
export const MORE: Shortcut[] = [
  { icon: "👤", label: "Hồ sơ", to: { id: "hoso" } },
  { icon: "🔔", label: "Thông báo", to: { id: "tb" } },
  ...SHORTCUTS.slice(4),
];

/* ---------- Hỏi đáp chính sách (câu trả lời: **đậm**) ---------- */
export const QA: Record<string, [string, string]> = {
  "Vì sao lương tuần này là tạm tính?": ["Lương sản phẩm tuần lấy từ sản lượng chuyền và phiếu mua bán chưa chốt nên là **tạm tính**. Số chính thức nằm trong phiếu lương tháng sau khi Phòng Nhân sự chốt (thường sau ngày 10 tháng sau).", "Theo Quy chế lương thưởng 2026, mục 2.4"],
  "Tăng ca được tính lương ra sao?": ["Ngày thường: **150%**. Chủ nhật: **200%**. Ngày lễ, Tết: **300%**. Với lương sản phẩm: sản lượng ngoài giờ × đơn giá × 1,5.", "Theo Quy chế lương thưởng 2026, mục 3.1"],
  "Đi muộn bị trừ thế nào?": ["Đi muộn dưới 15 phút: nhắc nhở. Từ 3 lần/tháng: **mất thưởng chuyên cần 300.000 đ** tháng đó.", "Theo Nội quy lao động 2026, điều 12"],
  "Mua bán công đoạn tính tiền thế nào?": ["Thành tiền = số lượng × đơn giá công đoạn. Mua: **cộng** vào lương của chị. Bán, trừ hàng: **trừ**. Chỉ phiếu **Hoàn thành** mới vào lương.", "Theo Quy trình mua bán công đoạn, mục 3"],
  "Một năm có bao nhiêu ngày phép?": ["Chị có **12 ngày phép năm**, cứ 5 năm làm việc được cộng thêm 1 ngày. Năm 2026 chị còn **7 ngày**.", "Theo Nội quy lao động 2026, điều 18"],
  "Nghỉ thai sản được mấy tháng?": ["Chị được nghỉ **6 tháng** hưởng chế độ thai sản do BHXH chi trả. Từ tháng thứ 7 mang thai được làm 7 tiếng/ngày mà vẫn đủ lương.", "Theo Quy chế lương thưởng 2026, mục 4.2"],
  "Con nhỏ được hỗ trợ bao nhiêu?": ["Mỗi con dưới 6 tuổi được hỗ trợ **100.000 đ/tháng**, tối đa 2 con.", "Theo Quy chế lương thưởng 2026, mục 4.5"],
  "Bảo hiểm trừ bao nhiêu phần trăm?": ["Trừ **10,5%** lương đóng bảo hiểm: BHXH 8%, BHYT 1,5%, BHTN 1%. Thêm đoàn phí công đoàn 1%.", "Theo Luật BHXH và Quy chế lương 2026, mục 5"],
};
export const QA_FALLBACK: [string, string] = ["Câu này em chưa tìm thấy trong quy định. Em đã chuyển cho **Phòng nhân sự**, chị sẽ nhận trả lời trong 1 ngày làm việc.", "Đã gửi lên Phòng nhân sự"];

/* ---------- Trưởng chuyền: công nhân trong chuyền ---------- */
export type Worker = { ma: string; ten: string };
export const LINE_WORKERS: Worker[] = [["004120", "Nguyễn Thị Hoa"], ["004133", "Trần Thị Hồng"], ["004157", "Phạm Văn Đức"], ["004162", "Lê Thị Thu"], ["004178", "Ngô Thị Hồng Nhung"], ["004185", "Phạm Thị Lan"], ["004191", "Đỗ Thị Hương"], ["004204", "Vũ Văn Nam"]].map(([ma, ten]) => ({ ma, ten }));
/** Bỏ dấu để tìm "hoa" ra "Hoa", "duc" ra "Đức". */
export const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

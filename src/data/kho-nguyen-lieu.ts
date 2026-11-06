// Dữ liệu giả — port từ demo-det-may/apps/kho-nguyen-lieu.html (cập nhật 06/11/2026, 14:20)

export type Tone = "ok" | "warn" | "bad" | "info" | "violet" | "gray";

export const STATUS_TONE: Record<string, Tone> = {
  "Chờ kiểm vải": "warn",
  "Đạt": "ok",
  "Lỗi – trả NCC": "bad",
  "Chờ soạn": "warn",
  "Đã soạn": "info",
  "Đã giao": "ok",
};

export type Zone = { name: string; desc: string; racks: string; rolls?: number; meters: string; fill: number; tone?: Tone };
export const ZONES: Zone[] = [
  { name: "Kho vải 1 · Khu A", desc: "Vải dệt kim (pique, thun)", racks: "A01–A40", rolls: 1420, meters: "271.300", fill: 89, tone: "bad" },
  { name: "Kho vải 1 · Khu B", desc: "Kaki, jean, vải dệt thoi", racks: "B01–B32", rolls: 1030, meters: "197.600", fill: 84, tone: "warn" },
  { name: "Kho vải 2 · Khu C", desc: "Thun lạnh, voan, lót", racks: "C01–C24", rolls: 790, meters: "150.900", fill: 78 },
  { name: "Khu chờ kiểm vải", desc: "Hàng mới về, chưa kiểm", racks: "Sàn K1–K6", rolls: 160, meters: "30.200", fill: 75 },
  { name: "Kho phụ liệu · Khu D", desc: "Cúc, chỉ, nhãn, khóa, bao bì", racks: "D01–D60", meters: "1.400 mã", fill: 71 },
];

/** Nhập – xuất 6 ngày (cuộn vải) */
export const IO6 = [
  { day: "T7 31/10", in: 88, out: 97 },
  { day: "T2 02/11", in: 95, out: 106 },
  { day: "T3 03/11", in: 91, out: 101 },
  { day: "T4 04/11", in: 84, out: 103 },
  { day: "T5 05/11", in: 93, out: 99 },
  { day: "T6 06/11", in: 92, out: 104 },
];

export type FabricInfo = { code: string; width: number; perRoll: number; lots: string[] };
export type Receipt = {
  no: string; date: string; supplier: string; po: string; order: string; item: string;
  count: number; unit: string; doc: number; actual: number; status: string; loc: string; fabric: FabricInfo | null;
};
export const RECEIPTS: Receipt[] = [
  { no: "PN-11062", date: "06/11", supplier: "Dệt Phú An", po: "PO-0612", order: "DH-2611 · Nordvik Outdoor", item: "Cotton pique 220g · Navy", count: 40, unit: "m", doc: 4800, actual: 4752, status: "Chờ kiểm vải", loc: "Khu chờ kiểm K2", fabric: { code: "PQ", width: 180, perRoll: 120, lots: ["DL-4471", "DL-4472"] } },
  { no: "PN-11061", date: "06/11", supplier: "Vải Minh Phát", po: "PO-0608", order: "DH-2614 · Bellmont Apparel", item: "Kaki thun 2/1 · Be", count: 32, unit: "m", doc: 3200, actual: 3191, status: "Đạt", loc: "B07–B09", fabric: { code: "KK", width: 150, perRoll: 100, lots: ["DL-8820"] } },
  { no: "PN-11060", date: "06/11", supplier: "Phụ liệu Sao Mai", po: "PO-0581", order: "DH-2614 · Bellmont Apparel", item: "Cúc nhựa 15mm · Be", count: 1, unit: "cái", doc: 12000, actual: 11950, status: "Đạt", loc: "D14-07", fabric: null },
  { no: "PN-11059", date: "06/11", supplier: "Dệt Đông Á", po: "PO-0607", order: "DH-2618 · Kazeyama Sports", item: "Voan · Đỏ đô", count: 20, unit: "m", doc: 1800, actual: 1784, status: "Lỗi – trả NCC", loc: "Khu chờ kiểm K5", fabric: { code: "VO", width: 145, perRoll: 90, lots: ["DL-3105", "DL-3106"] } },
  { no: "PN-11058", date: "05/11", supplier: "Vải Minh Phát", po: "PO-0605", order: "DH-2622 · Hanbit Urban", item: "Thun lạnh · Đen", count: 72, unit: "m", doc: 8640, actual: 8640, status: "Đạt", loc: "C03–C06", fabric: { code: "TL", width: 170, perRoll: 120, lots: ["DL-5530"] } },
  { no: "PN-11057", date: "05/11", supplier: "Chỉ Kim Long", po: "PO-0603", order: "Nhiều đơn", item: "Chỉ may 40/2 · Trắng", count: 2, unit: "cuộn chỉ", doc: 1200, actual: 1200, status: "Đạt", loc: "D22-03", fabric: null },
  { no: "PN-11056", date: "05/11", supplier: "Bao bì Tân Tiến", po: "PO-0601", order: "DH-2610 · Coral Bay Clothing", item: "Thùng carton 5 lớp", count: 1, unit: "cái", doc: 3000, actual: 2960, status: "Đạt", loc: "D sàn 2", fabric: null },
];

export type Issue = {
  no: string; time: string; lsx: string; order: string; dept: string; item: string; unit: string;
  req: number; out: number; receiver: string; status: string; lines: [string, string, string, string][];
};
export const ISSUES: Issue[] = [
  { no: "PX-21190", time: "13:40", lsx: "LSX-1249", order: "DH-2622 · AO-THUN-2402", dept: "Xưởng cắt · Bàn 06", item: "Thun lạnh · Đen", unit: "m", req: 2880, out: 0, receiver: "Trịnh Văn Sơn", status: "Chờ soạn", lines: [["TL-1105-001…024", "24 cuộn · lô DL-5530", "C03–C06", "2.880 m (dự kiến)"]] },
  { no: "PX-21189", time: "13:15", lsx: "—", order: "Mẫu chào hàng SMS", dept: "Phòng mẫu", item: "Voan · Đỏ đô", unit: "m", req: 12, out: 0, receiver: "Lý Thị Hằng", status: "Chờ soạn", lines: [["Cắt từ cuộn VO-0510-014", "lô DL-3011", "C21-04", "12 m"]] },
  { no: "PX-21188", time: "11:30", lsx: "LSX-1255", order: "DH-2620 · SOMI-NU-1210", dept: "Chuyền 11", item: "Nhãn size · Kazeyama", unit: "cái", req: 3600, out: 3200, receiver: "Ngô Thị Yến", status: "Đã soạn", lines: [["Lô L-2610-15 · S", "800", "D31-02", "800"], ["Lô L-2610-15 · M", "1.200", "D31-02", "1.200"], ["Lô L-2610-15 · L", "1.200", "D31-03", "1.200"], ["Còn thiếu 400 — chờ PO-0576", "", "", ""]] },
  { no: "PX-21187", time: "10:05", lsx: "LSX-1252", order: "DH-2614 · QUAN-KAKI-0932", dept: "Xưởng cắt · Bàn 07", item: "Kaki thun 2/1 · Be", unit: "m", req: 5200, out: 5212, receiver: "Đỗ Văn Hùng", status: "Đã soạn", lines: [["KK-1106-001…032", "32 cuộn · lô DL-8820", "B07–B09", "3.191 m"], ["KK-1021-033…052", "20 cuộn · lô DL-8794", "B04-02", "2.021 m"]] },
  { no: "PX-21186", time: "09:20", lsx: "LSX-1238", order: "DH-2610 · AO-THUN-2402", dept: "Hoàn thiện", item: "Thùng carton 5 lớp", unit: "cái", req: 190, out: 190, receiver: "Phan Thị Diệu", status: "Đã giao", lines: [["Lô L-2611-01", "190", "D sàn 2", "190"]] },
  { no: "PX-21185", time: "08:10", lsx: "LSX-1247", order: "DH-2611 · AO-POLO-2611", dept: "Chuyền 05", item: "Cúc nhựa 15mm · Navy", unit: "cái", req: 26400, out: 26400, receiver: "Hoàng Thị Nga", status: "Đã giao", lines: [["Lô L-2610-04", "26.400", "D14-05", "26.400"]] },
  { no: "PX-21184", time: "07:30", lsx: "LSX-1247", order: "DH-2611 · AO-POLO-2611", dept: "Xưởng cắt · Bàn 03", item: "Cotton pique 220g · Navy", unit: "m", req: 2760, out: 2769, receiver: "Đặng Văn Long", status: "Đã giao", lines: [["PQ-1028-024…046", "23 cuộn · lô DL-4402 (đợt 2/2)", "A12–A13", "2.769 m"]] },
];

/** Bộ phận nhận (bộ lọc "Xuất cho") → tiền tố trong cột dept */
export const DEPTS = ["Xưởng cắt", "Chuyền may", "Hoàn thiện", "Phòng mẫu"];
export const deptMatch = (dept: string, f: string) => (f === "Chuyền may" ? dept.startsWith("Chuyền") : dept.startsWith(f));

export const RETURNS = [
  { no: "TL-0412", date: "06/11", from: "Xưởng cắt · Bàn 03", lsx: "LSX-1239", item: "Cotton pique · Trắng", qty: "3 cuộn · 186 m", cond: "Dùng được", tone: "ok" as Tone, loc: "A14-02" },
  { no: "TL-0411", date: "06/11", from: "Chuyền 05", lsx: "LSX-1247", item: "Cúc nhựa 15mm · Navy", qty: "420 cái", cond: "Dùng được", tone: "ok" as Tone, loc: "D14-05" },
  { no: "TL-0410", date: "05/11", from: "Chuyền 12", lsx: "LSX-1233", item: "Chỉ may 40/2 · Đen", qty: "18 cuộn chỉ", cond: "Dùng được", tone: "ok" as Tone, loc: "D22-01" },
  { no: "TL-0409", date: "05/11", from: "Xưởng cắt · Bàn 08", lsx: "LSX-1231", item: "Kaki · Rêu (đầu tấm)", qty: "42 m", cond: "Vải vụn, làm mẫu", tone: "warn" as Tone, loc: "Phòng mẫu" },
];

export type Roll = { id: string; fabric: string; color: string; lot: string; width: number; meters: number; loc: string; date: string; held: string; wh: "Kho vải 1" | "Kho vải 2" | "Khu chờ kiểm" };
export const ROLLS: Roll[] = [
  { id: "PQ-1106-001", fabric: "V-PQ220", color: "Navy", lot: "DL-4471", width: 180, meters: 121, loc: "Khu chờ kiểm K2", date: "06/11", held: "DH-2611 · LSX-1251", wh: "Khu chờ kiểm" },
  { id: "PQ-1028-047", fabric: "V-PQ220", color: "Navy", lot: "DL-4402", width: 180, meters: 118, loc: "A13-04", date: "28/10", held: "DH-2611 · LSX-1251", wh: "Kho vải 1" },
  { id: "PQ-1015-112", fabric: "V-PQ220", color: "Trắng", lot: "DL-4390", width: 180, meters: 64, loc: "A14-02", date: "15/10", held: "Tự do", wh: "Kho vải 1" },
  { id: "KK-1106-012", fabric: "V-KK21", color: "Be", lot: "DL-8820", width: 150, meters: 99, loc: "B07-03", date: "06/11", held: "DH-2614 · LSX-1252", wh: "Kho vải 1" },
  { id: "TL-1105-031", fabric: "V-TL170", color: "Đen", lot: "DL-5530", width: 170, meters: 120, loc: "C04-01", date: "05/11", held: "DH-2622 · LSX-1249", wh: "Kho vải 2" },
  { id: "VO-0510-014", fabric: "V-VO75", color: "Đỏ đô", lot: "DL-3011", width: 145, meters: 76, loc: "C21-04", date: "10/05", held: "Tự do", wh: "Kho vải 2" },
  { id: "TL-0406-008", fabric: "V-TL170", color: "Xám chì", lot: "DL-5102", width: 170, meters: 78, loc: "C18-02", date: "06/04", held: "Tự do · tồn đọng", wh: "Kho vải 2" },
  { id: "KK-0703-019", fabric: "V-KK30", color: "Rêu", lot: "DL-8611", width: 150, meters: 98, loc: "B28-01", date: "03/07", held: "Tự do · tồn đọng", wh: "Kho vải 1" },
];
/** Bộ lọc mã vải → tiền tố mã vải */
export const FABRIC_FILTER: Record<string, string> = { "Cotton pique": "V-PQ", "Kaki thun": "V-KK" };

export const TRIMS = [
  { code: "PL-CUC-0154", name: "Cúc nhựa 15mm · Navy", lot: "L-2610-04", stock: "34.800 cái", held: "26.400", free: "8.400", loc: "D14-05", date: "12/10" },
  { code: "PL-CUC-0158", name: "Cúc nhựa 15mm · Be", lot: "L-2611-02", stock: "11.950 cái", held: "11.950", free: "0", loc: "D14-07", date: "06/11" },
  { code: "PL-CHI-0402", name: "Chỉ may 40/2 · Trắng", lot: "L-2611-03", stock: "1.840 cuộn", held: "1.200", free: "640", loc: "D22-03", date: "05/11" },
  { code: "PL-NHA-1021", name: "Nhãn chính dệt · Nordvik", lot: "L-2609-02", stock: "21.000 cái", held: "6.000", free: "15.000", loc: "D30-01", date: "25/09" },
  { code: "PL-KHO-0318", name: "Khóa kéo 18cm · Be", lot: "L-2610-07", stock: "4.400 cái", held: "4.400", free: "0", loc: "D18-02", date: "14/10" },
  { code: "PL-BB-0005", name: "Thùng carton 5 lớp", lot: "L-2611-01", stock: "2.770 cái", held: "1.900", free: "870", loc: "D sàn 2", date: "05/11" },
];

export type Need = { lsx: string; order: string; qty: number; item: string; unit: string; norm: number; issued: number; free: number; incoming: number; line: string };
export const NEEDS: Need[] = [
  { lsx: "LSX-1252", order: "DH-2614 · QUAN-KAKI-0932", qty: 5200, item: "Cúc nhựa 15mm · Be", unit: "cái", norm: 4, issued: 0, free: 11950, incoming: 6850, line: "10/11" },
  { lsx: "LSX-1252", order: "DH-2614 · QUAN-KAKI-0932", qty: 5200, item: "Khóa kéo 18cm · Be", unit: "cái", norm: 1, issued: 0, free: 4400, incoming: 0, line: "10/11" },
  { lsx: "LSX-1258", order: "DH-2618 · VAY-XOE-1105", qty: 2400, item: "Voan · Đỏ đô", unit: "m", norm: 1.25, issued: 0, free: 2140, incoming: 0, line: "11/11" },
  { lsx: "LSX-1261", order: "DH-2625 · AO-KHOAC-1150", qty: 4000, item: "Mex dựng 1m · Trắng", unit: "m", norm: 0.35, issued: 0, free: 900, incoming: 0, line: "13/11" },
  { lsx: "LSX-1255", order: "DH-2620 · SOMI-NU-1210", qty: 3600, item: "Nhãn size · Kazeyama", unit: "cái", norm: 1, issued: 3200, free: 0, incoming: 400, line: "07/11" },
  { lsx: "LSX-1252", order: "DH-2614 · QUAN-KAKI-0932", qty: 5200, item: "Kaki thun 2/1 · Be", unit: "m", norm: 1, issued: 5212, free: 0, incoming: 0, line: "10/11" },
  { lsx: "LSX-1247", order: "DH-2611 · AO-POLO-2611", qty: 6000, item: "Cotton pique 220g · Navy", unit: "m", norm: 0.92, issued: 5538, free: 0, incoming: 0, line: "đang may" },
];
/** Nhu cầu = định mức × số SP; Thiếu = nhu cầu − đã cấp − tồn khả dụng − đang về */
export const needOf = (n: Need) => Math.round(n.qty * n.norm);
export const shortOf = (n: Need) => Math.max(0, needOf(n) - n.issued - n.free - n.incoming);

export const COUNTS = [
  { no: "KK-2611-03", date: "06/11", scope: "Khu A · kệ A01–A10", counted: "286 / 355 cuộn", status: "Đang đếm", tone: "info" as Tone },
  { no: "KK-2611-02", date: "04/11", scope: "Phụ liệu · kệ D01–D15", counted: "352 / 352 mã", status: "Chờ duyệt chênh lệch", tone: "warn" as Tone },
  { no: "KK-2611-01", date: "02/11", scope: "Khu C · kệ C01–C12", counted: "396 / 396 cuộn", status: "Đã chốt", tone: "ok" as Tone },
  { no: "KK-2610-09", date: "30/10", scope: "Khu B · toàn khu", counted: "1.046 / 1.046 cuộn", status: "Đã chốt", tone: "ok" as Tone },
];

export const DIFFS = [
  { item: "Cúc nhựa 15mm · Navy", book: 35220, real: 34800, reason: "Trả lại kho chưa nhập sổ" },
  { item: "Nhãn size M · Bellmont", book: 12400, real: 12150, reason: "Hao hụt in lỗi" },
  { item: "Chỉ may 40/2 · Đen", book: 912, real: 930, reason: "Chuyền 12 trả lại" },
  { item: "Khóa kéo 20cm · Đen", book: 3600, real: 3540, reason: "Đang tìm nguyên nhân" },
];

export const STALE = [
  { item: "Thun lạnh · Xám chì (dư đơn DH-2508)", loc: "C18–C19", qty: "42 cuộn · 3.240 m", days: 214, value: 97200000, hint: "Dùng cho AO-THUN-2402 (DH-2631)", tone: "info" as Tone },
  { item: "Kaki · Rêu", loc: "B28", qty: "19 cuộn · 1.860 m", days: 126, value: 74400000, hint: "Dùng cho QUAN-KAKI-0932", tone: "info" as Tone },
  { item: "Cotton pique · Xanh ngọc", loc: "A37", qty: "31 cuộn · 3.720 m", days: 108, value: 126500000, hint: "Chào Nordvik làm màu phụ", tone: "violet" as Tone },
  { item: "Cúc kim loại 17mm", loc: "D41-03", qty: "15.000 cái", days: 180, value: 22500000, hint: "Liên hệ trả nhà cung cấp", tone: "gray" as Tone },
  { item: "Nhãn chính · Hanbit Urban (mẫu cũ)", loc: "D30-06", qty: "8.000 cái", days: 98, value: 4800000, hint: "Không dùng lại được — đề xuất hủy", tone: "bad" as Tone },
];

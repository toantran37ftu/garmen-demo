/** Dữ liệu giả cho app Kế toán (port từ demo-det-may/apps/ke-toan.html). */

export type Cell = string | number;
export type Tone = "ok" | "warn" | "bad" | "info" | "violet" | "gray";
/** [nhãn, giá trị, gợi ý, tông màu giá trị] */
export type Kpi = [string, string, string, Tone?];

/* ---------- menu ---------- */
export const MENU: [string, [string, string][]][] = [
  ["Sổ sách", [["tq", "Tổng quan"], ["ct", "Chứng từ"], ["lct", "Lập chứng từ"], ["dm", "Danh mục"]]],
  ["Tiền", [["quy", "Quỹ tiền mặt"], ["nh", "Ngân hàng"], ["kuv", "Khế ước vay"], ["dttc", "Đầu tư tài chính"]]],
  ["Mua bán", [["ban", "Bán hàng"], ["mua", "Mua hàng"], ["hddt", "Hóa đơn điện tử"]]],
  ["Kho và tài sản", [["kho", "Kho"], ["gt", "Giá thành"], ["hdg", "Hợp đồng"], ["ccdc", "CCDC, chi phí trả trước"], ["tscd", "Tài sản cố định"], ["tssh", "Tài sản sinh học"]]],
  ["Nhân sự", [["luong", "Tiền lương"]]],
  ["Thuế và báo cáo", [["thue", "Thuế"], ["tk01", "Tờ khai 01/GTGT"], ["bctc", "Báo cáo tài chính"], ["hn", "Báo cáo hợp nhất"], ["cdps", "Cân đối phát sinh"], ["ns", "Ngân sách"], ["bcc", "Báo cáo theo chiều"], ["sct", "Sổ chi tiết tài khoản"], ["skt", "Sổ kế toán"]]],
  ["Cuối kỳ", [["ks", "Khóa sổ"]]],
  ["Hệ thống", [["cd", "Cài đặt"], ["tg", "Tỷ giá"], ["tl", "Thiết lập ban đầu"]]],
];
export const viewName = (id: string) => MENU.flatMap((g) => g[1]).find((x) => x[0] === id)?.[1] ?? id;

export const PERIODS = ["Tháng 10/2026 · Đang mở", "Tháng 11/2026 · Đang mở", "Tháng 9/2026 · Đã khóa"];

/* ---------- trạng thái ---------- */
const SC: Record<string, Tone> = {
  "Nháp": "gray", "Đã ghi sổ": "ok", "Đã khớp": "ok", "Chưa khớp": "bad", "Gợi ý AI": "violet", "Đã thu": "ok", "Trong hạn": "ok", "Đã trả": "ok",
  "Sắp tới": "warn", "Không phát sinh": "gray", "Đã nộp": "ok", "Đang xử lý": "info", "CQT đã cấp mã": "ok", "Chờ ký số": "warn", "Đã gửi khách": "info",
  "Đã tính": "ok", "Dở dang": "warn", "Đang dùng": "ok", "Đã khóa": "gray", "Đang mở": "info", "Chưa mở": "gray", "Đã chạy": "ok", "Chưa chạy": "warn",
  "Hoàn tất": "ok", "Chưa xong": "warn", "Khách hàng": "info", "Nhà cung cấp": "violet", "Đã tất toán": "gray", "Đang thực hiện": "info",
  "Chờ duyệt": "warn", "Kỳ 11/2026": "gray", "Đạt": "ok", "Vượt": "bad", "MST tạm ngừng": "bad",
};
export const statusTone = (t: string): Tone =>
  t.startsWith("Quá hạn") ? "bad" : t.startsWith("Còn ") ? "warn" : SC[t] ?? "gray";

/* ---------- tiêu đề từng màn: [mô tả, nút chính, màn chuyển tới khi bấm nút chính, nút phụ] ---------- */
export const VIEW_META: Record<string, { d: string; a: string; go?: string; x?: string[] }> = {
  tq: { d: "Tháng 10/2026 · Chưa đủ điều kiện khóa sổ · tờ khai thuế GTGT hạn 20/11/2026", a: "＋ Lập chứng từ", go: "lct", x: ["↻ Quét lại"] },
  ct: { d: "Tất cả chứng từ kế toán trong kỳ — phiếu thu chi, báo nợ có, hóa đơn, phiếu kho, chứng từ khác", a: "＋ Lập chứng từ", go: "lct", x: ["⬇ Xuất Excel"] },
  lct: { d: "Nhập nghiệp vụ, hệ thống tự định khoản và ghi sổ", a: "Lưu và ghi sổ" },
  dm: { d: "Đối tượng, hàng hóa, hệ thống tài khoản và chiều phân tích dùng chung", a: "＋ Thêm đối tượng", x: ["↻ Cập nhật trạng thái MST"] },
  quy: { d: "Sổ quỹ, phiếu thu và phiếu chi tiền mặt", a: "＋ Phiếu chi", x: ["＋ Phiếu thu"] },
  nh: { d: "Tài khoản ngân hàng, sao kê và đối chiếu tự động", a: "↥ Nhập sao kê", x: ["＋ Ủy nhiệm chi"] },
  ban: { d: "Hóa đơn bán, công nợ phải thu và hạn thanh toán của khách hàng", a: "＋ Lập hóa đơn bán", go: "lct" },
  mua: { d: "Hóa đơn mua vào, công nợ phải trả và lịch thanh toán nhà cung cấp", a: "＋ Lập hóa đơn mua", go: "lct" },
  hddt: { d: "Phát hành hóa đơn có mã của cơ quan thuế và tải hóa đơn đầu vào", a: "＋ Phát hành hóa đơn", x: ["↓ Tải HĐ đầu vào"] },
  kho: { d: "Nhập – xuất – tồn theo giá trị nguyên phụ liệu, tính giá bình quân cuối kỳ", a: "Tính giá xuất kho", x: ["⬇ Xuất Excel"] },
  gt: { d: "Tập hợp chi phí và tính giá thành sản xuất theo lệnh sản xuất", a: "Tính giá thành" },
  tscd: { d: "Sổ tài sản, khấu hao đường thẳng hàng tháng theo bộ phận sử dụng", a: "＋ Ghi tăng tài sản", x: ["Tính khấu hao T10"] },
  luong: { d: "Nhận bảng lương từ app Tính lương, trích bảo hiểm, thuế TNCN và hạch toán", a: "Duyệt bút toán lương" },
  thue: { d: "Tình hình thuế, lịch khai nộp và xuất tờ khai", a: "Lập tờ khai 01/GTGT", go: "tk01", x: ["Xuất CSV", "In", "XML 05/KK-TNCN", "XML 05/QTT-TNCN", "XML 03/TNDN"] },
  bctc: { d: "Bộ báo cáo theo Thông tư 99/2025/TT-BTC, lập tự động từ sổ", a: "Nộp báo cáo", x: ["Xuất CSV", "In"] },
  ks: { d: "Kiểm tra điều kiện, chạy bút toán cuối kỳ và khóa kỳ kế toán", a: "🔒 Khóa sổ tháng 10" },
};

/* ---------- dữ liệu dùng chung ---------- */
export const KH: [string, string, number, string][] = [
  ["KH-NVK", "Nordvik Outdoor (Thụy Điển)", 20260000000, "30/10/2026"],
  ["KH-BLM", "Bellmont Apparel (Mỹ)", 17480000000, "25/10/2026"],
  ["KH-KZY", "Kazeyama Sports (Nhật)", 15520000000, "25/10/2026"],
  ["KH-CRB", "Coral Bay Clothing (Úc)", 9310000000, "28/10/2026"],
  ["KH-HBU", "Hanbit Urban (Hàn Quốc)", 9030000000, "28/10/2026"],
  ["KH-NTL", "Northline Wear (Canada)", 6820000000, "21/10/2026"],
];
export const NCC: [string, string, string, number, string][] = [
  ["NCC-MP", "NCC Vải Minh Phát", "0301234567", 7380000000, "28/10/2026"],
  ["NCC-HB", "NCC Dệt Hòa Bình", "0309876543", 5700000000, "27/10/2026"],
  ["NCC-AD", "NCC Phụ liệu Á Đông", "0312345678", 2550000000, "29/10/2026"],
  ["NCC-SM", "NCC Bao bì Sao Mai", "0315678901", 1283500000, "26/10/2026"],
  ["NCC-TC", "NCC Chỉ Thành Công", "0314567890", 858600000, "27/10/2026"],
  ["DL-KCN", "Điện lực khu công nghiệp", "0300000123", 567600000, "26/10/2026"],
];
/** [số CT, ngày, loại, đối tượng, diễn giải, TK Nợ / Có, số tiền, trạng thái] */
export const CT: [string, string, string, string, string, string, number, string][] = [
  ["UNC-1031", "31/10", "Ủy nhiệm chi", "NCC Vải Minh Phát", "Trả tiền vải kaki HĐ 0019344", "331 / 1121", 440000000, "Nháp"],
  ["PKT-1031", "31/10", "Chứng từ khác", "Bảng lương T10", "Hạch toán lương tháng 10/2026 (từ Tính lương)", "622, 627, 641, 642 / 334", 8126400000, "Nháp"],
  ["PKT-1032", "31/10", "Chứng từ khác", "—", "Trích khấu hao TSCĐ tháng 10", "627, 642 / 214", 452600000, "Nháp"],
  ["PX-2210", "30/10", "Phiếu xuất", "Xưởng cắt", "Xuất vải cotton pique cho LSX-2611-03", "621 / 1521", 337000000, "Đã ghi sổ"],
  ["BC-0412", "30/10", "Báo có", "Nordvik Outdoor (Thụy Điển)", "Thu tiền HĐ 0001288 – 82.600 USD", "1122 / 131", 2096388000, "Đã ghi sổ"],
  ["PT-0219", "30/10", "Phiếu thu", "Nguyễn Văn An", "Hoàn tạm ứng sửa máy cắt", "1111 / 141", 4500000, "Nháp"],
  ["PC-0391", "29/10", "Phiếu chi", "Tổ bảo trì Xưởng 2", "Mua dây curoa máy may", "6273 / 1111", 4850000, "Đã ghi sổ"],
  ["PN-0915", "29/10", "Phiếu nhập", "NCC Phụ liệu Á Đông", "Nhập nhãn dệt, nút nhựa – ĐH AO-POLO-2611", "1522, 1331 / 331", 152800000, "Đã ghi sổ"],
  ["HĐ 0001315", "28/10", "Hóa đơn bán", "Hanbit Urban (Hàn Quốc)", "Xuất khẩu AO-KHOAC-1150 – 84.500 USD", "131 / 5111", 2144610000, "Đã ghi sổ"],
  ["HĐ 0019344", "28/10", "Hóa đơn mua", "NCC Vải Minh Phát", "Mua vải kaki 12.800 m", "1521, 1331 / 331", 440000000, "Đã ghi sổ"],
  ["BN-0187", "27/10", "Báo nợ", "NCC Dệt Hòa Bình", "Trả tiền vải đợt 3", "331 / 1121", 1136000000, "Đã ghi sổ"],
  ["HĐ 0001310", "25/10", "Hóa đơn bán", "Kazeyama Sports (Nhật)", "Xuất khẩu AO-POLO-2611 – 96.900 USD", "131 / 5111", 2459322000, "Đã ghi sổ"],
  ["BC-0405", "25/10", "Báo có", "Bellmont Apparel (Mỹ)", "Thu tiền HĐ 0001279 – 49.200 USD", "1122 / 131", 1248696000, "Đã ghi sổ"],
];
/** Doanh thu / chi phí 6 tháng (tỷ đồng) */
export const REV = { months: ["T5", "T6", "T7", "T8", "T9", "T10"], rev: [39.6, 41.2, 44.1, 40.3, 42.6, 41.8], cost: [36.5, 38.0, 40.6, 37.4, 39.5, 39.0] };

/** [icon, nhóm, tiêu đề, chi tiết, chặn khóa sổ, màn mở] */
export const TASKS: [string, string, string, string, boolean, string][] = [
  ["💵", "Khóa sổ", "Không âm quỹ", "TK 1111 – Quỹ xưởng âm 3.971.160 đ từ ngày 29/10 (PC-0391 chi trước khi ghi PT-0219)", true, "quy"],
  ["💱", "Khóa sổ", "Đánh giá chênh lệch tỷ giá cuối kỳ", "Số dư gốc USD của TK 1122, 131 chưa đánh giá theo tỷ giá 31/10/2026 (25.380 đ/USD)", false, "ks"],
  ["🏦", "Ngân hàng", "3 giao dịch sao kê chưa khớp", "VCB USD ****8826: 2 khoản phí ngân hàng, 1 khoản Coral Bay Clothing (Úc) chuyển 24.600 USD", false, "nh"],
  ["🧾", "Thuế", "Hóa đơn đầu vào của NCC ngừng hoạt động", "HĐ 0007712 – NCC Chỉ Thành Công: MST tạm ngừng theo tra cứu cơ quan thuế ngày 05/11", false, "mua"],
  ["👥", "Tiền lương", "Bút toán lương tháng 10 chờ duyệt", "Nhận từ app Tính lương 05/11 17:20 · 8.126.400.000 đ · 980 người", false, "luong"],
];
/** [đạt, điều kiện, chi tiết khi chưa đạt] */
export const COND: [boolean, string, string?][] = [
  [false, "Không âm quỹ", "TK 1111 – Quỹ xưởng âm 3.971.160 đ từ ngày 29/10/2026"],
  [true, "Kỳ trước đã khóa sổ (Tháng 9/2026)"],
  [true, "Sao kê ngân hàng đã nhập đến hết 31/10"],
  [true, "Không có chứng từ lỗi định khoản"],
  [true, "Cân đối phát sinh: tổng Nợ = tổng Có"],
];

/* ---------- KPI ---------- */
export const KPI: Record<string, Kpi[]> = {
  tq: [["Tiền hiện có", "20,18 tỷ", "Tiền mặt + 3 tài khoản ngân hàng"], ["Thuế GTGT phải nộp", "0 đ", "Còn khấu trừ 828.400.000 chuyển kỳ sau"], ["Phải thu khách hàng", "78,42 tỷ", "6 khách hàng · ≈ 3,09 triệu USD"], ["Phải trả nhà cung cấp", "25,94 tỷ", "24 NCC · 3,64 tỷ đến hạn trong 7 ngày", "warn"], ["Lãi trước thuế T10", "2,80 tỷ", "Tạm tính, chưa khóa sổ", "ok"]],
  quy: [["Tồn đầu kỳ", "386.400.000", "01/10/2026"], ["Thu trong kỳ", "214.600.000", "18 phiếu thu", "ok"], ["Chi trong kỳ", "188.350.000", "41 phiếu chi", "bad"], ["Tồn cuối kỳ", "412.650.000", "Văn phòng 416.621.160 · Xưởng −3.971.160"]],
  ban: [["Doanh thu tháng 10", "41,83 tỷ", "22 hóa đơn · ≈ 1,65 triệu USD"], ["Phải thu khách hàng", "78,42 tỷ", "6 khách hàng"], ["Quá hạn", "3,90 tỷ", "3 hóa đơn", "bad"], ["Đến hạn trong 14 ngày", "9,64 tỷ", "5 hóa đơn", "warn"]],
  mua: [["Mua vào tháng 10", "10,37 tỷ", "168 hóa đơn đầu vào"], ["Phải trả NCC", "25,94 tỷ", "24 nhà cung cấp"], ["Đến hạn trong 7 ngày", "3,64 tỷ", "6 hóa đơn", "warn"], ["Cần xử lý", "1", "HĐ của NCC tạm ngừng MST", "bad"]],
  hddt: [["Đã phát hành T10", "22", "Ký hiệu 1C26TMD"], ["CQT đã cấp mã", "19", "", "ok"], ["Chờ ký số", "3", "", "warn"], ["HĐ đầu vào tải về", "168", "Từ cổng hóa đơn điện tử"]],
  kho: [["Tồn NPL cuối kỳ", "43,28 tỷ", "Vải ~650.000 m · 3.400 cuộn"], ["Nhập trong kỳ", "20,04 tỷ", "118 phiếu nhập"], ["Xuất cho sản xuất", "22,38 tỷ", "164 phiếu xuất · TK 621"], ["Chênh lệch kiểm kê", "−7,2 tr", "Vải lót, chờ xử lý", "warn"]],
  gt: [["CP NVL trực tiếp (621)", "22,38 tỷ", "Xuất kho theo lệnh SX"], ["CP nhân công trực tiếp (622)", "8,24 tỷ", "Lương SP + BH công ty"], ["CP sản xuất chung (627)", "4,02 tỷ", "Phân bổ theo giờ công"], ["Sản phẩm hoàn thành", "418.600", "68 lệnh SX mở"], ["Dở dang cuối kỳ", "7,46 tỷ", "TK 154"]],
  tscd: [["Nguyên giá", "78,60 tỷ", "68 nhóm tài sản · 720 máy may"], ["Hao mòn lũy kế", "30,40 tỷ", ""], ["Giá trị còn lại", "48,20 tỷ", "", "ok"], ["Khấu hao tháng 10", "452.600.000", "Chứng từ PKT-1032 (nháp)"]],
  luong: [["Quỹ lương T10", "8.126.400.000", "Lương SP ~76%"], ["BH công ty đóng (21,5%)", "1.208.300.000", "Trên lương đóng BH 5,62 tỷ"], ["BH người lao động (10,5%)", "590.100.000", "Khấu trừ lương"], ["Thuế TNCN khấu trừ", "64.380.000", "86 người phát sinh"], ["Thực lĩnh", "7.471.920.000", "Chi trả 05/11 qua VCB", "ok"]],
  thue: [["Thuế GTGT", "828.400.000", "Chuyển khấu trừ kỳ sau"], ["Thuế TNDN tạm nộp", "1.680.000.000", "Quý 4/2026 · dự kiến"], ["Thuế TNCN", "64.380.000", "Tháng 10/2026"], ["Hạn gần nhất", "20/11/2026", "Còn 14 ngày", "warn"]],
  bctc: [["Tổng tài sản", "213,83 tỷ", "Tại 31/10/2026"], ["Nợ phải trả", "87,34 tỷ", "Vay 51,4 tỷ"], ["Vốn chủ sở hữu", "126,48 tỷ", ""], ["Lợi nhuận sau thuế", "17,92 tỷ", "Lũy kế 10 tháng", "ok"]],
  ks: [["Điều kiện đã đạt", "4/5", "Còn 1 điều kiện chặn", "warn"], ["Lợi nhuận trước thuế", "2.804.000.000", "Tháng 10/2026 · tạm tính"], ["Khóa sổ gần nhất", "Tháng 9/2026", "Khóa ngày 08/10/2026 · Trần Thị Hoa"]],
};

/* ---------- bảng ----------
 * Quy ước tiêu đề cột: "#" số (căn phải), "!" huy hiệu trạng thái, "*" chữ đậm, "~" chữ mờ. */
export type TableDef = { head: string[]; rows: Cell[][]; foot?: string };

export const LCT_LINES: [string, string, string, string, string, number][] = [
  ["AO-POLO-2611", "Áo polo nam", "7.200", "114.200", "0% (xuất khẩu)", 822240000],
  ["AO-THUN-2402", "Áo thun cổ tròn", "9.600", "68.500", "0% (xuất khẩu)", 657600000],
];

export const DM_GOODS: TableDef = {
  head: ["*Mã", "Tên", "ĐVT", "Nhóm", "TK kho", "#Tồn cuối kỳ"],
  rows: [["AO-POLO-2611", "Áo polo nam pique", "cái", "Thành phẩm", "155", 14600], ["QUAN-KAKI-0932", "Quần kaki nam", "cái", "Thành phẩm", "155", 8200], ["AO-KHOAC-1150", "Áo khoác gió 2 lớp", "cái", "Thành phẩm", "155", 3100], ["V-PIQ-180", "Vải cotton pique 180gsm", "m", "Vải chính", "1521", 214000], ["V-KAKI-240", "Vải kaki 240gsm", "m", "Vải chính", "1521", 158000], ["V-LOT-TAF", "Vải lót taffeta", "m", "Vải lót", "1521", 110000], ["C-PE-402", "Chỉ polyester 40/2", "cuộn", "Chỉ may", "1522", 72000], ["DK-5N-60", "Dây kéo nhựa #5, 60 cm", "cái", "Dây kéo", "1522", 560000], ["N-4L-18", "Nút nhựa 4 lỗ 18L", "cái", "Nút, khóa", "1522", 3400000]],
};
export const DM_ACCOUNTS: TableDef = {
  head: ["*Số TK", "Tên tài khoản", "Tính chất", "#Dư Nợ", "#Dư Có"],
  rows: [["1111", "Tiền mặt VND", "Dư Nợ", 412650000, ""], ["1121", "Tiền gửi ngân hàng VND", "Dư Nợ", 7410700000, ""], ["1122", "Tiền gửi ngân hàng ngoại tệ", "Dư Nợ", 12355491600, ""], ["131", "Phải thu của khách hàng", "Lưỡng tính", 78420000000, ""], ["1331", "Thuế GTGT được khấu trừ", "Dư Nợ", 828400000, ""], ["1521", "Nguyên liệu – vải", "Dư Nợ", 37920000000, ""], ["1522", "Vật liệu phụ", "Dư Nợ", 5360000000, ""], ["154", "Chi phí SXKD dở dang", "Dư Nợ", 7460000000, ""], ["211", "Tài sản cố định hữu hình", "Dư Nợ", 78600000000, ""], ["214", "Hao mòn TSCĐ", "Dư Có", "", 30400000000], ["331", "Phải trả người bán", "Lưỡng tính", "", 25936200000], ["334", "Phải trả người lao động", "Dư Có", "", 7471920000], ["5111", "Doanh thu bán hàng hóa", "Không số dư", "", ""], ["622", "Chi phí nhân công trực tiếp", "Không số dư", "", ""]],
};
export const DM_DIMS: TableDef = {
  head: ["*Chiều", "#Số giá trị", "Bắt buộc với TK", "Ví dụ"],
  rows: [["Lệnh sản xuất", 68, "621, 622, 627, 154", "LSX-2611-03, LSX-0932-01"], ["Xưởng / bộ phận", 8, "622, 627, 641, 642", "Xưởng 1, Xưởng 2, Xưởng cắt, Hoàn thiện, Kho NPL"], ["Khách hàng – đơn hàng", 22, "5111, 131", "Nordvik Outdoor (Thụy Điển) · PO 4500-2611"], ["Hợp đồng", 28, "131, 331", "HĐ-NVK-2026-07"], ["Khoản mục phí", 22, "627, 642", "Điện, khí nén, bảo trì máy"]],
};

/** Sổ quỹ xưởng: [ngày, số phiếu, diễn giải, người nộp/nhận, thu, chi, tồn, trạng thái] */
export const QUY_ROWS: Cell[][] = [
  ["25/10", "", "Tồn đầu ngày", "", "", "", 4128840, ""],
  ["25/10", "PT-0214", "Rút tiền gửi nhập quỹ xưởng", "Lê Văn Cường", 20000000, "", 24128840, "Đã ghi sổ"],
  ["26/10", "PC-0384", "Mua kim máy may DBx1 #11", "Tổ bảo trì Xưởng 1", "", 6400000, 17728840, "Đã ghi sổ"],
  ["27/10", "PC-0388", "Tạm ứng sửa máy cắt", "Nguyễn Văn An", "", 15000000, 2728840, "Đã ghi sổ"],
  ["28/10", "PC-0390", "Mua găng tay, khẩu trang xưởng cắt", "Phạm Thị Dung", "", 1850000, 878840, "Đã ghi sổ"],
  ["29/10", "PC-0391", "Mua dây curoa máy may", "Tổ bảo trì Xưởng 2", "", 4850000, -3971160, "Đã ghi sổ"],
  ["30/10", "PT-0219", "Hoàn tạm ứng sửa máy cắt", "Nguyễn Văn An", 4500000, "", "", "Nháp"],
];

export const BANK_ACCS: [string, string, string, string][] = [
  ["VCB · VND", "****1021", "5.126.400.000 đ", "Sao kê đến 05/11 · khớp 100%"],
  ["BIDV · VND", "****5530", "2.284.300.000 đ", "Chưa kết nối sao kê tự động"],
  ["VCB · USD", "****8826", "486.820,00 USD", "≈ 12.355.491.600 đ · tỷ giá 25.380"],
];
export const BANK_STMT: TableDef = {
  head: ["Ngày", "Nội dung sao kê", "#Số tiền (USD)", "#Quy đổi VND", "Chứng từ khớp", "!Trạng thái"],
  rows: [["30/10", "TT HD 0001288 NORDVIK OUTDOOR AB", "82.600", 2096388000, "BC-0412", "Đã khớp"], ["28/10", "CORAL BAY CLOTHING PAYMENT INV 1291", "24.600", 624348000, "Gợi ý: HĐ 0001291 (24.600 USD)", "Gợi ý AI"], ["27/10", "PHI CHUYEN TIEN DI NUOC NGOAI", "-25", -634500, "—", "Chưa khớp"], ["27/10", "PHI QUAN LY TAI KHOAN T10", "-10", -253800, "—", "Chưa khớp"], ["25/10", "BELLMONT APPAREL TT INV 1279", "49.200", 1248696000, "BC-0405", "Đã khớp"], ["22/10", "BAN USD CHO VCB", "-60.000", -1522800000, "BN-0181", "Đã khớp"]],
};

export const SALES: TableDef = {
  head: ["*Số HĐ", "Ngày", "Khách hàng", "Mã hàng", "#USD", "#Còn phải thu (VND)", "Hạn TT", "!Trạng thái"],
  rows: [["0001284", "16/08", "Bellmont Apparel (Mỹ)", "QUAN-KAKI-0932", "98.400", 2497392000, "15/10/2026", "Quá hạn 22 ngày"], ["0001291", "31/08", "Coral Bay Clothing (Úc)", "AO-THUN-2402", "24.600", 624348000, "30/10/2026", "Quá hạn 7 ngày"], ["0001296", "05/09", "Northline Wear (Canada)", "QUAN-SHORT-0715", "30.800", 781704000, "04/11/2026", "Quá hạn 2 ngày"], ["0001302", "11/09", "Nordvik Outdoor (Thụy Điển)", "AO-POLO-2611", "76.000", 1928880000, "10/11/2026", "Còn 4 ngày"], ["0001306", "20/09", "Kazeyama Sports (Nhật)", "VAY-XOE-1105", "61.000", 1548180000, "19/11/2026", "Còn 13 ngày"], ["0001310", "25/10", "Kazeyama Sports (Nhật)", "AO-POLO-2611", "96.900", 2459322000, "24/12/2026", "Trong hạn"], ["0001315", "28/10", "Hanbit Urban (Hàn Quốc)", "AO-KHOAC-1150", "84.500", 2144610000, "27/12/2026", "Trong hạn"], ["0001288", "02/09", "Nordvik Outdoor (Thụy Điển)", "SOMI-NU-1210", "82.600", 0, "01/11/2026", "Đã thu"]],
};
/** [nhóm tuổi nợ, tỷ đồng, tông] */
export const AGING: [string, number, Tone?][] = [["Trong hạn", 74.52, "ok"], ["Quá hạn 1–30 ngày", 3.9, "warn"], ["Quá hạn 31–60 ngày", 0], ["Quá hạn > 60 ngày", 0]];

export const PURCHASES: TableDef = {
  head: ["*Số HĐ", "Ngày", "Nhà cung cấp", "Nội dung", "#Tiền hàng", "#Thuế GTGT", "#Tổng", "Hạn TT", "!Trạng thái"],
  rows: [["0048821", "29/10", "NCC Phụ liệu Á Đông", "Nhãn dệt, nút nhựa", 138909091, 13890909, 152800000, "08/11/2026", "Còn 2 ngày"], ["0019344", "28/10", "NCC Vải Minh Phát", "Vải kaki 240gsm – 12.800 m", 400000000, 40000000, 440000000, "12/11/2026", "Còn 6 ngày"], ["0007712", "27/10", "NCC Chỉ Thành Công", "Chỉ polyester 40/2", 54259259, 4340741, 58600000, "20/11/2026", "MST tạm ngừng"], ["0123087", "26/10", "Điện lực khu công nghiệp", "Tiền điện tháng 10", 158727273, 15872727, 174600000, "15/11/2026", "Còn 9 ngày"], ["0006631", "24/10", "NCC Bao bì Sao Mai", "Thùng carton 5 lớp", 164800000, 16480000, 181280000, "23/11/2026", "Trong hạn"], ["0031208", "20/10", "NCC Dệt Hòa Bình", "Vải cotton pique 180gsm", 1032727273, 103272727, 1136000000, "27/10/2026", "Đã trả"]],
};

export const EINVOICES: TableDef = {
  head: ["Ký hiệu", "*Số", "Ngày", "Người mua", "Loại", "#Tổng tiền", "~Mã CQT", "!Trạng thái"],
  rows: [["1C26TMD", "0001318", "31/10", "Nordvik Outdoor (Thụy Điển)", "Xuất khẩu", 1479840000, "—", "Chờ ký số"], ["1C26TMD", "0001317", "31/10", "Northline Wear (Canada)", "Xuất khẩu", 994520000, "—", "Chờ ký số"], ["1C26TMD", "0001316", "30/10", "Công ty Tái chế Xanh", "Bán vải vụn (10%)", 21120000, "—", "Chờ ký số"], ["1C26TMD", "0001315", "28/10", "Hanbit Urban (Hàn Quốc)", "Xuất khẩu", 2144610000, "00A1B2…7F", "Đã gửi khách"], ["1C26TMD", "0001310", "25/10", "Kazeyama Sports (Nhật)", "Xuất khẩu", 2459322000, "00C4D9…21", "Đã gửi khách"], ["1C26TMD", "0001312", "26/10", "Coral Bay Clothing (Úc)", "Xuất khẩu", 1386000000, "00E7F0…5B", "CQT đã cấp mã"]],
};

export const STOCK: TableDef = {
  head: ["*Nhóm NPL", "TK", "SL tồn cuối", "#Đầu kỳ", "#Nhập", "#Xuất", "#Cuối kỳ"],
  rows: [["Vải chính", "1521", "540.000 m", 37400000000, 16200000000, 18180000000, 35420000000], ["Vải lót", "1521", "110.000 m", 2640000000, 820000000, 960000000, 2500000000], ["Chỉ may", "1522", "72.000 cuộn", 1260000000, 580000000, 640000000, 1200000000], ["Dây kéo", "1522", "560.000 cái", 1600000000, 720000000, 780000000, 1540000000], ["Nút, khóa", "1522", "3.400.000 cái", 960000000, 360000000, 400000000, 920000000], ["Nhãn, thẻ bài", "1522", "1.650.000 cái", 740000000, 440000000, 470000000, 710000000], ["Bao bì, thùng carton", "1522", "240.000 cái", 1020000000, 920000000, 950000000, 990000000]],
  foot: "Tổng cộng",
};

const LSX: [string, string, string, number, number, number, number, string][] = [
  ["LSX-2611-03", "AO-POLO-2611", "Nordvik Outdoor (Thụy Điển)", 16000, 768000000, 236800000, 134400000, "Đã tính"],
  ["LSX-0932-01", "QUAN-KAKI-0932", "Bellmont Apparel (Mỹ)", 11000, 748000000, 209000000, 112200000, "Đã tính"],
  ["LSX-1150-02", "AO-KHOAC-1150", "Hanbit Urban (Hàn Quốc)", 6000, 1182000000, 243000000, 109200000, "Đã tính"],
  ["LSX-1105-01", "VAY-XOE-1105", "Kazeyama Sports (Nhật)", 7000, 441000000, 140000000, 71400000, "Đã tính"],
  ["LSX-2402-04", "AO-THUN-2402", "Coral Bay Clothing (Úc)", 22000, 594000000, 211200000, 121000000, "Dở dang"],
  ["LSX-0715-02", "QUAN-SHORT-0715", "Northline Wear (Canada)", 9000, 324000000, 117000000, 56700000, "Đã tính"],
  ["LSX-1210-01", "SOMI-NU-1210", "Nordvik Outdoor (Thụy Điển)", 8000, 480000000, 176000000, 84000000, "Dở dang"],
];
export const COSTING: TableDef = {
  head: ["*Lệnh SX", "Mã hàng", "Khách hàng", "#SL hoàn thành", "#NVL (621)", "#Nhân công (622)", "#SX chung (627)", "#Tổng giá thành", "#Giá thành đv", "!Trạng thái"],
  rows: LSX.map((r) => {
    const t = r[4] + r[5] + r[6];
    return [r[0], r[1], r[2], r[3], r[4], r[5], r[6], t, t / r[3], r[7]];
  }),
  foot: "Cộng 7 / 68 lệnh",
};
export const ALLOC_627: [string, string][] = [["Giờ công chuẩn", "Điện, khí nén, khấu hao máy may"], ["Số bàn cắt sử dụng", "Khấu hao máy cắt, lương tổ cắt"], ["Sản lượng hoàn thành", "Bao bì, dò kim, kiểm hàng"]];

const ASSETS: [string, string, string, number, number, number, number][] = [
  ["TS-MM01", "Máy may 1 kim điện tử (lô 2023)", "Xưởng 1", 290, 4060000000, 96, 1395625000],
  ["TS-MM02", "Máy may 1 kim điện tử (lô 2024)", "Xưởng 2", 250, 3500000000, 96, 729166667],
  ["TS-MV03", "Máy vắt sổ 5 chỉ", "Xưởng 1–2", 110, 1980000000, 96, 1031250000],
  ["TS-MD04", "Máy may 2 kim", "Xưởng 1–2", 70, 1540000000, 96, 770000000],
  ["TS-MC05", "Máy cắt tự động", "Xưởng cắt", 1, 6300000000, 120, 1312500000],
  ["TS-MC06", "Máy cắt tay đứng 10 inch", "Xưởng cắt", 10, 450000000, 60, 270000000],
  ["TS-MU07", "Máy ủi hơi và nồi hơi", "Hoàn thiện", 28, 1260000000, 96, 472500000],
  ["TS-DK08", "Máy dò kim loại", "Hoàn thiện", 3, 570000000, 96, 213750000],
  ["TS-NX09", "Nhà xưởng 2 khu may", "Toàn nhà máy", 1, 42000000000, 300, 13440000000],
  ["TS-HT10", "Hệ thống điện, khí nén", "Toàn nhà máy", 1, 6200000000, 180, 2893333333],
];
export const FIXED_ASSETS: TableDef = {
  head: ["*Mã", "Tên tài sản", "Bộ phận", "#SL", "#Nguyên giá", "#Số tháng KH", "#KH tháng 10", "#Hao mòn lũy kế", "#Còn lại"],
  rows: ASSETS.map((r) => [r[0], r[1], r[2], r[3], r[4], r[5], r[4] / r[5], r[6], r[4] - r[6]]),
  foot: "Cộng 10 / 68",
};

export const PAYROLL: TableDef = {
  head: ["Diễn giải", "Nợ", "Có", "#Số tiền", "!Trạng thái"],
  rows: [["Lương công nhân trực tiếp sản xuất", "622", "334", 7008200000, "Chờ duyệt"], ["Lương quản lý phân xưởng, QA, kho", "6271", "334", 562400000, "Chờ duyệt"], ["Lương bộ phận bán hàng", "641", "334", 104600000, "Chờ duyệt"], ["Lương quản lý doanh nghiệp", "642", "334", 451200000, "Chờ duyệt"], ["Trích BHXH, BHYT, BHTN phần công ty", "622, 627, 641, 642", "3383, 3384, 3386", 1208300000, "Chờ duyệt"], ["Trích kinh phí công đoàn 2%", "622, 627, 642", "3382", 112400000, "Chờ duyệt"], ["Khấu trừ BH người lao động", "334", "3383, 3384, 3386", 590100000, "Chờ duyệt"], ["Khấu trừ thuế TNCN", "334", "3335", 64380000, "Chờ duyệt"], ["Chi trả lương qua ngân hàng", "334", "1121", 7471920000, "Kỳ 11/2026"]],
};
export const PAYROLL_CHECKS = ["Tổng quỹ lương khớp 334", "Số người 980 khớp Nhân sự", "Lương đóng BH khớp tờ khai D02", "TNCN khớp tờ khai 05/KK", "Phân bổ theo xưởng / chuyền (15 chuyền)"];

export const TAX_CAL: TableDef = {
  head: ["Tờ khai / khoản", "Kỳ", "Hạn nộp", "!Trạng thái", "#Số tiền"],
  rows: [["Tờ khai 01/GTGT", "Tháng 10/2026", "20/11/2026", "Sắp tới", 0], ["Tờ khai 05/KK-TNCN", "Tháng 10/2026", "20/11/2026", "Sắp tới", 64380000], ["Tạm nộp thuế TNDN", "Quý 4/2026", "30/01/2027", "Sắp tới", 1680000000], ["Lệ phí môn bài", "Năm 2027", "30/01/2027", "Sắp tới", 3000000], ["Quyết toán 05/QTT-TNCN", "Năm 2026", "31/03/2027", "Sắp tới", "—"], ["Quyết toán 03/TNDN", "Năm 2026", "31/03/2027", "Sắp tới", "—"], ["Hồ sơ hoàn thuế GTGT hàng xuất khẩu", "Quý 3/2026", "—", "Đang xử lý", 2340000000], ["Thuế tài nguyên", "Tháng 10/2026", "—", "Không phát sinh", 0], ["Tờ khai 01/GTGT", "Tháng 9/2026", "20/10/2026", "Đã nộp", 0]],
};
/** [nhãn, giá trị, dòng tổng] */
export const VAT_T10: [string, string, boolean?][] = [["Thuế đầu ra (bán nội địa 10%)", "114.200.000"], ["Đầu ra hàng xuất khẩu 0%", "0"], ["Đầu vào được khấu trừ", "942.600.000"], ["Chuyển kỳ sau", "828.400.000", true]];
export const CIT_Q4: [string, string, boolean?][] = [["Lợi nhuận tạm tính quý 4", "8.400.000.000"], ["Thuế suất", "20%"], ["Tạm nộp", "1.680.000.000", true]];

/* ---------- báo cáo tài chính: [mã số, chỉ tiêu, cấp thụt lề, kỳ này, kỳ so sánh] ---------- */
export type RepRow = [string, string, number, number | null, number | null];
export const B01: RepRow[] = [
  ["100", "A. TÀI SẢN NGẮN HẠN", 0, 161215241600, 142072741600], ["110", "I. Tiền và các khoản tương đương tiền", 1, 20178841600, 16262741600], ["111", "1. Tiền", 2, 20178841600, 16262741600], ["130", "III. Các khoản phải thu ngắn hạn", 1, 81000000000, 72240000000], ["131", "1. Phải thu ngắn hạn của khách hàng", 2, 78420000000, 69800000000], ["136", "2. Phải thu ngắn hạn khác", 2, 2580000000, 2440000000], ["140", "IV. Hàng tồn kho", 1, 58640000000, 52300000000], ["150", "V. Tài sản ngắn hạn khác", 1, 1396400000, 1270000000], ["151", "1. Chi phí trả trước ngắn hạn", 2, 568000000, 480000000], ["152", "2. Thuế GTGT được khấu trừ", 2, 828400000, 790000000],
  ["200", "B. TÀI SẢN DÀI HẠN", 0, 52610000000, 50410000000], ["221", "1. Tài sản cố định hữu hình", 1, 48200000000, 47300000000], ["222", "– Nguyên giá", 2, 78600000000, 73200000000], ["223", "– Giá trị hao mòn lũy kế", 2, -30400000000, -25900000000], ["240", "IV. Tài sản dở dang dài hạn", 1, 2480000000, 960000000], ["261", "Chi phí trả trước dài hạn", 1, 1930000000, 2150000000], ["270", "TỔNG CỘNG TÀI SẢN", 0, 213825241600, 192482741600],
  ["300", "C. NỢ PHẢI TRẢ", 0, 87344100000, 83920000000], ["310", "I. Nợ ngắn hạn", 1, 70544100000, 63920000000], ["311", "1. Phải trả người bán ngắn hạn", 2, 25936200000, 23480000000], ["313", "2. Thuế và các khoản phải nộp Nhà nước", 2, 625180000, 1540000000], ["314", "3. Phải trả người lao động", 2, 7471920000, 7120000000], ["319", "4. Phải trả ngắn hạn khác (BHXH, KPCĐ)", 2, 1910800000, 1780000000], ["320", "5. Vay ngắn hạn", 2, 34600000000, 30000000000], ["330", "II. Nợ dài hạn", 1, 16800000000, 20000000000], ["338", "1. Vay dài hạn", 2, 16800000000, 20000000000],
  ["400", "D. VỐN CHỦ SỞ HỮU", 0, 126481141600, 108562741600], ["411", "1. Vốn góp của chủ sở hữu", 1, 90000000000, 90000000000], ["421", "2. Lợi nhuận sau thuế chưa phân phối", 1, 36481141600, 18562741600], ["440", "TỔNG CỘNG NGUỒN VỐN", 0, 213825241600, 192482741600],
];
export const B02: RepRow[] = [
  ["01", "1. Doanh thu bán hàng và cung cấp dịch vụ", 0, 41826400000, 412480000000], ["02", "2. Các khoản giảm trừ doanh thu", 1, 76400000, 752000000], ["10", "3. Doanh thu thuần", 0, 41750000000, 411728000000], ["11", "4. Giá vốn hàng bán", 1, 36310000000, 358520000000], ["20", "5. Lợi nhuận gộp", 0, 5440000000, 53208000000], ["21", "6. Doanh thu hoạt động tài chính", 1, 506000000, 4020000000], ["22", "7. Chi phí tài chính", 1, 334000000, 3436000000], ["23", "– Trong đó: chi phí lãi vay", 2, 262000000, 2644000000], ["25", "8. Chi phí bán hàng", 1, 1218000000, 11990000000], ["26", "9. Chi phí quản lý doanh nghiệp", 1, 1598000000, 19420000000], ["30", "10. Lợi nhuận thuần từ hoạt động kinh doanh", 0, 2796000000, 22382000000], ["31", "11. Thu nhập khác", 1, 20000000, 278000000], ["32", "12. Chi phí khác", 1, 12000000, 262000000], ["40", "13. Lợi nhuận khác", 0, 8000000, 16000000], ["50", "14. Tổng lợi nhuận kế toán trước thuế", 0, 2804000000, 22398000000], ["51", "15. Chi phí thuế TNDN hiện hành", 1, 560800000, 4479600000], ["60", "16. Lợi nhuận sau thuế TNDN", 0, 2243200000, 17918400000],
];
export const B03: RepRow[] = [
  ["", "I. Lưu chuyển tiền từ hoạt động kinh doanh", 0, null, null], ["01", "1. Tiền thu từ bán hàng, cung cấp dịch vụ", 1, 39640000000, 401960000000], ["02", "2. Tiền chi trả cho người cung cấp hàng hóa", 1, -21860000000, -218400000000], ["03", "3. Tiền chi trả cho người lao động", 1, -7420000000, -78600000000], ["04", "4. Tiền lãi vay đã trả", 1, -262000000, -2644000000], ["05", "5. Thuế TNDN đã nộp", 1, 0, -3920000000], ["07", "6. Tiền chi khác cho hoạt động kinh doanh", 1, -7023600000, -90479900000], ["20", "Lưu chuyển tiền thuần từ hoạt động kinh doanh", 0, 3074400000, 7916100000],
  ["", "II. Lưu chuyển tiền từ hoạt động đầu tư", 0, null, null], ["21", "1. Tiền chi mua sắm TSCĐ", 1, -780000000, -5400000000], ["30", "Lưu chuyển tiền thuần từ hoạt động đầu tư", 0, -780000000, -5400000000], ["", "III. Lưu chuyển tiền từ hoạt động tài chính", 0, null, null], ["33", "1. Tiền thu từ đi vay", 1, 6000000000, 58000000000], ["34", "2. Tiền trả nợ gốc vay", 1, -6400000000, -56600000000], ["40", "Lưu chuyển tiền thuần từ hoạt động tài chính", 0, -400000000, 1400000000],
  ["50", "Lưu chuyển tiền thuần trong kỳ", 0, 1894400000, 3916100000], ["60", "Tiền và tương đương tiền đầu kỳ", 1, 18284441600, 16262741600], ["70", "Tiền và tương đương tiền cuối kỳ", 0, 20178841600, 20178841600],
];
export const DEBTS: TableDef = {
  head: ["Đối tượng", "!Vai trò", "#Phải thu", "#Phải trả"],
  rows: [...KH.map((k) => [k[1], "Khách hàng", k[2], 0]), ...NCC.map((n) => [n[1], "Nhà cung cấp", 0, n[3]])],
  foot: "Cộng (12 đối tượng lớn nhất)",
};

/* ---------- khóa sổ ---------- */
/** [bút toán, Nợ / Có, số tiền, trạng thái] */
export const CLOSING_ENTRIES: [string, string, Cell, string][] = [
  ["Trích khấu hao TSCĐ", "627, 642 / 214", 452600000, "Đã chạy"],
  ["Phân bổ CCDC, chi phí trả trước", "627, 642 / 242", 248600000, "Đã chạy"],
  ["Đánh giá chênh lệch tỷ giá cuối kỳ", "1122, 131 / 4131", "—", "Chưa chạy"],
  ["Kết chuyển giá thành 154 → 155", "155 / 154", 34300000000, "Chưa chạy"],
  ["Kết chuyển doanh thu, chi phí → 911", "911", "—", "Chưa chạy"],
  ["Tạm tính thuế TNDN", "8211 / 3334", 560800000, "Chưa chạy"],
];
export const PERIOD_LIST: [string, string][] = [
  ["Tháng 12/2026", "Chưa mở"], ["Tháng 11/2026", "Đang mở"], ["Tháng 10/2026", "Đang mở"], ["Tháng 9/2026", "Đã khóa"], ["Tháng 8/2026", "Đã khóa"], ["Tháng 7/2026", "Đã khóa"],
  ["Tháng 6/2026", "Đã khóa"], ["Tháng 5/2026", "Đã khóa"], ["Tháng 4/2026", "Đã khóa"], ["Tháng 3/2026", "Đã khóa"], ["Tháng 2/2026", "Đã khóa"], ["Tháng 1/2026", "Đã khóa"],
];
/** [kỳ, mở lại lúc · người, lý do · khóa lại] */
export const REOPENS: [string, string, string][] = [
  ["Tháng 8/2026", "mở lại 14/09/2026 · Trần Thị Hoa", "Điều chỉnh hóa đơn mua vào sai thuế suất · khóa lại 15/09/2026"],
  ["Tháng 3/2026", "mở lại 22/04/2026 · Lê Minh Quân", "Bổ sung chi phí điện tháng 3 · khóa lại 22/04/2026"],
];

/* ---------- màn hình đơn giản: mô tả, nút chính, bảng ---------- */
export const SIMPLE: Record<string, { d: string; a: string } & TableDef> = {
  kuv: { d: "Hợp đồng vay, dư nợ gốc và lịch trả lãi", a: "＋ Thêm khế ước", head: ["*Số khế ước", "Ngân hàng", "Loại", "#Dư nợ", "Lãi suất", "Đáo hạn", "!Trạng thái"], rows: [["HM-2026-014", "VCB", "Vay ngắn hạn VND", 16800000000, "4,8%/năm", "15/01/2027", "Đang thực hiện"], ["HM-2026-021", "BIDV", "Vay ngắn hạn VND", 11400000000, "6,2%/năm", "20/12/2026", "Đang thực hiện"], ["USD-2026-03", "VCB", "Vay ngắn hạn USD (252.167 USD)", 6400000000, "5,1%/năm", "28/02/2027", "Đang thực hiện"], ["TDH-2023-02", "VCB", "Vay dài hạn mua máy may", 16800000000, "7,1%/năm", "30/06/2029", "Đang thực hiện"]] },
  dttc: { d: "Tiền gửi có kỳ hạn và các khoản đầu tư", a: "＋ Thêm khoản đầu tư", head: ["*Số hợp đồng", "Nơi gửi", "Kỳ hạn", "#Số tiền", "Lãi suất", "Ngày tất toán", "!Trạng thái"], rows: [["TG-2026-09", "VCB", "1 tháng", 8000000000, "3,2%/năm", "30/09/2026", "Đã tất toán"], ["TG-2026-06", "BIDV", "3 tháng", 6000000000, "3,9%/năm", "30/06/2026", "Đã tất toán"]] },
  hdg: { d: "Hợp đồng bán với khách hàng và hợp đồng mua NPL", a: "＋ Thêm hợp đồng", head: ["*Số hợp đồng", "Đối tượng", "Hình thức", "#Giá trị (USD)", "Đã giao", "Hiệu lực", "!Trạng thái"], rows: [["HĐ-NVK-2026-07", "Nordvik Outdoor (Thụy Điển)", "FOB", "740.000", "62%", "31/03/2027", "Đang thực hiện"], ["HĐ-BLM-2026-05", "Bellmont Apparel (Mỹ)", "FOB", "910.000", "48%", "30/04/2027", "Đang thực hiện"], ["HĐ-KZY-2026-04", "Kazeyama Sports (Nhật)", "Gia công (CMT)", "345.000", "71%", "31/01/2027", "Đang thực hiện"], ["HĐ-HBU-2026-02", "Hanbit Urban (Hàn Quốc)", "FOB", "450.000", "35%", "31/05/2027", "Đang thực hiện"], ["HĐM-MP-2026", "NCC Vải Minh Phát", "Mua NPL", "—", "—", "31/12/2026", "Đang thực hiện"]] },
  ccdc: { d: "Công cụ dụng cụ và chi phí trả trước, phân bổ hàng tháng", a: "＋ Ghi tăng CCDC", head: ["*Mã", "Tên", "Bộ phận", "#Giá trị", "#Số kỳ PB", "#Đã phân bổ", "#Phân bổ T10"], rows: [["CC-KE01", "Kéo cắt chỉ, kéo bấm (1.900 cái)", "Xưởng 1–2", 114000000, 12, 76000000, 9500000], ["CC-BU02", "Bàn ủi hơi cầm tay", "Hoàn thiện", 168000000, 24, 84000000, 7000000], ["CC-GH03", "Ghế công nhân có tựa", "Xưởng 1–2", 288000000, 24, 120000000, 12000000], ["CP-BH04", "Bảo hiểm cháy nổ nhà xưởng 2026", "Toàn nhà máy", 780000000, 12, 650000000, 65000000], ["CP-PM05", "Phần mềm quản trị sản xuất", "Văn phòng", 960000000, 36, 320000000, 26666667]] },
  tssh: { d: "Tài sản sinh học theo chuẩn mực mới", a: "＋ Thêm tài sản", head: ["Mã", "Tên", "Loại", "#Giá trị", "Ghi chú"], rows: [["—", "Chưa phát sinh tài sản sinh học", "—", 0, "Không áp dụng cho hoạt động may mặc"]] },
  tk01: { d: "Tờ khai thuế GTGT mẫu 01/GTGT, phương pháp khấu trừ", a: "Xuất XML", head: ["*Chỉ tiêu", "Nội dung", "#Giá trị HHDV", "#Thuế GTGT"], rows: [["[22]", "Thuế GTGT còn được khấu trừ kỳ trước chuyển sang", "", 0], ["[23]/[24]", "Hàng hóa, dịch vụ mua vào trong kỳ", 9426000000, 942600000], ["[25]", "Thuế GTGT của HHDV mua vào được khấu trừ", "", 942600000], ["[29]", "HHDV bán ra chịu thuế suất 0% (xuất khẩu)", 40684400000, ""], ["[32]/[33]", "HHDV bán ra chịu thuế suất 10%", 1142000000, 114200000], ["[40]", "Thuế GTGT phải nộp", "", 0], ["[43]", "Thuế GTGT còn được khấu trừ chuyển kỳ sau", "", 828400000]] },
  hn: { d: "Hợp nhất công ty mẹ và công ty con", a: "Lập báo cáo hợp nhất", head: ["*Đơn vị", "Tỷ lệ sở hữu", "#Tổng tài sản", "#Doanh thu T10", "!Trạng thái"], rows: [["Công ty TNHH May Demo (mẹ)", "—", 213825241600, 41826400000, "Đã khóa"], ["Công ty TNHH Bao bì Demo (con)", "100%", 15360000000, 1940000000, "Đang mở"], ["Loại trừ giao dịch nội bộ", "—", -1283500000, -856000000, "Chưa chạy"]] },
  cdps: { d: "Bảng cân đối số phát sinh các tài khoản", a: "Xuất Excel", head: ["*Số TK", "Tên tài khoản", "#Dư Nợ đầu kỳ", "#Phát sinh Nợ", "#Phát sinh Có", "#Dư Nợ cuối kỳ"], rows: [["111", "Tiền mặt", 386400000, 214600000, 188350000, 412650000], ["112", "Tiền gửi ngân hàng", 17898041600, 40120000000, 38251850000, 19766191600], ["131", "Phải thu khách hàng", 76233600000, 41940600000, 39754200000, 78420000000], ["152", "Nguyên liệu, vật liệu", 45620000000, 20040000000, 22380000000, 43280000000], ["154", "Chi phí SXKD dở dang", 7120000000, 34640000000, 34300000000, 7460000000], ["211", "TSCĐ hữu hình", 77820000000, 780000000, 0, 78600000000]] },
  ns: { d: "So sánh thực hiện với ngân sách tháng", a: "＋ Lập ngân sách", head: ["*Khoản mục", "#Ngân sách T10", "#Thực hiện", "Tỷ lệ", "!Đánh giá"], rows: [["Doanh thu", 40000000000, 41826400000, "105%", "Đạt"], ["Chi phí NVL trực tiếp", 22800000000, 22380000000, "98%", "Đạt"], ["Chi phí nhân công", 8000000000, 8240000000, "103%", "Vượt"], ["Điện, nước, khí nén", 540000000, 567600000, "105%", "Vượt"], ["Chi phí bán hàng", 1250000000, 1218000000, "97%", "Đạt"]] },
  bcc: { d: "Chi phí sản xuất theo chiều Xưởng / bộ phận", a: "Xuất Excel", head: ["*Xưởng / bộ phận", "Chuyền", "#Sản lượng", "#Nhân công (622)", "#SX chung (627)"], rows: [["Xưởng 1", "01–08", 226400, 3680000000, 1890000000], ["Xưởng 2", "09–15", 192200, 3180000000, 1640000000], ["Xưởng cắt", "8 bàn cắt", "", 410000000, 260000000], ["Hoàn thiện & đóng gói", "—", "", 970000000, 230000000]] },
  sct: { d: "Sổ chi tiết tài khoản 131 – Phải thu khách hàng", a: "Xuất Excel", head: ["Ngày", "*Chứng từ", "Diễn giải", "TK đối ứng", "#Nợ", "#Có"], rows: [["25/10", "HĐ 0001310", "Xuất khẩu AO-POLO-2611 – Kazeyama Sports (Nhật)", "5111", 2459322000, ""], ["25/10", "BC-0405", "Bellmont Apparel (Mỹ) thanh toán", "1122", "", 1248696000], ["28/10", "HĐ 0001315", "Xuất khẩu AO-KHOAC-1150 – Hanbit Urban (Hàn Quốc)", "5111", 2144610000, ""], ["30/10", "BC-0412", "Nordvik Outdoor (Thụy Điển) thanh toán", "1122", "", 2096388000]] },
  skt: { d: "Sổ nhật ký chung, sổ cái và sổ quỹ", a: "In sổ", head: ["Ngày", "*Chứng từ", "Diễn giải", "TK Nợ", "TK Có", "#Số tiền"], rows: CT.filter((r) => r[7] === "Đã ghi sổ").map((r) => [`${r[1]}/2026`, r[0], r[4], r[5].split(" / ")[0], r[5].split(" / ")[1], r[6]]) },
  cd: { d: "Thông tin doanh nghiệp và chính sách kế toán", a: "Lưu cài đặt", head: ["*Mục", "Giá trị"], rows: [["Chế độ kế toán", "Thông tư 99/2025/TT-BTC"], ["Đồng tiền hạch toán", "VND"], ["Phương pháp tính giá xuất kho", "Bình quân gia quyền cuối kỳ"], ["Khai thuế GTGT", "Theo tháng · phương pháp khấu trừ"], ["Tỷ giá ghi sổ", "Tỷ giá mua chuyển khoản VCB"], ["Kết nối", "Tính lương · Kho nguyên liệu · Kế hoạch sản xuất"]] },
  tg: { d: "Tỷ giá ngoại tệ dùng ghi sổ và đánh giá cuối kỳ", a: "＋ Cập nhật tỷ giá", head: ["Ngày", "*Ngoại tệ", "#Mua chuyển khoản", "#Bán", "Dùng cho"], rows: [["31/10/2026", "USD", 25380, 25740, "Đánh giá cuối kỳ T10"], ["30/10/2026", "USD", 25380, 25740, "Ghi sổ"], ["28/10/2026", "USD", 25379, 25739, "Ghi sổ"], ["31/10/2026", "EUR", 27412, 28860, "—"]] },
  tl: { d: "Các bước thiết lập ban đầu", a: "Tiếp tục thiết lập", head: ["Bước", "*Nội dung", "!Trạng thái"], rows: [["1", "Thông tin công ty, MST, chữ ký số", "Hoàn tất"], ["2", "Hệ thống tài khoản (194 TK)", "Hoàn tất"], ["3", "Số dư đầu kỳ – còn thiếu TK 242", "Chưa xong"], ["4", "Kết nối ngân hàng VCB", "Hoàn tất"], ["5", "Kết nối ngân hàng BIDV", "Chưa xong"], ["6", "Hóa đơn điện tử 1C26TMD", "Hoàn tất"], ["7", "Kết nối app Tính lương, Kho nguyên liệu", "Hoàn tất"]] },
};

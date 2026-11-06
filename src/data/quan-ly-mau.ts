/** Dữ liệu giả cho app Quản lý mẫu & tech pack — port nguyên từ apps/quan-ly-mau.html. */

export type Kind = "khoac" | "polo" | "thun" | "somi" | "kaki" | "short" | "vay";
export type Status = "ok" | "run" | "wait" | "rev";

/** [mã, tên, mô tả, số techpack, số tài liệu, cập nhật] */
export type Customer = [string, string, string, number, number, string];
export const CUS: Customer[] = [
  ["A", "Nordvik Outdoor (Thụy Điển)", "Khách châu Âu, thời trang ngoài trời. Khách lớn nhất: áo khoác, gile chần bông.", 38, 14, "05/11/2026"],
  ["B", "Bellmont Apparel (Mỹ)", "Chuỗi bán lẻ Mỹ. Quần kaki, polo, áo thun basic số lượng lớn.", 31, 11, "03/11/2026"],
  ["C", "Kazeyama Sports (Nhật)", "Nhãn hàng Nhật, yêu cầu đường may và đóng gói rất chặt.", 24, 9, "30/10/2026"],
  ["D", "Coral Bay Clothing (Úc)", "Đồ nữ: váy, sơ mi. Đơn 8.000–15.000 sp/mã.", 18, 7, "28/10/2026"],
  ["E", "Hanbit Urban (Hàn Quốc)", "Thời trang trẻ, hoodie, jogger; đổi mẫu nhanh.", 16, 6, "21/10/2026"],
  ["F", "Northline Wear (Canada)", "Đồ trẻ em và đồ mặc nhà, yêu cầu an toàn hóa chất cao.", 13, 5, "09/10/2026"],
];

const TYPES: [string, string, number][] = [
  ["AO-KHOAC", "Áo khoác gió có mũ", 0], ["QUAN-KAKI", "Quần kaki nam", 1], ["AO-POLO", "Áo polo nam", 1], ["VAY-XOE", "Váy xòe nữ", 3],
  ["AO-THUN", "Áo thun cổ tròn", 1], ["QUAN-SHORT", "Quần short", 5], ["SOMI-NU", "Sơ mi nữ", 3], ["AO-HOODIE", "Áo hoodie nỉ", 4],
  ["QUAN-JOGGER", "Quần jogger", 4], ["AO-GILE", "Áo gile chần bông", 0], ["SOMI-NAM", "Sơ mi nam", 2],
];
const FIXED = ["VAY-XOE-1105", "AO-POLO-2611", "QUAN-KAKI-0932", "SOMI-NU-1210", "QUAN-SHORT-0715", "AO-THUN-2402", "AO-HOODIE-2207", "QUAN-JOGGER-1408", "AO-GILE-1163", "AO-POLO-2615", "AO-KHOAC-1150"];
export const ST: Record<Status, string> = { ok: "Hoàn tất", run: "Đang xử lý", wait: "Đang chờ", rev: "Cần xem" };
const REV = [13, 21, 30, 44, 52, 67, 78, 90, 103, 117, 131];
const KIND: Record<string, Kind> = {
  "AO-KHOAC": "khoac", "AO-HOODIE": "khoac", "AO-GILE": "khoac", "QUAN-KAKI": "kaki", "QUAN-JOGGER": "kaki", "AO-POLO": "polo",
  "AO-THUN": "thun", "VAY-XOE": "vay", "QUAN-SHORT": "short", "SOMI-NU": "somi", "SOMI-NAM": "somi",
};

export type Techpack = {
  code: string; name: string; cu: number; st: Status; files: number;
  rows: number | null; img: number | null; cw: number | null; time: string | null; date: string; k: Kind;
};

// Giữ đúng bộ sinh của bản HTML (Park–Miller) để số liệu khớp bản duyệt.
let seed = 7;
const rnd = (a: number, b: number) => a + Math.floor(((seed = (seed * 16807) % 2147483647) / 2147483647) * (b - a + 1));
const dd = (n: number) => {
  const d = new Date(2026, 10, 6);
  d.setDate(d.getDate() - n);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};
export const TP: Techpack[] = Array.from({ length: 140 }, (_, i) => {
  const t = i < FIXED.length
    ? TYPES.find((x) => FIXED[i].startsWith(x[0] + "-") && FIXED[i].split("-").length === x[0].split("-").length + 1)!
    : TYPES[rnd(0, TYPES.length - 1)];
  const code = i < FIXED.length ? FIXED[i] : t[0] + "-" + String(1000 + ((i * 137) % 1000)).padStart(4, "0");
  const st: Status = i < 9 ? "wait" : i === 9 ? "run" : REV.includes(i) ? "rev" : "ok";
  const done = st === "ok" || st === "rev";
  const cu = rnd(0, 9) < 7 ? t[2] : rnd(0, 5), sec = rnd(80, 290);
  return {
    code, name: t[1], cu, st, files: rnd(1, 3), rows: done ? rnd(38, 92) : null, img: done ? rnd(8, 42) : null, cw: done ? rnd(2, 6) : null,
    time: done ? `${Math.floor(sec / 60)} phút ${sec % 60} giây` : null, date: dd(Math.floor(i * 0.62)), k: KIND[code.replace(/-\d+$/, "")],
  };
});
Object.assign(TP[10], { rows: 25, img: 18, cw: 4, cu: 0, time: "2 phút 37 giây", files: 2 });
export const DEFAULT_TP = 10;
export const countSt = (s: Status) => TP.filter((t) => t.st === s).length;

/** [tên phối màu, màu hex] */
export const CWS: Record<Kind, [string, string][]> = {
  khoac: [["001 Đen", "#111"], ["410 Xanh navy", "#1E2A4A"], ["131 Trắng ngà", "#F4F0E6"], ["358 Xanh rêu", "#556B2F"]],
  polo: [["100 Trắng", "#F7F7F5"], ["410 Navy", "#1E2A4A"], ["620 Đỏ đô", "#7A1F2B"], ["235 Xanh ngọc", "#2E8B83"]],
  thun: [["100 Trắng", "#F7F7F5"], ["001 Đen", "#111"], ["520 Xám melange", "#A9A9AE"], ["740 Xanh biển", "#3A6EA5"]],
  somi: [["100 Trắng", "#F7F7F5"], ["416 Xanh nhạt", "#BCD4EA"], ["803 Hồng nhạt", "#F2CFCF"], ["255 Be cát", "#D8C7A6"]],
  kaki: [["250 Be khaki", "#C3B091"], ["410 Navy", "#1E2A4A"], ["090 Ghi than", "#4A4A4A"], ["330 Ô liu", "#6B6B3A"]],
  short: [["330 Ô liu", "#6B6B3A"], ["410 Navy", "#1E2A4A"], ["560 Cam san hô", "#F08A6C"], ["250 Be", "#C3B091"]],
  vay: [["801 Hồng phấn", "#E9B7C2"], ["132 Kem", "#EFE6D2"], ["415 Xanh pastel", "#A8C5E2"], ["001 Đen", "#111"]],
};

/** [mục, loại, mô tả, icon, KT, NCC, mã, SL, [giá trị theo phối màu], vị trí dùng, trang] */
export type BomRow = [string, string, string, string, string, string, string, string, string[], string, number];
const S4 = (s: string) => [s, s, s, s], NV = "Phụ liệu Á Đông", SV = "In Nhãn Sao Việt", TT = "Bao bì Tân Tiến";
const LBL = (pg: number, w1: string, w2: string): BomRow[] => [
  ["Vật tư", "Nhãn", "Nhãn chính dệt damask, gập 2 đầu", "nhan", "45 × 15 mm", SV, "N-0145", "1,000 PC", S4("Theo nhãn hàng"), w1, pg],
  ["Vật tư", "Nhãn", "Nhãn size dệt", "size", "15 × 15 mm", SV, "N-0102", "1,000 PC", S4("Theo nhãn chính"), "Dưới nhãn chính", pg],
  ["Vật tư", "Nhãn", "Nhãn HDSD in satin, thành phần + ký hiệu giặt", "care", "30 × 70 mm", SV, "N-0215", "1,000 PC", S4("Trắng / mực đen"), w2, pg],
  ["Vật tư", "Nhãn", "Nhãn PO + mã vạch", "po", "25 × 40 mm", SV, "N-0230", "1,000 PC", S4("Trắng"), "Sau nhãn HDSD", pg],
];
const TH = (k: Kind, pg: number, m1: string, m2: string, kim: string): BomRow[] => [
  ["Chỉ may", "Chỉ may/Kim", "Chỉ may polyester 40/2 (Tex 27)", "chi", "5.000 m/cuộn", "Chỉ Thành Công", "C-0507", m1 + " M", CWS[k].map((c) => "C-" + c[0]), "May chính", pg],
  ["Chỉ may", "Chỉ may/Kim", "Chỉ vắt sổ polyester 60/3", "chi", "8.000 m/cuộn", "Chỉ Thành Công", "C-0603", m2 + " M", CWS[k].map((c) => "C-" + c[0]), "Vắt sổ, trần đè", pg],
  ["Chỉ may", "Chỉ may/Kim", kim, "kim", "—", NV, "K-" + kim.match(/#(\d+)/)![1] + "00", "—", S4("—"), "Máy 1 kim", pg],
];
const HANG = (pg: number): BomRow => ["Đóng gói", "Móc treo", "Móc treo nhựa có kẹp, in size", "hanger", "Rộng 38 cm", TT, "MT-0380", "1,000 PC", S4("Đen"), "Treo từng chiếc", pg];
const PACK = (pg: number, per: number, bag: string, ex: BomRow[] = []): BomRow[] => [
  ["Đóng gói", "Thẻ bài", "Thẻ bài giấy kraft 350 gsm + dây treo", "tag", "55 × 90 mm", SV, "TB-0590", "1,000 PC", S4("Kraft / mực đen"), "Treo ở nhãn chính", pg], ...ex,
  ["Đóng gói", "Túi PE", "Túi PE 0,05 mm tự dính, in cảnh báo ngạt thở", "pe", bag, TT, "PE-" + bag.replace(/\D/g, "").slice(0, 4), "1,000 PC", S4("Trong"), "Từng chiếc", pg],
  ["Đóng gói", "Thùng carton", "Thùng carton 5 lớp, in mark theo PO", "carton", "60 × 40 × 30 cm", TT, "CT-6040", (1 / per).toFixed(3).replace(".", ",") + " PC", S4("Nâu kraft"), per + " sp/thùng, size lẻ", pg],
];
export const BOMS: Record<Kind, BomRow[]> = {
  khoac: [
    ["Vật tư", "Vải", "Vải chính taslan 228T, 100% nylon, tráng PU chống thấm 5.000 mm", "vai", "Khổ 145 cm", "Dệt Hòa Bình", "V-2281", "1,650 M", ["V-2281-BK", "V-2281-NV", "V-2281-OW", "V-2281-OL"], "Thân, tay, mũ", 4],
    ["Vật tư", "Lót", "Lót lưới polyester 100%, 75 g/m²", "lot", "Khổ 150 cm", "Vải Minh Phát", "L-0031", "0,850 M", ["Đen", "Navy", "Trắng", "Đen"], "Lót thân trên", 5],
    ["Vật tư", "Lót", "Lót taffeta 190T polyester", "lot", "Khổ 150 cm", "Vải Minh Phát", "L-0190", "0,720 M", ["Đen", "Navy", "Ghi nhạt", "Rêu"], "Lót tay, lót túi", 5],
    ["Vật tư", "Gòn", "Gòn tấm polyester 80 g/m², chần ô 6 cm", "gon", "Khổ 150 cm", "Gòn Việt Thắng", "G-0080", "0,600 M", S4("Trắng"), "Thân, tay", 5],
    ["Vật tư", "Dây kéo", "Dây kéo nhựa #5, 2 chiều, đầu khóa logo", "zip", "Dài 66 cm", NV, "DK-5066", "1,000 PC", ["580 Đen", "560 Navy", "501 Trắng", "566 Rêu"], "Nẹp trước", 6],
    ["Vật tư", "Dây kéo", "Dây kéo nylon răng ẩn chống nước #3", "zip", "Dài 18 cm", NV, "DK-3018", "2,000 PC", ["580 Đen", "560 Navy", "580 Đen", "566 Rêu"], "Túi sườn", 6],
    ["Vật tư", "Phụ liệu dệt kim", "Bo tay dệt kim 1×1, 95% PE 5% spandex", "rib", "8 × 22 cm", "Dệt kim Phú Thịnh", "BO-0122", "2,000 PC", ["Đen", "Navy", "Trắng ngà", "Rêu"], "Cửa tay", 6],
    ["Vật tư", "Dây luồn", "Dây luồn tròn 4 mm + chặn dây nhựa", "cord", "Dài 120 cm", NV, "DL-0412", "1,000 PC", ["Đen", "Navy", "Ghi nhạt", "Đen"], "Mũ, gấu", 7],
    ["Vật tư", "Cúc", "Cúc dập kim loại 4 chi tiết, không niken", "snap", "Ø 15 mm", NV, "CD-1504", "4,000 PC", ["Gunmetal", "Gunmetal", "Bạc mờ", "Gunmetal"], "Nắp túi, cổ", 7],
    ["Vật tư", "Nhãn", "Nhãn chính dệt satin, gập 2 đầu", "nhan", "50 × 20 mm", SV, "N-0088", "1,000 PC", ["Nền đen", "Nền đen", "Nền trắng", "Nền đen"], "Giữa cổ sau", 8],
    ["Vật tư", "Nhãn", "Nhãn size dệt XS – XXL", "size", "15 × 15 mm", SV, "N-0102", "1,000 PC", S4("Theo nhãn chính"), "Dưới nhãn chính", 8],
    ["Vật tư", "Nhãn", "Nhãn HDSD in satin 5 ngôn ngữ, thành phần + ký hiệu giặt", "care", "30 × 80 mm", SV, "N-0215", "1,000 PC", S4("Trắng / mực đen"), "Sườn trái, mặt trong", 8],
    ["Vật tư", "Nhãn", "Nhãn PO + mã vạch", "po", "25 × 40 mm", SV, "N-0230", "1,000 PC", S4("Trắng"), "Sau nhãn HDSD", 8],
    ["In", "Ép nhiệt", "Logo ép nhiệt phản quang", "ep", "50 × 50 mm", "In Ép Nhiệt Đại Phong", "IN-0550", "1,000 PC", ["Bạc PQ", "Bạc PQ", "Xám PQ", "Bạc PQ"], "Ngực trái", 9],
    ["Chỉ may", "Chỉ may/Kim", "Chỉ may polyester 40/2 (Tex 27)", "chi", "5.000 m/cuộn", "Chỉ Thành Công", "C-0507", "180,000 M", ["C-001 Đen", "C-410 Navy", "C-131 Trắng", "C-358 Rêu"], "May chính", 10],
    ["Chỉ may", "Chỉ may/Kim", "Chỉ vắt sổ polyester 60/3", "chi", "8.000 m/cuộn", "Chỉ Thành Công", "C-0603", "120,000 M", ["C-001 Đen", "C-410 Navy", "C-131 Trắng", "C-358 Rêu"], "Vắt sổ đường may trong", 10],
    ["Chỉ may", "Chỉ may/Kim", "Chỉ diễu polyester 20/3 bóng", "chi", "3.000 m/cuộn", "Chỉ Thành Công", "C-2003", "35,000 M", ["C-001 Đen", "C-410 Navy", "C-001 Đen", "C-131 Trắng"], "Diễu nẹp, nắp túi", 10],
    ["Chỉ may", "Chỉ may/Kim", "Kim DB×1 #14 mũi tròn", "kim", "—", NV, "K-1400", "—", S4("—"), "Máy 1 kim", 10],
    ["Chỉ may", "Băng keo", "Băng ép seam chống thấm 3 lớp", "tape", "Rộng 20 mm", NV, "BK-0320", "4,200 M", S4("Trong suốt"), "Vai, sườn, mũ", 10],
    ["Rập", "Chi tiết rập", "Thân trước × 2, thân sau × 1 — vải chính", "rap", "—", "—", "R-01", "3 PC", S4("—"), "Sơ đồ cắt, bàn 1", 13],
    ["Rập", "Chi tiết rập", "Tay × 2, mũ × 3 mảnh — vải chính", "rap", "—", "—", "R-02", "5 PC", S4("—"), "Sơ đồ cắt, bàn 1", 13],
    ["Đóng gói", "Thẻ bài", "Thẻ bài giấy kraft 350 gsm + dây treo", "tag", "55 × 90 mm", SV, "TB-0590", "1,000 PC", S4("Kraft / mực đen"), "Treo ở đầu khóa", 11],
    ["Đóng gói", "Túi PE", "Túi PE 0,05 mm tự dính, in cảnh báo ngạt thở", "pe", "40 × 55 cm", TT, "PE-4055", "1,000 PC", S4("Trong"), "Từng chiếc", 12],
    ["Đóng gói", "Thùng carton", "Thùng carton 5 lớp, in mark theo PO", "carton", "60 × 40 × 35 cm", TT, "CT-6040", "0,083 PC", S4("Nâu kraft"), "12 sp/thùng, size lẻ", 12],
    ["Khác", "Hút ẩm", "Gói hút ẩm silica 2 g, không DMF", "silica", "4 × 5 cm", TT, "HA-0002", "1,000 PC", S4("—"), "Trong túi PE", 12],
  ],
  polo: [
    ["Vật tư", "Vải", "Vải cá sấu (pique) 100% cotton chải kỹ, 220 g/m², xử lý chống co", "vai", "Khổ 180 cm", "Dệt may Thành Công", "V-PQ220", "0,980 M", ["PQ-100", "PQ-410", "PQ-620", "PQ-235"], "Thân, tay", 4],
    ["Vật tư", "Phụ liệu dệt kim", "Cổ dệt phẳng 1×1, viền tipping 2 sọc", "rib", "38 × 8,5 cm", "Dệt kim Phú Thịnh", "BC-3885", "1,000 PC", ["Trắng / sọc navy", "Navy / sọc trắng", "Đỏ đô / sọc trắng", "Ngọc / sọc trắng"], "Cổ", 5],
    ["Vật tư", "Phụ liệu dệt kim", "Bo tay dệt 1×1 cùng màu cổ", "rib", "34 × 2,5 cm", "Dệt kim Phú Thịnh", "BT-3425", "2,000 PC", ["Trắng", "Navy", "Đỏ đô", "Ngọc"], "Cửa tay", 5],
    ["Vật tư", "Mex", "Mex dựng nẹp không dệt 30 g/m²", "mex", "Khổ 100 cm", NV, "MX-0030", "0,040 M", S4("Trắng"), "Nẹp cổ", 5],
    ["Vật tư", "Cúc", "Cúc nhựa 4 lỗ 18L (11,4 mm), mặt nhám", "btn", "18L", NV, "CN-1804", "3,000 PC", ["Trắng", "Navy", "Đỏ đô", "Ngọc"], "Nẹp cổ", 6],
    ["Vật tư", "Băng", "Băng dệt che đường may cổ sau, in logo", "tape", "Rộng 10 mm", SV, "BD-0010", "0,420 M", ["Navy", "Trắng", "Trắng", "Trắng"], "Cổ sau", 6],
    ["Thêu", "Thêu", "Logo thêu ngực trái, 6.500 mũi", "emb", "40 × 30 mm", "Thêu Vi tính Phương Nam", "TH-4030", "1,000 PC", ["Navy", "Trắng", "Trắng", "Trắng"], "Ngực trái", 7],
    ...LBL(8, "Giữa cổ sau", "Sườn trái, cách gấu 10 cm"), ...TH("polo", 9, "165,000", "110,000", "Kim DB×1 #11 mũi bi (hàng dệt kim)"),
    ["Rập", "Chi tiết rập", "Thân trước, thân sau, tay × 2, đáp nẹp × 2 — vải chính", "rap", "—", "—", "R-01", "6 PC", S4("—"), "Sơ đồ cắt, bàn 3", 11],
    ...PACK(12, 36, "30 × 40 cm"),
  ],
  thun: [
    ["Vật tư", "Vải", "Vải single jersey 100% cotton compact 30/1, 180 g/m²", "vai", "Khổ 92 cm (ống)", "Dệt kim Đông Phương", "V-SJ180", "0,680 M", ["SJ-100", "SJ-001", "SJ-520", "SJ-740"], "Thân, tay", 4],
    ["Vật tư", "Phụ liệu dệt kim", "Bo cổ rib 1×1, 95% cotton 5% spandex", "rib", "Bản 2 cm", "Dệt kim Phú Thịnh", "BO-1120", "0,520 M", ["Trắng", "Đen", "Xám melange", "Xanh biển"], "Cổ", 5],
    ["Vật tư", "Băng", "Dây dù cổ sau vai-vai", "tape", "Rộng 10 mm", NV, "BD-1010", "0,380 M", ["Trắng", "Đen", "Xám", "Navy"], "Cổ sau", 5],
    ["In", "In lụa", "In lụa logo ngực, mực plastisol không phthalate", "ep", "220 × 80 mm", "In Lụa Tân Phú", "IN-2208", "1,000 PC", ["Đen", "Trắng", "Trắng", "Trắng"], "Ngực trước", 6],
    ...LBL(7, "Giữa cổ sau", "Sườn trái, cách gấu 8 cm"), ...TH("thun", 8, "120,000", "140,000", "Kim UY×128 #11 mũi bi (trần đè)"),
    ["Rập", "Chi tiết rập", "Thân trước, thân sau, tay × 2 — vải chính", "rap", "—", "—", "R-01", "4 PC", S4("—"), "Sơ đồ cắt, bàn 5", 10],
    ...PACK(11, 48, "28 × 38 cm"),
  ],
  somi: [
    ["Vật tư", "Vải", "Vải poplin 100% cotton 40×40 / 133×72, 115 g/m²", "vai", "Khổ 145 cm", "Dệt Phong Phú", "V-PP115", "1,450 M", ["PP-100", "PP-416", "PP-803", "PP-255"], "Thân, tay, cổ, măng sét", 4],
    ["Vật tư", "Mex", "Mex dựng cổ & măng sét dính 1 mặt 90 g/m²", "mex", "Khổ 112 cm", NV, "MX-0090", "0,150 M", S4("Trắng"), "Lá cổ, chân cổ, măng sét", 5],
    ["Vật tư", "Mex", "Mex nẹp áo mỏng 30 g/m²", "mex", "Khổ 100 cm", NV, "MX-0030", "0,080 M", S4("Trắng"), "Nẹp trước", 5],
    ["Vật tư", "Cúc", "Cúc trai nhân tạo 4 lỗ 16L (7 nẹp + 2 măng sét + 1 chân cổ + 1 dự phòng)", "btn", "16L", NV, "CN-1604", "11,000 PC", ["Trắng ngọc", "Trắng ngọc", "Hồng ngọc", "Be ngọc"], "Nẹp, măng sét, chân cổ", 6],
    ...LBL(7, "Giữa chân cổ sau", "Sườn trái, cách gấu 12 cm"), ...TH("somi", 8, "150,000", "90,000", "Kim DB×1 #11 mũi nhọn"),
    ["Rập", "Chi tiết rập", "Thân trước × 2, thân sau, đô × 2, tay × 2, lá cổ × 2, chân cổ × 2, măng sét × 4", "rap", "—", "—", "R-01", "15 PC", S4("—"), "Sơ đồ cắt, bàn 2", 10],
    ...PACK(11, 30, "30 × 40 cm", [HANG(11)]),
  ],
  kaki: [
    ["Vật tư", "Vải", "Vải kaki twill 2/1, 98% cotton 2% spandex, 270 g/m², giặt enzyme", "vai", "Khổ 147 cm", "Dệt Nam Định", "V-KT270", "1,250 M", ["KT-250", "KT-410", "KT-090", "KT-330"], "Thân quần, cạp", 4],
    ["Vật tư", "Lót", "Lót túi TC 65/35 poplin 110 g/m²", "lot", "Khổ 150 cm", "Vải Minh Phát", "L-TC110", "0,350 M", ["Be", "Navy", "Ghi", "Be"], "Lót túi chéo, túi sau", 4],
    ["Vật tư", "Mex", "Mex dính cạp dệt 60 g/m²", "mex", "Khổ 112 cm", NV, "MX-0060", "0,060 M", S4("Trắng"), "Cạp, đáp cửa quần", 5],
    ["Vật tư", "Khóa kéo", "Khóa kéo quần đồng #3, đầu khóa tự động (auto-lock)", "zip", "Dài 18 cm", "YKK Việt Nam", "DK-3018M", "1,000 PC", ["Đồng / tape 572", "Đồng / tape 560", "Đồng / tape 580", "Đồng / tape 566"], "Cửa quần", 5],
    ["Vật tư", "Cúc", "Cúc kim loại dập chân 17 mm, logo chìm, không niken", "snap", "Ø 17 mm", NV, "CK-1700", "1,000 PC", ["Đồng cổ", "Đồng cổ", "Gunmetal", "Đồng cổ"], "Cạp trước", 6],
    ["Vật tư", "Đinh tán", "Đinh tán đồng 8 mm", "rivet", "Ø 8 mm", NV, "DT-0800", "4,000 PC", ["Đồng cổ", "Đồng cổ", "Gunmetal", "Đồng cổ"], "Miệng túi chéo", 6],
    ["Vật tư", "Cúc", "Cúc nhựa 4 lỗ 24L", "btn", "24L", NV, "CN-2404", "2,000 PC", ["Be", "Navy", "Ghi than", "Ô liu"], "Túi mổ sau", 6],
    ["Vật tư", "Nhãn", "Nhãn da PU ép logo", "nhan", "40 × 25 mm", SV, "N-0425", "1,000 PC", S4("Nâu"), "Cạp sau phải", 7],
    ...LBL(7, "Giữa cạp sau, mặt trong", "Sườn trái, dưới cạp"), ...TH("kaki", 8, "210,000", "95,000", "Kim DP×5 #16 mũi tròn (vải dày)"),
    ["Chỉ may", "Chỉ may/Kim", "Chỉ diễu polyester 20/3 bóng", "chi", "3.000 m/cuộn", "Chỉ Thành Công", "C-2003", "40,000 M", ["C-250 Be", "C-410 Navy", "C-090 Ghi", "C-330 Ô liu"], "Diễu cửa quần, túi", 8],
    ["Rập", "Chi tiết rập", "Thân trước × 2, thân sau × 2, cạp × 2, đỉa × 7, đáp túi × 4", "rap", "—", "—", "R-01", "15 PC", S4("—"), "Sơ đồ cắt, bàn 4", 10],
    ...PACK(11, 24, "35 × 45 cm", [["Đóng gói", "Nhãn dán", "Băng dán size trên ống quần", "size", "20 × 100 mm", SV, "ND-2010", "1,000 PC", S4("Trắng / mực đen"), "Ống quần phải", 11]]),
  ],
  short: [
    ["Vật tư", "Vải", "Vải cotton twill nhẹ 100% cotton, 200 g/m², giặt mềm", "vai", "Khổ 150 cm", "Dệt Nam Định", "V-TW200", "0,620 M", ["TW-330", "TW-410", "TW-560", "TW-250"], "Thân quần", 4],
    ["Vật tư", "Lót", "Lót túi cotton 100% 100 g/m²", "lot", "Khổ 150 cm", "Vải Minh Phát", "L-CT100", "0,250 M", S4("Trắng"), "Lót túi sườn", 4],
    ["Vật tư", "Chun", "Chun dệt 3,5 cm, độ giãn 120%", "chun", "Dài 62 cm (size M)", NV, "CH-3562", "1,000 PC", S4("Trắng"), "Trong cạp", 5],
    ["Vật tư", "Dây luồn", "Dây dệt dẹt 1 cm, bịt đầu silicon (không kim loại – hàng trẻ em)", "cord", "Dài 110 cm", NV, "DL-1011", "1,000 PC", ["Ô liu", "Navy", "San hô", "Be"], "Cạp", 5],
    ["Thêu", "Khuy thêu", "Khuy thêu luồn dây Ø 6 mm (thay ô-dê kim loại)", "eyelet", "Ø 6 mm", "—", "KT-0006", "2,000 PC", ["Ô liu", "Navy", "San hô", "Be"], "Cạp trước", 5],
    ["Vật tư", "Nhãn", "Nhãn vòng logo dệt", "nhan", "10 × 40 mm", SV, "N-0410", "1,000 PC", S4("Nền trắng"), "Cạnh túi sau", 6],
    ...LBL(6, "Giữa cạp sau, mặt trong", "Sườn trái, dưới cạp"), ...TH("short", 7, "95,000", "70,000", "Kim DB×1 #14 mũi tròn"),
    ["Rập", "Chi tiết rập", "Thân trước × 2, thân sau × 2, cạp, túi đắp, đáp túi × 2", "rap", "—", "—", "R-01", "8 PC", S4("—"), "Sơ đồ cắt, bàn 6", 9],
    ...PACK(10, 60, "25 × 35 cm"),
  ],
  vay: [
    ["Vật tư", "Vải", "Vải satin polyester 50D, 105 g/m², chống nhăn", "vai", "Khổ 150 cm", "Dệt Hòa Bình", "V-SA105", "1,850 M", ["SA-801", "SA-132", "SA-415", "SA-001"], "Thân váy, cạp", 4],
    ["Vật tư", "Lót", "Lót tricot polyester 100%", "lot", "Khổ 150 cm", "Vải Minh Phát", "L-TR060", "1,300 M", ["Hồng", "Kem", "Xanh", "Đen"], "Lót váy", 4],
    ["Vật tư", "Mex", "Mex dính cạp 1 mặt 60 g/m²", "mex", "Khổ 112 cm", NV, "MX-0060", "0,050 M", S4("Trắng"), "Cạp", 5],
    ["Vật tư", "Khóa kéo", "Khóa giấu nylon #3", "zip", "Dài 20 cm", "YKK Việt Nam", "DK-IZ320", "1,000 PC", ["515 Hồng", "841 Kem", "539 Xanh", "580 Đen"], "Giữa sau", 5],
    ["Vật tư", "Móc cài", "Móc cài cạp kim loại (bộ 2 chi tiết)", "hook", "Bộ", NV, "MC-0210", "1,000 BỘ", S4("Bạc mờ"), "Đầu cạp sau", 5],
    ["Vật tư", "Dây treo", "Dây treo váy satin 6 mm", "tape", "Dài 25 cm", NV, "DT-0625", "2,000 PC", S4("Theo màu vải"), "Sườn trong cạp", 6],
    ...LBL(7, "Giữa cạp sau, mặt trong", "Sườn trái lớp lót"), ...TH("vay", 8, "140,000", "160,000", "Kim DB×1 #9 mũi nhọn (vải mỏng)"),
    ["Rập", "Chi tiết rập", "Thân trước, thân sau × 2 (vạt tròn ¾), lót × 3, cạp × 2", "rap", "—", "—", "R-01", "8 PC", S4("—"), "Sơ đồ cắt, bàn 7", 10],
    ...PACK(11, 20, "40 × 55 cm", [HANG(11)]),
  ],
};

/** [mã, điểm đo, tên gốc, cách đo, dung sai −, dung sai +, size gốc (M), bước nhảy, trang] */
export type PomRow = [string, string, string, string, number, number, number, number, number];
export const POMS: Record<Kind, PomRow[]> = {
  khoac: [["A", "Dài áo sau", "Body length from HPS", "Đỉnh vai cổ sau thẳng xuống gấu", 1, 1, 70, 1.5, 14], ["B", "Rộng ngực ½", "Chest width 1/2", "Dưới nách 2,5 cm, đo thẳng", 1, 1, 58, 2.5, 14],
    ["C", "Rộng gấu ½", "Hem width 1/2", "Đo thẳng ở gấu, dây luồn thả", 1, 1, 56, 2.5, 14], ["D", "Rộng vai", "Across shoulder", "Đầu vai trái sang đầu vai phải", 0.5, 0.5, 46, 1.2, 14],
    ["E", "Dài tay", "Sleeve length from shoulder", "Đầu vai tới mép bo tay", 1, 1, 64, 1, 14], ["F", "Bắp tay ½", "Bicep 1/2", "Dưới nách 2,5 cm, vuông góc tay", 0.5, 0.5, 21, 0.8, 15],
    ["G", "Rộng cửa tay ½", "Cuff opening 1/2", "Bo tay để thả", 0.5, 0.5, 9, 0.3, 15], ["H", "Cao bo tay", "Cuff height", "Đường may tới mép bo", 0.3, 0.3, 6, 0, 15],
    ["I", "Dài nẹp trước", "Center front length", "Chân cổ tới gấu, dọc dây kéo", 1, 1, 66, 1.5, 15], ["J", "Rộng cổ ½", "Neck width 1/2", "Giữa hai đỉnh vai cổ", 0.5, 0.5, 24, 0.5, 15],
    ["K", "Cao mũ", "Hood height", "Chân mũ tới đỉnh mũ", 0.5, 0.5, 36, 0.5, 16], ["L", "Rộng mũ ½", "Hood width 1/2", "Đo ngang chỗ rộng nhất", 0.5, 0.5, 26, 0.5, 16]],
  polo: [["A", "Dài áo sau", "Body length from HPS", "Đỉnh vai cổ sau thẳng xuống gấu", 1, 1, 72, 1.5, 14], ["B", "Rộng ngực ½", "Chest width 1/2", "Dưới nách 2,5 cm", 1, 1, 54, 2.5, 14],
    ["C", "Rộng gấu ½", "Hem width 1/2", "Đo thẳng ở gấu", 1, 1, 53, 2.5, 14], ["D", "Rộng vai", "Across shoulder", "Đầu vai trái sang phải", 0.5, 0.5, 45, 1.2, 14],
    ["E", "Dài tay", "Sleeve length", "Đầu vai tới mép bo tay", 0.5, 0.5, 23, 0.5, 14], ["F", "Rộng cửa tay ½", "Sleeve opening 1/2", "Đo thẳng ở mép bo", 0.5, 0.5, 17.5, 0.6, 15],
    ["G", "Dài nẹp", "Placket length", "Chân cổ tới đáy nẹp", 0.3, 0.3, 15, 0, 15], ["H", "Cao cổ sau", "Collar height at CB", "Giữa sau, chân cổ tới mép", 0.2, 0.2, 7.5, 0, 15],
    ["I", "Rộng cổ", "Neck width", "Giữa hai đỉnh vai cổ", 0.5, 0.5, 18.5, 0.5, 15], ["J", "Dài xẻ tà", "Side vent length", "Từ gấu lên đầu xẻ", 0.3, 0.3, 4, 0, 15]],
  thun: [["A", "Dài áo sau", "Body length from HPS", "Đỉnh vai cổ sau thẳng xuống gấu", 1, 1, 70, 1.5, 14], ["B", "Rộng ngực ½", "Chest width 1/2", "Dưới nách 2,5 cm", 1, 1, 52, 2.5, 14],
    ["C", "Rộng gấu ½", "Hem width 1/2", "Đo thẳng ở gấu", 1, 1, 52, 2.5, 14], ["D", "Rộng vai", "Across shoulder", "Đầu vai trái sang phải", 0.5, 0.5, 44, 1.2, 14],
    ["E", "Dài tay", "Sleeve length", "Đầu vai tới gấu tay", 0.5, 0.5, 21, 0.5, 14], ["F", "Rộng cửa tay ½", "Sleeve opening 1/2", "Đo thẳng ở gấu tay", 0.5, 0.5, 17, 0.6, 15],
    ["G", "Rộng cổ", "Neck width", "Giữa hai đỉnh vai cổ", 0.5, 0.5, 18, 0.5, 15], ["H", "Hạ cổ trước", "Front neck drop", "Từ đường HPS tới mép cổ trước", 0.3, 0.3, 9, 0.3, 15], ["I", "Bản bo cổ", "Neck rib width", "Đo vuông góc", 0.2, 0.2, 2, 0, 15]],
  somi: [["A", "Dài áo sau", "Body length from HPS", "Đỉnh vai cổ sau thẳng xuống gấu", 1, 1, 64, 1, 14], ["B", "Rộng ngực ½", "Bust 1/2", "Dưới nách 2,5 cm", 1, 1, 47, 2, 14],
    ["C", "Rộng eo ½", "Waist 1/2", "Chỗ hẹp nhất", 1, 1, 42, 2, 14], ["D", "Rộng gấu ½", "Hem 1/2", "Đo thẳng ở gấu", 1, 1, 49, 2, 14], ["E", "Rộng vai", "Across shoulder", "Đầu vai trái sang phải", 0.5, 0.5, 38, 1, 14],
    ["F", "Dài tay", "Sleeve length", "Đầu vai tới hết măng sét", 0.5, 0.5, 59, 0.5, 15], ["G", "Bắp tay ½", "Bicep 1/2", "Dưới nách 2,5 cm", 0.5, 0.5, 16.5, 0.5, 15],
    ["H", "Dài măng sét", "Cuff length", "Đo khi cài cúc", 0.5, 0.5, 21, 0.5, 15], ["I", "Cao măng sét", "Cuff height", "Đo vuông góc", 0.2, 0.2, 6, 0, 15], ["J", "Vòng cổ", "Neck circumference", "Tâm cúc tới tâm khuy", 0.5, 0.5, 37, 1, 15]],
  kaki: [["A", "Vòng cạp ½", "Waist 1/2", "Mép trên cạp, cài cúc", 0.5, 0.5, 42, 2.5, 14], ["B", "Vòng mông ½", "Hip 1/2", "Dưới cạp 18 cm", 1, 1, 52, 2.5, 14],
    ["C", "Rộng đùi ½", "Thigh 1/2", "Dưới đáy 2,5 cm", 0.5, 0.5, 31, 1.3, 14], ["D", "Rộng gối ½", "Knee 1/2", "Dưới đáy 33 cm", 0.5, 0.5, 23, 0.8, 14], ["E", "Rộng ống ½", "Leg opening 1/2", "Đo thẳng ở gấu", 0.3, 0.3, 19.5, 0.6, 14],
    ["F", "Dài dọc quần", "Outseam", "Mép trên cạp tới gấu", 1, 1, 104, 1.5, 15], ["G", "Dài giàng", "Inseam", "Đáy tới gấu", 1, 1, 81, 0, 15], ["H", "Đáy trước", "Front rise", "Đáy tới mép cạp, gồm cạp", 0.5, 0.5, 26, 0.6, 15],
    ["I", "Đáy sau", "Back rise", "Đáy tới mép cạp sau", 0.5, 0.5, 37, 0.8, 15], ["J", "Bản cạp", "Waistband height", "Đo vuông góc", 0.2, 0.2, 4, 0, 15]],
  short: [["A", "Vòng cạp ½ (thả)", "Waist relaxed 1/2", "Cạp để thả", 1, 1, 30, 2.5, 14], ["B", "Vòng cạp ½ (kéo giãn)", "Waist extended 1/2", "Kéo hết giãn", 1, 1, 40, 2.5, 14],
    ["C", "Vòng mông ½", "Hip 1/2", "Dưới cạp 12 cm", 1, 1, 44, 2, 14], ["D", "Rộng đùi ½", "Thigh 1/2", "Dưới đáy 2,5 cm", 0.5, 0.5, 28, 1.2, 14], ["E", "Rộng ống ½", "Leg opening 1/2", "Đo thẳng ở gấu", 0.5, 0.5, 26, 1, 14],
    ["F", "Dài dọc quần", "Outseam", "Mép trên cạp tới gấu", 0.5, 0.5, 36, 1.5, 15], ["G", "Dài giàng", "Inseam", "Đáy tới gấu", 0.5, 0.5, 13, 0.5, 15],
    ["H", "Đáy trước", "Front rise", "Gồm cạp", 0.5, 0.5, 22, 0.6, 15], ["I", "Đáy sau", "Back rise", "Gồm cạp", 0.5, 0.5, 29, 0.8, 15]],
  vay: [["A", "Vòng cạp ½", "Waist 1/2", "Mép trên cạp, cài móc", 0.5, 0.5, 35, 2.5, 14], ["B", "Vòng mông ½", "Hip 1/2", "Dưới cạp 18 cm", 1, 1, 49, 2.5, 14],
    ["C", "Dài váy giữa sau", "CB length", "Mép trên cạp tới gấu", 1, 1, 60, 1, 14], ["D", "Vòng gấu", "Sweep", "Đo theo đường cong gấu", 3, 3, 260, 8, 15],
    ["E", "Bản cạp", "Waistband height", "Đo vuông góc", 0.2, 0.2, 3, 0, 15], ["F", "Dài khóa giấu", "Invisible zip length", "Từ mép cạp xuống", 0.5, 0.5, 20, 0, 15]],
};

/** Callout: [x đích, y đích, x vòng số, y vòng số, ghi chú] */
export type Callout = [number, number, number, number, string];
/** Trang chi tiết: [tiêu đề, mặt, viewBox phóng to, callouts] */
export const DET: Record<Kind, [string, "front" | "back", string, Callout[]][]> = {
  polo: [["Chi tiết cổ & nẹp", "front", "58 4 84 92", [[85, 30, 66, 22, "Cổ dệt phẳng 1×1, viền tipping 2 sọc"], [100, 58, 126, 50, "Cúc nhựa 4 lỗ 18L × 3"], [100, 80, 78, 88, "Đáy nẹp may hộp, diễu 0,6 cm"], [128, 62, 134, 82, "Logo thêu ngực trái"]]],
    ["Chi tiết tay & xẻ tà", "front", "6 20 64 190", [[25, 74, 12, 96, "Bo tay dệt 1×1, cao 2,5 cm"], [52, 40, 62, 30, "Diễu vòng nách 0,6 cm"], [44.5, 186, 60, 172, "Xẻ tà 4 cm, đính bọ 2 đầu"], [60, 195, 56, 205, "Gấu may 2 kim 2,5 cm"]]]],
  thun: [["Chi tiết cổ & vị trí in", "front", "58 2 84 84", [[90, 27, 70, 44, "Bo cổ rib 1×1, bản 2 cm"], [100, 34.5, 120, 44, "Diễu trần đè 2 kim 0,6 cm"], [100, 19, 128, 10, "Nhãn chính may giữa cổ sau"], [100, 66, 130, 80, "In lụa logo, cách cổ 7 cm"]]],
    ["Chi tiết tay & gấu", "front", "6 40 80 170", [[25.4, 69.8, 12, 90, "Gấu tay may 2 kim 2,5 cm"], [48.5, 42.3, 64, 52, "Tra tay vắt sổ 4 chỉ"], [70, 195, 62, 180, "Gấu thân may 2 kim 2,5 cm"]]]],
  somi: [["Chi tiết cổ & nẹp", "front", "62 0 76 70", [[87, 36, 70, 54, "Cổ có chân, mex dựng 90 g/m²"], [100, 40, 124, 46, "Cúc 4 lỗ 16L"], [82.5, 20, 70, 10, "Diễu mí 0,15 cm"], [103.5, 60, 126, 64, "Nẹp 2,5 cm, diễu 2 đường"]]],
    ["Chi tiết măng sét", "front", "2 128 54 50", [[21, 158.5, 44, 140, "Măng sét 6 cm, 1 cúc 16L"], [26, 152.4, 10, 136, "Diễu mí 0,15 cm"], [27, 164.7, 46, 170, "Diễu gấu măng sét 0,6 cm"]]]],
  khoac: [["Chi tiết mũ & cổ", "front", "56 0 88 92", [[91.8, 10, 116, 10, "Mũ 3 mảnh, ép seam chống thấm"], [81.5, 40, 64, 62, "Viền mũ diễu 0,6 cm"], [84, 77, 70, 86, "Dây luồn Ø 4 mm + chặn dây"], [100, 72, 124, 84, "Dây kéo #5 2 chiều, đầu khóa logo"], [127, 75, 136, 58, "Logo ép nhiệt phản quang"]]],
    ["Chi tiết túi & chần bông", "front", "38 100 70 110", [[67, 144, 90, 124, "Túi sườn khóa giấu chống nước 18 cm"], [56, 148, 44, 128, "Chần ô 6 cm qua gòn 80 g/m²"], [53, 196, 44, 204, "Dây luồn gấu + chặn dây"], [70, 190.6, 92, 204, "Bản gấu 3 cm"]]]],
  kaki: [["Chi tiết cạp & cửa quần", "front", "30 0 92 100", [[100, 16, 116, 34, "Cúc kim loại Ø 17 mm, không niken"], [76, 17, 82, 40, "Đỉa 1 × 5 cm × 7"], [108, 60, 116, 80, "Khóa #3 auto-lock, diễu chữ J"], [56.4, 49.3, 42, 76, "Túi chéo, diễu 0,6 cm"], [66.5, 25.5, 52, 36, "Đinh tán đồng miệng túi"]]],
    ["Chi tiết túi sau", "back", "40 18 72 52", [[68, 46, 92, 60, "Túi mổ 2 viền 13 cm"], [68, 53, 50, 64, "Cúc 4 lỗ 24L, khuy đứng"], [70.3, 31, 90, 28, "Chiết ly sau 6 cm"], [56, 17, 46, 30, "Đỉa sau"]]]],
  short: [["Chi tiết cạp chun", "front", "28 2 92 62", [[66, 19, 52, 6, "Cạp chun 3,5 cm, chần 4 đường"], [95, 20, 80, 44, "Khuy thêu luồn dây (không kim loại)"], [90, 49, 108, 56, "Dây dệt dẹt 1 cm, bịt đầu silicon"], [52, 47, 38, 40, "Túi sườn chéo"]]],
    ["Chi tiết túi sau & gấu", "back", "26 40 74 104", [[67, 62, 90, 48, "Túi đắp, diễu 2 đường 0,6 cm"], [82, 58.5, 94, 72, "Nhãn vòng logo"], [60, 128, 46, 114, "Gấu lật 3,5 cm"]]]],
  vay: [["Chi tiết cạp", "front", "56 4 88 44", [[82, 18, 72, 38, "Cạp 3 cm, mex dính 1 mặt"], [100, 14.5, 118, 36, "Diễu mí cạp 0,15 cm"]]],
    ["Chi tiết khóa giấu", "back", "64 4 72 100", [[100, 60, 118, 64, "Khóa giấu nylon #3, 20 cm"], [100, 18, 120, 12, "Móc cài cạp"], [80.5, 37, 74, 56, "Chiết ly sau 10 cm"], [100, 92, 84, 98, "Chặn đuôi khóa"]]]],
};
/** Vị trí nhãn chính & nhãn sườn trên hình mặt sau */
export const LB: Record<Kind, [[number, number], [number, number]]> = {
  polo: [[100, 28], [46, 170]], thun: [[100, 24], [48, 170]], somi: [[100, 28], [62.5, 160]], khoac: [[100, 56], [52, 170]],
  kaki: [[100, 16], [41, 34]], short: [[100, 19], [39, 36]], vay: [[88, 18], [65, 36]],
};
/** Cách đo: [mã POM, x1, y1, x2, y2, vị trí chữ dọc đường (0–1)] */
export const MEAS: Record<Kind, [string, number, number, number, number, number][]> = {
  polo: [["A", 82, 16, 82, 200, 0.62], ["B", 44, 70, 156, 70, 0.72], ["C", 42, 190, 158, 190, 0.5], ["D", 48, 26, 152, 26, 0.8], ["E", 48, 26, 24, 77, 0.5], ["G", 112, 24, 112, 84, 0.5]],
  thun: [["A", 80, 13, 80, 200, 0.62], ["B", 44, 66, 156, 66, 0.72], ["C", 44, 190, 156, 190, 0.5], ["D", 46, 23, 154, 23, 0.8], ["E", 46, 23, 23, 73, 0.5], ["G", 80, 8, 120, 8, 0.5]],
  somi: [["A", 84, 13, 84, 200, 0.6], ["B", 56, 88, 144, 88, 0.72], ["C", 62, 124, 138, 124, 0.72], ["D", 57, 186, 143, 186, 0.3], ["E", 52, 20, 148, 20, 0.25], ["F", 52, 24, 15, 157, 0.5]],
  khoac: [["A", 68, 44, 68, 202, 0.6], ["B", 50, 92, 150, 92, 0.72], ["C", 48, 196, 152, 196, 0.72], ["D", 40, 54, 160, 54, 0.8], ["E", 40, 54, 14, 175, 0.5], ["I", 92, 60, 92, 190, 0.4]],
  kaki: [["A", 40, 4, 160, 4, 0.7], ["B", 33, 80, 167, 80, 0.72], ["C", 34.3, 100, 97.5, 100, 0.4], ["E", 38.1, 205, 88.1, 205, 0.5], ["F", 28, 10, 32, 208, 0.5], ["G", 96, 104, 87, 206, 0.5]],
  short: [["A", 36, 5, 164, 5, 0.7], ["C", 30, 70, 170, 70, 0.72], ["E", 32.2, 137, 90.5, 137, 0.5], ["F", 25, 10, 27, 140, 0.5], ["G", 97, 102, 90, 138, 0.5]],
  vay: [["A", 64, 7, 136, 7, 0.7], ["B", 54, 70, 146, 70, 0.72], ["C", 108, 12, 108, 210, 0.6], ["E", 130, 12, 130, 24, 0.5]],
};
export const NPG = (k: Kind) => 5 + DET[k].length;
export const sizesOf = (k: Kind) => (k === "kaki" ? ["28", "30", "32", "34", "36", "38"] : ["XS", "S", "M", "L", "XL", "XXL"]);
export const CATS = ["Tất cả", "Vật tư", "Chỉ may", "Rập", "In", "Thêu", "Đóng gói", "Khác", "Hình ảnh"];

/* ---------- Chế độ chỉnh sửa: 2 sheet ---------- */
const vn = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");
export function sheetData(k: Kind, sheet: 0 | 1): (string | number)[][] {
  const CW = CWS[k], SZ = sizesOf(k);
  const d: (string | number)[][] = sheet === 0
    ? [["Mục", "Loại", "Mô tả", "KT", "NCC", "Mã", "SL", ...CW.map((c) => c[0]), "Vị trí dùng", "Tr."],
      ...BOMS[k].map((r) => [r[0], r[1], r[2], r[4], r[5], r[6], r[7], ...r[8], r[9], r[10]])]
    : [["Mã", "Điểm đo", "Tên gốc", "Cách đo", "Dung sai −", "Dung sai +", ...SZ, "Tr."],
      ...POMS[k].map((p) => [p[0], p[1], p[2], p[3], vn(p[4]), vn(p[5]), ...SZ.map((_, i) => vn(p[6] + (i - 2) * p[7])), p[8]])];
  const w = d[0].length;
  for (let i = 0; i < 8; i++) d.push(Array(w).fill(""));
  return d;
}

/* ---------- Thùng rác, người dùng ---------- */
/** [mã, mô tả, khách hàng idx, người xóa, ngày xóa, còn lại] */
export const TRASH: [string, string, number, string, string, string][] = [
  ["AO-POLO-2598", "Áo polo nam · SS27 · bản trùng", 0, "Lê Thị Bích", "02/11/2026", "26 ngày"],
  ["QUAN-KAKI-0918", "Quần kaki nam · SS27 · khách hủy mã", 1, "Nguyễn Thị Hạnh", "28/10/2026", "21 ngày"],
  ["VAY-XOE-1099", "Váy xòe nữ · SS27 · tải nhầm file", 3, "Trần Thu Hà", "15/10/2026", "8 ngày"],
];
/** [viết tắt, họ tên, bộ phận, vai trò, hoạt động gần nhất] */
export const USERS: [string, string, string, string, string][] = [
  ["TH", "Trần Thu Hà", "Phòng mẫu", "Admin", "Đang hoạt động"], ["NH", "Nguyễn Thị Hạnh", "Phòng mẫu", "Biên tập", "10 phút trước"],
  ["LB", "Lê Thị Bích", "Merchandiser", "Biên tập", "1 giờ trước"], ["PT", "Phạm Văn Tú", "QA", "Chỉ xem", "Hôm qua"],
  ["ĐK", "Đỗ Minh Khoa", "Kế hoạch sản xuất", "Chỉ xem", "04/11/2026"], ["VL", "Vũ Ngọc Lan", "Kho NPL", "Chỉ xem", "02/11/2026"],
];

// Dữ liệu demo "Theo dõi vận hành toàn nhà máy" — port nguyên từ apps/theo-doi-van-hanh.html.
// Chuỗi có **...** được hiển thị in đậm.

export type Risk = "cao" | "tb";
export type Level = "ok" | "warn" | "bad";

export const RISK_LABEL: Record<Risk, string> = { cao: "RỦI RO CAO", tb: "RỦI RO TRUNG BÌNH" };

export type ScenarioOption = {
  k: string; rec?: boolean; t: string; d: string; save: string; hit: string; cost: string; res: string;
};
export type Scenario = {
  lv: Risk; t: string; c: string; m: string; n: string;
  /** [PO, khách, mã hàng, số lượng, ngày giao, tác động] */
  orders: [string, string, string, number, string, string][];
  /** [tiêu đề, mô tả, đối tượng liên kết] */
  steps: [string, string, string[]][];
  root: string;
  src: string[];
  opts: ScenarioOption[];
};

// 5 tình huống: mỗi cái là một chuỗi liên kết dữ liệu → nguyên nhân gốc → 3 phương án
export const SCENARIOS: Scenario[] = [
  {
    lv: "cao", t: "3 đơn xuất Mỹ có nguy cơ trễ 4–6 ngày vì vải lô V-2611 về trễ", c: "Nhà cung cấp dời ngày giao 18.000 m vải pique từ 03/11 sang 10/11.", m: "~1,1 tỷ đồng", n: "3 đơn",
    orders: [["PO-2611", "Bellmont Apparel (Mỹ)", "AO-POLO-2611", 14000, "15/11", "trễ 5 ngày"], ["PO-2614", "Bellmont Apparel (Mỹ)", "AO-POLO-2611", 10000, "18/11", "trễ 4 ngày"], ["PO-2620", "Bellmont Apparel (Mỹ)", "AO-THUN-2402", 8000, "20/11", "trễ 6 ngày"]],
    steps: [["Vải về trễ 7 ngày", "Phiếu mua PM-0418: 18.000 m pique navy, NCC xác nhận dời sang 10/11.", ["Lô V-2611", "PM-0418", "NCC Dệt Phú An"]],
      ["Xưởng cắt dừng 3 bàn", "Kế hoạch cắt 8.400 sp tuần này mới đạt 38%.", ["Bàn 03", "Bàn 04", "Bàn 07"]],
      ["3 chuyền sắp hết hàng", "Tồn bán thành phẩm chỉ đủ đến trưa 08/11.", ["Chuyền 05", "Chuyền 06", "Chuyền 09"]],
      ["3 đơn trễ ngày xuất", "Phạt chậm giao 3%/ngày + nguy cơ phải đi máy bay.", ["PO-2611", "PO-2614", "PO-2620"]]],
    root: "Kế hoạch cắt vẫn chạy theo **ngày vải về cũ (03/11)**. Khi nhà cung cấp đổi ngày qua email, không ai cập nhật vào Excel kế hoạch nên 4 ngày sau mới phát hiện.",
    src: ["ERP đơn hàng (cập nhật 06:00)", "Phần mềm kho – phiếu nhập NPL", "Email xác nhận NCC 02/11", "Excel kế hoạch cắt", "Đếm hàng chuyền 05, 06, 09"],
    opts: [{ k: "A", t: "Giữ nguyên, xuất phần trễ bằng máy bay", d: "Chờ vải 10/11, tăng ca cắt 2 ca, phần hàng trễ đi đường hàng không.", save: "3/3 đơn", hit: "Không", cost: "~640 triệu đồng", res: "Giao đúng hẹn nhưng cước hàng không rất cao" },
      { k: "B", rec: true, t: "Mua vải thay thế trong nước cho 2 đơn", d: "NCC nội địa giao 8.500 m ngày 08/11 (giá cao hơn 18%). Bellmont Apparel đã duyệt chất vải tương đương năm ngoái.", save: "2/3 đơn", hit: "PO-2620 trễ 3 ngày", cost: "~240 triệu đồng", res: "Giảm 78% thiệt hại, cần khách duyệt mẫu trong 24 giờ" },
      { k: "C", t: "Xin khách dời ngày giao, đổi lịch chuyền", d: "Đàm phán với Bellmont Apparel dời 6 ngày, chiết khấu 2%. Chuyền 05, 06, 09 chạy đơn khác trong lúc chờ.", save: "0/3 đơn (dời hẹn)", hit: "3 đơn đổi lịch", cost: "~350 triệu đồng", res: "Không phạt, nhưng ảnh hưởng uy tín với khách lớn" }],
  },
  {
    lv: "cao", t: "Xưởng 2 hiệu suất giảm 3 ngày liên tiếp do thiếu 21 người", c: "Tháng 10 có 58 người nghỉ việc, 21 người ở 3 chuyền Xưởng 2.", m: "~560 triệu đồng", n: "2 đơn",
    orders: [["PO-2617", "Hanbit Urban (Hàn Quốc)", "AO-KHOAC-1150", 9000, "19/11", "trễ 3 ngày"], ["PO-2623", "Nordvik Outdoor (Thụy Điển)", "SOMI-NU-1210", 15000, "22/11", "trễ 2 ngày"]],
    steps: [["21 công nhân nghỉ việc", "Máy chấm công: 21 người Xưởng 2 nghỉ hẳn trong tháng 10, gấp đôi Xưởng 1.", ["Xưởng 2", "Tháng 10"]],
      ["3 chuyền thiếu 6–8 người", "Mỗi chuyền chỉ còn 37–40/46 người.", ["Chuyền 10", "Chuyền 13", "Chuyền 15"]],
      ["Hiệu suất 74% → 63%", "Giảm 3 ngày liên tiếp, thiếu ~900 sp/ngày.", ["Đếm hàng chuyền", "04–06/11"]],
      ["2 đơn chậm 2–3 ngày", "Nếu không bù người, ngày giao trễ.", ["PO-2617", "PO-2623"]]],
    root: "Đơn giá công đoạn mã **AO-KHOAC-1150** thấp hơn mã khác 12%, thu nhập thợ Xưởng 2 giảm ~900.000 đồng/tháng → thợ tay nghề cao nghỉ sang xưởng gần nhà.",
    src: ["Máy chấm công (đến 07:00)", "Hồ sơ nghỉ việc – phòng nhân sự", "Bảng đơn giá công đoạn", "Đếm hàng chuyền", "ERP đơn hàng (cập nhật 06:00)"],
    opts: [{ k: "A", rec: true, t: "Điều 14 thợ từ Xưởng 1 trong 2 tuần", d: "Chuyền 02 và 07 đang dư người (đơn sắp xong). Trả phụ cấp điều chuyển 30.000 đồng/ngày.", save: "2/2 đơn", hit: "Xưởng 1 giảm ~2% sản lượng", cost: "~55 triệu đồng", res: "Cứu ngay trong tuần; nên làm kèm điều chỉnh đơn giá" },
      { k: "B", t: "Tăng đơn giá 12% + thưởng giữ chân", d: "Điều chỉnh đơn giá mã áo khoác, thưởng 500.000 đồng cho người ở lại hết quý.", save: "1/2 đơn", hit: "PO-2617 vẫn trễ 2 ngày", cost: "~85 triệu đồng/tháng", res: "Giảm nghỉ việc dài hạn, tác dụng chậm 3–4 tuần" },
      { k: "C", t: "Đưa 3.500 sp ra gia công ngoài", d: "Thuê xưởng vệ tinh may phần thân áo khoác, nhà máy làm hoàn thiện.", save: "2/2 đơn", hit: "Không", cost: "~180 triệu đồng", res: "Rủi ro chất lượng, cần QA giám sát tại chỗ" }],
  },
  {
    lv: "tb", t: "Chuyền 12 tỷ lệ lỗi tăng lên 5,8%, đơn Nhật sắp kiểm hàng", c: "2 máy 2 kim quá hạn bảo trì + 3 thợ mới ở công đoạn tra cạp.", m: "~250 triệu đồng", n: "1 đơn",
    orders: [["PO-2609", "Kazeyama Sports (Nhật)", "QUAN-KAKI-0932", 16000, "16/11", "kiểm hàng 12/11"]],
    steps: [["2 máy quá hạn bảo trì", "Quá 18 ngày so với lịch, kim lệch, đường may bỏ mũi.", ["Máy M-12-07", "Máy M-12-09"]],
      ["3 thợ mới ở tra cạp", "Vào làm 28/10, chưa qua bài kiểm tay nghề.", ["Chuyền 12", "Công đoạn tra cạp"]],
      ["Lỗi đường may tăng gấp 3", "156 sp phải sửa trong 3 ngày.", ["Phiếu QC 03–05/11"]],
      ["Nguy cơ rớt kiểm hàng", "AQL 2.5 của Kazeyama Sports, kiểm 12/11.", ["PO-2609"]]],
    root: "Lịch bảo trì máy bị **hoãn 2 lần** để chạy đơn gấp, đúng lúc chuyền nhận thợ mới → cả máy và người cùng yếu ở một công đoạn.",
    src: ["Phiếu kiểm hàng QC", "Sổ bảo trì máy (Excel)", "Hồ sơ nhân sự", "Đếm hàng chuyền 12"],
    opts: [{ k: "A", rec: true, t: "Dừng chuyền 4 giờ, bảo trì máy + kèm thợ", d: "Bảo trì 2 máy chiều nay, tổ trưởng kèm 3 thợ mới, kiểm 100% tra cạp đến hết tuần.", save: "1/1 đơn", hit: "Mất ~450 sp hôm nay", cost: "~15 triệu đồng", res: "Lỗi dự kiến về dưới 3% từ 09/11" },
      { k: "B", t: "Chỉ tăng QC kiểm 100% cuối chuyền", d: "Không dừng chuyền, thêm 2 QC bắt lỗi và sửa hàng.", save: "1/1 đơn (khả năng ~70%)", hit: "Không", cost: "~20 triệu đồng", res: "Lỗi vẫn phát sinh, chỉ chặn ở cuối" },
      { k: "C", t: "Chuyển tra cạp sang Chuyền 14", d: "Chuyền 14 thợ lành nghề làm hộ công đoạn tra cạp 1 tuần.", save: "1/1 đơn", hit: "PO-2625 chậm 1 ngày", cost: "~8 triệu đồng", res: "Nhanh, nhưng đẩy rủi ro sang đơn khác" }],
  },
  {
    lv: "tb", t: "Thiếu 17.600 khóa kéo cho lệnh sản xuất áo khoác", c: "Khách đổi mẫu thêm túi ngực nhưng định mức trong ERP chưa cập nhật.", m: "~380 triệu đồng", n: "1 đơn",
    orders: [["PO-2615", "Northline Wear (Canada)", "AO-KHOAC-1150", 12000, "25/11", "dừng chuyền từ 11/11"]],
    steps: [["Khách đổi mẫu 20/10", "Thêm túi ngực có khóa: 1 → 2 khóa/sp.", ["AO-KHOAC-1150", "Mẫu rev.2"]],
      ["Định mức chưa cập nhật", "Phòng kỹ thuật sửa rập nhưng bảng định mức trong ERP vẫn 1 khóa/sp.", ["Định mức v1", "LSX-1150-03", "LSX-1150-04"]],
      ["Kho thiếu 17.600 cái", "Tồn 6.400, cần 24.000 cho 2 lệnh.", ["Khóa kéo 18 cm đen"]],
      ["2 chuyền dừng từ 11/11", "Đơn giao 25/11 trễ ~5 ngày.", ["Chuyền 07", "Chuyền 08", "PO-2615"]]],
    root: "Thay đổi mẫu chỉ được **gửi qua Zalo cho phòng kỹ thuật**, không đi qua bước cập nhật định mức → phòng mua hàng đặt theo số cũ.",
    src: ["ERP đơn hàng (cập nhật 06:00)", "Bảng định mức NPL", "Phần mềm kho", "Excel kế hoạch sản xuất"],
    opts: [{ k: "A", rec: true, t: "Đặt gấp nhà cung cấp hiện tại", d: "NCC giao 10/11 nếu chịu phí gấp 15%.", save: "1/1 đơn", hit: "Không", cost: "~28 triệu đồng", res: "Chuyền chạy liên tục, an toàn nhất" },
      { k: "B", t: "Mượn khóa của đơn PO-2622", d: "Dùng tồn khóa cùng loại của đơn Coral Bay Clothing, hoàn trả khi hàng về.", save: "1/1 đơn", hit: "PO-2622 có thể chậm 2 ngày", cost: "Gần như 0", res: "Rẻ, nhưng chuyển rủi ro sang đơn khác" },
      { k: "C", t: "May thân trước, ráp khóa sau", d: "Chạy các công đoạn không cần khóa, ráp túi ngực khi khóa về.", save: "1/1 đơn (trễ 1–2 ngày)", hit: "Không", cost: "~35 triệu đồng", res: "Tốn công lắp lại, dễ sai sót" }],
  },
  {
    lv: "tb", t: "86 công nhân Xưởng 1 sắp vượt giới hạn tăng ca 300 giờ/năm", c: "Kế hoạch tháng 11 thêm 38 giờ/người, vượt mức luật cho phép.", m: "~480 triệu đồng", n: "2 đơn",
    orders: [["PO-2624", "Nordvik Outdoor (Thụy Điển)", "AO-POLO-2611", 24000, "28/11", "đánh giá tuân thủ 20/11"], ["PO-2627", "Nordvik Outdoor (Thụy Điển)", "VAY-XOE-1105", 10000, "05/12", "đánh giá tuân thủ 20/11"]],
    steps: [["Tăng ca tuần này 5.400 giờ", "Tăng 12% so với tuần trước để bù sản lượng.", ["Xưởng 1", "Bảng tăng ca"]],
      ["86 người đã 268–296 giờ", "Cộng dồn từ đầu năm theo máy chấm công.", ["Chuyền 01", "Chuyền 03", "Chuyền 04", "Chuyền 06"]],
      ["Kế hoạch tháng 11 vượt luật", "Thêm 38 giờ/người → 306–334 giờ, trên mức 300 giờ/năm.", ["Excel kế hoạch tăng ca"]],
      ["Khách EU đánh giá 20/11", "Vi phạm giờ làm là lỗi nặng, có thể tạm dừng đặt hàng.", ["PO-2624", "PO-2627"]]],
    root: "Tăng ca được duyệt **theo từng chuyền, từng tuần**; không ai cộng dồn giờ của từng người trong cả năm.",
    src: ["Máy chấm công (cộng dồn 01/01–05/11)", "Excel kế hoạch tăng ca", "Lịch đánh giá của khách hàng", "Bộ luật Lao động 2019 – Điều 107"],
    opts: [{ k: "A", t: "Tuyển 24 lao động thời vụ", d: "Tuyển qua công ty cung ứng trong 2 tuần, thay phần tăng ca vượt.", save: "2/2 đơn", hit: "Không", cost: "~210 triệu đồng", res: "Đúng luật, nhưng năng suất người mới thấp" },
      { k: "B", rec: true, t: "Chuyển bớt việc sang Chuyền 11 + chia ca", d: "Chuyển 1 mã hàng sang Chuyền 11 Xưởng 2 (giờ tăng ca còn thấp), làm thứ Bảy luân phiên ở Xưởng 1.", save: "2/2 đơn", hit: "Chuyền 11 hiệu suất −2 điểm", cost: "~36 triệu đồng", res: "Đúng luật, không ai vượt 300 giờ" },
      { k: "C", t: "Chỉ tăng ca người dưới 250 giờ", d: "Giữ kế hoạch nhưng loại 86 người khỏi danh sách tăng ca.", save: "1/2 đơn", hit: "PO-2624 chậm 2 ngày", cost: "Gần như 0", res: "Đúng luật, chấp nhận chậm 1 đơn" }],
  },
];

/** [chỉ số tình huống, mức, nội dung] */
export const INSIGHTS: [number, Risk, string][] = [
  [0, "cao", "Vải lô **V-2611** về trễ 7 ngày sẽ làm **3 đơn xuất Mỹ** trễ 4–6 ngày, thiệt hại ước ~1,1 tỷ đồng."],
  [1, "cao", "Xưởng 2 hiệu suất giảm **3 ngày liên tiếp** (74% → 63%) do thiếu 21 người nghỉ việc."],
  [4, "tb", "**86 công nhân** Xưởng 1 sẽ vượt 300 giờ tăng ca/năm nếu giữ kế hoạch tháng 11 — trước đợt đánh giá của khách EU."],
  [2, "tb", "Chuyền 12 lỗi **5,8%**, gấp đôi mức cho phép, đúng 6 ngày trước khi Kazeyama Sports (Nhật) kiểm hàng."],
  [3, "tb", "Thiếu **17.600 khóa kéo** cho áo khoác PO-2615 vì định mức chưa cập nhật theo mẫu mới."],
];

export const QA: Record<string, string> = {
  "Tuần này đơn nào có nguy cơ trễ?": "Có **5 đơn**: 3 đơn của Bellmont Apparel (Mỹ) (**PO-2611, 2614, 2620**) vì vải lô V-2611 về trễ, ~1,1 tỷ đồng; **PO-2617** vì Xưởng 2 thiếu người; **PO-2615** vì thiếu khóa kéo.",
  "Công đoạn nào đang nghẽn?": "**Xưởng cắt**: chạy 98% công suất, hàng chờ cắt 1,8 ngày do thiếu vải. Chuyền 05 và 09 chờ hàng cắt 3,5 giờ hôm qua.",
  "Nguyên liệu nào sắp hết?": "7 loại dưới 5 ngày dùng, gấp nhất: vải pique lô V-2611 (1 ngày), khóa kéo 18 cm (3 ngày, **chưa đặt đủ**), chỉ 40/2 trắng và mex cổ áo (4 ngày).",
  "Tháng này nghỉ việc bao nhiêu người?": "Tháng 10 có **58 người nghỉ việc** (5,9%), cao hơn tháng 9 (44 người). Riêng Xưởng 2 chiếm 21 người.",
};
export const QA_FALLBACK = "Bản demo chỉ trả lời các câu hỏi mẫu. Hãy bấm một câu bên trên.";

// ---- Chuỗi số cho biểu đồ ----
/** Sản lượng 14 ngày 23/10 → 05/11 */
export const ACT = [16100, 16600, 15900, 16800, 16950, 16700, 16300, 16650, 16850, 16200, 16400, 16150, 15700, 15940];
export const PLAN = [16400, 16400, 16400, 16400, 16400, 16400, 16400, 16600, 16600, 16600, 16600, 16600, 16600, 16600];
export const pad = (n: number) => String(n).padStart(2, "0");
export const dayLabel = (d: number) => (d <= 8 ? `${23 + d}/10` : `${pad(d - 8)}/11`);

/** Hiệu suất theo chuyền hôm qua, TB 74,8% */
export const EFF = [80, 84, 81, 78, 66, 78, 82, 81, 68, 62, 80, 71, 63, 82, 66];
/** Tỷ lệ lỗi theo chuyền tuần này, TB 2,7% */
export const DEF = [2.4, 1.8, 2.1, 2.5, 2.4, 2.3, 1.9, 2.4, 2.3, 3.4, 2.7, 5.8, 3.1, 1.6, 3.8];
/** [bộ phận, giờ tăng ca, số người] */
export const OT: [string, number, number][] = [["Xưởng 1", 2700, 360], ["Xưởng 2", 1550, 315], ["Xưởng cắt", 480, 55], ["Hoàn thiện", 670, 110]];
/** [tên đầy đủ, nhãn ngắn, số lỗi] */
export const PARETO: [string, string, number][] = [["Đường may không đều", "Đường may", 552], ["Lệch cổ", "Lệch cổ", 370], ["Bẩn, dính dầu", "Bẩn/dầu", 255], ["Bỏ mũi, sùi chỉ", "Bỏ mũi", 228], ["Sai thông số", "Thông số", 140], ["Khác", "Khác", 185]];

export const CUSTOMERS: Record<string, string> = { N: "Nordvik Outdoor (Thụy Điển)", B: "Bellmont Apparel (Mỹ)", K: "Kazeyama Sports (Nhật)", C: "Coral Bay Clothing (Úc)", H: "Hanbit Urban (Hàn Quốc)", L: "Northline Wear (Canada)" };
/** 22 đơn: [PO, khách, số lượng, % xong, ngày giao, rủi ro] — 5 nguy cơ trễ, 17 đúng tiến độ (3 cần theo dõi) */
export const ORDERS_ALL: [string, string, number, number, string, Level][] = [
  ["PO-2602", "C", 18000, 97, "09/11", "warn"], ["PO-2604", "N", 28000, 94, "10/11", "ok"], ["PO-2605", "K", 12000, 88, "12/11", "ok"], ["PO-2607", "H", 8000, 76, "14/11", "ok"],
  ["PO-2611", "B", 14000, 46, "15/11", "bad"], ["PO-2609", "K", 16000, 81, "16/11", "warn"], ["PO-2608", "L", 20000, 72, "17/11", "ok"], ["PO-2610", "B", 22000, 70, "18/11", "ok"],
  ["PO-2614", "B", 10000, 31, "18/11", "bad"], ["PO-2617", "H", 9000, 52, "19/11", "bad"], ["PO-2620", "B", 8000, 18, "20/11", "bad"], ["PO-2612", "C", 10000, 58, "21/11", "ok"],
  ["PO-2623", "N", 15000, 44, "22/11", "warn"], ["PO-2613", "N", 32000, 55, "24/11", "ok"], ["PO-2615", "L", 12000, 24, "25/11", "bad"], ["PO-2616", "H", 6000, 50, "26/11", "ok"],
  ["PO-2618", "K", 18000, 38, "27/11", "ok"], ["PO-2624", "N", 24000, 20, "28/11", "ok"], ["PO-2619", "B", 26000, 30, "29/11", "ok"], ["PO-2622", "C", 14000, 28, "30/11", "ok"],
  ["PO-2625", "L", 16000, 15, "03/12", "ok"], ["PO-2627", "N", 10000, 5, "05/12", "ok"],
];
export const LEVEL_LABEL: Record<Level, string> = { ok: "Đúng tiến độ", warn: "Cần theo dõi", bad: "Nguy cơ trễ" };

/** Công nhân đi làm 30 ngày làm việc, hôm nay 922/980 */
export const ATT = [941, 938, 944, 936, 940, 933, 939, 942, 935, 930, 937, 934, 929, 936, 931, 927, 933, 930, 925, 931, 928, 924, 929, 926, 921, 927, 924, 919, 925, 922];
/** Nhãn 30 ngày làm việc (bỏ Chủ nhật) kết thúc 06/11/2026 */
export const ATT_DAYS = (() => {
  const out: string[] = [];
  for (const d = new Date(2026, 10, 6); out.length < 30; d.setDate(d.getDate() - 1))
    if (d.getDay()) out.unshift(`${pad(d.getDate())}/${pad(d.getMonth() + 1)}`);
  return out;
})();

/** [NPL, số ngày đủ dùng] */
export const NPL_DAYS: [string, number][] = [["Vải pique navy V-2611", 1], ["Khóa kéo 18 cm đen", 3], ["Nhãn dệt Bellmont", 3.5], ["Chỉ may 40/2 trắng", 4], ["Mex cổ áo", 4], ["Nút polo 4 lỗ", 4.5], ["Thun cạp quần", 4.5], ["Vải dù áo khoác", 6], ["Thùng carton", 8], ["Vải thun cotton", 9], ["Kaki cotton be", 12]];

export const HR_MONTHS = ["T6", "T7", "T8", "T9", "T10", "T11*"];
export const HR_IN = [52, 48, 66, 45, 50, 8];
export const HR_OUT = [36, 41, 38, 44, 58, 5];

export const REV_MONTHS = ["T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12", "T1/27", "T2/27"];
export const REV = [41.2, 43.8, 39.5, 44.6, 42.1, 40.3, 43.5, 47.8, 36.2, 31.4];
/** 6 tháng đầu là thực tế, từ T11 là dự báo */
export const REV_ACTUAL = 6;

// ---- Bảng các tab ----
/** [PO, khách, mã hàng, số lượng, % xong, ngày giao, mức] */
export const ORDER_ROWS: [string, string, string, number, number, string, Level][] = [
  ["PO-2611", "Bellmont Apparel (Mỹ)", "AO-POLO-2611", 14000, 46, "15/11", "bad"], ["PO-2614", "Bellmont Apparel (Mỹ)", "AO-POLO-2611", 10000, 31, "18/11", "bad"],
  ["PO-2620", "Bellmont Apparel (Mỹ)", "AO-THUN-2402", 8000, 18, "20/11", "bad"], ["PO-2617", "Hanbit Urban (Hàn Quốc)", "AO-KHOAC-1150", 9000, 52, "19/11", "bad"],
  ["PO-2615", "Northline Wear (Canada)", "AO-KHOAC-1150", 12000, 24, "25/11", "bad"], ["PO-2609", "Kazeyama Sports (Nhật)", "QUAN-KAKI-0932", 16000, 81, "16/11", "warn"],
  ["PO-2623", "Nordvik Outdoor (Thụy Điển)", "SOMI-NU-1210", 15000, 44, "22/11", "warn"], ["PO-2604", "Nordvik Outdoor (Thụy Điển)", "QUAN-KAKI-0932", 28000, 94, "10/11", "ok"],
];
/** [chuyền, mã hàng, kế hoạch, thực tế, ghi chú] */
export const LINE_ROWS: [string, string, number, number, string][] = [
  ["Chuyền 02", "AO-THUN-2402", 1150, 1190, ""], ["Chuyền 05", "AO-POLO-2611", 1050, 690, "Chờ hàng cắt 3,5 giờ"], ["Chuyền 09", "AO-POLO-2611", 1050, 720, "Chờ hàng cắt"],
  ["Chuyền 10", "AO-KHOAC-1150", 620, 420, "Thiếu 8 người"], ["Chuyền 13", "SOMI-NU-1210", 980, 690, "Thiếu 7 người"], ["Chuyền 12", "QUAN-KAKI-0932", 900, 820, "Lỗi 5,8%"],
];
/** [NPL, dùng cho đơn, tồn kho, đủ dùng, hàng về, đủ?] */
export const STOCK_ROWS: [string, string, string, string, string, boolean][] = [
  ["Vải pique navy · lô V-2611", "PO-2611, 2614, 2620", "2.400 m", "1 ngày", "Trễ, dự kiến 10/11", false],
  ["Khóa kéo 18 cm đen", "PO-2615", "6.400 cái", "3 ngày", "Chưa đặt đủ", false],
  ["Chỉ may 40/2 trắng", "Nhiều đơn", "420 cuộn", "4 ngày", "08/11", false],
  ["Mex cổ áo", "PO-2623", "6.000 m", "4 ngày", "10/11", false],
  ["Kaki cotton be", "PO-2604", "38.000 m", "12 ngày", "—", true],
];
/** [loại lỗi, % thanh, số lỗi, mức] */
export const TOP_DEFECTS: [string, number, number, Level | "info"][] = [["Đường may không đều", 82, 552, "bad"], ["Lệch cổ", 55, 370, "warn"], ["Bẩn, dính dầu", 38, 255, "warn"], ["Sai thông số", 21, 140, "info"]];
/** [kết quả, mức, nội dung, ngày] */
export const INSPECTIONS: [string, Level | "info", string, string][] = [
  ["Đạt", "ok", "PO-2604 · Nordvik Outdoor (Thụy Điển)", "03/11"],
  ["Không đạt", "bad", "PO-2602 · Coral Bay Clothing (Úc) · kiểm lại 08/11", "04/11"],
  ["Sắp kiểm", "info", "PO-2609 · Kazeyama Sports (Nhật)", "12/11"],
];
/** Đi làm theo bộ phận hôm nay (%) */
export const DEPT_ATT: [string, number][] = [["Xưởng 1", 96], ["Xưởng 2", 89], ["Cắt", 94], ["Hoàn thiện", 93], ["Kho NPL", 97], ["QA", 96]];

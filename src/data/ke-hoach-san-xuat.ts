// Dữ liệu giả — Quản lý kế hoạch sản xuất (port từ apps/ke-hoach-san-xuat.html)
// Ngày tính từ T2 02/11/2026 (= 0). Hôm nay 06/11 = 4.

export const CUSTOMERS = [
  "Nordvik Outdoor (Thụy Điển)",
  "Bellmont Apparel (Mỹ)",
  "Kazeyama Sports (Nhật)",
  "Coral Bay Clothing (Úc)",
  "Hanbit Urban (Hàn Quốc)",
  "Northline Wear (Canada)",
];

export const N = 182;
export const TODAY = 4;
const RATE = 25400;

export type Raw = [
  po: string,
  cust: number,
  code: string,
  qty: number,
  usd: number,
  start: number,
  days: [number, number, number],
  ship: number,
  npl: [string, number][],
  lsx: [number, number, number][],
  prog: [number, number, number],
];

// [PO, khách, mã hàng, SL, giá USD/sp, ngày bắt đầu cắt, [số ngày cắt, may, hoàn thiện], ngày xuất, NPL [[tên, ngày về]], LSX [[chuyền, SL, % đã may]], % [cắt, may, hoàn thiện]]
const RAW: Raw[] = [
  ["NV-4471",0,"AO-POLO-2611",24000,6.2,4,[3,12,3],25,[["Vải pique 220g",10],["Cúc 4 lỗ",3],["Nhãn chính",2]],[[5,6000,0],[5,6000,0],[6,6000,0],[6,6000,0]],[0,0,0]],
  ["NV-4475",0,"AO-KHOAC-1150",15000,14.5,-12,[4,16,4],25,[["Vải dù 2 lớp",-15],["Khóa kéo YKK",-10]],[[4,5000,100],[4,5000,100],[4,5000,25]],[100,75,30]],
  ["NV-4490",0,"QUAN-SHORT-0715",13200,5.8,-8,[4,13,4],22,[["Vải kaki 2 chiều",-12],["Nhãn dệt",-9]],[[13,6600,100],[13,6600,20]],[99,60,25]],
  ["NV-4512",0,"AO-POLO-2611",36000,6.2,44,[4,18,4],85,[["Vải pique 220g",40],["Cúc 4 lỗ",38]],[[5,9000,0],[5,9000,0],[6,9000,0],[6,9000,0]],[0,0,0]],
  ["BM-7720",1,"QUAN-KAKI-0932",30000,8.4,-10,[5,30,5],28,[["Vải kaki 98/2",-14],["Cúc 15mm (thiếu 8.000)",10]],[[2,7500,40],[2,7500,0],[9,7500,40],[9,7500,0]],[100,20,0]],
  ["BM-7731",1,"SOMI-NU-1210",20000,7.1,-3,[5,11,4],30,[["Vải poplin",-6],["Cúc ngọc trai",-4]],[[7,5000,30],[7,5000,0],[14,5000,30],[14,5000,0]],[88,15,0]],
  ["BM-7745",1,"AO-POLO-2611",40000,5.9,60,[5,14,4],112,[["Vải pique 220g",55],["Cúc 4 lỗ",52]],[[1,14000,0],[3,13000,0],[4,13000,0]],[0,0,0]],
  ["BM-7760",1,"QUAN-KAKI-0932",28000,8.4,120,[5,14,4],165,[["Vải kaki 98/2",112]],[[2,7000,0],[2,7000,0],[9,7000,0],[9,7000,0]],[0,0,0]],
  ["KZ-3305",2,"VAY-XOE-1105",14000,11.8,-3,[4,17,4],19,[["Vải voan",-6],["Ren trang trí",-4]],[[3,7000,34],[3,7000,0]],[92,17,0]],
  ["KZ-3312",2,"SOMI-NU-1210",13000,9.2,-1,[4,13,4],30,[["Vải lụa pha",-3]],[[8,6500,16],[8,6500,0]],[100,8,0]],
  ["KZ-3330",2,"SOMI-NU-1210",18000,9.2,35,[4,9,4],70,[["Vải lụa pha",30]],[[7,4500,0],[7,4500,0],[8,4500,0],[8,4500,0]],[0,0,0]],
  ["KZ-3341",2,"VAY-XOE-1105",12000,11.8,98,[4,13,4],135,[["Vải voan",92],["Ren trang trí",94]],[[3,6000,0],[3,6000,0]],[0,0,0]],
  ["CB-5108",3,"AO-THUN-2402",16000,3.6,-14,[4,16,3],12,[["Vải cotton 4 chiều",-18]],[[1,8000,100],[1,8000,70]],[100,85,60]],
  ["CB-5120",3,"AO-THUN-2402",22000,3.6,-4,[4,11,3],26,[["Vải cotton 4 chiều",-7]],[[10,5500,76],[10,5500,0],[12,5500,68],[12,5500,0]],[95,36,8]],
  ["CB-5133",3,"QUAN-SHORT-0715",26000,5.2,70,[5,13,4],108,[["Vải kaki 2 chiều",64]],[[10,6500,0],[10,6500,0],[12,6500,0],[12,6500,0]],[0,0,0]],
  ["CB-5150",3,"AO-THUN-2402",38000,3.4,140,[5,13,4],178,[["Vải cotton 4 chiều",133]],[[10,13000,0],[12,13000,0],[13,12000,0]],[0,0,0]],
  ["HB-6610",4,"QUAN-SHORT-0715",12000,5.0,-10,[3,12,3],10,[["Vải kaki 2 chiều",-13]],[[5,6000,100],[5,6000,80]],[100,90,55]],
  ["HB-6622",4,"AO-KHOAC-1150",16800,15.0,-6,[5,18,5],32,[["Vải dù 2 lớp",-9],["Khóa kéo YKK",-8]],[[11,8400,54],[11,8400,0]],[83,27,5]],
  ["HB-6650",4,"AO-KHOAC-1150",34000,15.0,95,[5,20,5],129,[["Vải dù 2 lớp",104],["Khóa kéo YKK",96]],[[11,8500,0],[11,8500,0],[13,8500,0],[13,8500,0]],[0,0,0]],
  ["NL-8801",5,"QUAN-KAKI-0932",13000,8.0,-11,[4,14,3],14,[["Vải kaki 98/2",-14]],[[6,6500,100],[6,6500,50]],[100,75,50]],
  ["NL-8815",5,"QUAN-KAKI-0932",20000,8.0,2,[5,20,4],45,[["Vải kaki 98/2",-1],["Cúc 15mm",1]],[[15,7000,0],[15,7000,0],[15,6000,0]],[46,0,0]],
  ["NL-8830",5,"AO-KHOAC-1150",36000,16.5,120,[6,20,5],175,[["Vải dù 2 lớp",113],["Khóa kéo YKK",115]],[[14,9000,0],[14,9000,0],[15,9000,0],[15,9000,0]],[0,0,0]],
];

export type Status = "ok" | "warn" | "late" | "plan";
export const ST: Record<Status, string> = { ok: "Đúng tiến độ", warn: "Chờ NPL", late: "Dự kiến trễ", plan: "Chưa bắt đầu" };
export const PH = ["Chờ NPL", "Cắt", "May", "Hoàn thiện"];

export type Lsx = { line: number; qty: number; pct: number; code: string };
/** Lịch có thể kéo thả: ngày bắt đầu cắt + số ngày may. */
export type Sched = { start: number; sew: number };

export type Order = {
  i: number;
  po: string;
  cust: number;
  code: string;
  qty: number;
  usd: number;
  start: number;
  days: [number, number, number];
  ship: number;
  npl: [string, number][];
  lsx: Lsx[];
  prog: [number, number, number];
  nplDay: number;
  lines: string; // "05, 06"
  done: number;
  pct: number;
  // tính lại khi đổi lịch
  w: number;
  ss: number;
  se: number;
  end: number;
  late: number;
  st: Status;
  lab: string;
};

let code = 2611;
function mkBase(r: Raw, i: number) {
  const [po, cust, c, qty, usd, start, days, ship, npl, lsx, prog] = r;
  return {
    i, po, cust, code: c, qty, usd, start, days, ship, npl, prog,
    lsx: lsx.map(([line, q, pct]) => ({ line, qty: q, pct, code: `LSX-${code++}` })),
    nplDay: Math.max(...npl.map((m) => m[1])),
    lines: [...new Set(lsx.map((l) => p2(l[0])))].join(", "),
    done: lsx.reduce((s, l) => s + (l[1] * l[2]) / 100, 0),
    // % sản xuất, gộp 3 khâu theo số ngày
    pct: Math.round(days.reduce((s, d, k) => s + d * prog[k], 0) / days.reduce((s, d) => s + d, 0)),
  };
}
const BASE = RAW.map(mkBase);

/** Thêm đơn mới vào dữ liệu gốc, trả về chỉ số đơn. */
// shortcut: ghi thẳng vào mảng module (demo không backend), tải lại trang là mất; khi nối ERP thì lưu qua API.
export function addOrder(r: Raw): number {
  BASE.push(mkBase(r, BASE.length));
  return BASE.length - 1;
}

export const INITIAL_SCHED: Sched[] = BASE.map((b) => ({ start: b.start, sew: b.days[1] }));

export function calc(i: number, s: Sched): Order {
  const b = BASE[i];
  const days: [number, number, number] = [b.days[0], s.sew, b.days[2]];
  const w = b.prog[0] ? 0 : Math.max(0, b.nplDay - s.start); // chỉ chờ NPL khi chưa cắt
  const ss = s.start + w + days[0];
  const se = ss + days[1];
  const end = se + days[2];
  const late = Math.max(0, end - b.ship);
  const st: Status = late ? "late" : w ? "warn" : s.start > TODAY ? "plan" : "ok";
  return { ...b, start: s.start, days, w, ss, se, end, late, st, lab: late ? `Trễ ${late} ngày` : ST[st] };
}

export const buildOrders = (sched: Sched[]) => sched.map((s, i) => calc(i, s));

export type Warn = { o: number; q: number; why: string; chain: string[]; acts: [string, string, string, string][] };
// acts: [ngắn gọn, phương án, kết quả, đánh đổi]
export const WARNS: Warn[] = [
  { o: 8, q: 14000, why: "Mã hàng mới, Chuyền 03 mới đạt 81% năng suất",
    chain: ["Mã hàng mới VAY-XOE-1105, công nhân chưa quen", "Chuyền 03 đạt 810/1.000 SP/ngày, 3 ngày liền", "May kéo dài 17 ngày (kế hoạch 14)", "Trễ xuất 3 ngày (21/11 → 24/11)"],
    acts: [["Thêm thợ", "Tăng cường 4 thợ lành nghề từ Chuyền 01 (xong may 07/11)", "Kịp xuất 21/11", "Chuyền 01 nhận đơn mới chậm 2 ngày"],
      ["Tăng ca", "Tăng ca Chủ nhật 08/11 và 15/11 cho Chuyền 03", "Còn trễ 1 ngày", "Chi phí tăng ca ~38 triệu đ"],
      ["Xuất từng phần", "Xuất 10.500 sp ngày 21/11, 3.500 sp ngày 24/11", "Không bị phạt phần lớn", "Cần khách đồng ý, thêm 1 lô hàng lẻ (LCL)"]] },
  { o: 4, q: 8000, why: "Thiếu 8.000 cúc 15mm, nhà cung cấp giao 12/11",
    chain: ["Cúc 15mm về trễ 12/11 (cần từ 03/11)", "Chuyền 02, 09 may được thân, chờ đính cúc", "Hoàn thiện dồn vào cuối đơn", "Trễ xuất 2 ngày (30/11 → 02/12)"],
    acts: [["Đổi thứ tự màu", "May trước màu Be (đủ cúc), dời màu Xanh than sau 12/11", "Kịp xuất 30/11", "Tổ cắt phải đổi thứ tự bàn cắt 2 ngày"],
      ["Mua cúc nội địa", "Mua 8.000 cúc của nhà cung cấp trong nước, giao 09/11", "Kịp xuất 30/11", "Giá cao hơn 35% (~6 triệu đ), cần khách duyệt mẫu cúc"],
      ["Tăng ca", "Tăng ca 2 giờ × 6 ngày cho Chuyền 02, 09", "Còn trễ 1 ngày", "Chi phí ~52 triệu đ"]] },
  { o: 0, q: 24000, why: "Vải pique 220g về trễ 6 ngày (nhà cung cấp lùi tàu)",
    chain: ["Vải pique về 12/11 (kế hoạch 06/11)", "Cắt bắt đầu muộn 6 ngày → 12/11", "May Chuyền 05, 06 dồn 12 ngày liên tục", "Trễ xuất 3 ngày (27/11 → 30/11)"],
    acts: [["Chuyển chuyền", "Chuyển 6.000 sp sang Chuyền 07 (trống từ 15/11)", "Kịp xuất 27/11", "Chuyền 07 đổi mã hàng, 3 ngày đầu năng suất ~80%"],
      ["Tăng ca", "Tăng ca 2 giờ × 10 ngày cho Chuyền 05, 06", "Kịp xuất 27/11", "Chi phí ~86 triệu đ; công nhân đã tăng ca 28 giờ/tháng"],
      ["Xuất từng phần", "Xuất 18.000 sp đúng 27/11, 6.000 sp ngày 30/11", "Phạt chỉ tính trên 6.000 sp", "Cần khách đồng ý, thêm 1 lần đặt container"]] },
  { o: 18, q: 34000, why: "Nhà cung cấp vải nghỉ Tết, vải dù về 14/02/2027",
    chain: ["Vải dù 2 lớp về 14/02 (kế hoạch cắt 05/02)", "Cắt lùi 9 ngày sau Tết", "May Chuyền 11, 13 dồn, công nhân về muộn sau Tết", "Trễ xuất 5 ngày (11/03 → 16/03)"],
    acts: [["Đặt vải sớm", "Đặt vải đi tàu trước Tết, về 28/01/2027", "Kịp xuất 11/03", "Ứng tiền vải sớm 3 tuần ~2,1 tỷ đ, tồn kho thêm 18.000 m"],
      ["Thêm chuyền", "Thêm Chuyền 14 may song song 3 tuần", "Kịp xuất 11/03", "Dời đơn NL-8830 trên Chuyền 14 lùi 5 ngày (vẫn kịp)"],
      ["Lùi ngày xuất", "Đàm phán với khách lùi ngày xuất sang 16/03", "Không bị phạt", "Khách có thể giảm đơn mùa sau"]] },
];

// Năng lực chuyền (15 chuyền: Xưởng 1 = 01–08, Xưởng 2 = 09–15)
export const WORKERS = [45, 44, 46, 43, 47, 44, 48, 45, 46, 44, 42, 45, 44, 47, 45]; // tổng 675 công nhân may
export const CAP: [number, number][] = [[1060,1040],[1040,1000],[1000,1000],[1000,980],[1080,1060],[1040,1020],[1100,1080],[1060,1040],[1070,1050],[1040,1020],[1000,980],[1060,1040],[1040,1020],[1090,1060],[1050,0]];
// Tiến độ hằng ngày: [chuyền, kế hoạch, thực tế]
export const DAILY: [number, number, number][] = [[1,1040,1052],[2,1000,760],[3,1000,810],[4,980,962],[5,1060,1041],[6,1020,998],[7,1080,1096],[8,1040,1003],[9,1050,1012],[10,1020,1034],[11,980,941],[12,1040,1031],[13,1020,978],[14,1060,1048]];
export const HOURLY: [string, number, number | null][] = [["7–8 giờ", 90, 112], ["8–9 giờ", 79, 99], ["9–10 giờ", 71, 89], ["10–11 giờ", 20, null]];

export type Note = { who: string; avatar: string; text: string; meta: string };
export const NOTES: Note[] = [
  { who: "Tổ cắt", avatar: "C", text: "Đổi thứ tự cắt PO BM-7731 lên trước PO KZ-3312", meta: "05/11 16:20 · Đã xem" },
  { who: "Kho", avatar: "K", text: "Cấp vải PO KZ-3305 sớm 1 ngày (05/11)", meta: "04/11 16:20 · Đã xem" },
];

// ---------- helpers ----------
export function p2(n: number) {
  return String(n).padStart(2, "0");
}
export const f = (n: number) => Math.round(n).toLocaleString("vi-VN");
export const ty = (usd: number) => `${((usd * RATE) / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ đ`;
export const dt = (d: number, y?: boolean) => {
  const x = new Date(2026, 10, 2 + d);
  return `${p2(x.getDate())}/${p2(x.getMonth() + 1)}${y ? `/${x.getFullYear()}` : ""}`;
};
export const ln = (n: number) => `Chuyền ${p2(n)}`;
export const verdict = (o: Order) =>
  (o.late ? `Trễ ${o.late} ngày (xuất ${dt(o.ship)})` : "Kịp xuất") + (o.w ? ` · ⚠ chờ NPL ${o.w} ngày (về ${dt(o.nplDay)})` : "");

/** Các đoạn [khâu, ngày bắt đầu, số ngày, %] — khâu 0 = chờ NPL. */
export function segs(o: Order): [number, number, number, number][] {
  const s: [number, number, number, number][] = [];
  let x = o.start;
  if (o.w) { s.push([0, x, o.w, 100]); x += o.w; }
  o.days.forEach((d, k) => { s.push([k + 1, x, d, o.prog[k]]); x += d; });
  return s;
}

export const onLine = (orders: Order[], n: number) => orders.filter((o) => o.lsx.some((l) => l.line === n));
export const curOnLine = (orders: Order[], n: number) => onLine(orders, n).filter((o) => o.ss <= TODAY && o.se > TODAY);

// ---------- Nhận đơn mới: có kịp không? ----------
export type NewSpec = { cust: number; code: string; qty: number; ship: number; npl: number };
export type Shift = { i: number; d: number; line: number };
export type Fit = {
  lines: number[];
  start: number; // ngày bắt đầu cắt
  cut: number;
  ss: number; // may từ
  se: number; // may đến (không gồm)
  end: number; // xong hoàn thiện (không gồm)
  late: number;
  free: number[]; // ngày rảnh sớm nhất của từng chuyền (sau khi cắt xong)
  shifts: Shift[]; // đơn khác phải lùi
  capDay: number; // SP/ngày của các chuyền được chọn
};
export const FIN = 3;

/** Xếp thử đơn mới vào `nLines` chuyền tốt nhất, dựa trên lịch chuyền hiện có. `boost` = hệ số tăng ca. */
export function fitNew(orders: Order[], spec: NewSpec, nLines = 2, boost = 1): Fit {
  const start0 = Math.max(TODAY + 1, spec.npl);
  const cut = Math.max(3, Math.ceil(spec.qty / 6000));
  const c0 = start0 + cut;
  const free = CAP.map((_, k) => {
    let F = c0;
    for (const o of onLine(orders, k + 1).sort((a, b) => a.ss - b.ss)) if (o.ss <= F && o.se > F) F = o.se;
    return F;
  });
  // chuyền chưa may mã hàng này: 3 tuần đầu chỉ đạt ~85% năng suất
  const rate = (n: number) => CAP[n - 1][0] * boost * (onLine(orders, n).some((o) => o.code === spec.code) ? 1 : 0.85);
  const bumped = (n: number, e: number) => onLine(orders, n).filter((o) => o.ss >= free[n - 1] && o.ss < e);
  const score = (k: number) => {
    const e = free[k] + Math.ceil(spec.qty / nLines / rate(k + 1));
    return e + bumped(k + 1, e).reduce((s, o) => s + e - o.ss, 0) * 0.2;
  };
  const lines = CAP.map((_, k) => k)
    .sort((a, b) => score(a) - score(b) || a - b)
    .slice(0, nLines)
    .map((k) => k + 1)
    .sort((a, b) => a - b);
  const capDay = lines.reduce((s, n) => s + rate(n), 0);
  const ss = Math.max(...lines.map((n) => free[n - 1]));
  const se = ss + Math.ceil(spec.qty / capDay);
  const end = se + FIN;
  const m = new Map<number, Shift>();
  for (const n of lines)
    for (const o of bumped(n, se)) if ((m.get(o.i)?.d ?? 0) < se - o.ss) m.set(o.i, { i: o.i, d: se - o.ss, line: n });
  return { lines, start: ss - cut, cut, ss, se, end, late: Math.max(0, end - spec.ship), free, shifts: [...m.values()], capDay };
}

/** Bản ghi Raw để đưa đơn mới vào kế hoạch. */
export function newRaw(orders: Order[], spec: NewSpec, fit: Fit): Raw {
  const pre = orders.find((o) => o.cust === spec.cust)?.po.slice(0, 2) ?? "XX";
  const no = Math.max(0, ...orders.filter((o) => o.po.startsWith(pre)).map((o) => +o.po.slice(3))) + 10;
  const share = Math.floor(spec.qty / fit.lines.length / 100) * 100;
  const lsx = fit.lines.map((n, k): [number, number, number] => [n, k === fit.lines.length - 1 ? spec.qty - share * k : share, 0]);
  const usd = orders.find((o) => o.code === spec.code)?.usd ?? 7.5;
  return [`${pre}-${no}`, spec.cust, spec.code, spec.qty, usd, fit.start, [fit.cut, fit.se - fit.ss, FIN], spec.ship, [["Vải chính", spec.npl]], lsx, [0, 0, 0]];
}

// tự kiểm (giống bản HTML)
{
  const os = buildOrders(INITIAL_SCHED);
  console.assert(os.filter((o) => o.late).length === WARNS.length && WARNS.every((w) => os[w.o].late > 0), "cảnh báo khớp đơn trễ");
  console.assert(os.length === 22 && os.reduce((s, o) => s + o.lsx.length, 0) === 68, "22 đơn · 68 LSX");
  console.assert(os.every((o) => o.lsx.reduce((s, l) => s + l.qty, 0) === o.qty), "LSX cộng đúng SL đơn");
  const m = calc(0, { start: 12, sew: 12 }); // NV-4471 dời cắt sang 14/11: hết chờ NPL, trễ 5 ngày
  console.assert(m.w === 0 && m.end === 30 && m.late === 5 && m.st === "late", "kéo thả tính lại ngày xong & trễ");
  console.assert(WORKERS.filter((_, i) => curOnLine(os, i + 1).length).length === 14, "14 chuyền đang may");
  const ok = fitNew(os, { cust: 4, code: "AO-KHOAC-1150", qty: 20000, ship: 43, npl: 23 });
  const bad = fitNew(os, { cust: 1, code: "SOMI-NU-1210", qty: 60000, ship: 43, npl: 23 });
  const demo = fitNew(os, { cust: 2, code: "SOMI-NU-1210", qty: 30000, ship: 46, npl: 23 }); // mặc định màn Nhận đơn mới
  console.assert(demo.late === 0 && demo.lines.join() === "7,14" && demo.shifts.length === 1 && os[demo.shifts[0].i].po === "KZ-3330", "đơn mẫu: kịp, dời KZ-3330");
  console.assert(ok.late === 0 && bad.late > 0 && ok.lines.join() === "4,11" && ok.end === 40, "đơn mới: SL lớn hơn thì trễ");
}

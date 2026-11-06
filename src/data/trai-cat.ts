// Dữ liệu giả cho app Quản lý trải – cắt (port từ demo-det-may/apps/trai-cat.html).

export const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
export const DB = 0.06; // 2 đầu bàn cộng thêm mỗi lớp (m)
export const DM = 1.02; // định mức vải = lớp × dài sơ đồ × 1,02
const TEM = [148, 152, 145, 160, 138, 154, 146, 142, 150, 156]; // mét trên tem, cuộn ~150 m

export type Tone = "ok" | "info" | "gray" | "warn" | "bad";

export type OrderColor = { mau: string; sl: number; truoc: number; done: number };
export type Order = {
  po: string; kh: string; ma: string; giao: string; ch: string; hh: number;
  sz: string[]; pct: number[]; r: number[];
  /** [tên sơ đồ, dài (m), khổ (cm), hiệu suất %] */
  sd: [string, number, number, number];
  c: OrderColor[];
  R: number; cells: number[][]; qty: number; can: number; da: number;
};
export type Roll = {
  k: number; tem: number; m: number; n: number; rem: number;
  ps: boolean; ma: string; lot: string; kind: "dang" | "tra" | "dt";
};
export type Lay = {
  id: string; lc: CutOrder; o: Order; mau: string; kh: number; tt: number; ng: string; bd: string; kt: string;
  s: number; DL: number; rolls: Roll[];
  dai: number; dauban: number; dt: number; tra: number; tieu: number; dm: number; ch: number; hh: number;
  st: [string, Tone];
};
export type CutOrder = { id: string; o: number; O: Order; ban: string; DL: number; lays: Lay[] };
export type RollRow = Roll & { y: Lay };

type RawOrder = Omit<Order, "R" | "cells" | "qty" | "can" | "da" | "c"> & { c: [string, number, number][] };
// sd = [tên sơ đồ, dài, khổ, hiệu suất], r = tỉ lệ size trên sơ đồ, c = [màu, SL đặt, lớp đã cắt trước hôm nay]
const RAW_O: RawOrder[] = [
  { po: "BM-7731", kh: "Bellmont Apparel (Mỹ)", ma: "SOMI-NU-1210", giao: "02/12/2026", ch: "Chuyền 07", hh: 2, sz: ["S", "M", "L", "XL"], pct: [17, 33, 33, 17], r: [2, 4, 4, 2], sd: ["SN1210-B12", 13.85, 145, 83.5], c: [["Xanh nhạt", 12000, 820], ["Trắng", 8000, 470]] },
  { po: "KZ-3305", kh: "Kazeyama Sports (Nhật)", ma: "VAY-XOE-1105", giao: "21/11/2026", ch: "Chuyền 03", hh: 3, sz: ["S", "M", "L"], pct: [25, 50, 25], r: [2, 4, 2], sd: ["VX1105-K8", 14.2, 150, 79.6], c: [["Đỏ đô", 8000, 880], ["Xanh rêu", 6000, 640]] },
  { po: "CB-5120", kh: "Coral Bay Clothing (Úc)", ma: "AO-THUN-2402", giao: "28/11/2026", ch: "Chuyền 10", hh: 1.5, sz: ["S", "M", "L", "XL", "XXL"], pct: [8, 25, 25, 25, 17], r: [1, 3, 3, 3, 2], sd: ["AT2402-C12", 12.36, 180, 88.2], c: [["Đen", 12000, 800], ["Trắng", 10000, 640]] },
  { po: "NL-8815", kh: "Northline Wear (Canada)", ma: "QUAN-KAKI-0932", giao: "17/12/2026", ch: "Chuyền 15", hh: 2.5, sz: ["30", "31", "32", "33", "34"], pct: [17, 17, 33, 17, 16], r: [2, 2, 4, 2, 2], sd: ["QK0932-N12", 15.6, 150, 84.1], c: [["Be", 12000, 420], ["Đen", 8000, 280]] },
  { po: "HB-6622", kh: "Hanbit Urban (Hàn Quốc)", ma: "AO-KHOAC-1150", giao: "04/12/2026", ch: "Chuyền 11", hh: 2.5, sz: ["M", "L", "XL"], pct: [25, 50, 25], r: [2, 4, 2], sd: ["AK1150-H8", 16.8, 150, 81.2], c: [["Xám", 10800, 1100], ["Đen", 6000, 600]] },
  { po: "NV-4490", kh: "Nordvik Outdoor (Thụy Điển)", ma: "QUAN-SHORT-0715", giao: "24/11/2026", ch: "Chuyền 13", hh: 2, sz: ["28", "30", "32", "34", "36"], pct: [17, 17, 33, 17, 16], r: [2, 2, 4, 2, 2], sd: ["QS0715-N12", 11.4, 150, 85.6], c: [["Xanh navy", 7200, 545], ["Kaki", 6000, 480]] },
];
// Lệnh cắt hôm nay: lays = [màu, lớp KH, lớp TT, người trải, bắt đầu, kết thúc]
const RAW_L: { id: string; o: number; ban: string; lays: [string, number, number, string, string, string][] }[] = [
  { id: "LC-6061", o: 0, ban: "Bàn 03", lays: [["Xanh nhạt", 80, 80, "Trần Văn Phúc", "06:35", "09:20"], ["Trắng", 90, 34, "Trần Văn Phúc", "09:35", ""]] },
  { id: "LC-6062", o: 0, ban: "Bàn 04", lays: [["Xanh nhạt", 90, 90, "Phạm Thị Duyên", "06:40", "09:50"], ["Trắng", 90, 0, "Phạm Thị Duyên", "", ""]] },
  { id: "LC-6063", o: 1, ban: "Bàn 01", lays: [["Đỏ đô", 100, 100, "Nguyễn Văn Tâm", "06:30", "09:40"], ["Xanh rêu", 100, 40, "Nguyễn Văn Tâm", "09:55", ""]] },
  { id: "LC-6064", o: 2, ban: "Bàn 05", lays: [["Đen", 100, 100, "Võ Văn Lực", "06:30", "09:05"], ["Trắng", 100, 52, "Võ Văn Lực", "09:20", ""]] },
  { id: "LC-6065", o: 2, ban: "Bàn 08", lays: [["Đen", 100, 100, "Bùi Văn Quang", "06:30", "08:50"], ["Trắng", 100, 70, "Bùi Văn Quang", "09:00", ""]] },
  { id: "LC-6066", o: 3, ban: "Bàn 06", lays: [["Be", 90, 90, "Ngô Thị Lan", "06:45", "09:45"], ["Đen", 90, 0, "Ngô Thị Lan", "", ""]] },
  { id: "LC-6067", o: 4, ban: "Bàn 07", lays: [["Xám", 80, 80, "Lê Thị Hạnh", "06:50", "09:35"], ["Đen", 80, 0, "Lê Thị Hạnh", "", ""]] },
  { id: "LC-6068", o: 5, ban: "Bàn 02", lays: [["Xanh navy", 80, 80, "Lê Văn Bình", "06:40", "09:10"], ["Kaki", 80, 28, "Lê Văn Bình", "09:25", ""]] },
];

// ---------- tính toán ----------
export const O: Order[] = RAW_O.map((o) => ({
  ...o,
  c: o.c.map(([mau, sl, truoc]) => ({ mau, sl, truoc, done: 0 })),
  R: sum(o.r),
  cells: o.c.map((c) => o.pct.map((p) => Math.round((c[1] * p) / 100))),
  qty: 0, can: 0, da: 0,
}));

export const LAYS: Lay[] = [];

function mkRolls(y: { s: number; DL: number; kh: number; tt: number }): Roll[] {
  const { s, DL } = y;
  // trải lần lượt từng cuộn theo mét đo thực đến đủ số lớp
  const out: Omit<Roll, "ps" | "ma" | "lot" | "kind">[] = [];
  let left = y.tt, k = 0;
  while (left > 0) {
    const tem = TEM[(s * 3 + k) % 10];
    const m = +(tem - ((s + k) % 4) * 0.5 - (k === 1 && s % 2 === 0 ? 6 : 0)).toFixed(1);
    const c = Math.min(Math.floor((m - 0.2) / DL), left);
    out.push({ k, tem, m, n: c, rem: +(m - c * DL).toFixed(2) });
    left -= c; k++;
  }
  const nPlan = Math.ceil((y.kh * DL) / 150); // kho cấp số cuộn theo mét cần ÷ 150 m/cuộn
  return out.map((x, i) => {
    const ps = i >= nPlan;
    return {
      ...x, ps, ma: "CV-" + (58800 + s * 37 + x.k),
      lot: ps ? "Lô 0" + (60 + (s % 3)) + " · gần chuẩn" : "Lô 0" + (23 + (s % 5)) + " · chuẩn",
      kind: y.tt < y.kh && i === out.length - 1 ? "dang" : x.rem >= 8 ? "tra" : "dt",
    };
  });
}

export const L: CutOrder[] = RAW_L.map((raw) => {
  const o = O[raw.o];
  const lc: CutOrder = { id: raw.id, o: raw.o, O: o, ban: raw.ban, DL: +(o.sd[1] + DB).toFixed(2), lays: [] };
  lc.lays = raw.lays.map((a, j) => {
    const base = { s: LAYS.length, DL: lc.DL, kh: a[1], tt: a[2] };
    const rolls = mkRolls(base);
    const dai = base.tt * base.DL, dauban = base.tt * DB;
    const dt = sum(rolls.filter((x) => x.kind === "dt").map((x) => x.rem));
    const tra = sum(rolls.filter((x) => x.kind === "tra").map((x) => x.rem));
    const tieu = dai + dt, dm = base.tt * o.sd[1] * DM;
    const y: Lay = {
      ...base, id: lc.id + "/" + (j + 1), lc, o, mau: a[0], ng: a[3], bd: a[4], kt: a[5], rolls,
      dai, dauban, dt, tra, tieu, dm, ch: tieu - dm, hh: base.tt ? ((dt + dauban) / tieu) * 100 : 0,
      st: base.tt >= base.kh ? ["Đã xong", "ok"] : base.tt > 0 ? ["Đang trải", "info"] : ["Chờ trải", "gray"],
    };
    LAYS.push(y);
    return y;
  });
  return lc;
});

// lớp đã cắt theo màu = trước hôm nay + lớp thực tế hôm nay
O.forEach((o) => o.c.forEach((c) => { c.done = c.truoc + sum(LAYS.filter((y) => y.o === o && y.mau === c.mau).map((y) => y.tt)); }));
export const need = (o: Order, q: number) => Math.ceil(q * (1 + o.hh / 100));
O.forEach((o) => {
  o.qty = sum(o.cells.flat());
  o.can = sum(o.cells.map((r) => sum(r.map((q) => need(o, q)))));
  o.da = sum(o.c.map((c, ci) => sum(o.r.map((r, si) => Math.min(c.done * r, need(o, o.cells[ci][si]))))));
});

export const ROLLS: RollRow[] = LAYS.flatMap((y) => y.rolls.map((x) => ({ ...x, y })));
export const FIN = LAYS.filter((y) => y.st[0] === "Đã xong");
export const lcSp = (lc: CutOrder) => sum(lc.lays.map((y) => y.kh * lc.O.R));
export const lcM = (lc: CutOrder) => sum(lc.lays.map((y) => y.kh * lc.DL));
export const hhO = (o: Order) => {
  const ys = LAYS.filter((y) => y.o === o && y.tt);
  const g = (k: "tt" | "dai" | "dauban" | "dt" | "tra" | "tieu" | "dm" | "ch") => sum(ys.map((y) => y[k]));
  return { ys, g, hh: ys.length ? ((g("dt") + g("dauban")) / g("tieu")) * 100 : null };
};
/** Số lớp cần của 1 màu = max theo size (SL cần cắt ÷ sp size đó/lớp) */
export const layNeed = (o: Order, ci: number) => Math.max(...o.cells[ci].map((q, si) => Math.ceil(need(o, q) / o.r[si])));
/** Số bó của 1 phiếu trải xong: mỗi xấp chia tối đa 30 lớp/bó */
export const boCount = (y: Lay) => y.o.R * Math.ceil(y.tt / 30);

// [tổ trưởng, phiếu xong, lớp trải, lớp/giờ, % mục tiêu, hao hụt %] — tuần 45
export const BAN: [string, number, number, number, number, number][] = [
  ["Nguyễn Văn Tâm", 9, 820, 24, 96, 1.9], ["Lê Văn Bình", 8, 760, 22, 88, 2.3], ["Trần Văn Phúc", 9, 830, 25, 104, 1.6], ["Phạm Thị Duyên", 8, 740, 22, 86, 2.1],
  ["Võ Văn Lực", 10, 900, 27, 112, 1.5], ["Ngô Thị Lan", 8, 770, 23, 92, 1.8], ["Lê Thị Hạnh", 8, 720, 21, 84, 2.4], ["Máy cắt tự động", 11, 960, 30, 120, 1.3],
];
export const BSP = [8, 12, 12, 12, 12, 12, 8, 12]; // sp/lớp của sơ đồ chạy nhiều nhất tại bàn (khớp lệnh cắt hôm nay)
export const banName = (i: number) => "Bàn " + String(i + 1).padStart(2, "0");

// ---------- kiểm tra nhất quán (giữ từ bản HTML) ----------
console.assert(LAYS.every((y) => sum(y.rolls.map((x) => x.n)) === y.tt), "lớp cuộn ≠ lớp phiếu");
console.assert(LAYS.every((y) => Math.abs(sum(y.rolls.map((x) => x.m - x.rem)) - y.dai) < 0.01), "mét dùng ≠ lớp × dài lớp");
console.assert(BAN.length === 8 && L.every((lc) => BSP[+lc.ban.slice(4) - 1] === lc.O.R), "8 bàn, sp/lớp khớp lệnh cắt");
console.assert(O.every((o) => /^Chuyền (0[1-9]|1[0-5])$/.test(o.ch) && o.c.every((c, ci) => c.done <= layNeed(o, ci))), "Chuyền 01–15, không cắt vượt số lớp cần");
console.assert(
  sum(O.map((o) => LAYS.filter((y) => y.o === o).length)) === LAYS.length && sum(O.map((o) => ROLLS.filter((x) => x.y.o === o).length)) === ROLLS.length,
  "Liên quan không khớp tổng",
);

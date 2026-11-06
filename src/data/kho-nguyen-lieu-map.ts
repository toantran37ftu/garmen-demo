// Sơ đồ kho + phiếu soạn hàng — dữ liệu giả, sinh có seed, tổng khớp ZONES (3.400 cuộn · 650.000 m)
import { seeded } from "@/lib/format";
import { TRIMS, ZONES } from "./kho-nguyen-lieu";

export type Mat = { fabric: string; item: string; prefix: string; color: string; order: string | null };
export type CellKind = "fabric" | "check" | "trim";
export type Cell = {
  id: string; rack: string; bay: number; kind: CellKind;
  /** vải: số cuộn · phụ liệu: số lô */
  rolls: number; meters: number; cap: number;
  mat: Mat; lot: string; age: number; defect: boolean;
};

export const ORDERS = [
  { id: "DH-2611", lsx: "LSX-1251", label: "DH-2611 · Nordvik Outdoor · AO-POLO-2611" },
  { id: "DH-2614", lsx: "LSX-1252", label: "DH-2614 · Bellmont Apparel · QUAN-KAKI-0932" },
  { id: "DH-2618", lsx: "LSX-1258", label: "DH-2618 · Kazeyama Sports · VAY-XOE-1105" },
  { id: "DH-2622", lsx: "LSX-1249", label: "DH-2622 · Hanbit Urban · AO-THUN-2402" },
  { id: "DH-2625", lsx: "LSX-1261", label: "DH-2625 · AO-KHOAC-1150" },
  { id: "DH-2610", lsx: "LSX-1238", label: "DH-2610 · Coral Bay Clothing · AO-THUN-2402" },
];
export const lsxOf = (order: string | null) => ORDERS.find((o) => o.id === order)?.lsx ?? "";

const F = {
  PQ: { fabric: "V-PQ220", item: "Cotton pique 220g", prefix: "PQ" },
  TC: { fabric: "V-TC180", item: "Thun cotton 4 chiều", prefix: "TC" },
  KK: { fabric: "V-KK21", item: "Kaki thun 2/1", prefix: "KK" },
  KR: { fabric: "V-KK30", item: "Kaki 3/1", prefix: "KK" },
  JN: { fabric: "V-JN12", item: "Jean 12oz", prefix: "JN" },
  TL: { fabric: "V-TL170", item: "Thun lạnh", prefix: "TL" },
  VO: { fabric: "V-VO75", item: "Voan", prefix: "VO" },
  LT: { fabric: "V-LT60", item: "Lót taffeta", prefix: "LT" },
};
const m = (f: keyof typeof F, color: string, order: string | null = null): Mat => ({ ...F[f], color, order });

export const FABRICS = Object.values(F).map((f) => `${f.fabric} · ${f.item}`);

/** Dãy kệ vải: số ô, khu trong ZONES, mặt hàng xếp theo cụm 4 ô */
const RACKS = [
  { rack: "A", bays: 40, zone: 0, mats: [m("PQ", "Navy", "DH-2611"), m("PQ", "Trắng", "DH-2610"), m("PQ", "Đỏ tươi"), m("TC", "Trắng", "DH-2610"), m("PQ", "Xám melange", "DH-2611")] },
  { rack: "B", bays: 32, zone: 1, mats: [m("KK", "Be", "DH-2614"), m("KK", "Đen", "DH-2625"), m("JN", "Xanh đậm"), m("KK", "Be", "DH-2614")] },
  { rack: "C", bays: 24, zone: 2, mats: [m("TL", "Đen", "DH-2622"), m("TL", "Trắng", "DH-2610"), m("VO", "Đỏ đô", "DH-2618"), m("LT", "Đen", "DH-2625")] },
  { rack: "D", bays: 16, zone: 0, mats: [m("TC", "Đen", "DH-2610"), m("PQ", "Navy", "DH-2611"), m("TC", "Trắng")] },
  { rack: "E", bays: 12, zone: 1, mats: [m("KK", "Đen", "DH-2625"), m("JN", "Xanh đậm")] },
  { rack: "F", bays: 12, zone: 2, mats: [m("LT", "Be", "DH-2614"), m("LT", "Đen", "DH-2625"), m("VO", "Đỏ đô", "DH-2618")] },
];
export const FAB_RACKS = RACKS.map((r) => r.rack);
export const CAP = 30; // 5 tầng × 6 cuộn
export const PER_TIER = 6;

type Fix = Partial<Omit<Cell, "mat">> & { mat: Mat };
/** Ô có số liệu thật trong các màn khác (tồn kho, xuất kho, tồn đọng) */
const FIX: Record<string, Fix> = {
  A12: { mat: m("PQ", "Navy", "DH-2611"), rolls: 2, lot: "DL-4402", age: 9 },
  A13: { mat: m("PQ", "Navy", "DH-2611"), rolls: 5, lot: "DL-4402", age: 9 },
  A14: { mat: m("PQ", "Trắng"), rolls: 6, lot: "DL-4390", age: 22 },
  A37: { mat: m("PQ", "Xanh ngọc"), rolls: 16, meters: 1920, lot: "DL-4105", age: 108 },
  A38: { mat: m("PQ", "Xanh ngọc"), rolls: 15, meters: 1800, lot: "DL-4105", age: 108 },
  B04: { mat: m("KK", "Be", "DH-2614"), rolls: 3, lot: "DL-8794", age: 16 },
  B07: { mat: m("KK", "Be", "DH-2614"), rolls: 11, lot: "DL-8820", age: 0 },
  B08: { mat: m("KK", "Be", "DH-2614"), rolls: 11, lot: "DL-8820", age: 0 },
  B09: { mat: m("KK", "Be", "DH-2614"), rolls: 10, lot: "DL-8820", age: 0 },
  B28: { mat: m("KR", "Rêu"), rolls: 19, meters: 1860, lot: "DL-8611", age: 126 },
  C03: { mat: m("TL", "Đen", "DH-2622"), rolls: 18, lot: "DL-5530", age: 1 },
  C04: { mat: m("TL", "Đen", "DH-2622"), rolls: 18, lot: "DL-5530", age: 1 },
  C05: { mat: m("TL", "Đen", "DH-2622"), rolls: 18, lot: "DL-5530", age: 1 },
  C06: { mat: m("TL", "Đen", "DH-2622"), rolls: 18, lot: "DL-5530", age: 1 },
  C18: { mat: m("TL", "Xám chì"), rolls: 21, meters: 1620, lot: "DL-5102", age: 214 },
  C19: { mat: m("TL", "Xám chì"), rolls: 21, meters: 1620, lot: "DL-5102", age: 214 },
  C21: { mat: m("VO", "Đỏ đô"), rolls: 8, lot: "DL-3011", age: 180 },
  // Khu kiểm vải (sàn K1–K6)
  K1: { mat: m("KK", "Đen", "DH-2625"), rolls: 30, lot: "DL-8841", age: 1 },
  K2: { mat: m("PQ", "Navy", "DH-2611"), rolls: 40, meters: 4752, lot: "DL-4471", age: 0 },
  K3: { mat: m("TL", "Trắng", "DH-2610"), rolls: 28, lot: "DL-5541", age: 1 },
  K4: { mat: m("JN", "Xanh đậm"), rolls: 22, lot: "DL-7210", age: 2 },
  K5: { mat: m("VO", "Đỏ đô", "DH-2618"), rolls: 20, meters: 1784, lot: "DL-3105", age: 0, defect: true },
  K6: { mat: m("LT", "Đen", "DH-2625"), rolls: 20, lot: "DL-6120", age: 1 },
};

const pad = (n: number) => String(n).padStart(2, "0");
const rnd = seeded(2611);
const num = (s: string) => Number(s.replace(/\D/g, ""));

/** Chia `total` cho các ô chưa cố định: khởi tạo ngẫu nhiên rồi ±1 đến khi khớp đúng tổng. */
function spread(cells: Cell[], total: number) {
  const free = cells.filter((c) => !FIX[c.id]?.rolls);
  let diff = total - cells.reduce((s, c) => s + c.rolls, 0);
  for (let i = 0, guard = 0; diff !== 0 && guard < 1e6; i++, guard++) {
    const c = free[i % free.length];
    const step = Math.sign(diff);
    // ô trống chỉ được lấp khi đã đi hết một vòng mà chưa đủ
    if (step > 0 ? c.rolls < c.cap && (c.rolls > 0 || guard > free.length * 40) : c.rolls > 1) {
      c.rolls += step;
      diff -= step;
    }
  }
}
function spreadMeters(cells: Cell[], total: number) {
  const fixed = cells.filter((c) => FIX[c.id]?.meters);
  const rest = cells.filter((c) => !FIX[c.id]?.meters);
  const left = total - fixed.reduce((s, c) => s + c.meters, 0);
  const restRolls = rest.reduce((s, c) => s + c.rolls, 0);
  for (const c of rest) c.meters = Math.round((c.rolls * left) / restRolls);
  const big = rest.reduce((a, b) => (b.rolls > a.rolls ? b : a));
  big.meters += left - rest.reduce((s, c) => s + c.meters, 0);
}

function make(id: string, rack: string, bay: number, kind: CellKind, cap: number, mat: Mat): Cell {
  const fix = FIX[id];
  const p = rnd();
  const rolls = fix?.rolls ?? (p < 0.05 ? 0 : Math.round(cap * (p < 0.2 ? 0.15 + rnd() * 0.3 : 0.8 + rnd() * 0.2)));
  return {
    id, rack, bay, kind, cap, rolls, meters: fix?.meters ?? 0,
    mat: fix?.mat ?? { ...mat, order: rnd() < 0.25 ? null : mat.order },
    lot: fix?.lot ?? `DL-${4000 + Math.floor(rnd() * 5000)}`,
    age: fix?.age ?? 2 + Math.floor(rnd() * 80),
    defect: !!fix?.defect,
  };
}

const fabric: Cell[] = [];
ZONES.slice(0, 3).forEach((z, zi) => {
  const zc: Cell[] = [];
  for (const r of RACKS.filter((x) => x.zone === zi))
    for (let b = 1; b <= r.bays; b++) zc.push(make(`${r.rack}${pad(b)}`, r.rack, b, "fabric", CAP, r.mats[Math.floor((b - 1) / 4) % r.mats.length]));
  spread(zc, z.rolls ?? 0);
  spreadMeters(zc, num(z.meters));
  fabric.push(...zc);
});
fabric.sort((a, b) => FAB_RACKS.indexOf(a.rack) - FAB_RACKS.indexOf(b.rack) || a.bay - b.bay);

const check = [1, 2, 3, 4, 5, 6].map((k) => make(`K${k}`, "K", k, "check", 45, FIX[`K${k}`].mat));
spreadMeters(check, num(ZONES[3].meters));

/** Phụ liệu: kệ P1–P4 × 12 ô, đơn vị là lô (3.020 lô) */
const TRIM_POOL: Record<string, string[]> = {
  P1: ["Cúc nhựa 18mm · Đen", "Khóa kéo 20cm · Đen", "Cúc dập 4 chi tiết"],
  P2: ["Chỉ may 40/2 · Đen", "Chỉ vắt sổ 60/3 · Trắng"],
  P3: ["Nhãn size · Bellmont", "Nhãn giặt · Hanbit Urban"],
  P4: ["Túi PE 30×40", "Băng keo 5cm"],
};
/** Ô phụ liệu → mã trong TRIMS (màn Tồn kho) */
export const TRIM_AT: Record<string, { code: string; order: string | null }> = {
  "P1-03": { code: "PL-CUC-0154", order: "DH-2611" },
  "P1-04": { code: "PL-CUC-0158", order: "DH-2614" },
  "P1-08": { code: "PL-KHO-0318", order: "DH-2614" },
  "P2-03": { code: "PL-CHI-0402", order: null },
  "P3-01": { code: "PL-NHA-1021", order: "DH-2611" },
  "P4-02": { code: "PL-BB-0005", order: "DH-2610" },
};
const TRIM_STALE: Record<string, [string, number]> = { "P1-11": ["Cúc kim loại 17mm", 180], "P3-06": ["Nhãn chính · Hanbit Urban (mẫu cũ)", 98] };
const trim: Cell[] = [];
for (const rack of ["P1", "P2", "P3", "P4"])
  for (let b = 1; b <= 12; b++) {
    const id = `${rack}-${pad(b)}`;
    const t = TRIMS.find((x) => x.code === TRIM_AT[id]?.code);
    const pool = TRIM_POOL[rack];
    const c = make(id, rack, b, "trim", 85, {
      fabric: t?.code ?? "", item: t?.name ?? TRIM_STALE[id]?.[0] ?? pool[b % pool.length], prefix: "", color: "",
      order: TRIM_AT[id] ? TRIM_AT[id].order : ORDERS[b % ORDERS.length].id,
    });
    if (TRIM_STALE[id]) c.age = TRIM_STALE[id][1];
    trim.push(c);
  }
spread(trim, 3020);

export const CELLS: Cell[] = [...fabric, ...check, ...trim];
export const cellById = (id: string) => CELLS.find((c) => c.id === id);
export const isStale = (c: Cell) => c.age > 90 && c.rolls > 0;

const FAB = [...fabric, ...check];
export const TOTAL = { rolls: FAB.reduce((s, c) => s + c.rolls, 0), meters: FAB.reduce((s, c) => s + c.meters, 0) };

/** Luồng hàng hôm nay 06/11 (khớp phiếu nhập / xuất) */
export const MOVES: { from: string; to: string; label: string; kind: "in" | "out" }[] = [
  { from: "nhan", to: "K2", label: "PN-11062 · Pique Navy → khu kiểm K2", kind: "in" },
  { from: "nhan", to: "K5", label: "PN-11059 · Voan Đỏ đô → K5 (lỗi)", kind: "in" },
  { from: "K1", to: "B08", label: "PN-11061 · Kaki Be → B07–B09", kind: "in" },
  { from: "nhan", to: "P1-04", label: "PN-11060 · Cúc Be → P1-04", kind: "in" },
  { from: "A13", to: "xuat", label: "PX-21184 · Pique Navy → Bàn cắt 03", kind: "out" },
  { from: "B07", to: "xuat", label: "PX-21187 · Kaki Be → Bàn cắt 07", kind: "out" },
  { from: "P1-03", to: "xuat", label: "PX-21185 · Cúc Navy → Chuyền 05", kind: "out" },
];

/** Danh sách cuộn của 1 ô (vải) */
const TODAY = new Date(2026, 10, 6);
export type RollRow = { id: string; tier: number; color: string; lot: string; meters: number; order: string | null };
export function rollsOf(c: Cell): RollRow[] {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - c.age);
  const code = `${c.mat.prefix}-${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const base = Math.floor(c.meters / Math.max(1, c.rolls));
  const extra = c.meters - base * c.rolls;
  return Array.from({ length: c.rolls }, (_, i) => ({
    id: `${code}-${String(((c.bay * 7 + i) % 900) + 1).padStart(3, "0")}`,
    tier: Math.floor(i / PER_TIER) + 1,
    color: c.mat.color, lot: c.lot, meters: base + (i < extra ? 1 : 0), order: c.mat.order,
  }));
}

/** Phiếu xuất chờ soạn → danh sách cuộn cần lấy */
export type PickRoll = { id: string; color: string; lot: string; meters: number; loc: string };
export const PICKS: Record<string, PickRoll[]> = {
  "PX-21190": Array.from({ length: 24 }, (_, i) => ({
    id: `TL-1105-${String(i + 1).padStart(3, "0")}`, color: "Đen", lot: "DL-5530", meters: 120,
    loc: `C${pad(3 + Math.floor(i / 6))}-${pad((i % 6) % 5 + 1)}`,
  })),
  "PX-21189": [{ id: "VO-0510-014", color: "Đỏ đô", lot: "DL-3011", meters: 12, loc: "C21-04" }],
};
/** Cuộn "quét nhầm" để thử cảnh báo */
export const WRONG: Record<string, { id: string; loc: string; held: string }> = {
  "PX-21190": { id: "TL-1029-017", loc: "C05-04", held: "DH-2610 · LSX-1238" },
  "PX-21189": { id: "VO-0918-006", loc: "C21-02", held: "DH-2618 · LSX-1258" },
};

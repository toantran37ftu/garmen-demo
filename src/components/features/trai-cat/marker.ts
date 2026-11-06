// Sinh sơ đồ cắt giả (tất định) cho 1 đơn: chi tiết rập theo mã hàng × tỉ lệ size, xếp skyline trên khổ vải.
import type { Order } from "@/data/trai-cat";

type Pt = [number, number]; // x dọc canh sợi (chiều dài vải), y theo khổ — toạ độ đơn vị 0..1
const SHAPE: Record<string, Pt[]> = {
  than: [[0.04, 0.06], [0, 0.33], [0.1, 0.5], [0, 0.67], [0.04, 0.94], [0.17, 0.97], [0.28, 1], [1, 1], [1, 0], [0.28, 0], [0.17, 0.03]],
  nuaThan: [[0.04, 0.08], [0, 0.6], [0.03, 0.8], [0.12, 1], [1, 1], [1, 0], [0.3, 0], [0.17, 0.04]],
  tay: [[0.3, 0], [0.1, 0.15], [0, 0.5], [0.1, 0.85], [0.3, 1], [1, 0.84], [1, 0.16]],
  co: [[0, 0.15], [0.08, 0], [0.92, 0], [1, 0.15], [0.94, 1], [0.06, 1]],
  chuNhat: [[0, 0], [1, 0], [1, 1], [0, 1]],
  quanTruoc: [[0, 0.12], [0, 0.82], [0.2, 0.85], [0.28, 0.97], [0.33, 1], [1, 0.8], [1, 0.2], [0.18, 0], [0.06, 0.04]],
  quanSau: [[0, 0.04], [0.04, 0.78], [0.22, 0.86], [0.3, 1], [1, 0.82], [1, 0.18], [0.2, 0], [0.08, 0]],
  tui: [[0, 0], [0.7, 0], [1, 0.25], [1, 0.75], [0.7, 1], [0, 1]],
  vay: [[0, 0.3], [0, 0.7], [0.9, 1], [0.97, 0.86], [1, 0.5], [0.97, 0.14], [0.9, 0]],
  mu: [[0, 0.2], [0.3, 0], [0.8, 0.05], [1, 0.35], [1, 1], [0, 1]],
};
// [tên chi tiết, hình, dài dọc canh sợi, rộng, số lượng] — kích thước tương đối (cm, size giữa)
type Def = [string, keyof typeof SHAPE, number, number, number];
const PIECES: Record<string, Def[]> = {
  SOMI: [["Thân trước", "nuaThan", 66, 28, 2], ["Thân sau", "than", 66, 50, 1], ["Tay", "tay", 58, 40, 2], ["Cổ", "co", 42, 8, 2], ["Măng sét", "chuNhat", 24, 7, 2], ["Nẹp", "chuNhat", 60, 5, 1]],
  VAY: [["Thân trước", "vay", 64, 104, 1], ["Thân sau", "vay", 64, 104, 1], ["Cạp", "chuNhat", 40, 8, 2]],
  AO: [["Thân trước", "than", 72, 54, 1], ["Thân sau", "than", 72, 54, 1], ["Tay", "tay", 22, 42, 2], ["Viền cổ", "co", 46, 5, 1]],
  QUAN: [["Thân trước", "quanTruoc", 104, 32, 2], ["Thân sau", "quanSau", 106, 38, 2], ["Cạp", "chuNhat", 88, 8, 1], ["Túi", "tui", 30, 20, 2]],
  KHOAC: [["Thân trước", "nuaThan", 72, 32, 2], ["Thân sau", "than", 72, 58, 1], ["Tay", "tay", 64, 46, 2], ["Mũ", "mu", 38, 30, 2], ["Túi", "tui", 20, 18, 2]],
  SHORT: [["Thân trước", "quanTruoc", 50, 34, 2], ["Thân sau", "quanSau", 52, 38, 2], ["Cạp", "chuNhat", 80, 7, 1], ["Túi", "tui", 26, 18, 2]],
};
const kind = (ma: string) =>
  ma.startsWith("SOMI") ? "SOMI" : ma.startsWith("VAY") ? "VAY" : ma.startsWith("AO-THUN") ? "AO"
    : ma.startsWith("QUAN-KAKI") ? "QUAN" : ma.startsWith("AO-KHOAC") ? "KHOAC" : "SHORT";

export type Piece = { si: number; sz: string; ten: string; sp: number; pts: Pt[]; x: number; y: number; w: number; h: number };
export type Marker = { len: number; kho: number; pieces: Piece[] };

const area = (p: Pt[]) => Math.abs(p.reduce((s, [x, y], i) => { const [u, v] = p[(i + 1) % p.length]; return s + x * v - u * y; }, 0)) / 2;

/** Toạ độ ra theo cm thật: x ∈ [0, dài sơ đồ×100], y ∈ [0, khổ] */
export function buildMarker(o: Order): Marker {
  const len = o.sd[1] * 100, kho = o.sd[2], eff = o.sd[3] / 100;
  const defs = PIECES[kind(o.ma)];
  const mid = (o.sz.length - 1) / 2;
  type Raw = { si: number; sz: string; ten: string; sp: number; shape: Pt[]; w: number; h: number };
  const raw: Raw[] = [];
  o.sz.forEach((sz, si) => {
    const f = 1 + (si - mid) * 0.04;
    for (let sp = 1; sp <= o.r[si]; sp++)
      defs.forEach(([ten, sh, w, h, n]) => { for (let k = 0; k < n; k++) raw.push({ si, sz, ten, sp, shape: SHAPE[sh], w: w * f, h: h * f }); });
  });
  // co giãn đều để tổng diện tích rập = hiệu suất × diện tích sơ đồ (khớp số liệu phiếu cắt)
  const A = raw.reduce((s, p) => s + area(p.shape) * p.w * p.h, 0);
  let s = Math.sqrt((eff * len * kho) / A);
  s = Math.min(s, (kho - 2) / Math.max(...raw.map((p) => p.h)));
  raw.forEach((p) => { p.w *= s; p.h *= s; });

  // skyline theo khổ (lưới 1 cm), chi tiết to xếp trước
  const order = raw.map((_, i) => i).sort((a, b) => raw[b].w * raw[b].h - raw[a].w * raw[a].h || a - b);
  const sky = new Array<number>(Math.ceil(kho)).fill(0);
  const placed: (Piece & { k: number })[] = [];
  order.forEach((idx, n) => {
    const p = raw[idx], hh = Math.ceil(p.h);
    let best = Infinity, by = 0;
    for (let y = 0; y + hh <= sky.length; y++) {
      let m = 0;
      for (let j = y; j < y + hh; j++) m = Math.max(m, sky[j]);
      if (m < best - 0.01) { best = m; by = y; }
    }
    for (let j = by; j < by + hh; j++) sky[j] = best + p.w;
    const flip = n % 2 === 1; // lật 180° xen kẽ cho các chi tiết lồng nhau
    const pts = p.shape.map(([u, v]): Pt => (flip ? [1 - u, 1 - v] : [u, v]));
    placed.push({ k: idx, si: p.si, sz: p.sz, ten: p.ten, sp: p.sp, pts, x: best, y: by, w: p.w, h: p.h });
  });
  // shortcut: xếp theo hình bao nên dài thực tế lệch dài sơ đồ; nén/giãn trục dọc cho khớp số liệu, đủ cho demo
  const used = Math.max(...placed.map((p) => p.x + p.w));
  const kx = len / used;
  const pieces = placed.sort((a, b) => a.x - b.x).map(({ k: _k, ...p }) => ({ ...p, x: p.x * kx, w: p.w * kx }));
  return { len, kho, pieces };
}


// Dữ liệu giả + công thức lương — port nguyên từ demo-det-may/apps/tinh-luong.html (cùng PRNG có seed → cùng bộ số).

export const f = (n: number) => Math.round(n).toLocaleString("vi-VN");
export const f2 = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
export const fTy = (v: number) => (v / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + " tỷ";
export const fTr = (v: number) => (v / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tr";
export const sum = <T>(a: T[], fn: (x: T) => number) => a.reduce((s, x) => s + fn(x), 0);

export const GC = 208;
const HS = [0, 100, 108, 116, 125, 135];
const PCV = { A: 200000, P: 150000, X: 300000 };

// ===== Lịch kỳ 10/2026 =====
export const dd = (d: number | string) => String(d).padStart(2, "0");
export const dow = (d: number) => new Date(2026, 9, d).getDay();
export const TH = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DAYS = [...Array(31)].map((_, i) => i + 1).filter(dow); // bỏ Chủ nhật
export const WEEKS = DAYS.reduce<number[][]>((a, d) => (dow(d) === 1 || !a.length ? a.push([d]) : a[a.length - 1].push(d), a), []);
const rnd = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const otH = (ch: string, d: number) => (dow(d) === 6 ? 0.75 : rnd(ch + d) < 0.35 ? 1.75 : 0.75); // giờ TC: đến 17h = 0,75 · đến 18h = 1,75

// ===== Sinh dữ liệu nhà máy theo FACTORY.md =====
// shortcut: giữ PRNG mulberry32 của bản HTML (không dùng seeded()) để ra đúng bộ số đã duyệt.
let seed = 20261031;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const ri = (a: number, b: number) => a + Math.floor(rand() * (b - a + 1));
const pick = <T>(a: readonly T[]): T => a[Math.floor(rand() * a.length)];
const chance = (p: number) => rand() < p;
const KSP = 0.905, KRT = 0.95; // hệ số hiệu chỉnh để quỹ lương ≈ 8,1 tỷ (FACTORY.md)
const HO = "Nguyễn Nguyễn Nguyễn Nguyễn Nguyễn Trần Trần Trần Lê Lê Lê Phạm Phạm Hoàng Huỳnh Phan Vũ Võ Võ Đặng Bùi Đỗ Hồ Ngô Dương Lý Đinh Trịnh Mai Lương Tạ Cao Đoàn Lâm Hà Châu Kiều Tô Quách Lưu Thái Trương La".split(" ");
const DEM_NU = "Thị Thị Thị Thị Thị Thị Thị Ngọc Thu Thanh Kim Mỹ Hồng Bích Thùy Minh".split(" ");
const TEN_NU = "Hoa Lan Hương Hằng Thảo Trang Linh Nga Yến Mai Huệ Hạnh Nhung Thủy Hiền Liên Loan Phượng Tuyết Vân Hà Duyên Diễm Ngân Thơ Trinh Oanh Quyên Nhàn Tâm Xuân Dung Huyền My Thắm Ly Chi Giang Sen Thu Thanh Kim Bích Lụa Gấm Nhi Vy Tú Hậu".split(" ");
const DEM_NAM = "Văn Văn Văn Văn Văn Đức Minh Quốc Hữu Công Thanh Ngọc".split(" ");
const TEN_NAM = "Hùng Minh Tuấn Dũng Hải Nam Long Phúc Tài Khang Lộc Bảo Thịnh Toàn Trung Đức Hiếu Quang Sơn Thắng Tiến Vinh Cường Huy Kiên Tâm Phong Lực Hậu Tú".split(" ");
const mkName = (nu: boolean | number) => `${pick(HO)} ${pick(nu ? DEM_NU : DEM_NAM)} ${pick(nu ? TEN_NU : TEN_NAM)}`;

type Cd = [string, number];
// Mã hàng: [khách hàng, công đoạn [tên, đơn giá đ/sp]] — theo Quy trình công nghệ
export const MH: Record<string, [string, Cd[]]> = {
  "AO-POLO-2611": ["Nordvik Outdoor (Thụy Điển)", [["May vai con", 412], ["Tra cổ", 586], ["May nẹp cổ", 498], ["Tra tay", 534], ["Vắt sổ sườn", 462], ["Lên lai áo", 378], ["Đính nhãn", 214], ["May đô sau", 356]]],
  "AO-THUN-2402": ["Hanbit Urban (Hàn Quốc)", [["May vai", 296], ["Viền cổ", 452], ["Tra tay", 418], ["Vắt sổ sườn", 386], ["Lên lai", 312], ["Đính nhãn", 168], ["May bo tay", 344], ["Diễu cổ", 274]]],
  "QUAN-KAKI-0932": ["Bellmont Apparel (Mỹ)", [["May túi hông", 624], ["May túi sau", 688], ["Tra khóa", 572], ["May lưng", 646], ["Vắt sổ đáy", 364], ["May đáy", 418], ["Lên lai quần", 336], ["Đính đỉa", 288]]],
  "AO-KHOAC-1150": ["Northline Wear (Canada)", [["May thân trước", 716], ["Tra khóa nẹp", 684], ["May mũ", 652], ["Tra tay", 598], ["May lót", 544], ["Chặn bo", 402], ["Lên lai", 388], ["Đính nhãn", 236]]],
  "SOMI-NU-1210": ["Kazeyama Sports (Nhật)", [["May nẹp áo", 458], ["Tra cổ", 612], ["Tra tay", 524], ["May măng sét", 496], ["Vắt sổ", 352], ["Lên lai", 326], ["Thùa khuy", 248], ["Đính cúc", 232]]],
  "VAY-XOE-1105": ["Coral Bay Clothing (Úc)", [["May thân váy", 482], ["Tra khóa giọt lệ", 556], ["May lưng váy", 528], ["Viền nách", 436], ["Vắt sổ", 348], ["Lên lai váy", 402], ["Đính nhãn", 184], ["Ráp sườn", 452]]],
  "QUAN-SHORT-0715": ["Bellmont Apparel (Mỹ)", [["May túi xéo", 398], ["May túi sau", 452], ["Tra lưng thun", 486], ["Vắt sổ đáy", 318], ["May đáy", 364], ["Lên lai", 286], ["Đính nhãn", 168], ["Chặn đỉa", 212]]],
};
export const CHUYEN = [...Array(15)].map((_, i) => "Chuyền " + dd(i + 1));
const LINE_N = [45, 44, 46, 45, 47, 43, 45, 46, 44, 45, 48, 42, 45, 44, 46]; // Σ 675
export const XUONG: Record<string, string> = Object.fromEntries(CHUYEN.map((c, i) => [c, i < 8 ? "Xưởng 1" : "Xưởng 2"]));
export const GT = new Set(["Phòng Mẫu", "Kỹ thuật", "Bảo trì", "Kế toán", "Nhân sự", "Văn phòng"]); // gián tiếp: lương thời gian
type Role = [string, number, number, number, string[]];
// [bộ phận, số người, tỷ lệ nữ, [[chức danh, số người (0 = phần còn lại), lương CB từ, đến, công đoạn/việc]]] — role đầu tiên là trưởng bộ phận
const DEPTS: [string, number, number, Role[]][] = [
  ...CHUYEN.map((c, i): [string, number, number, Role[]] => [c, LINE_N[i], 0.88, [["Tổ trưởng", 1, 6.8e6, 6.8e6, ["Điều hành chuyền"]], ["CN hỗ trợ chuyền", 1, 4.96e6, 4.96e6, ["Hỗ trợ chuyền"]], ["Công nhân may", 0, 4.96e6, 4.96e6, []]]]),
  ["Tổ cắt", 55, 0.3, [["Tổ trưởng cắt", 1, 6.5e6, 6.5e6, ["Điều hành bàn cắt"]], ["Vận hành máy cắt", 8, 5.6e6, 5.6e6, ["Cắt tự động"]], ["Công nhân cắt", 0, 5.2e6, 5.2e6, ["Trải vải – cắt", "Cắt tay", "Đánh số – bó hàng", "Ép mex"]]]],
  ["Hoàn thiện", 110, 0.85, [["Tổ trưởng hoàn thiện", 2, 6.5e6, 6.5e6, ["Điều hành tổ"]], ["CN hoàn thiện", 0, 4.96e6, 4.96e6, ["Ủi thành phẩm", "Cắt chỉ – vệ sinh", "Gấp xếp – đóng thùng", "Treo thẻ bài", "Đóng gói"]]]],
  ["QA", 28, 0.8, [["Trưởng QA", 1, 7.2e6, 7.2e6, ["Điều hành QA"]], ["Nhân viên QC", 0, 5.2e6, 5.2e6, ["Kiểm hàng cuối chuyền", "Kiểm thành phẩm", "Kiểm AQL"]]]],
  ["Kho NPL", 22, 0.2, [["Thủ kho", 1, 6.2e6, 6.2e6, ["Quản lý kho NPL"]], ["Công nhân kho", 0, 4.96e6, 4.96e6, ["Bốc xếp – nhập vải", "Cấp phát phụ liệu", "Kiểm vải 4 điểm", "Soạn NPL cho cắt"]]]],
  ["Phòng Mẫu", 18, 0.7, [["Trưởng nhóm mẫu", 1, 17.8e6, 17.8e6, ["May mẫu"]], ["Nhân viên rập", 5, 9e6, 11.5e6, ["Thiết kế rập"]], ["Thợ may mẫu", 0, 8.2e6, 9.6e6, ["May mẫu"]]]],
  ["Kỹ thuật", 20, 0.5, [["Trưởng phòng kỹ thuật", 1, 18e6, 18e6, ["Quản lý kỹ thuật"]], ["Nhân viên IE", 6, 11e6, 14e6, ["Bấm giờ – định mức"]], ["Kỹ thuật chuyền", 0, 9.5e6, 12.5e6, ["Cân chuyền – hướng dẫn"]]]],
  ["Bảo trì", 14, 0.05, [["Tổ trưởng bảo trì", 1, 12e6, 12e6, ["Quản lý bảo trì"]], ["Thợ bảo trì máy", 0, 8.5e6, 11e6, ["Sửa máy may", "Bảo trì điện"]]]],
  ["Kế toán", 10, 0.8, [["Kế toán trưởng", 1, 22e6, 22e6, ["Kế toán tổng hợp"]], ["Kế toán viên", 0, 9.5e6, 13e6, ["Kế toán lương", "Kế toán kho", "Kế toán thanh toán"]]]],
  ["Nhân sự", 10, 0.7, [["Trưởng phòng nhân sự", 1, 18e6, 18e6, ["Quản lý nhân sự"]], ["Chuyên viên nhân sự", 0, 9e6, 12e6, ["Tuyển dụng", "Tiền lương – BHXH", "Đào tạo"]]]],
  ["Văn phòng", 18, 0.6, [["Giám đốc nhà máy", 1, 45e6, 45e6, ["Điều hành nhà máy"]], ["Nhân viên kế hoạch", 5, 10e6, 13e6, ["Kế hoạch sản xuất"]], ["Merchandiser", 4, 12e6, 16e6, ["Theo dõi đơn hàng"]], ["Nhân viên XNK", 3, 10e6, 13e6, ["Chứng từ xuất nhập khẩu"]], ["Lái xe – bảo vệ", 0, 7.5e6, 9.5e6, ["Đưa đón – giao hàng", "Bảo vệ cổng"]]]],
];
// Kế hoạch chuyền tháng 10: mã hàng a đến hết ngày s, sau đó đổi sang mã hàng b (s = 31: không đổi mã)
export const MHK = Object.keys(MH);
const PLAN: Record<string, { a: string; b: string; s: number }> = Object.fromEntries(
  CHUYEN.map((c) => {
    const a = pick(MHK);
    let b = pick(MHK);
    while (b === a) b = pick(MHK);
    return [c, { a, b, s: chance(0.6) ? ri(8, 23) : 31 }];
  }),
);
const pool = [...Array(1180)].map((_, i) => i + 1);
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [pool[i], pool[j]] = [pool[j], pool[i]];
}
let nextOld = 0, nextNew = 1181;

export type DayRec = { sl: number; o: number; tg: number; ng: number; mb: number };
/** Dòng lương SP: 1 CN × 1 mã hàng × 1 chuyền */
export type SpRow = { ma: string; ten: string; mh: string; ch: string; x: string; cd: Cd[]; dg: number; day: Record<number, DayRec>; first: number; last: number };
type Px = [string, string, number, number]; // ngày, nội dung, giờ HL, giờ TC
type SpSum = { tg: number; ng: number; mb: number; h: number };
type Seed = [string, string, string, string, string, number, number, number, number, number, number, number, number, number, number, "A" | "B" | "C", number, number, number, string, number, number, number, number, number, string, string, SpSum?];

const PHISX: Record<string, Px[]> = {}, NGAYVAO: Record<string, string> = {};
export const CHEDO: Record<string, string> = {};
const EMP: { bi: number; num: number; s: Seed }[] = [];
export const R: SpRow[] = [];
const TRAIN = { line: ["An toàn lao động, nội quy", "Thao tác máy 1 kim", "Thao tác máy vắt sổ"], other: ["An toàn lao động, nội quy", "Hướng dẫn công việc", "Kèm cặp tại vị trí"] };
DEPTS.forEach(([bp, n, pNu, roles], bi) => {
  const gt = GT.has(bp), line = !!XUONG[bp], rest = n - roles.reduce((a, r) => a + r[1], 0);
  roles.forEach(([cd, k, F0, F1, cds], ri0) => {
    for (let j = 0; j < (k || rest); j++) {
      const lead = ri0 === 0, isNew = !gt && !k && chance(line ? 0.055 : 0.04), sew = line && cd === "Công nhân may";
      const num = isNew ? nextNew++ : pool[nextOld++], ma = "NV" + dd(num).padStart(4, "0"), nu = chance(lead && !line ? pNu * 0.7 : pNu) ? 1 : 0, ten = mkName(nu);
      const F = Math.round(ri(F0 / 1e5, F1 / 1e5) * (gt ? 0.68 : 1)) * 1e5, bac = gt ? ri(3, 5) : lead ? 5 : isNew ? 1 : pick([2, 3, 3, 3, 4, 4, 4, 5]);
      const from = isNew ? pick(DAYS.filter((d) => d >= 2 && d <= 22)) : 1;
      let H = 0, M = 0;
      const pres: number[] = [];
      DAYS.filter((d) => d >= from).forEach((d) => {
        const x = rand();
        if (x < 0.022) H++;
        else if (x < 0.03) { /* vắng */ } else if (x < 0.032) M++;
        else pres.push(d);
      });
      const px: Px[] = isNew ? pres.slice(0, 3).map((d, i) => [dd(d) + "/10", TRAIN[line ? "line" : "other"][i], 8, i ? 2 : 0]) : [];
      if (isNew) { PHISX[ma] = px; NGAYVAO[ma] = dd(from) + "/10/2026"; }
      const work = pres.slice(px.length), I = nu && !gt && !isNew && chance(0.025) ? pres.length : 0;
      if (I) CHEDO[ma] = pick(["Giờ thứ 8 (thai sản)", "60 phút cho con bú"]);
      let cdoan = pick(cds), rate = 0, tc = px.reduce((a, r) => a + r[3], 0);
      if (gt) tc = pick([0, 0, 0, 4, 8, 12, 16]);
      else if (sew) {
        // lương SP: sinh sản lượng từng ngày theo mã hàng của chuyền
        const pl = PLAN[bp], kk = [0, 185, 246, 250, 260, 272][bac] * (0.96 + 0.08 * rand()) * KSP * (I ? 0.92 : 1) * (isNew ? 0.85 : 1);
        const byMh: Record<string, { cd: Cd[]; dg: number; day: Record<number, DayRec> }> = {};
        const cdx: Record<string, number[]> = {};
        [pl.a, pl.b].forEach((h) => {
          const m = chance(0.5) ? 2 : chance(0.6) ? 1 : 3, s = new Set<number>();
          while (s.size < m) s.add(ri(0, 7));
          cdx[h] = [...s].sort((a, b) => a - b);
        });
        work.forEach((d) => {
          const mh = d <= pl.s ? pl.a : pl.b, cd2 = cdx[mh].map((i) => MH[mh][1][i]), dg = cd2.reduce((a, c) => a + c[1], 0);
          const sl = Math.round((kk * 1000) / dg * (0.88 + 0.24 * rand()) * (mh === pl.b && d - pl.s <= 2 ? 0.6 : 1)); // 2 ngày đầu vào mã mới ra ít
          const o = otH(bp, d), b = 7.67 + o;
          tc += o;
          (byMh[mh] = byMh[mh] || { cd: cd2, dg, day: {} }).day[d] = { sl, o, tg: Math.round((sl / b) * 7.67 * dg), ng: Math.round((sl / b) * o * dg * 1.5), mb: 0 };
        });
        Object.entries(byMh).forEach(([mh, v]) => {
          const ds = Object.keys(v.day).map(Number);
          R.push({ ma, ten, mh, ch: bp, x: XUONG[bp], cd: v.cd, dg: v.dg, day: v.day, first: Math.min(...ds), last: Math.max(...ds) });
        });
        cdoan = (byMh[pl.b] || byMh[pl.a] || { cd: [["Chờ phân công", 0]] }).cd.map((c) => c[0]).join(", ");
      } else {
        rate = Math.round(((F / GC) * (1.04 + 0.04 * bac + 0.04 * rand()) * KRT) / 100) * 100; // đơn giá giờ luôn trên lương CB giờ
        work.forEach((d) => (tc += otH(bp, d)));
      }
      const pc = (lead ? "A" : chance(0.03) ? "A" : "") + (chance(0.04) ? "P" : "") + (bp === "Kho NPL" && chance(0.25) ? "X" : "") +
        ((bp === "Tổ cắt" && chance(0.6)) || cdoan === "Ủi thành phẩm" || (bp === "Kho NPL" && chance(0.5)) ? "D" : "");
      const con = pick([0, 0, 0, 0, 0, 1, 1, 1, 2, 2]), kpi = isNew ? pick(["B", "C"] as const) : pick("AAAAAAAAAAABBBBBBBCC".split("") as ("A" | "B" | "C")[]);
      const AP = cdoan === "Bốc xếp – nhập vải" ? ri(5, 14) * 50000 : bp === "Tổ cắt" && chance(0.1) ? ri(4, 7) * 40000 : 0;
      EMP.push({
        bi, num,
        s: [ma, ten, bp, isNew ? "CN thử việc" : cd, cdoan, nu, F, pres.length, H, I, M, tc, chance(gt ? 0.05 : 0.3) ? 8 : 0, rate, 0, kpi, bac, con, con + (chance(0.08) ? 1 : 0),
          pc, isNew ? 0 : chance(gt ? 0.5 : 0.8) ? 1 : 0, isNew ? 0 : lead ? 500000 : 300000, AP, isNew ? 150000 : 0, !isNew && chance(0.05) ? ri(5, 20) * 100000 : 0,
          !isNew || chance(0.5) ? `0711 ${dd(num).padStart(4, "0")} ${ri(100, 999)}` : "", chance(0.015) ? "Cần kiểm tra" : chance(0.72) ? "Đã chốt" : "Tạm tính"],
      });
    }
  });
});

// Mua – bán công đoạn: trong cùng chuyền, cùng mã hàng, cùng ngày; người mua (+) làm thay CĐ của người bán (−)
export type Mb = { so: string; d: number; ch: string; mh: string; cd: string; dg: number; sl: number; sell: string; buy: string; st: string };
export const MBS: Mb[] = [];
CHUYEN.forEach((ch) => {
  const rs = R.filter((r) => r.ch === ch);
  for (let n = ri(2, 4); n > 0; n--) {
    const sell = pick(rs), d = pick(Object.keys(sell.day).map(Number)), buys = rs.filter((r) => r.ma !== sell.ma && r.mh === sell.mh && r.day[d]);
    if (!buys.length) continue;
    const buy = pick(buys), c = pick(sell.cd), sl = ri(25, 65) * 10, st = d >= 29 ? "Chờ duyệt" : chance(0.07) ? "Trả về rà soát" : "Đã vào lương";
    if (st !== "Trả về rà soát") { sell.day[d].mb -= sl * c[1]; buy.day[d].mb += sl * c[1]; }
    MBS.push({ so: "", d, ch, mh: sell.mh, cd: c[0], dg: c[1], sl, sell: sell.ten, buy: buy.ten, st });
  }
});
MBS.sort((a, b) => a.d - b.d).forEach((m, i) => (m.so = "MB-" + (1001 + i)));
// Gắn lương SP (W, X) của công nhân may từ bảng lương SP → cùng một nguồn số
const SPSUM: Record<string, SpSum> = {};
R.forEach((r) => Object.values(r.day).forEach((x) => {
  const s = (SPSUM[r.ma] = SPSUM[r.ma] || { tg: 0, ng: 0, mb: 0, h: 0 });
  s.tg += x.tg; s.ng += x.ng; s.mb += x.mb; s.h += 7.67;
}));
EMP.forEach((e) => {
  const sp = SPSUM[e.s[0]];
  if (sp) { e.s[13] = Math.round(sp.tg / sp.h); e.s[14] = sp.mb; e.s[27] = sp; }
});
const SEED = EMP.sort((a, b) => a.bi - b.bi || a.num - b.num).map((e) => e.s);

const tax = (w: number) => (w <= 1e7 ? w * 0.05 : w <= 3e7 ? 5e5 + (w - 1e7) * 0.1 : 2.5e6 + (w - 3e7) * 0.2); // shortcut: 3 bậc đầu biểu thuế 2026, đủ cho mock
function calc(s: Seed) {
  const [ma, ten, bp, cd, cdoan, nu, F, G, H, I, M, tc, R, rate, mb, kpi, bac, con, AV, pc, xe, AO, AP, AQ, AS, atm, st, sp] = s;
  const pm = GT.has(bp), h = F / GC, px = PHISX[ma] || [];
  const L = px.reduce((a, r) => a + r[2], 0), pxT = px.reduce((a, r) => a + r[2] + r[3] * 1.5, 0);
  const N = pm ? G * 8 : 0, O = pm ? 0 : G * 8 - L, P = (pm ? tc : 0) + pxT, Q = pm ? 0 : tc - px.reduce((a, r) => a + r[3], 0);
  const J = Math.round((G * 20) / 6) / 10, K = nu ? (G === 0 ? 0 : G <= 1 ? 0.5 : G <= 2 ? 1 : 1.5) : 0;
  const pcs = { A: pc.includes("A") ? PCV.A : 0, P: pc.includes("P") ? PCV.P : 0, X: pc.includes("X") ? PCV.X : 0, D: pc.includes("D") ? 15000 * Math.ceil(G) : 0 };
  const AG = pcs.A + pcs.P + pcs.X + pcs.D, hb = (F + AG) / GC, r = Math.round;
  const U = r(h * N), V = r(hb * P * 1.5), W = pm ? 0 : sp ? sp.tg + sp.mb : r(rate * O) + mb, X = pm ? 0 : sp ? sp.ng : r(rate * Q * 1.5);
  const Y = r(h * R * 2), Z = r(h * H * 8), AA = r(Math.max(rate, h) * I), AB = r(h * J), AC = r(h * K), AD = r((h * 0.5 * R) / 8), AE = r((F / 26) * M);
  const S = r(h * (O + N) + hb * (Q + P) * 1.5 + hb * R * 2), T = Math.max(0, S - (U + V + W + X + Y + AB));
  const AF = con * 100000, AI = HS[bac], AJ = Math.round((O + 1.5 * Q) * AI) / 100;
  const AK = xe ? r((200000 / 26) * (Math.ceil(G) + R / 8)) : 0, AL = r((650000 / 26) * G * { A: 1, B: 0.5, C: 0 }[kpi]), AN = { A: 300000, B: 150000, C: 0 }[kpi];
  const AR = Math.max(0, T + U + V + W + X + Y + Z + AA + AB + AC + AD + AE + AF + AG + AK + AL + AN + AO + AP + AQ);
  const bh = [r((F + AG) * 0.08), r((F + AG) * 0.015), r((F + AG) * 0.01)], AT = bh[0] + bh[1] + bh[2], AU = r((F + AG) * 0.01);
  const AW = Math.max(0, r(AR - V - X - AT - 15500000 - 6200000 * AV)), AX = r(tax(AW));
  const AY = Math.max(0, AR - AS - AT - AU - AX), AZ = G ? r((AR - Z) / G) : 0;
  return {
    ma, ten, bp, cd, cdoan, st: T > 0 ? "Cần kiểm tra" : st, nu, rate, mb, con, pcs, bh, px, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB, AC, AD, AE, AF, AG,
    AH: bac, AI, AJ, AK, AL, AM: kpi as string, AN, AO, AP, AQ, AR, AS, AT, AU, AV, AW, AX, AY, AZ, BA: atm ? AY : 0, BB: atm ? 0 : r(AY / 1000) * 1000, BC: atm,
    BD: AZ >= 300000 ? "Giỏi" : AZ >= 250000 ? "Khá" : AZ >= 200000 ? "TB" : "Yếu",
  };
}
export type Pay = ReturnType<typeof calc>;
export const D = SEED.map(calc);
export const DM: Record<string, Pay> = Object.fromEntries(D.map((d) => [d.ma, d]));
/** Giá trị cột F–BD của một dòng lương. */
export const val = (d: Pay, k: string) => (d as unknown as Record<string, number | string>)[k];
// self-check: AR = tổng các khoản thu nhập, AY = AR − AS − AT − AU − AX
export const INC = ["T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AK", "AL", "AN", "AO", "AP", "AQ"];
D.forEach((d) => console.assert(INC.reduce((a, k) => a + (val(d, k) as number), 0) === d.AR && d.AR - d.AS - d.AT - d.AU - d.AX === d.AY, d.ma));
console.assert(D.length === 980 && new Set(D.map((d) => d.ma)).size === 980, "quy mô 980 lao động");

export type GroupId = "cong" | "luong" | "pc" | "tong" | "chi";
// [id, tên, class màu nền nhóm]
export const GROUPS: [GroupId, string, string][] = [
  ["cong", "Công & giờ", "bg-sky-50"],
  ["luong", "Các khoản lương", "bg-emerald-50"],
  ["pc", "Phụ cấp & thưởng", "bg-amber-50"],
  ["tong", "Tổng & khấu trừ", "bg-violet-50"],
  ["chi", "Chi trả", "bg-gray-100"],
];
/** [cột, tiêu đề, nhóm, công thức, kiểu: m tiền · h giờ/ngày · x số không cộng · t chữ] */
export type Col = [string, string, GroupId, string, "m" | "h" | "x" | "t"];
export const COLS: Col[] = [
  ["F", "LƯƠNG CB", "cong", "Lương cơ bản theo HĐLĐ (Nhân viên.Lương cơ bản)", "m"],
  ["G", "NGÀY CÔNG", "cong", "Chấm công ngày: ROUND(SUM(Ngày công) bỏ Chủ nhật, 2), trừ công chuyển sang Công việc phát sinh", "h"],
  ["H", "P+LỄ+VR+TN (ngày)", "cong", "Nghỉ phép: SUM(Số công) loại P, Lễ, Việc riêng, Tai nạn", "h"],
  ["I", "GIỜ THỨ 8", "cong", "Bảng Chế độ: số ngày hưởng giờ thứ 8 (thai sản) / 60 phút cho con bú", "h"],
  ["J", "NGHỈ GIỮA CA (giờ)", "cong", "= G × 20 / 60", "h"],
  ["K", "PHỤ NỮ (giờ)", "cong", "Nam = 0; Nữ: G ≤ 1 → 0,5; G ≤ 2 → 1; còn lại 1,5", "h"],
  ["L", "TG PSX (giờ)", "cong", "Bảng Phi SX: giờ huấn luyện (phi sản xuất)", "h"],
  ["M", "TG NGỪNG VIỆC (ngày)", "cong", "Nghỉ phép: SUM(Số công) loại NGV", "h"],
  ["N", "GIỜ LV TG", "cong", "Bảng HS Phòng Mẫu → TG: giờ làm thường các ngày thuộc Phòng Mẫu / khối gián tiếp", "h"],
  ["O", "GIỜ LV ĐG", "cong", "= SUM(Giờ làm thường) bỏ CN − N − giờ Phi SX − giờ Công việc phát sinh", "h"],
  ["P", "NGOÀI GIỜ NT TG", "cong", "= Bảng HS → TGTC + Bảng Phi SX → TỔNG (đã quy đổi tăng ca ×1,5)", "h"],
  ["Q", "NGOÀI GIỜ NT ĐG", "cong", "= SUM(Tổng giờ OT) bỏ CN − P − giờ TC Công việc phát sinh", "h"],
  ["R", "CN (giờ)", "cong", "Chấm công ngày: SUM(Giờ làm thường) của ngày Chủ nhật", "h"],
  ["S", "LƯƠNG TỐI THIỂU", "luong", "= ROUND(F/208×(O+N) + (F+AG)/208×(Q+P)×1,5 + (F+AG)/208×R×2)\n208 = số giờ công chuẩn của kỳ", "m"],
  ["T", "BÙ LƯƠNG TỐI THIỂU", "luong", "= MAX(0, S − (U+V+W+X+Y+AB))", "m"],
  ["U", "LƯƠNG TG", "luong", "Bảng HS Phòng Mẫu → LƯƠNG TG = ROUND(F/208 × N)", "m"],
  ["V", "LƯƠNG TC TG", "luong", "= ROUND((F+AG)/208 × P × 1,5), P gồm cả giờ Phi SX", "m"],
  ["W", "LƯƠNG SẢN PHẨM", "luong", "= Thu nhập khoán ngày trong giờ + thu nhập mua bán công đoạn trong giờ (MB đã mang dấu +/−) — CN may lấy từ tab Lương sản phẩm", "m"],
  ["X", "LƯƠNG SP NGOÀI GIỜ", "luong", "= Thu nhập khoán ngoài giờ × 1,5 + TN mua bán ngoài giờ", "m"],
  ["Y", "LƯƠNG CHỦ NHẬT", "luong", "= ROUND(F/208 × R × 2)", "m"],
  ["Z", "LƯƠNG NGÀY F, LỄ, VR, TN", "luong", "= ROUND(F/208 × H × 8)", "m"],
  ["AA", "GIỜ THỨ 8 (tiền)", "luong", "Bảng Chế độ → SỐ TIỀN = số giờ × MAX(lương SP bình quân giờ, lương CB giờ)", "m"],
  ["AB", "LƯƠNG NGHỈ GIỮA CA", "luong", "= ROUND(F/208 × J)", "m"],
  ["AC", "VSPN", "luong", "= ROUND(F/208 × K)", "m"],
  ["AD", "LƯƠNG NGHỈ TRƯA CN", "luong", "= ROUND(F/208 × 0,5 giờ × số ngày làm Chủ nhật)", "m"],
  ["AE", "LƯƠNG NGỪNG VIỆC", "luong", "= ROUND(F/26 × M)", "m"],
  ["AF", "TRỢ CẤP CON NHỎ", "pc", "Bảng Con nhỏ → SỐ TIỀN = số con dưới 7 tuổi × 100.000", "m"],
  ["AG", "PHỤ CẤP (ATVSV, PCCC, xe nâng, độc hại)", "pc", "= Bảng BHXH (PC ATVSV + PC PCCC + PC xe nâng) + Bảng Độc hại → SỐ TIỀN", "m"],
  ["AH", "BẬC", "pc", "Bảng Tay nghề và KPI → Bậc mới của kỳ", "x"],
  ["AI", "HS BẬC", "pc", "Bảng Tay nghề và KPI → Hệ số của kỳ", "x"],
  ["AJ", "HS QĐ", "pc", "= (O + 1,5×Q) × AI / 100", "h"],
  ["AK", "HỖ TRỢ XĂNG XE", "pc", "Bảng Xăng xe = ROUND(200.000 / 26 × (ROUNDUP(G) + số ngày làm CN))", "m"],
  ["AL", "THƯỞNG NĂNG SUẤT", "pc", "= Đơn giá thưởng NS của chuyền (650.000) ÷ 26 × G; × 0,5 nếu KPI B, × 0 nếu KPI C", "m"],
  ["AM", "LOẠI KPI", "pc", "Bảng Tay nghề và KPI → Hạng KPI của kỳ", "t"],
  ["AN", "KPI", "pc", "Thưởng KPI A = 300.000, B = 150.000, C = 0", "m"],
  ["AO", "TRỢ CẤP", "pc", "Bảng Trợ cấp → CỘNG (Công ty + Quỹ xưởng)", "m"],
  ["AP", "BỐC XẾP", "pc", "Bảng Bốc xếp → SỐ TIỀN", "m"],
  ["AQ", "HT KHÁM SK ĐẦU VÀO", "pc", "Bảng KSK đầu vào → 150.000 nếu ngày vào công ty nằm trong kỳ", "m"],
  ["AR", "TỔNG LƯƠNG", "tong", "= MAX(0, ROUND(SUM(T..AG) + AK + AL + AN + AO + AP + AQ))", "m"],
  ["AS", "ĐÃ NHẬN/TẠM ỨNG", "tong", "Khoản tạm ứng đã nhận trong kỳ", "m"],
  ["AT", "BHXH_YT_TN", "tong", "Bảng BHXH → NLĐ đóng: (F+AG) × (BHXH 8% + BHYT 1,5% + BHTN 1%)", "m"],
  ["AU", "CÔNG ĐOÀN PHÍ", "tong", "Bảng Công đoàn phí → (F+AG) × 1%", "m"],
  ["AV", "NGƯỜI P.THUỘC", "tong", "Thân nhân: số người phụ thuộc thuế", "x"],
  ["AW", "THU NHẬP CHỊU THUẾ", "tong", "= MAX(0, ROUND(AR − V − X − AT − 15.500.000 − 6.200.000 × AV))", "m"],
  ["AX", "THUẾ TNCN", "tong", "Lũy tiến từng phần theo Biểu thuế TNCN trên AW", "m"],
  ["AY", "THỰC LĨNH", "tong", "= MAX(0, ROUND(AR − AS − AT − AX − AU))", "m"],
  ["AZ", "BÌNH QUÂN", "chi", "= G > 0 ? ROUND((AR − Z) / G) : 0", "x"],
  ["BA", "ATM", "chi", "= có tài khoản ATM ? ROUND(AY) : 0", "m"],
  ["BB", "TIỀN MẶT", "chi", "= có tài khoản ATM ? 0 : ROUND(AY, −3)", "m"],
  ["BC", "TK ATM", "chi", "Nhân viên.Tài khoản ATM", "t"],
  ["BD", "XẾP LOẠI", "chi", "AZ ≥ 300.000 Giỏi; ≥ 250.000 Khá; ≥ 200.000 TB; còn lại Yếu", "t"],
];
export const RED = ["AS", "AT", "AU", "AX"], BOLD = ["AR", "AY"];
/** Chuỗi hiển thị của một ô ("–" cho 0 / rỗng). */
export const fmtCol = (c: Col, v: number | string) => (c[4] === "t" ? String(v || "–") : v === 0 ? "–" : c[4] === "m" ? f(v as number) : f2(v as number));

// KPI tính từ toàn bộ dữ liệu sinh ra
const TT = D.filter((d) => !GT.has(d.bp));
export const PAY_KPI = {
  quy: sum(D, (d) => d.AR), lsp: sum(D, (d) => d.W + d.X), n: D.length, tt: TT.length,
  thucLinhTT: sum(TT, (d) => d.AY) / TT.length, canKT: D.filter((d) => d.st === "Cần kiểm tra").length,
};
export const BPS = [...new Set(D.map((d) => d.bp))];
export const inBp = (d: { bp: string }, v: string) => !v || d.bp === v || XUONG[d.bp] === v;

// ===== Lương sản phẩm theo mã hàng – chuyền (mô phỏng sheet "ĐG NGAY") =====
export type PCol = { lab: string; days: number[] };
export type SpVal = { c: number[]; sl: number; tg: number; ng: number; mb: number; n: number; tt: number; tong: number };
const SK = ["sl", "tt", "tg", "ng", "mb", "tong"] as const;
export function V(r: SpRow, cols: PCol[]): SpVal {
  const ds = cols.flatMap((c) => c.days).map((d) => r.day[d]).filter(Boolean), s = (k: keyof DayRec) => ds.reduce((a, x) => a + x[k], 0);
  const sl = s("sl"), tg = s("tg"), ng = s("ng"), mb = s("mb");
  return { c: cols.map((c) => c.days.reduce((a, d) => a + (r.day[d] ? r.day[d].sl : 0), 0)), sl, tg, ng, mb, n: ds.length, tt: sl * r.dg, tong: tg + ng + mb };
}
export const ADD = (vs: SpVal[], n: number): SpVal => {
  const a: SpVal = { c: Array(n).fill(0), sl: 0, tg: 0, ng: 0, mb: 0, n: 0, tt: 0, tong: 0 };
  vs.forEach((v) => { v.c.forEach((x, i) => (a.c[i] += x)); SK.forEach((k) => (a[k] += v[k])); });
  return a;
};
export const MONTH: PCol[] = WEEKS.map((w) => ({ lab: `${dd(w[0])}–${dd(w[w.length - 1])}/10`, days: w }));
// self-check: thành tiền = SL × ĐG ≈ TN trong giờ + TN ngoài giờ ÷ 1,5 (sai số làm tròn ≤ 1 đ/ngày); mua–bán CĐ cân nhau; W, X bảng lương = tổng tab lương SP
R.forEach((r) => { const v = V(r, MONTH); console.assert(Math.abs(v.tt - v.tg - v.ng / 1.5) <= v.n, "SP", r.ma, r.mh); });
console.assert(ADD(R.map((r) => V(r, MONTH)), 5).mb === 0, "MB không cân");
Object.entries(SPSUM).forEach(([ma, s]) => console.assert(DM[ma].W === s.tg + s.mb && DM[ma].X === s.ng, "W/X lệch lương SP", ma));

/** Kỳ: "m" = cả tháng (cột theo tuần), "0".."n" = tuần (cột theo ngày). */
export const PERIODS = [{ v: "m", lab: "Tháng 10/2026 (cột theo tuần)" }, ...MONTH.map((w, i) => ({ v: String(i), lab: `Tuần ${w.lab} (cột theo ngày)` }))];
export const spCols = (p: string): PCol[] => (p === "m" ? MONTH : WEEKS[+p].map((d) => ({ lab: `${TH[dow(d)]} ${dd(d)}/10`, days: [d] })));
export const range = (rs: SpRow[]) => `${dd(Math.min(...rs.map((r) => r.first)))}–${dd(Math.max(...rs.map((r) => r.last)))}/10`;
export type SpItem = SpVal & { r: SpRow; i: number };

/** Ma trận mã hàng × chuyền: chỉ lọc kỳ + xưởng để luôn thấy đủ các ô. */
export function spMatrix(inP: SpItem[], x: string) {
  const mx = inP.filter((o) => !x || o.r.x === x), chs = CHUYEN.filter((k) => mx.some((o) => o.r.ch === k)), mhs = MHK.filter((h) => mx.some((o) => o.r.mh === h));
  const cell: Record<string, { tong: number; sl: number; cn: Set<string> }> = {};
  mx.forEach((o) => {
    const z = (cell[o.r.mh + "|" + o.r.ch] = cell[o.r.mh + "|" + o.r.ch] || { tong: 0, sl: 0, cn: new Set() });
    z.tong += o.tong; z.sl += o.sl; z.cn.add(o.r.ma);
  });
  const tot = (h = "", k = "") => sum(Object.entries(cell).filter(([key]) => { const [a, b] = key.split("|"); return (!h || a === h) && (!k || b === k); }), (e) => e[1].tong);
  console.assert(Math.abs(sum(mhs, (h) => tot(h)) - sum(chs, (k) => tot("", k))) < 1, "ma trận lệch");
  return { chs, mhs, cell, tot };
}

// ===== Mua – bán công đoạn =====
export const cntSt = (s: string) => MBS.filter((m) => m.st === s).length;

// ===== Bảng con: [tên, mô tả, tiêu đề cột, hàm trả về dòng] =====
type Cell = string | number;
const P = (fn: (d: Pay) => Cell[], keep: (d: Pay) => unknown = () => true) => () => D.filter(keep).map((d) => [d.ma, d.ten, ...fn(d)]);
const QL: Cell[][] = BPS.filter((b) => !GT.has(b)).map((b) => {
  const ds = D.filter((d) => d.bp === b), q = sum(ds, (d) => d.W + d.X), hs = Math.round(sum(ds, (d) => d.AJ) * 10) / 10;
  return [b, ds.length, q, hs, Math.round(q / hs)];
});
const CVPS: Cell[][] = [...Array(14)]
  .map(() => { const r = pick(R); return [r.ma, r.ten, pick(["Thêu logo ngực", "Thêu chữ tay áo", "Sửa hàng lỗi khách trả", "Tháo – may lại đường diễu", "Ép seam chống thấm"]), r.mh, ri(2, 6) * 4, pick([0, 0, 2, 4]), ri(34, 40) * 10000] as [string, string, string, string, number, number, number]; })
  .map((r) => [...r, Math.round((r[4] / 8) * r[6])]);
export const SUBS: [string, string, string[], () => Cell[][]][] = [
  ["Bảng công", "Chấm công ngày + nghỉ phép theo kỳ 01–31/10/2026", ["Mã NV", "Họ tên", "Bộ phận", "Ngày công", "Giờ làm thường", "Giờ tăng ca", "Giờ CN", "Nghỉ P/Lễ (ngày)", "Loại nghỉ"],
    P((d) => [d.bp, d.G, d.O + d.N + d.L, d.Q + (GT.has(d.bp) ? d.P : 0), d.R, d.H, d.H ? "P – phép năm" : d.M ? "NGV – ngừng việc" : "–"])],
  ["Quỹ lương", "Quỹ lương sản phẩm theo bộ phận (đơn giá tiền lương) · đơn giá/HS = Quỹ ÷ ΣHS QĐ", ["Bộ phận", "Số NV", "Quỹ lương SP", "ΣHS quy đổi", "Đơn giá / HS"], () => QL],
  ["Chế độ", "Giờ thứ 8 (thai sản) và 60 phút cho con bú — đơn giá = MAX(lương SP BQ giờ, lương CB giờ)", ["Mã NV", "Họ tên", "Chế độ", "Số giờ", "Đơn giá giờ", "Số tiền"],
    P((d) => [CHEDO[d.ma], d.I, Math.round(Math.max(d.rate, d.F / GC)), d.AA], (d) => d.I)],
  ["Con nhỏ", "Trợ cấp con nhỏ dưới 7 tuổi · 100.000 đ/con/tháng", ["Mã NV", "Họ tên", "Bộ phận", "Số con", "Mức", "Số tiền"], P((d) => [d.bp, d.con, 100000, d.AF], (d) => d.con)],
  ["BHXH", "Nền đóng = mức lương + phụ cấp · NLĐ 10,5% · công ty 21,5%", ["Mã NV", "Họ tên", "Mức lương", "PC ATVSV", "PC PCCC", "PC xe nâng", "Độc hại", "BS lương", "BHXH 8%", "BHYT 1,5%", "BHTN 1%", "NLĐ tổng", "Công ty 21,5%"],
    P((d) => [d.F, d.pcs.A, d.pcs.P, d.pcs.X, d.pcs.D, 0, ...d.bh, d.AT, Math.round((d.F + d.AG) * 0.215)])],
  ["Bốc xếp", "Tiền bốc xếp theo tháng (khoản mục BOC_XEP)", ["Mã NV", "Họ tên", "Bộ phận", "Tháng", "Số tiền"], P((d) => [d.bp, "10/2026", d.AP], (d) => d.AP)],
  ["Trợ cấp", "Trợ cấp xưởng theo tháng: phần công ty + quỹ xưởng", ["Mã NV", "Họ tên", "Bộ phận", "Công ty", "Quỹ xưởng", "Cộng"], P((d) => [d.bp, Math.min(d.AO, 200000), d.AO - Math.min(d.AO, 200000), d.AO], (d) => d.AO)],
  ["Công đoàn phí", "Danh sách thu công đoàn phí kỳ 10/2026 · 1% nền đóng BHXH", ["Mã NV", "Họ tên", "Bộ phận", "Nền đóng", "Tỷ lệ", "Số tiền"], P((d) => [d.bp, d.F + d.AG, "1%", d.AU])],
  ["Độc hại", "Bồi dưỡng độc hại theo tháng · 15.000 đ/ngày công", ["Mã NV", "Họ tên", "Bộ phận", "Ngày tính", "Mức/ngày", "Số tiền"], P((d) => [d.bp, Math.ceil(d.G), 15000, d.pcs.D], (d) => d.pcs.D)],
  ["Xăng xe", "Hỗ trợ xăng xe = 200.000 / 26 × (ngày công làm tròn lên + ngày CN)", ["Mã NV", "Họ tên", "Bộ phận", "Mức tháng", "Số ngày tính", "Số tiền"], P((d) => [d.bp, 200000, Math.ceil(d.G) + d.R / 8, d.AK], (d) => d.AK)],
  ["HS Phòng Mẫu", "Giờ làm & lương thời gian Phòng Mẫu và khối gián tiếp", ["Mã NV", "Họ tên", "Chức danh", "Giờ TG", "Giờ TC (TGTC)", "Lương TG", "Lương TC"], P((d) => [d.cd, d.N, d.P, d.U, d.V], (d) => d.N)],
  ["Khám SK đầu vào", "Nhân viên mới vào trong kỳ × mức hỗ trợ 150.000", ["Mã NV", "Họ tên", "Bộ phận", "Ngày vào", "Mức", "Số tiền"], P((d) => [d.bp, NGAYVAO[d.ma], 150000, d.AQ], (d) => d.AQ)],
  ["Phi SX", "Giờ huấn luyện (phi sản xuất) · TỔNG = giờ HL + giờ TC × 150%", ["Mã NV", "Họ tên", "Ngày", "Nội dung", "Giờ HL", "Giờ TC", "Tổng quy đổi"],
    () => D.flatMap((d) => d.px.map((r) => [d.ma, d.ten, r[0], r[1], r[2], r[3], r[2] + r[3] * 1.5]))],
  ["Công việc phát sinh", "Việc ngoài định mức (vd thêu) · thành tiền = giờ LV ÷ 8 × lương định mức ngày", ["Mã NV", "Họ tên", "Công việc", "Mã hàng", "Giờ LV", "Giờ TC", "Lương ĐM ngày", "Thành tiền"], () => CVPS],
];
export const SUB_COUNTS = SUBS.map((s) => s[3]().length);

export const PAGE_SIZE = 50;

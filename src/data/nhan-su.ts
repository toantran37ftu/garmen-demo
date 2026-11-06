// Dữ liệu giả — port từ demo-det-may/apps/nhan-su.html (toàn nhà máy 980 người, cập nhật 06/11/2026)
import type { Tone } from "./kho-nguyen-lieu";

export type { Tone };

export type Employee = {
  id: string; name: string; dept: string; team: string; joined: string; contract: string; status: string; birthYear: string;
};

const SEED_ROWS: [string, string, string, string, string, string, string, string][] = [
  ["NV0412", "Nguyễn Thị Hoa", "May", "Chuyền 05", "04/08/2014", "Không thời hạn", "Đang làm", "1979"],
  ["NV0388", "Trần Thị Lan", "May", "Chuyền 05", "05/08/2020", "Không thời hạn", "Đang làm", "1993"],
  ["NV1027", "Võ Thị Mai", "May", "Chuyền 07", "09/11/2025", "12 tháng · hết 09/11", "Đang làm", "1997"],
  ["NV0874", "Bùi Thị Ngọc", "May", "Chuyền 03", "20/02/2021", "Không thời hạn", "Nghỉ thai sản", "1995"],
  ["NV1203", "Lý Thị Hằng", "May", "Chuyền 03", "11/09/2026", "Thử việc · hết 11/11", "Thử việc", "2001"],
  ["NV0961", "Đỗ Văn Hùng", "Cắt", "Tổ cắt 2", "14/04/2022", "36 tháng", "Đang làm", "1988"],
  ["NV0655", "Hồ Văn Tài", "Kho", "Kho vải", "24/11/2023", "12 tháng · hết 24/11", "Đang làm", "1985"],
  ["NV0207", "Ngô Thị Yến", "Hoàn thiện", "Tổ ủi", "02/06/2017", "Không thời hạn", "Đang làm", "1979"],
  ["NV1388", "Phan Thị Thúy", "May", "Chuyền 11", "03/05/2024", "36 tháng", "Đang làm", "1999"],
  ["NV1512", "Lê Văn Đức", "May", "Chuyền 14", "15/01/2025", "24 tháng", "Đang làm", "1996"],
  ["NV0733", "Trương Thị Hạnh", "QA", "QA Xưởng 2", "10/10/2022", "Không thời hạn", "Đang làm", "1991"],
  ["NV1176", "Nguyễn Văn Bình", "Bảo trì", "Tổ cơ điện", "22/07/2025", "36 tháng", "Đang làm", "1992"],
];

/** 12 hồ sơ thật + 48 hồ sơ sinh bằng PRNG cố định (giữ đúng thuật toán bản HTML → cùng danh sách). */
function buildEmployees(): Employee[] {
  const P = SEED_ROWS.map(([id, name, dept, team, joined, contract, status, birthYear]) => ({ id, name, dept, team, joined, contract, status, birthYear }));
  let seed = 980;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const pad = (n: number) => String(n).padStart(2, "0");
  const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Trịnh", "Đinh", "Lương", "Mai", "Cao", "Tạ"];
  const NU = ["Thị Thu", "Thị Hồng", "Thị Ngọc", "Thị Kim", "Thị Thanh", "Thị", "Thị", "Thị Mỹ"];
  const NAM = ["Văn", "Văn", "Đức", "Minh", "Quang", "Hữu"];
  const TNU = ["Hương", "Huyền", "Trang", "Nhung", "Loan", "Thảo", "Dung", "Hiền", "Liên", "Oanh", "Phương", "Quyên", "Sen", "Tâm", "Vân", "Xuân", "Yến", "Duyên", "Hà", "Linh"];
  const TNAM = ["Anh", "Bảo", "Cường", "Dũng", "Hải", "Khánh", "Lâm", "Nam", "Phong", "Quân", "Sơn", "Thắng", "Tuấn", "Việt"];
  // trọng số ~ cơ cấu 980 người: may 675, cắt 55, hoàn thiện 110, QA 28, kho 22, gián tiếp 90
  const DEP: [string, number][] = [["May", 69], ["Cắt", 6], ["Hoàn thiện", 11], ["QA", 3], ["Kho", 2], ["Văn phòng", 4], ["Bảo trì", 2], ["Kỹ thuật", 1], ["Phòng mẫu", 2]];
  const TO: Record<string, () => string> = {
    "Cắt": () => "Bàn cắt " + pad(1 + Math.floor(rnd() * 8)),
    "Hoàn thiện": () => pick(["Tổ ủi", "Tổ đóng gói", "Tổ cắt chỉ"]),
    "QA": () => pick(["QA Xưởng 1", "QA Xưởng 2", "QA thành phẩm"]),
    "Kho": () => pick(["Kho vải", "Kho phụ liệu"]),
    "Văn phòng": () => pick(["Kế toán", "Nhân sự", "Kế hoạch", "Xuất nhập khẩu"]),
    "Bảo trì": () => "Tổ cơ điện",
    "Kỹ thuật": () => "Phòng kỹ thuật",
    "Phòng mẫu": () => "Tổ may mẫu",
    "May": () => "Chuyền " + pad(1 + Math.floor(rnd() * 15)),
  };
  const used = new Set(P.map((p) => p.id));
  const today = new Date(2026, 10, 6).getTime();
  const DAY = 864e5;
  const dmy = (d: Date) => pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  for (let k = 0; k < 48; k++) {
    let r = rnd() * 100;
    const dep = (DEP.find((d) => (r -= d[1]) < 0) ?? DEP[0])[0];
    const nu = ["May", "Hoàn thiện", "QA"].includes(dep) ? rnd() < 0.85 : rnd() < 0.4;
    const name = pick(HO) + " " + (nu ? pick(NU) : pick(NAM)) + " " + (nu ? pick(TNU) : pick(TNAM));
    let id: string;
    do id = "NV" + String(100 + Math.floor(rnd() * 1420)).padStart(4, "0");
    while (used.has(id));
    used.add(id);
    const probation = rnd() < 0.08;
    const vao = probation
      ? new Date(2026, 8, 10 + Math.floor(rnd() * 55))
      : new Date(2015 + Math.floor(rnd() * 11), Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 28));
    let contract: string;
    let status = "Đang làm";
    if (probation) {
      const h = new Date(vao);
      h.setMonth(h.getMonth() + 2);
      contract = "Thử việc · hết " + dmy(h).slice(0, 5);
      status = "Thử việc";
    } else if (today - vao.getTime() > 3 * 365 * DAY) contract = "Không thời hạn";
    else {
      const m = pick([12, 24, 36]);
      const h = new Date(vao);
      h.setMonth(h.getMonth() + m);
      while (h.getTime() < today) h.setMonth(h.getMonth() + m);
      contract = m + " tháng" + (h.getTime() - today < 30 * DAY ? " · hết " + dmy(h).slice(0, 5) : "");
    }
    if (nu && status === "Đang làm" && rnd() < 0.04) status = "Nghỉ thai sản";
    P.push({ id, name, dept: dep, team: TO[dep](), joined: dmy(vao), contract, status, birthYear: String(Math.max(1972, vao.getFullYear() - 18 - Math.floor(rnd() * 25))) });
  }
  return P;
}

export const EMPLOYEES = buildEmployees();
export const TOTAL_STAFF = 980;
export const PAGE_SIZE = 15;

export const STATUS_TONE: Record<string, Tone> = { "Đang làm": "ok", "Thử việc": "info", "Nghỉ thai sản": "violet" };
export const contractTone = (c: string): Tone => (c.includes("hết") ? "warn" : "gray");

export const DEPT_OPTIONS = ["May", "Cắt", "Hoàn thiện", "QA", "Kho", "Bảo trì", "Kỹ thuật", "Phòng mẫu", "Văn phòng"];
/** Bộ lọc chuyền → điều kiện trên cột Chuyền / tổ */
export const LINE_FILTERS: Record<string, (team: string) => boolean> = {
  "Xưởng 1 · Chuyền 01–08": (t) => /^Chuyền 0[1-8]$/.test(t),
  "Xưởng 2 · Chuyền 09–15": (t) => /^Chuyền (09|1[0-5])$/.test(t),
  "Chuyền 05": (t) => t === "Chuyền 05",
  "Chuyền 12": (t) => t === "Chuyền 12",
};

// ---------- Nhập hồ sơ nhanh ----------
export type ScanField = { key: string; label: string; value: string; state?: "y" | "r"; scan?: string };
/** `scan` = dòng chữ tay tương ứng trên ảnh gốc (không có → ô không nằm trên ảnh). */
export const SCAN_FIELDS: ScanField[] = [
  { key: "name", label: "Họ và tên", value: "Trịnh Thị Hương", scan: "Trịnh Thị Hương" },
  { key: "dob", label: "Ngày sinh", value: "14/03/1998", scan: "14/03/1998" },
  { key: "cccd", label: "Số CCCD", value: "038198004512", state: "y", scan: "0381980····2" },
  { key: "home", label: "Quê quán", value: "Thọ Xuân, Thanh Hoá", scan: "Thọ Xuân, Thanh Hoá" },
  { key: "addr", label: "Chỗ ở hiện nay", value: "Khu phố 3, P. Tân Định", state: "y", scan: "Khu phố 3, P. Tân Định" },
  { key: "bank", label: "Số tài khoản", value: "", state: "r", scan: "10203··· ngân hàng ···" },
  { key: "edu", label: "Trình độ", value: "12/12", scan: "12/12" },
  { key: "dept", label: "Bộ phận nhận việc", value: "May · Chuyền 05" },
];
export const SCAN_LABELS: Record<string, string> = {
  name: "Họ và tên:", dob: "Ngày sinh:", cccd: "Số CCCD:", home: "Quê quán:", addr: "Chỗ ở hiện nay:", bank: "Số tài khoản:", edu: "Trình độ:",
};

export type BatchRow = { name: string; pages: number; docs: string; note: string; noteBad?: boolean; result: "Cần xem" | "Sẵn sàng" | "Lỗi file" };
export const BATCH: BatchRow[] = [
  { name: "Trịnh Thị Hương", pages: 4, docs: "Sơ yếu lý lịch, CCCD, bằng cấp", note: "2 ô chưa chắc, 1 ô không đọc được", result: "Cần xem" },
  { name: "Đặng Văn Long", pages: 5, docs: "Sơ yếu lý lịch, CCCD, khám sức khỏe", note: "Trùng CCCD với NV0915", noteBad: true, result: "Cần xem" },
  { name: "Mai Thị Thảo", pages: 4, docs: "Sơ yếu lý lịch, CCCD, bằng cấp", note: "—", result: "Sẵn sàng" },
  { name: "Hà Văn Quý", pages: 3, docs: "Sơ yếu lý lịch, CCCD", note: "—", result: "Sẵn sàng" },
  { name: "Lò Thị Én", pages: 1, docs: "—", note: "Ảnh quá mờ, chụp lại", noteBad: true, result: "Lỗi file" },
];
/** Số đếm của cả lô 12 bộ (bảng chỉ liệt kê 5 bộ tiêu biểu) */
export const BATCH_COUNTS = { ready: 8, review: 3, error: 1 };

// ---------- Hợp đồng ----------
export const EXPIRING = [
  { name: "Võ Thị Mai", line: "Chuyền 07", type: "Xác định thời hạn 12 tháng", end: "09/11/2026", left: 3, lead: "Ký tiếp" },
  { name: "Lý Thị Hằng", line: "Chuyền 03", type: "Thử việc 2 tháng", end: "11/11/2026", left: 5, lead: "Ký chính thức" },
  { name: "Hồ Văn Tài", line: "Kho", type: "Xác định thời hạn 12 tháng", end: "24/11/2026", left: 18, lead: "" },
  { name: "Đặng Thị Kim", line: "Chuyền 08", type: "Xác định thời hạn 36 tháng", end: "02/12/2026", left: 26, lead: "Ký tiếp" },
];

// ---------- Chấm công & nghỉ phép ----------
export const REQUESTS = [
  { name: "Nguyễn Thị Hoa", type: "Nghỉ phép năm", tone: "info" as Tone, time: "10–11/11", reason: "Về quê" },
  { name: "Phạm Thị Thu", type: "Nghỉ ốm", tone: "violet" as Tone, time: "06/11", reason: "Có giấy bác sĩ" },
  { name: "Chuyền 12 (44 người)", type: "Tăng ca", tone: "warn" as Tone, time: "08/11 · 2 giờ", reason: "Kịp đơn xuất" },
  { name: "Bùi Thị Ngọc", type: "Nghỉ thai sản", tone: "ok" as Tone, time: "15/11 – 15/05", reason: "Sinh con" },
];
export const ATTENDANCE_BY_DEPT = [
  { dept: "May", rate: 96 },
  { dept: "Cắt", rate: 97 },
  { dept: "Hoàn thiện", rate: 89 },
  { dept: "QA", rate: 97 },
  { dept: "Kho", rate: 98 },
  { dept: "Văn phòng, bảo trì", rate: 99 },
];

// ---------- Tuyển dụng ----------
export type Candidate = { name: string; info: string; badge?: { text: string; tone: Tone } };
export const KANBAN: { title: string; count: number; cards: Candidate[] }[] = [
  { title: "Mới nộp", count: 74, cards: [
    { name: "Lê Thị Ngân", info: "Công nhân may · 3 năm kinh nghiệm" },
    { name: "Vũ Văn Toàn", info: "Công nhân cắt" },
    { name: "Cao Thị Lụa", info: "Công nhân may · mới" },
  ] },
  { title: "Hẹn thi tay nghề", count: 27, cards: [
    { name: "Đinh Thị Hoài", info: "Thi 07/11 · 8:00" },
    { name: "Tạ Văn Phúc", info: "Thi 07/11 · 8:00" },
  ] },
  { title: "Khám sức khỏe", count: 16, cards: [
    { name: "Hoàng Thị Mơ", info: "Đạt tay nghề bậc 3", badge: { text: "Chờ kết quả khám", tone: "warn" } },
    { name: "Kiều Văn Sơn", info: "Đạt tay nghề bậc 2" },
  ] },
  { title: "Nhận việc", count: 9, cards: [
    { name: "Mai Thị Thảo", info: "Vào Chuyền 05 · 04/11", badge: { text: "Đã nhận", tone: "ok" } },
    { name: "Hà Văn Quý", info: "Vào Cắt · 04/11", badge: { text: "Đã nhận", tone: "ok" } },
  ] },
  { title: "Không đạt", count: 11, cards: [{ name: "Trương Văn Hải", info: "Chưa đạt tay nghề" }] },
];

// ---------- Báo cáo biến động ----------
/** Tuyển mới / nghỉ việc 12 tháng (11/2025 → 10/2026) */
export const MONTHS = [
  { m: "T11", hired: 58, left: 38 }, { m: "T12", hired: 40, left: 47 }, { m: "T1", hired: 36, left: 60 },
  { m: "T2", hired: 70, left: 52 }, { m: "T3", hired: 66, left: 42 }, { m: "T4", hired: 49, left: 34 },
  { m: "T5", hired: 45, left: 37 }, { m: "T6", hired: 42, left: 39 }, { m: "T7", hired: 51, left: 36 },
  { m: "T8", hired: 57, left: 33 }, { m: "T9", hired: 62, left: 41 }, { m: "T10", hired: 52, left: 41 },
];
export const LEAVE_REASONS = [
  { reason: "Chuyển chỗ làm khác", n: 167, tone: "bad" as Tone },
  { reason: "Về quê, việc gia đình", n: 121, tone: "bad" as Tone },
  { reason: "Thu nhập chưa đạt mong muốn", n: 91, tone: "bad" as Tone },
  { reason: "Sức khỏe, thai sản", n: 66, tone: "warn" as Tone },
  { reason: "Hết hợp đồng, không ký tiếp", n: 55, tone: "info" as Tone },
];
export const LINE_CHANGES = [
  { line: "Chuyền 03", start: 46, hired: 2, left: 4, moved: 0, end: 44, rate: "8,7%", tone: "bad" as Tone },
  { line: "Chuyền 05", start: 44, hired: 2, left: 1, moved: 1, end: 46, rate: "2,3%", tone: "ok" as Tone },
  { line: "Chuyền 07", start: 45, hired: 1, left: 2, moved: 0, end: 44, rate: "4,4%", tone: "warn" as Tone },
  { line: "Chuyền 12", start: 43, hired: 3, left: 1, moved: -1, end: 44, rate: "2,3%", tone: "ok" as Tone },
  { line: "Toàn nhà máy", start: 967, hired: 52, left: 41, moved: 0, end: 978, rate: "4,2%", tone: "warn" as Tone, total: true },
];

// ---------- Bản đồ nhân lực hôm nay ----------
export type DayStatus = "Có mặt" | "Đi muộn" | "Nghỉ phép" | "Không phép";
/** absentDays = số ngày vắng trong 30 ngày gần nhất (≥4 → rủi ro nghỉ việc cao); from = chuyền cũ nếu vừa điều chuyển */
export type Worker = { id: string; name: string; step: string; level: number; status: DayStatus; absentDays: number; from?: string };
export const STEPS = ["May cổ", "Tra tay", "Vắt sổ", "May túi", "Diễu, mí", "Đính cúc, thùa khuyết", "Ủi bán thành phẩm", "Kiểm hàng chuyền"];
export const RISK_DAYS = 4;

// [chuyền, biên chế, nghỉ phép, không phép, đi muộn, định biên hôm nay] — biên chế khớp Báo cáo biến động (03=44, 05=46, 07=44, 12=44), tổng 675
const LINE_PLAN: [number, number, number, number, number, number][] = [
  [1, 45, 1, 0, 0, 45], [2, 46, 2, 1, 1, 44], [3, 44, 2, 2, 0, 45], [4, 45, 1, 0, 0, 43], [5, 46, 1, 0, 1, 46],
  [6, 47, 1, 1, 1, 45], [7, 44, 0, 0, 0, 41], [8, 43, 1, 1, 1, 43], [9, 46, 1, 0, 0, 45], [10, 45, 2, 1, 2, 44],
  [11, 44, 1, 1, 0, 42], [12, 44, 2, 2, 1, 45], [13, 47, 1, 0, 0, 44], [14, 46, 1, 1, 2, 46], [15, 43, 1, 0, 0, 42],
];
const lineName = (n: number) => "Chuyền " + String(n).padStart(2, "0");
export const LINE_TARGET: Record<string, number> = Object.fromEntries(LINE_PLAN.map((l) => [lineName(l[0]), l[5]]));

/** Công nhân từng chuyền: hồ sơ có sẵn trong danh sách nhân viên đứng đầu, phần còn lại sinh bằng PRNG cố định. */
export function buildFloor(): Record<string, Worker[]> {
  let seed = 675;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Trịnh", "Đinh", "Mai", "Cao"];
  const TEN = ["Hương", "Huyền", "Trang", "Nhung", "Loan", "Thảo", "Dung", "Hiền", "Liên", "Oanh", "Phương", "Quyên", "Tâm", "Vân", "Xuân", "Duyên", "Hà", "Linh"];
  const used = new Set(EMPLOYEES.map((e) => e.id));
  let next = 100;
  const newId = () => {
    while (used.has("NV" + String(next).padStart(4, "0"))) next++;
    used.add("NV" + String(next).padStart(4, "0"));
    return "NV" + String(next++).padStart(4, "0");
  };
  const out: Record<string, Worker[]> = {};
  for (const [n, hc, leave, awol, late] of LINE_PLAN) {
    const line = lineName(n);
    const known = EMPLOYEES.filter((e) => e.team === line && e.status !== "Nghỉ thai sản");
    out[line] = Array.from({ length: hc }, (_, i) => {
      const k = known[i];
      const nu = rnd() < 0.85;
      let name = k ? k.name : pick(HO) + " " + (nu ? "Thị " + pick(TEN) : "Văn " + pick(["Hùng", "Nam", "Tuấn", "Sơn"]));
      const status: DayStatus =
        i >= hc - awol ? "Không phép" : i >= hc - awol - leave ? "Nghỉ phép" : i >= 6 && i < 6 + late ? "Đi muộn" : "Có mặt";
      if (line === "Chuyền 12" && i === hc - awol - leave) name = "Phạm Thị Thu"; // đơn nghỉ ốm 06/11 ở màn Chấm công
      const absentDays = status === "Không phép" ? 3 + Math.floor(rnd() * 4) : rnd() < 0.07 ? 4 + Math.floor(rnd() * 2) : Math.floor(rnd() * 3);
      const level = k?.status === "Thử việc" ? 1 : 1 + Math.floor(rnd() * 5);
      return { id: k ? k.id : newId(), name, step: STEPS[i % STEPS.length], level, status, absentDays };
    });
  }
  return out;
}

/** Bộ phận ngoài chuyền may: biên chế / có mặt (khớp tỉ lệ đi làm theo bộ phận) */
export const AREAS = [
  { name: "Hoàn thiện", note: "Ủi · cắt chỉ · đóng gói", hc: 110, present: 98 },
  { name: "QA", note: "QA Xưởng 1, 2, thành phẩm", hc: 28, present: 27 },
  { name: "Kho NPL", note: "Kho vải · phụ liệu", hc: 22, present: 22 },
  { name: "Văn phòng", note: "Gián tiếp · kỹ thuật · mẫu", hc: 90, present: 89 },
];
/** 8 bàn cắt: [biên chế, có mặt] — tổng 55 / 53 */
export const CUT_TABLES: [number, number][] = [[7, 7], [7, 7], [7, 6], [7, 7], [7, 7], [7, 6], [7, 7], [6, 6]];
export const TODAY_ABSENCE = { leave: 28, awol: 16, lateOutsideLines: 3, newThisWeek: 9 };

export type Move = { from: string; to: string; n: number; step: string; why: string; fit: number };
export const MOVES: Move[] = [
  { from: "Chuyền 07", to: "Chuyền 12", n: 3, step: "May cổ", fit: 94, why: "Chuyền 07 dư 3 (mã áo thun đơn giản), Chuyền 12 thiếu 5 khi đang chạy đơn xuất — cùng tay nghề may cổ, bậc ≥3." },
  { from: "Chuyền 13", to: "Chuyền 03", n: 2, step: "Tra tay", fit: 88, why: "Chuyền 03 mới vào mã VAY-XOE-1105, năng suất 81% — thêm 2 thợ tra tay vững tay từ Chuyền 13 đang dư 2." },
  { from: "Chuyền 04", to: "Chuyền 14", n: 1, step: "Vắt sổ", fit: 81, why: "Chuyền 04 dư 1 sau khi cân chuyền — chuyển 1 thợ vắt sổ sang Chuyền 14 (thiếu 2)." },
];

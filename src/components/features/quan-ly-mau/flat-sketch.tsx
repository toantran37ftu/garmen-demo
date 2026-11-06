import type { ReactNode, SVGProps } from "react";
import { type Callout, type Kind, LB, MEAS } from "@/data/quan-ly-mau";

/* Hình phẳng kỹ thuật (flat sketch): vẽ nửa trái rồi lật đối xứng qua x=100. */
export const INK = "#1F2329";
const RED = "#DC2626";

/** Pha màu với trắng: a=1 giữ nguyên, a=0 trắng. */
export const mix = (c: string, a: number) => {
  if (c.length === 4) c = "#" + [...c.slice(1)].map((x) => x + x).join("");
  return "#" + [1, 3, 5].map((i) => Math.round(255 - (255 - parseInt(c.substr(i, 2), 16)) * a).toString(16).padStart(2, "0")).join("");
};
const mir = (d: string) =>
  d.replace(/([MLQC])([^MLQCZ]*)/g, (_, c: string, n: string) => c + n.trim().split(/[\s,]+/).map((v, i) => (i % 2 ? v : 200 - +v)).join(" ") + " ");
const both = (d: string) => d + " " + mir(d);
/** Nửa trái (đầu & cuối nằm trên x=100, chỉ M/L/Q/C tuyệt đối) → đường bao kín đối xứng. */
export function sym(d: string) {
  const seg = [...d.matchAll(/([MLQC])([^MLQC]*)/g)].map((m) => [m[1], m[2].trim().split(/[\s,]+/).map(Number)] as const);
  let r = d;
  for (let i = seg.length - 1; i > 0; i--) {
    const [c, n] = seg[i], e = seg[i - 1][1].slice(-2), p: number[] = [];
    for (let j = n.length - 4; j >= 0; j -= 2) p.push(200 - n[j], n[j + 1]);
    r += ` ${c}${[...p, 200 - e[0], e[1]].join(" ")}`;
  }
  return r + " Z";
}
console.assert(sym("M100 0 L50 10 Q60 15 100 20") === "M100 0 L50 10 Q60 15 100 20 Q140 15 150 10 L100 0 Z", "sym");

const Btn = ({ x, y, r = 2.4 }: { x: number; y: number; r?: number }) => (
  <>
    <circle cx={x} cy={y} r={r} fill="#fff" />
    <circle cx={x - r * 0.32} cy={y} r={r * 0.17} fill={INK} stroke="none" />
    <circle cx={x + r * 0.32} cy={y} r={r * 0.17} fill={INK} stroke="none" />
  </>
);
const Loop = ({ x, fill }: { x: number; fill: string }) => <rect x={x - 2.5} y={8.5} width={5} height={16} rx={0.8} fill={fill} />;

/** Một nhóm nét: o = đường bao (tô màu), f = nếp vải, l/L = đường may (L không lật), s/S = diễu, z/Z = răng khóa, x = chi tiết thêm. */
type G = { o: string[]; f?: string; l?: string; L?: string; s?: string; S?: string; z?: string; Z?: string; x?: (fill: string) => ReactNode };
const SH = Array.from({ length: 10 }, (_, i) => `M${42 + i * 5} 13.5 L${42 + i * 5} 24.5`).join(" ");
const POLO = "M100 22 Q88 22 82 14 L48 26 L14 70 L34 84 L44 66 L42 198 Q70 201 100 201", TEE = " L46 23 L14 66 L32 80 L44 62 L44 200 L100 200";
const SOMI = " L52 24 C42 60 30 110 16 148 L14 166 L36 169 L38 151 C44 120 52 90 58 64 C54 90 58 110 62 124";
const JK = "M100 4 C80 4 66 16 66 38 L68 44 L40 54 L14 166 L14 184 L36 186 L36 168 L50 88 L48 190 L48 202 L100 203";
const JKL = "M40 54 Q50 70 50 88 M14 166 L36 168 M19 166.5 L19 184.5 M24.5 167 L24.5 185 M30 167.5 L30 185.5 M48 190 L100 191";
const JKS = "M34 80 L49.3 92 M28.4 104 L45.5 114 M22.8 128 L41.3 138 M17.3 152 L37 162 M48 199 L100 200 M43 55 Q53 70 53 88";
const KK = "M100 10 L40 10 L38 24 Q32 60 34 92 L38 208 L88 208 L98 94 Q99 88 100 86", SHO = "M100 10 L36 10 L36 28 Q28 60 30 92 L32 140 L90 140 L97 100 Q99 92 100 90";
const VAY = "M100 12 L64 12 L64 24 C56 70 30 140 14 196 Q56 212 100 212";

const F: Record<Kind, Record<"front" | "back", G[]>> = {
  polo: {
    front: [
      { o: [POLO], l: "M48 26 Q54 46 44 66 M17.4 65.1 L37.4 79.1 M42 186 L47 186", s: "M51 27 Q57 47 47 67 M42 194 Q70 197 100 197",
        L: "M93 24 L93 84 L107 84 L107 24", S: "M95 26 L95 82 L105 82 L105 26 M95 77 L105 77",
        x: () => (<><Btn x={100} y={42} /><Btn x={100} y={58} /><Btn x={100} y={74} /><ellipse cx={128} cy={62} rx={7} ry={4.5} strokeDasharray="1.2 1" /></>) },
      { o: ["M100 9 Q88 9 80 13 L84 47 L96 33 Q97 25 100 22"], l: "M83 15.5 L86.5 43" },
    ],
    back: [
      { o: ["M100 12 Q88 12 82 14 L48 26 L14 70 L34 84 L44 66 L42 200 Q70 206 100 206"], l: "M48 26 Q54 46 44 66 M17.4 65.1 L37.4 79.1 M42 188 L47 188", s: "M51 27 Q57 47 47 67 M42 196 Q70 202 100 202" },
      { o: ["M100 8 Q88 8 80 13 L81 24 Q92 26 100 26"], l: "M80.7 21 Q92 23 100 23" },
    ],
  },
  thun: {
    front: [
      { o: ["M100 15 Q90 15 80 12 L80 16 L100 30"], x: () => <rect x={95} y={16.5} width={10} height={6} rx={0.5} fill="#fff" /> },
      { o: ["M100 30 Q87 30 80 14" + TEE], l: "M46 23 Q52 42 44 62", s: "M15.8 63.6 L33.8 77.6 M17 62 L35 76 M44 194 L100 194 M44 196.5 L100 196.5",
        x: () => <rect x={80} y={54} width={40} height={24} stroke="#9CA3AF" strokeDasharray="3 2" /> },
      { o: ["M100 27 Q88 27 83 13 L79 14 Q86 32 100 32"], s: "M79.5 16.5 Q87 34.5 100 34.5" },
    ],
    back: [
      { o: ["M100 14 Q88 14 80 13" + TEE], l: "M46 23 Q52 42 44 62", s: "M15.8 63.6 L33.8 77.6 M17 62 L35 76 M44 194 L100 194 M44 196.5 L100 196.5" },
      { o: ["M100 13 Q90 13 80 12.5 L79 17 Q90 19 100 19"], s: "M79 20 Q90 22 100 22" },
    ],
  },
  somi: {
    front: [
      { o: ["M100 24 Q88 24 84 13" + SOMI + " L57 186 Q76 201 100 200"], l: "M52 24 Q60 44 58 64 M16 148 L38 151 M78 98 L80 128 L78 160 M56.5 90 L74 97",
        s: "M17.4 151.2 L37.5 154 M15.5 163 L35.7 166 M57.5 182 Q76 196 100 196", L: "M95 24 L95 199.6 M105 24 L105 199.6", S: "M96.5 28 L96.5 199.5 M103.5 28 L103.5 199.5",
        x: () => (<>{[40, 64, 88, 112, 136, 160, 184].map((y) => <Btn key={y} x={100} y={y} />)}<Btn x={21} y={158.5} r={2} /><Btn x={179} y={158.5} r={2} /></>) },
      { o: ["M100 8 Q88 7 82 11 L80 22 L86 44 L97 30 Q98 26 100 25"], l: "M81.5 14 Q91 16 100 16", s: "M84 13 L82 22 L87 41 L95.5 31" },
    ],
    back: [
      { o: ["M100 12 Q88 12 84 13" + SOMI + " L57 188 Q76 204 100 203"], l: "M52 24 Q60 44 58 64 M16 148 L38 151 M54 36 Q76 38 100 38 M80 78 L82 122 L80 166 M27 150 L30 132",
        L: "M96 38 L95 58 M104 38 L105 58", s: "M17.4 151.2 L37.5 154 M15.5 163 L35.7 166 M54.3 41 Q76 41 100 41 M57.5 184 Q76 199 100 199",
        x: () => (<><Btn x={31} y={158.5} r={2} /><Btn x={169} y={158.5} r={2} /></>) },
      { o: ["M100 6 Q88 6 82 11 L82 22 Q92 24 100 24"], s: "M82.3 20 Q92 22 100 22" },
    ],
  },
  khoac: {
    front: [
      { o: [JK], l: JKL + " M60 128 L66 126 L74 160 L68 162 L60 128 M92 16 Q91 9 93 4.2 M68 44 Q76 50 82 56",
        s: JKS + " M49 80 L95 80 M49.6 104 L95 104 M49.2 126 L95 126 M48.8 148 L95 148 M48.4 170 L95 170", z: "M63 127 L71 161",
        L: "M97.5 60 L97.5 199 M102.5 60 L102.5 199", S: "M95.5 60 L95.5 199 M104.5 60 L104.5 199", Z: "M100 60 L100 199",
        x: () => (
          <>
            <rect x={97.8} y={61} width={4.4} height={7} rx={1} fill="#fff" />
            <rect x={98.6} y={68} width={2.8} height={9} rx={1.2} fill="#fff" />
            <rect x={118} y={70} width={18} height={10} rx={1} strokeDasharray="2 1.5" />
            <path d="M53 196 L56 207 M147 196 L144 207" />
            <rect x={52.5} y={206} width={6} height={8} rx={2} fill="#fff" />
            <rect x={141.5} y={206} width={6} height={8} rx={2} fill="#fff" />
            <circle cx={53} cy={196} r={1.5} fill="#fff" />
            <circle cx={147} cy={196} r={1.5} fill="#fff" />
          </>
        ) },
      { o: ["M100 16 C86 16 78 26 78 40 Q78 54 94 60 L100 60"], s: "M100 19.5 C88 19.5 81.5 28 81.5 40 Q81.5 51.5 95 57",
        x: () => (
          <>
            <path d="M86 59.6 L84 74 M114 59.6 L116 74" />
            <circle cx={86} cy={58} r={1.6} fill="#fff" />
            <circle cx={114} cy={58} r={1.6} fill="#fff" />
            <rect x={81} y={73} width={6} height={8} rx={2} fill="#fff" />
            <rect x={113} y={73} width={6} height={8} rx={2} fill="#fff" />
          </>
        ) },
    ],
    back: [
      { o: [JK], l: JKL + " M92 4.3 C88 18 88 32 92 46 M68 44 Q84 50 100 50",
        s: JKS + " M49 80 L100 80 M49.6 104 L100 104 M49.2 126 L100 126 M48.8 148 L100 148 M48.4 170 L100 170 M94.5 4.5 C90.5 18 90.5 32 94.5 46.5",
        x: () => <rect x={92} y={54} width={16} height={6} rx={1} strokeDasharray="1.5 1" /> },
    ],
  },
  kaki: {
    front: [
      { o: [KK], l: "M38.4 22 L100 22 M68 22 Q62 48 33.5 59", s: "M40 12.5 L100 12.5 M39 19.5 L100 19.5 M71 22 Q65 50 33.6 62.5 M38 203 L88.4 203",
        L: "M100 22 L100 86", S: "M108 22 L108 70 Q108 80 100.5 84",
        x: (fill) => (
          <>
            {[50, 150, 76, 124].map((x) => <Loop key={x} x={x} fill={fill} />)}
            <circle cx={100} cy={16} r={3.2} fill="#fff" />
            <circle cx={100} cy={16} r={1.5} />
            <circle cx={66.5} cy={25.5} r={1.1} />
            <circle cx={133.5} cy={25.5} r={1.1} />
          </>
        ) },
    ],
    back: [
      { o: [KK], l: "M38.4 22 L100 22 M54 44 L82 44 L82 48 L54 48 L54 44 M70 22 L70.6 40",
        s: "M40 12.5 L100 12.5 M39 19.5 L100 19.5 M38 203 L88.4 203 M52.5 42.5 L83.5 42.5 L83.5 49.5 L52.5 49.5 L52.5 42.5",
        L: "M100 22 L100 86", S: "M102.5 22 L102.5 84",
        x: (fill) => (
          <>
            {[56, 144, 100].map((x) => <Loop key={x} x={x} fill={fill} />)}
            <Btn x={68} y={53} r={2.2} />
            <Btn x={132} y={53} r={2.2} />
            <rect x={110} y={12.5} width={13} height={7} rx={1} fill="#fff" />
          </>
        ) },
    ],
  },
  short: {
    front: [
      { o: [SHO], f: SH, l: "M36 28 L100 28 M62 28 Q58 50 30.5 60 M31.5 128 L92.1 128",
        s: "M37 25.5 L100 25.5 M37 12.5 L100 12.5 M65 28 Q61 53 30.6 63.5 M31.7 131 L91.6 131 M32 136.5 L90.6 136.5", L: "M100 28 L100 90", S: "M106 28 L106 66 Q106 76 100.5 80",
        x: () => (
          <>
            <path d="M95 21.5 Q93 36 90 46 M105 21.5 Q107 36 110 46" />
            <path d="M90 46 L89 52 M110 46 L111 52" strokeWidth={2.6} />
            <circle cx={95} cy={20} r={1.8} fill="#fff" />
            <circle cx={105} cy={20} r={1.8} fill="#fff" />
          </>
        ) },
    ],
    back: [
      { o: [SHO], f: SH, l: "M36 28 L100 28 M31.5 128 L92.1 128", s: "M37 25.5 L100 25.5 M37 12.5 L100 12.5 M31.7 131 L91.6 131 M32 136.5 L90.6 136.5",
        L: "M100 28 L100 90 M54 48 L80 48 L80 74 L67 80 L54 74 L54 48", S: "M56 50.5 L78 50.5 M56 48 L56 73 L67 78 L78 73 L78 48 M102.5 28 L102.5 88",
        x: () => <rect x={80} y={54} width={4} height={9} fill="#fff" /> },
    ],
  },
  vay: {
    front: [{ o: [VAY], f: "M80 25 Q76 110 58 207 M91 25 Q92 120 84 210", l: "M64 24 L100 24", s: "M65 14.5 L100 14.5 M65 21.5 L100 21.5 M16 191 Q56 207 100 207" }],
    back: [
      { o: [VAY], f: "M80 52 Q76 110 58 207 M91 96 Q92 140 84 210", l: "M64 24 L100 24 M80 24 L81 50", s: "M65 14.5 L100 14.5 M65 21.5 L100 21.5 M16 191 Q56 207 100 207",
        L: "M100 12 L100 212",
        x: () => (
          <>
            <path d="M100 24 L100 90" strokeWidth={1.6} />
            <rect x={98.6} y={89} width={2.8} height={6} rx={1} fill="#fff" />
            <path d="M97 18 L103 18" strokeWidth={1.6} />
          </>
        ) },
    ],
  },
};

const Ln = ({ a, b, ...at }: { a?: string; b?: string } & SVGProps<SVGPathElement>) =>
  a || b ? <path d={`${a ? both(a) : ""} ${b || ""}`} {...at} /> : null;

/**
 * Hình phẳng kỹ thuật một mặt. `color` tô theo phối màu; `viewBox` để phóng to chi tiết;
 * `overlay` vẽ chồng (callout, cách đo, vị trí nhãn); `thumb` = bản thu nhỏ (nét đậm, bỏ nét đứt).
 */
export function FlatSketch({
  k, side, color, viewBox, overlay, thumb, className,
}: {
  k: Kind; side: "front" | "back"; color?: string | null; viewBox?: string; overlay?: ReactNode; thumb?: boolean; className?: string;
}) {
  const fill = color ? mix(color, 0.42) : "#fff";
  return (
    <svg
      viewBox={viewBox || "0 0 200 220"}
      xmlns="http://www.w3.org/2000/svg"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={thumb ? `size-full [&_[stroke-dasharray]]:hidden ${className ?? ""}` : className}
      aria-hidden
    >
      {F[k][side].map((g, i) => (
        <g key={i}>
          <g fill={fill} stroke={INK} strokeWidth={thumb ? 4 : 1.5}>
            {g.o.map((d) => <path key={d} d={sym(d)} />)}
          </g>
          <g fill="none" stroke={INK} strokeWidth={thumb ? 2.2 : 1}>
            <Ln a={g.f} stroke="#9CA3AF" strokeWidth={0.8} />
            <Ln a={g.l} b={g.L} />
            <Ln a={g.s} b={g.S} strokeWidth={0.7} strokeDasharray="2.2 1.6" />
            <Ln a={g.z} b={g.Z} strokeWidth={2.6} strokeDasharray="1 1" strokeLinecap="butt" />
            {g.x?.(fill)}
          </g>
        </g>
      ))}
      {overlay}
    </svg>
  );
}

/** Vòng số đỏ chỉ vào chi tiết. `w` = bề rộng viewBox để co kích thước. */
export function Callouts({ calls, w }: { calls: (Callout | [number, number, number, number])[]; w: number }) {
  const r = w * 0.045, sw = r * 0.22;
  return (
    <>
      {calls.map((c, i) => (
        <g key={i}>
          <path d={`M${c[0]} ${c[1]} L${c[2]} ${c[3]}`} stroke={RED} strokeWidth={sw} />
          <circle cx={c[0]} cy={c[1]} r={r * 0.3} fill={RED} />
          <circle cx={c[2]} cy={c[3]} r={r} fill="#fff" stroke={RED} strokeWidth={sw} />
          <text x={c[2]} y={c[3] + r * 0.42} fontSize={r * 1.15} fontWeight={700} fill={RED} textAnchor="middle" fontFamily="system-ui,sans-serif">{i + 1}</text>
        </g>
      ))}
    </>
  );
}

/** Ô vị trí nhãn chính & nhãn sườn trên mặt sau. */
export function LabelOverlay({ k }: { k: Kind }) {
  const [[nx, ny], [sx, sy]] = LB[k];
  const box = (x: number, y: number, w: number, h: number) => (
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#FEE2E2" stroke={RED} strokeWidth={0.8} strokeDasharray="2 1" />
  );
  return (
    <>
      {box(nx, ny, 12, 7)}
      {box(sx, sy, 6, 12)}
      <Callouts calls={[[nx, ny, nx + 30, ny + 26], [sx, sy, sx + 28, sy - 24]]} w={200} />
    </>
  );
}

/** Đường đo POM (A, B, C…) trên mặt trước. */
export function MeasureOverlay({ k }: { k: Kind }) {
  return (
    <>
      {MEAS[k].map(([c, x1, y1, x2, y2, t]) => {
        const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = (-dy / l) * 3, ny = (dx / l) * 3, mx = x1 + dx * t, my = y1 + dy * t;
        return (
          <g key={c}>
            <path d={`M${x1} ${y1} L${x2} ${y2} M${x1 - nx} ${y1 - ny} L${x1 + nx} ${y1 + ny} M${x2 - nx} ${y2 - ny} L${x2 + nx} ${y2 + ny}`} stroke={RED} strokeWidth={0.9} />
            <circle cx={mx} cy={my} r={5} fill="#fff" stroke={RED} strokeWidth={0.9} />
            <text x={mx} y={my + 2.3} fontSize={6.5} fontWeight={700} fill={RED} textAnchor="middle" fontFamily="system-ui,sans-serif">{c}</text>
          </g>
        );
      })}
    </>
  );
}

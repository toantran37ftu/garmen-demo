import type { ReactNode } from "react";
import { mix } from "./flat-sketch";

const Tx = ({ s, y, f = 6, c = "#1F2937" }: { s: string; y: number; f?: number; c?: string }) => (
  <text x={17} y={y} fontSize={f} fontWeight={700} fill={c} stroke="none" textAnchor="middle" fontFamily="system-ui,sans-serif">{s}</text>
);
const Metal = ({ r }: { r: number }) => (
  <>
    <circle cx={17} cy={17} r={r} fill="#D1D5DB" />
    <circle cx={17} cy={17} r={r * 0.62} fill="#EEF0F3" />
    <circle cx={17} cy={17} r={r * 0.22} />
  </>
);
const G3 = Array.from({ length: 7 }, (_, i) => `M5 ${8 + i * 3} L29 ${8 + i * 3} M${8 + i * 3} 5 L${8 + i * 3} 29`).join(" ");
const DG = Array.from({ length: 9 }, (_, i) => { const s = 12 + i * 5, a = Math.max(5, s - 29), b = Math.min(29, s - 5); return `M${a} ${b} L${b} ${a}`; }).join(" ");

/** Biểu tượng loại vật tư trong BOM (vải, lót, dây kéo, cúc, nhãn…), tô theo màu phối `col`. */
export function BomIcon({ t, col }: { t: string; col: string }) {
  const L = mix(col, 0.5);
  const s: Record<string, ReactNode> = {
    vai: <><path d="M5 5H29V24L24 29H5Z" fill={L} /><path d={DG} strokeOpacity={0.3} strokeWidth={0.7} /><path d="M29 24H24V29Z" fill="#fff" /></>,
    lot: <><rect x={5} y={5} width={24} height={24} fill="#fff" /><path d={G3} strokeOpacity={0.35} strokeWidth={0.6} /></>,
    gon: <><rect x={5} y={5} width={24} height={24} rx={3} fill="#fff" /><path d="M5 17L17 5L29 17L17 29Z M11 11L23 23 M23 11L11 23" strokeDasharray="1.5 1.2" strokeOpacity={0.6} /></>,
    zip: <><rect x={12} y={2} width={10} height={30} fill={L} /><path d="M17 2V32" strokeWidth={3} strokeDasharray="1 1" /><rect x={14} y={6} width={6} height={7} rx={1.5} fill="#D1D5DB" /><rect x={15.5} y={12} width={3} height={9} rx={1.5} fill="#D1D5DB" /></>,
    rib: <><rect x={5} y={8} width={24} height={18} fill={L} /><path d={[8, 10.5, 13, 15.5, 18, 20.5, 23, 25.5].map((x) => `M${x} 8V26`).join(" ")} strokeOpacity={0.4} /></>,
    cord: <><path d="M3 28 C10 6 17 30 24 12" strokeWidth={2.4} stroke={mix(col, 0.85)} /><rect x={21} y={3} width={8} height={11} rx={3.5} fill="#D1D5DB" /><circle cx={25} cy={8.5} r={1.4} /></>,
    snap: <Metal r={12} />,
    rivet: <Metal r={8} />,
    eyelet: <><circle cx={17} cy={17} r={10} fill={L} /><circle cx={17} cy={17} r={5} fill="#fff" /><circle cx={17} cy={17} r={7.5} strokeDasharray="1 .8" /></>,
    btn: <><circle cx={17} cy={17} r={12} fill={L} /><circle cx={17} cy={17} r={9} strokeOpacity={0.35} />{[[14.5, 14.5], [19.5, 14.5], [14.5, 19.5], [19.5, 19.5]].map((p) => <circle key={p.join()} cx={p[0]} cy={p[1]} r={1.3} fill="#374151" />)}</>,
    nhan: <><rect x={3} y={10} width={28} height={14} rx={1} fill="#1F2937" /><path d="M6 10V24 M28 10V24" stroke="#9CA3AF" /><Tx s="LOGO" y={19.3} f={5.5} c="#fff" /></>,
    size: <><rect x={9} y={9} width={16} height={16} rx={1} fill="#fff" /><Tx s="M" y={20.5} f={8} /></>,
    care: <><rect x={10} y={2} width={14} height={30} rx={1} fill="#fff" /><path d="M13 7L14 11H20L21 7 M14 19L17 14L20 19Z" strokeWidth={0.8} /><rect x={14} y={22} width={6} height={6} strokeWidth={0.8} /><circle cx={17} cy={25} r={2} strokeWidth={0.8} /></>,
    po: <><rect x={6} y={7} width={22} height={20} rx={1} fill="#fff" /><path d={[9, 10.5, 12.8, 14, 16.5, 17.6, 19.8, 21.5, 23, 24.8].map((x) => `M${x} 10V21`).join(" ")} strokeWidth={0.9} /><Tx s="PO" y={26} f={4.5} /></>,
    ep: <><rect x={5} y={5} width={24} height={24} fill="#fff" strokeDasharray="2 1.5" /><path d="M10 23L17 10L24 23Z" fill={L} /></>,
    emb: <><circle cx={17} cy={17} r={11} fill="#fff" strokeDasharray="1.5 1" /><path d={Array.from({ length: 8 }, (_, i) => `M${11 + i * 1.7} 11 L${10 + i * 1.7} 23`).join(" ")} stroke={mix(col, 0.85)} strokeWidth={1.1} /></>,
    chi: <><path d="M11 30L14 6H20L23 30Z" fill={L} /><path d="M12 25H22 M12.6 20H21.4 M13.2 15H20.8 M13.8 10H20.2" strokeOpacity={0.4} /><path d="M8 30.5H26" strokeWidth={2} /></>,
    kim: <><path d="M7 29L26 6" strokeWidth={1.6} /><ellipse cx={24} cy={8.4} rx={1.8} ry={0.7} transform="rotate(-50 24 8.4)" fill="#fff" /></>,
    tape: <><path d="M15 28H31V23H22" fill={L} /><circle cx={15} cy={17} r={11} fill={L} /><circle cx={15} cy={17} r={5} fill="#fff" /></>,
    rap: <><path d="M6 4H24L29 12V30H6Z" fill="#FEF3C7" /><path d="M17 9V25 M14.5 12L17 9L19.5 12 M14.5 22L17 25L19.5 22" strokeWidth={0.9} /><path d="M6 17H9" /></>,
    tag: <><path d="M10 8L17 3L24 8V31H10Z" fill="#E7D3B0" /><circle cx={17} cy={8} r={1.4} fill="#fff" /><path d="M13 16H21 M13 19.5H21 M13 23H19" strokeOpacity={0.5} /></>,
    pe: <><rect x={5} y={3} width={24} height={28} rx={1} fill="#EFF6FF" strokeOpacity={0.6} /><path d="M5 8H29" strokeDasharray="1.5 1" /><path d="M9 24H25 M9 27H20" stroke="#DC2626" strokeWidth={0.8} /></>,
    carton: <><path d="M4 11L17 5L30 11V26L17 32L4 26Z" fill="#D6B98C" /><path d="M4 11L17 17L30 11 M17 17V32 M10.5 8L23.5 14" strokeOpacity={0.7} /></>,
    silica: <><rect x={7} y={6} width={20} height={22} rx={2} fill="#fff" strokeDasharray="1.5 1" /><Tx s="SILICA" y={15} f={4} /><Tx s="GEL" y={21} f={4} /></>,
    hanger: <path d="M17 12C17 9 20.5 9 20.5 6C20.5 3.5 15 3.5 15 6 M17 12L3 24H31Z" strokeWidth={1.4} />,
    mex: <><rect x={5} y={5} width={24} height={24} fill="#fff" /><path d={Array.from({ length: 36 }, (_, i) => `M${8 + (i % 6) * 3.6} ${8 + Math.floor(i / 6) * 3.6}h.01`).join(" ")} strokeWidth={1.3} strokeLinecap="round" strokeOpacity={0.5} /></>,
    chun: <><rect x={3} y={11} width={28} height={12} fill="#fff" /><path d={`M3 17${Array.from({ length: 9 }, (_, i) => `L${4.5 + i * 3} ${i % 2 ? 20 : 14}`).join("")}`} strokeWidth={0.8} /></>,
    hook: <><path d="M6 13H19C24 13 24 19 19 19H13" strokeWidth={1.8} stroke="#6B7280" /><path d="M14 24H28 M14 24C10 24 10 29 14 29H28" strokeWidth={1.8} stroke="#6B7280" /></>,
  };
  return (
    <svg viewBox="0 0 34 34" fill="none" stroke="#374151" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" className="block size-[34px] rounded-md border bg-white" aria-hidden>
      {s[t]}
    </svg>
  );
}

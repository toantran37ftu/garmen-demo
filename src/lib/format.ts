/** Định dạng số kiểu Việt Nam: 1.234.567 · 8,2 */
export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("vi-VN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** 8.126.400.000 → "8,13 tỷ"; 7.450.000 → "7,45 tr" */
export const money = (n: number) =>
  Math.abs(n) >= 1e9 ? `${fmt(n / 1e9, 2)} tỷ` : Math.abs(n) >= 1e6 ? `${fmt(n / 1e6, 2)} tr` : fmt(n);

/** Bộ sinh số giả ngẫu nhiên có seed — dữ liệu demo ổn định giữa các lần tải. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

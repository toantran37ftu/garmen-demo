import { Badge } from "@erp/miniapp-ui";
import { RISK_LABEL, type Risk } from "@/data/theo-doi-van-hanh";

/** "a **b** c" → a <b>b</b> c */
export const rich = (s: string) => s.split("**").map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));

export function RiskBadge({ lv }: { lv: Risk }) {
  return lv === "cao" ? (
    <Badge variant="destructive">{RISK_LABEL.cao}</Badge>
  ) : (
    <Badge variant="outline" className="border-warning text-warning">{RISK_LABEL.tb}</Badge>
  );
}

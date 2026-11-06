import type { ReactNode } from "react";
import { CWS, DET, type Kind, MEAS, POMS } from "@/data/quan-ly-mau";
import { Callouts, FlatSketch, LabelOverlay, MeasureOverlay } from "./flat-sketch";

type PageDef = [string, ReactNode, [string | number, string][]?];

/** Các trang hình vẽ của techpack (mặt trước/sau, chi tiết có callout, vị trí nhãn, phối màu, cách đo). */
export function Gallery({ k, color }: { k: Kind; color: string | null }) {
  const CW = CWS[k], POM = POMS[k];
  const P: PageDef[] = [
    ["Hình phẳng – mặt trước", <FlatSketch k={k} side="front" color={color} className="size-full" />],
    ["Hình phẳng – mặt sau", <FlatSketch k={k} side="back" color={color} className="size-full" />],
    ...DET[k].map(([title, side, vb, calls]): PageDef => [
      title,
      <FlatSketch k={k} side={side} color={color} viewBox={vb} className="size-full" overlay={<Callouts calls={calls} w={+vb.split(" ")[2]} />} />,
      calls.map((c, i) => [i + 1, c[4]]),
    ]),
    ["Vị trí nhãn", <FlatSketch k={k} side="back" color={color} className="size-full" overlay={<LabelOverlay k={k} />} />,
      [[1, "Nhãn chính + nhãn size, giữa sau; treo thẻ bài"], [2, "Nhãn HDSD + nhãn PO, sườn trái mặt trong"]]],
    ["Phối màu", (
      <div className="grid size-full grid-cols-2 gap-1">
        {CW.map(([name, hex]) => (
          <div key={name} className="text-center text-xs">
            <FlatSketch k={k} side="front" color={hex} className="h-[92px] w-full" />
            <div><i className="mr-1 inline-block size-2.5 rounded-sm border border-black/20 align-[-1px]" style={{ background: hex }} />{name}</div>
          </div>
        ))}
      </div>
    )],
    ["Cách đo (POM)", <FlatSketch k={k} side="front" className="size-full" overlay={<MeasureOverlay k={k} />} />,
      MEAS[k].map((m) => [m[0], POM.find((p) => p[0] === m[0])![1]])],
  ];
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5 bg-muted p-3.5">
      {P.map(([title, body, notes], i) => (
        <div key={title} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <b>{title}</b>
            <span className="text-xs text-muted-foreground">Tr. {i + 2}</span>
          </div>
          <div className="grid h-[250px] place-items-center p-2">{body}</div>
          {notes && (
            <ol className="flex flex-col gap-1 border-t border-dashed px-3 pt-2 pb-2.5 text-xs">
              {notes.map(([n, text]) => (
                <li key={n}>
                  <b className="mr-1.5 inline-grid h-4 min-w-4 place-items-center rounded-full bg-red-600 text-[10px] text-white">{n}</b>
                  {text}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}

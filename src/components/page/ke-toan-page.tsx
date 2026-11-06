"use client";

import {
  AppSidebar,
  type AppSidebarItem,
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@erp/miniapp-ui";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { AppFrame } from "@/components/app-frame";
import { Overview } from "@/components/features/ke-toan/overview";
import {
  Bank,
  Cash,
  Catalog,
  Closing,
  Costing,
  EInvoices,
  FixedAssets,
  NewVoucher,
  Payroll,
  Purchases,
  Sales,
  Simple,
  Statements,
  Stock,
  Tax,
  Vouchers,
} from "@/components/features/ke-toan/views";
import { MENU, PERIODS, SIMPLE, VIEW_META, viewName } from "@/data/ke-toan";

// AppFrame chỉ có sidebar phẳng, nên menu nhóm được dựng ở đây với AppSidebar (type: "section").
const SIDE_ITEMS: AppSidebarItem[] = MENU.flatMap(([group, items]) => [
  { id: `g-${group}`, label: group, type: "section" as const },
  ...items.map(([id, label]) => ({ id, label })),
]);

function body(view: string, go: (id: string) => void): ReactNode {
  switch (view) {
    case "tq": return <Overview go={go} />;
    case "ct": return <Vouchers />;
    case "lct": return <NewVoucher />;
    case "dm": return <Catalog />;
    case "quy": return <Cash />;
    case "nh": return <Bank />;
    case "ban": return <Sales />;
    case "mua": return <Purchases />;
    case "hddt": return <EInvoices />;
    case "kho": return <Stock />;
    case "gt": return <Costing />;
    case "tscd": return <FixedAssets />;
    case "luong": return <Payroll />;
    case "thue": return <Tax />;
    case "bctc": return <Statements />;
    case "ks": return <Closing go={go} />;
    default: return <Simple id={view} />;
  }
}

export function KeToanPage() {
  const [view, setView] = useState("tq");
  const go = (id: string) => {
    setView(id);
    window.scrollTo(0, 0);
  };
  const meta = VIEW_META[view] ?? SIMPLE[view];
  const target = VIEW_META[view]?.go;
  const extra = VIEW_META[view]?.x ?? [];

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      {extra.map((x) => (
        <Button key={x} variant="outline" onClick={() => toast(x)}>
          {x}
        </Button>
      ))}
      <Select defaultValue={PERIODS[0]}>
        <SelectTrigger aria-label="Kỳ kế toán" className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => (target ? go(target) : toast.success(meta.a))}>{meta.a}</Button>
    </div>
  );

  return (
    <AppFrame
      slug="ke-toan"
      nav="none"
      description={
        <>
          <b className="text-foreground">{viewName(view)}</b> · {meta.d}
        </>
      }
      actions={actions}
    >
      <div className="flex gap-6">
        <aside className="sticky top-44 hidden h-[calc(100vh-12rem)] shrink-0 self-start md:block">
          <AppSidebar
            items={SIDE_ITEMS}
            activeId={view}
            onItemSelect={(it) => go(it.id)}
            collapsible={false}
            navLabel="Menu kế toán"
            logo={
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">M</span>
                <div className="leading-tight">
                  <b className="block">Công ty TNHH May Demo</b>
                  <span className="text-muted-foreground">MST 03xxxxxxx</span>
                </div>
              </div>
            }
            footer={
              <div className="leading-tight">
                <b className="block">Trần Thị Hoa</b>
                <span className="text-muted-foreground">Kế toán trưởng</span>
              </div>
            }
          />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="md:hidden">
            <Select value={view} onValueChange={go}>
              <SelectTrigger aria-label="Chọn màn hình" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MENU.map(([group, items]) => (
                  <SelectGroup key={group}>
                    <SelectLabel>{group}</SelectLabel>
                    {items.map(([id, label]) => (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          {body(view, go)}
        </div>
      </div>
    </AppFrame>
  );
}

"use client";

import {
  AppSidebar,
  type AppSidebarItem,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  PageHeader,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@erp/miniapp-ui";
import Link from "next/link";
import type { ReactNode } from "react";
import { appBySlug } from "@/constants/apps";

export type FrameNavItem = { id: string; label: string; badge?: ReactNode; icon?: ReactNode };

/**
 * Khung chung cho mọi mini app trong demo: breadcrumb về Danh sách ứng dụng,
 * PageHeader, và điều hướng giữa các màn — tab ngang (mặc định) hoặc sidebar trái.
 * Header (và tab) dính trên cùng khi cuộn.
 */
export function AppFrame({
  slug,
  description,
  actions,
  nav = "tabs",
  items,
  active,
  onChange,
  children,
}: {
  slug: string;
  description?: ReactNode;
  actions?: ReactNode;
  nav?: "tabs" | "sidebar" | "none";
  items?: FrameNavItem[];
  active?: string;
  onChange?: (id: string) => void;
  children: ReactNode;
}) {
  const app = appBySlug(slug);
  const title = (
    <span className="flex items-center gap-2">
      <span aria-hidden>{app?.icon}</span>
      {app?.name ?? slug}
    </span>
  );

  const header = (
    <div className="flex flex-col gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Danh sách ứng dụng</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{app?.name ?? slug}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader title={title} description={description} actions={actions} />
    </div>
  );

  if (nav === "sidebar" && items) {
    const sideItems: AppSidebarItem[] = items.map((i) => ({ id: i.id, label: i.label, icon: i.icon }));
    return (
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-white md:block">
          <AppSidebar
            items={sideItems}
            activeId={active}
            onItemSelect={(it) => onChange?.(it.id)}
            logo={<span className="text-sm font-semibold">{app?.name}</span>}
          />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b bg-white px-4 py-3 md:px-6">
            {header}
            <div className="mt-3 md:hidden">
              <NavTabs items={items} active={active} onChange={onChange} />
            </div>
          </header>
          <main className="flex flex-col gap-4 p-4 md:p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-white px-4 pt-3 md:px-6">
        {header}
        {nav === "tabs" && items ? (
          <div className="mt-2 overflow-x-auto">
            <NavTabs items={items} active={active} onChange={onChange} />
          </div>
        ) : (
          <div className="h-3" />
        )}
      </header>
      <main className="flex flex-col gap-4 p-4 md:p-6">{children}</main>
    </div>
  );
}

function NavTabs({
  items,
  active,
  onChange,
}: {
  items: FrameNavItem[];
  active?: string;
  onChange?: (id: string) => void;
}) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange?.(v)}>
      <TabsList variant="line">
        {items.map((i) => (
          <TabsTrigger key={i.id} value={i.id} className="gap-1.5">
            {i.label}
            {i.badge != null && <Badge variant="destructive">{i.badge}</Badge>}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

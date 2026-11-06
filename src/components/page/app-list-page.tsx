"use client";

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@erp/miniapp-ui";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { APPS } from "@/constants/apps";

export function AppListPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
      <PageHeader
        title="Danh sách ứng dụng"
        description={`Các ứng dụng đang chạy trong nhà máy · ${APPS.length} app`}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APPS.map((a) => (
          <Card key={a.slug}>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-xl" aria-hidden>
                {a.icon}
              </span>
              <CardAction>
                <Badge variant="secondary">● Đang chạy</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <CardTitle>{a.name}</CardTitle>
              <CardDescription>{a.description}</CardDescription>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/apps/${a.slug}/`}>
                  Mở app <ArrowUpRightIcon />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}

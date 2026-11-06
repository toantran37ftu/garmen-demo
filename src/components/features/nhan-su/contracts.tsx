"use client";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { EXPIRING } from "@/data/nhan-su";
import { KpiGrid, ToneBadge } from "./ui";

export function Contracts() {
  const [renewed, setRenewed] = useState<Set<string>>(new Set());
  const renew = (names: string[]) => {
    setRenewed((s) => new Set([...s, ...names]));
    toast.success(names.length > 1 ? `Đã tạo phụ lục gia hạn cho ${names.length} hợp đồng` : `Đã tạo phụ lục gia hạn — ${names[0]}`);
  };

  return (
    <>
      <KpiGrid
        items={[
          { label: "Hết hạn trong 7 ngày", value: "7", tone: "bad" },
          { label: "Hết hạn trong 30 ngày", value: "28", tone: "warn" },
          { label: "Thử việc sắp hết", value: "18" },
          { label: "Không xác định thời hạn", value: "612" },
        ]}
      />
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Hợp đồng sắp hết hạn</CardTitle>
          <CardAction>
            <Button size="sm" onClick={() => renew(EXPIRING.map((c) => c.name).filter((n) => !renewed.has(n)))} disabled={renewed.size === EXPIRING.length}>
              Gia hạn hàng loạt
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Chuyền</TableHead>
                <TableHead>Loại hợp đồng</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Còn lại</TableHead>
                <TableHead>Đề xuất của tổ trưởng</TableHead>
                <TableHead><span className="sr-only">Thao tác</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EXPIRING.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.line}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.end}</TableCell>
                  <TableCell><ToneBadge tone={c.left <= 7 ? "bad" : "warn"}>{c.left} ngày</ToneBadge></TableCell>
                  <TableCell className={c.lead ? undefined : "text-muted-foreground"}>{c.lead || "Chưa có"}</TableCell>
                  <TableCell>
                    {renewed.has(c.name) ? (
                      <ToneBadge tone="ok">Đã gia hạn</ToneBadge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => renew([c.name])}>Gia hạn</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

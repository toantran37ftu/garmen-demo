"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import { useState } from "react";
import { toast } from "sonner";
import { ATTENDANCE_BY_DEPT, REQUESTS } from "@/data/nhan-su";
import { KpiGrid, ToneBadge } from "./ui";

export function Attendance() {
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const pending = 21 - approved.size;

  return (
    <>
      <KpiGrid
        items={[
          { label: "Có mặt hôm nay", value: "936", hint: "95,5% / 980 · từ máy chấm công" },
          { label: "Nghỉ có phép", value: "28" },
          { label: "Vắng không báo", value: "16", tone: "bad" },
          { label: "Đơn chờ duyệt", value: String(pending), tone: "warn" },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Đơn nghỉ phép & tăng ca chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Loại đơn</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead><span className="sr-only">Thao tác</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REQUESTS.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell><ToneBadge tone={r.tone}>{r.type}</ToneBadge></TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell>{r.reason}</TableCell>
                    <TableCell>
                      {approved.has(r.name) ? (
                        <ToneBadge tone="ok">Đã duyệt</ToneBadge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setApproved((s) => new Set(s).add(r.name));
                            toast.success(`Đã duyệt đơn ${r.type.toLowerCase()} — ${r.name}`);
                          }}
                        >
                          Duyệt
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Tỉ lệ đi làm theo bộ phận</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {ATTENDANCE_BY_DEPT.map((d) => (
              <div key={d.dept} className="flex items-center gap-3">
                <div className="flex-1">{d.dept}</div>
                <Progress
                  value={d.rate}
                  className="flex-[2]"
                  indicatorClassName={d.rate < 90 ? "bg-warning" : "bg-success"}
                  aria-label={`${d.dept} ${d.rate}%`}
                />
                <b className="w-10 text-right tabular-nums">{d.rate}%</b>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

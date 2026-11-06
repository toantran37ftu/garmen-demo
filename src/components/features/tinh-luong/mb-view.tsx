"use client";

import {
  Button, Card, CardAction, CardContent, CardHeader, CardTitle, StatisticCard,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@erp/miniapp-ui";
import { toast } from "sonner";
import { CHUYEN, cntSt, dd, f, MBS } from "@/data/tinh-luong";
import { StatusBadge } from "./shared";

const ROWS = MBS.slice().reverse();

export function MbView() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Phiếu kỳ 10/2026" value={f(MBS.length)} hint={`${CHUYEN.length} chuyền`} />
        <StatisticCard label="Chờ phòng công nghệ duyệt" value={<span className="text-warning">{cntSt("Chờ duyệt")}</span>} />
        <StatisticCard label="Trả về rà soát" value={<span className="text-destructive">{cntSt("Trả về rà soát")}</span>} />
        <StatisticCard label="Đã vào lương" value={<span className="text-success">{cntSt("Đã vào lương")}</span>} />
      </div>
      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-3">
          <CardTitle>Phiếu mua – bán công đoạn</CardTitle>
          <CardAction>
            <Button size="sm" onClick={() => toast("Lập phiếu mua – bán công đoạn (demo)")}>＋ Lập phiếu</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex max-h-[64vh] flex-col">
            <Table stickyHeader density="compact" className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Số phiếu</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Chuyền</TableHead>
                  <TableHead>Mã hàng</TableHead>
                  <TableHead>Công đoạn</TableHead>
                  <TableHead>Người bán → người mua</TableHead>
                  <TableHead numeric>SL</TableHead>
                  <TableHead numeric>Đơn giá</TableHead>
                  <TableHead numeric>Thành tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((m) => (
                  <TableRow key={m.so}>
                    <TableCell>{m.so}</TableCell>
                    <TableCell>{dd(m.d)}/10</TableCell>
                    <TableCell>{m.ch}</TableCell>
                    <TableCell>{m.mh}</TableCell>
                    <TableCell>{m.cd}</TableCell>
                    <TableCell>{m.sell} → {m.buy}</TableCell>
                    <TableCell numeric>{f(m.sl)}</TableCell>
                    <TableCell numeric>{f(m.dg)}</TableCell>
                    <TableCell numeric>{f(m.sl * m.dg)}</TableCell>
                    <TableCell><StatusBadge st={m.st} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

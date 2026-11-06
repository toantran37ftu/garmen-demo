import { Avatar, AvatarFallback, Badge, Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@erp/miniapp-ui";
import { toast } from "sonner";
import { CUS, TRASH, USERS } from "@/data/quan-ly-mau";
import { CustomerChip } from "./techpack-table";

export function CustomersTable({ onOpen }: { onOpen: () => void }) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead><TableHead>Tên</TableHead><TableHead>Mô tả</TableHead>
              <TableHead numeric>Techpack</TableHead><TableHead numeric>Tài liệu</TableHead><TableHead>Cập nhật</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CUS.map((c, i) => (
              <TableRow key={c[0]} className="cursor-pointer" onClick={onOpen}>
                <TableCell><CustomerChip cu={i} codeOnly /></TableCell>
                <TableCell className="font-semibold">{c[1]}</TableCell>
                <TableCell className="min-w-[220px] whitespace-normal text-muted-foreground">{c[2]}</TableCell>
                <TableCell numeric>{c[3]}</TableCell>
                <TableCell numeric>{c[4]}</TableCell>
                <TableCell className="tabular-nums">{c[5]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const FileTag = () => <span className="grid h-9 w-[30px] shrink-0 place-items-center rounded-sm bg-primary/10 text-[10px] font-bold text-primary">PDF</span>;

export function TrashTable() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead><TableHead>Khách hàng</TableHead><TableHead>Người xóa</TableHead>
              <TableHead>Ngày xóa</TableHead><TableHead>Còn lại</TableHead><TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {TRASH.map(([code, desc, cu, who, date, left]) => (
              <TableRow key={code}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <FileTag />
                    <div><div className="font-semibold">{code}</div><div className="text-muted-foreground">{desc}</div></div>
                  </div>
                </TableCell>
                <TableCell><CustomerChip cu={cu} /></TableCell>
                <TableCell>{who}</TableCell>
                <TableCell className="tabular-nums">{date}</TableCell>
                <TableCell>{left}</TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => toast.success(`Đã khôi phục ${code}`)}>Khôi phục</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const ROLE_VARIANT = { Admin: "default", "Biên tập": "secondary", "Chỉ xem": "outline" } as const;

export function UsersTable() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Họ tên</TableHead><TableHead>Bộ phận</TableHead><TableHead>Vai trò</TableHead><TableHead>Hoạt động gần nhất</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {USERS.map(([ini, name, dept, role, last]) => (
              <TableRow key={name}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm"><AvatarFallback>{ini}</AvatarFallback></Avatar>
                    <b>{name}</b>
                  </div>
                </TableCell>
                <TableCell>{dept}</TableCell>
                <TableCell><Badge variant={ROLE_VARIANT[role as keyof typeof ROLE_VARIANT]}>{role}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{last}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

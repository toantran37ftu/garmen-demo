/** Danh sách mini app trong demo — dùng cho trang danh sách và breadcrumb. */
export type AppInfo = { slug: string; name: string; description: string; icon: string };

export const APPS: AppInfo[] = [
  { slug: "ke-hoach-san-xuat", name: "Quản lý kế hoạch sản xuất", icon: "📅", description: "Xếp đơn vào chuyền, theo dõi tiến độ, cảnh báo đơn có nguy cơ trễ." },
  { slug: "trai-cat", name: "Quản lý trải – cắt", icon: "✂️", description: "Order cắt, lệnh cắt, phiếu trải, cuộn vải, bó hàng và hao hụt." },
  { slug: "quan-ly-mau", name: "Quản lý mẫu & tech pack", icon: "📐", description: "Tech pack, vật tư theo phối màu, bảng size và lịch sử phiên bản." },
  { slug: "kho-nguyen-lieu", name: "Quản lý kho nguyên liệu", icon: "📦", description: "Hàng về, xuất theo lệnh sản xuất, tồn vải – phụ liệu, cảnh báo thiếu." },
  { slug: "nhan-su", name: "Quản lý nhân sự", icon: "👥", description: "Hồ sơ, hợp đồng, chấm công; chụp hồ sơ giấy tự điền." },
  { slug: "tinh-luong", name: "Tính lương", icon: "💰", description: "Lương sản phẩm theo mã hàng – chuyền, lương tháng, phụ cấp, chế độ." },
  { slug: "app-cong-nhan", name: "App cho công nhân", icon: "📱", description: "Công nhân xem lương, chấm công, xin nghỉ, hỏi chính sách." },
  { slug: "ke-toan", name: "Kế toán", icon: "🧾", description: "Thu chi, công nợ, hóa đơn, sổ sách, thuế và báo cáo." },
  { slug: "theo-doi-van-hanh", name: "Theo dõi vận hành", icon: "📈", description: "Toàn cảnh đơn hàng, chuyền, kho, chất lượng, nhân sự." },
];

export const appBySlug = (slug: string) => APPS.find((a) => a.slug === slug);

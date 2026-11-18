# Garment demo — Mozy mini apps cho ngành dệt may

Demo 9 mini app cho nhà máy may ~980 lao động, 15 chuyền. **Chỉ phần giao diện**, dựng trên `erp-miniapp-template` với component của `@erp/miniapp-ui` (v0.10.1). Không nối ERP, không API, mọi số liệu là dữ liệu giả trong `src/data/`.

| App | Route |
|---|---|
| Danh sách ứng dụng | `/` |
| Quản lý kế hoạch sản xuất | `/apps/ke-hoach-san-xuat/` |
| Quản lý trải – cắt | `/apps/trai-cat/` |
| Quản lý mẫu & tech pack | `/apps/quan-ly-mau/` |
| Quản lý kho nguyên liệu | `/apps/kho-nguyen-lieu/` |
| Quản lý nhân sự | `/apps/nhan-su/` |
| Tính lương | `/apps/tinh-luong/` |
| App cho công nhân | `/apps/app-cong-nhan/` |
| Kế toán | `/apps/ke-toan/` |
| Theo dõi vận hành | `/apps/theo-doi-van-hanh/` |

## Cấu trúc
- `src/app/apps/<slug>/page.tsx` — route (Server Component)
- `src/components/page/<slug>-page.tsx` — điều phối màn hình
- `src/components/features/<slug>/` — bảng, thẻ, biểu đồ, Sheet/Dialog
- `src/data/<slug>.ts` — dữ liệu giả
- `src/components/app-frame.tsx` — khung chung: breadcrumb, PageHeader, tab hoặc sidebar

## Chạy
```bash
bun install        # hoặc npm install (cần quyền tải release của @erp/miniapp-ui)
bun run dev
bun run build      # xuất trang tĩnh ra out/ (output: "export")
```
Build cho GitHub Pages dưới `/<repo>`: đặt `BASE_PATH=/<repo>` khi build.

## Bản HTML cũ
Bản design HTML tĩnh trước khi chuyển sang kit nằm ở `html-demo/` (mở `html-demo/index.html`).

## Bản online (GitHub Pages)
- Bản dùng kit: https://toantran37ftu.github.io/garmen-demo/
- Bản HTML cũ: https://toantran37ftu.github.io/garmen-demo/html-demo/

Deploy: `BASE_PATH=/garmen-demo next build`, chép `html-demo/` vào `out/`, thêm `out/.nojekyll`, đẩy `out/` lên nhánh `gh-pages`.

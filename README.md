# Garment demo — Mozy mini apps cho ngành dệt may

Bản **design demo** (HTML tĩnh, dữ liệu giả) các mini app cho nhà máy may ~980 lao động, 15 chuyền. Dùng để duyệt giao diện và nhúng iframe lên landing page.

- `index.html` — Danh sách ứng dụng (mở từng app trong khung)
- `apps/*.html` — 9 mini app, mỗi file chạy độc lập (nhúng iframe được, vd `apps/tinh-luong.html`)
- `shared.css` — design token và component dùng chung
- `FACTORY.md` — số liệu nhà máy mẫu mà mọi app dùng chung

| App | File |
|---|---|
| Quản lý kế hoạch sản xuất | `apps/ke-hoach-san-xuat.html` |
| Quản lý trải – cắt | `apps/trai-cat.html` |
| Quản lý mẫu & tech pack | `apps/quan-ly-mau.html` |
| Quản lý kho nguyên liệu | `apps/kho-nguyen-lieu.html` |
| Quản lý nhân sự | `apps/nhan-su.html` |
| Tính lương | `apps/tinh-luong.html` |
| App cho công nhân | `apps/app-cong-nhan.html` |
| Kế toán | `apps/ke-toan.html` |
| Theo dõi vận hành | `apps/theo-doi-van-hanh.html` |

## Chạy

Không cần build. Mở bằng một static server bất kỳ:

```bash
npx serve .
```

Tên người, khách hàng, số liệu đều là dữ liệu giả.

# Stride

Cửa hàng giày thể thao full-stack: React, TypeScript, Vite ở frontend và Express ở backend. Giao diện tiếng Việt, font Arial.

## Tính năng

- Trang chủ và bộ sưu tập giày lấy từ API.
- Lọc theo danh mục, tìm kiếm, sắp xếp.
- Chi tiết sản phẩm, chọn size, tồn kho.
- Giỏ hàng (khách lưu local, thành viên lưu server).
- Đăng ký / đăng nhập phiên cookie HttpOnly.
- Yêu thích, newsletter, đơn hàng.
- Thanh toán COD hoặc thẻ mô phỏng (không lưu số thẻ).

Tài khoản demo: `demo@stride.vn` / `stride123`

## Công nghệ

React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Express, tsx.

## Chạy máy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Máy chủ phát triển |
| `npm run build` | Build frontend và server |
| `npm run start` | Chạy bản production trong `dist` |
| `npm run lint` | Kiểm tra TypeScript |

Dữ liệu tài khoản, giỏ hàng và đơn được lưu tại `backend/data/store.json`.

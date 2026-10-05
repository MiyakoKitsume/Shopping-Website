# Stride

Stride là giao diện cửa hàng giày thể thao được xây dựng bằng React, TypeScript và Vite. Toàn bộ giao diện hiện sử dụng tiếng Việt và font Arial để dễ đọc.

## Tính năng

- Trang chủ giới thiệu bộ sưu tập giày.
- Lọc sản phẩm theo danh mục.
- Tìm kiếm sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Điều chỉnh số lượng và xem tổng tiền bằng VNĐ.
- Trang đăng nhập và đăng ký tài khoản.
- Luồng thanh toán gồm:
  - Thông tin liên hệ.
  - Địa chỉ giao hàng.
  - Thông tin thanh toán.
  - Xác nhận đặt hàng.
- Giao diện responsive cho màn hình máy tính và điện thoại.

## Công nghệ sử dụng

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Express
- tsx

## Yêu cầu

- Node.js 18 trở lên
- npm

## Cài đặt

```bash
npm install
```

## Chạy môi trường phát triển

```bash
npm run dev
```

Ứng dụng sẽ chạy tại:

```text
http://localhost:3000
```

## Các lệnh có sẵn

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy máy chủ phát triển |
| `npm run build` | Build frontend và server production |
| `npm run start` | Chạy server từ thư mục `dist` |
| `npm run preview` | Xem thử bản build Vite |
| `npm run lint` | Kiểm tra TypeScript |
| `npm run clean` | Xóa các file build |

Trên Windows, nếu PowerShell chặn `npm.ps1`, có thể dùng các lệnh tương đương:

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

## Cấu trúc thư mục

```text
Shopping-Website/
├── frontend/
│   └── src/
│       ├── App.tsx       # Giao diện và logic cửa hàng
│       ├── index.css     # Style toàn bộ ứng dụng
│       └── main.tsx      # React entry point
├── backend/              # Cấu trúc backend mở rộng
├── server.ts             # Express server và Vite middleware
├── index.html            # HTML entry point
├── vite.config.ts        # Cấu hình Vite
├── tsconfig.json         # Cấu hình TypeScript
└── package.json          # Dependencies và scripts
```

## Lưu ý

Đăng nhập, đăng ký và thanh toán hiện là luồng frontend mô phỏng để trình diễn giao diện. Dữ liệu tài khoản, giỏ hàng và đơn hàng chưa được lưu vào cơ sở dữ liệu, đồng thời thanh toán chưa kết nối với cổng thanh toán thật.

Các ảnh sản phẩm được tải từ Unsplash nên cần kết nối Internet để hiển thị đầy đủ.
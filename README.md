# Bondy Dashboard — Admin & Moderation Panel

Bondy Dashboard là bảng điều khiển quản trị (admin dashboard) dành cho nền tảng Bondy Social, cho phép quản lý người dùng, nội dung, báo cáo vi phạm, thống kê, và các hoạt động moderation. Được xây dựng bằng **React + Vite + TypeScript**, giao diện hiện đại và responsive.

## 🚀 Tính năng chính

- Quản lý người dùng (view, ban, warn, edit role)
- Moderation nội dung: duyệt báo cáo, xóa/hide post/reel/comment
- Thống kê realtime (users, posts, interactions, reports)
- Quản lý API keys (nếu có)
- Dark/Light theme hỗ trợ
- Responsive – hoạt động tốt trên desktop và tablet

## 📦 Công nghệ sử dụng

- **Vite** + **React 18** + **TypeScript**
- **React Router** – điều hướng SPA
- **TanStack Query (React Query)** – quản lý data fetching & caching
- **Zustand** hoặc **Context API** – state management
- **MUI (Material UI)** hoặc **Ant Design** – components UI
- **Recharts** hoặc **Chart.js** – biểu đồ thống kê
- **Axios** – gọi API
- **Vite** – build tool nhanh chóng

## 📂 Cấu trúc dự án

```
bondy-dashboard/
├─ public/
├─ src/
│  ├─ __mock/            # Mock data (dev)
│  ├─ components/        # Các component chung
│  ├─ enums/             # Enum constants
│  ├─ hooks/             # Custom hooks
│  ├─ layouts/           # Layout chính (sidebar, header)
│  ├─ lib/               # Utils, axios instance
│  ├─ models/            # Interfaces/TypeScript models
│  ├─ pages/             # Các trang dashboard
│  ├─ routes/            # Cấu hình route + protected routes
│  ├─ sections/          # Các section lớn trong page
│  ├─ services/          # API services
│  ├─ stores/            # Zustand stores
│  ├─ theme/             # Theme config (MUI/AntD)
│  ├─ types/             # Type definitions
│  ├─ utils/             # Helper functions
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ vite-env.d.ts
│  └─ config-global.ts
├─ .env
├─ .env.example
├─ .env.production
├─ vite.config.ts
├─ tsconfig.json
└─ README.md
```

## 🔧 Yêu cầu hệ thống

- **Node.js >= 20** (khuyến nghị LTS)
- npm / yarn / pnpm

## ⚙️ Cài đặt

```bash
git clone https://github.com/your-org/bondy-dashboard.git
cd bondy-dashboard
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

## 🔑 Biến môi trường (.env)

Tạo file `.env` ở thư mục gốc (dựa trên `.env.example`):

```dotenv
# Backend API
VITE_REACT_APP_API_URL=http://localhost:8080      # URL của Bondy Server Gateway
VITE_REACT_APP_API_KEY=your-internal-dashboard-api-key   # API key nội bộ để truy cập admin endpoints
```

### Giải thích

- **VITE_REACT_APP_API_URL**: Trỏ đến API Gateway của Bondy Server (cùng với client).
- **VITE_REACT_APP_API_KEY**: Key nội bộ (có thể kiểm tra qua header `X-Internal-Api-Key` hoặc `Authorization`) để bảo vệ các endpoint admin/moderation.

> Lưu ý: Các biến bắt đầu bằng `VITE_` sẽ được expose ra client-side. Đảm bảo không để lộ secret nhạy cảm (nếu cần token thì dùng login riêng).

## ▶️ Chạy dự án

### Development

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở trình duyệt: [http://localhost:5173](http://localhost:5173) (mặc định Vite)

### Build cho Production

```bash
npm run build
npm run preview   # xem trước build
```

File build sẽ nằm trong thư mục `dist/`.

## 🔒 Bảo mật & Authentication

- Dashboard yêu cầu đăng nhập (sử dụng cùng hệ thống auth với Bondy Client hoặc endpoint riêng).
- Chỉ user có role **ADMIN** hoặc **MODERATOR** mới truy cập được.
- Tất cả request đến backend cần kèm JWT hợp lệ + API key (nếu cấu hình).

## 🐛 Troubleshooting

- **401 Unauthorized**: Kiểm tra JWT và `VITE_REACT_APP_API_KEY`.
- **CORS error**: Đảm bảo gateway cho phép origin của dashboard.
- **Data không load**: Mở DevTools → Network tab kiểm tra request.

## 📝 Lưu ý

- Không commit file `.env` lên Git.
- File `.env.example` chỉ chứa cấu trúc biến để team dễ setup.
- Khi deploy production: sử dụng HTTPS, đặt domain riêng (ví dụ: dashboard.bondy.app).
- Có thể tích hợp thêm **Sentry** cho error tracking, **i18n** cho đa ngôn ngữ.

## 🚀 Định hướng phát triển

- Thêm realtime updates với WebSocket (notification cho moderator)
- Export báo cáo (CSV/Excel)
- Role-based access control chi tiết hơn
- Audit log cho hành động admin

Chào mừng bạn đến với Bondy Dashboard — công cụ quản trị mạnh mẽ cho mạng xã hội Bondy! 🛡️

Có góp ý hoặc bug? Mở issue hoặc pull request ngay nhé! 🚀
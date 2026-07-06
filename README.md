# TodoApp Frontend (React + Vite)

Đây là giao diện người dùng (Frontend) cho ứng dụng TodoApp, bao gồm hệ thống Quản lý Workspace và Bảng Kanban động kéo thả mượt mà.

## 🛠️ Công nghệ sử dụng
- **Framework**: React 18
- **Build Tool**: Vite (cực kỳ nhanh)
- **Styling**: Tailwind CSS + Vanilla CSS (Màu sắc sống động, Glassmorphism, Dark mode)
- **Kéo Thả (Drag & Drop)**: `@hello-pangea/dnd`
- **Tương tác API**: Axios
- **Quản lý thông báo**: `react-hot-toast`
- **Chọn Ngày Giờ**: `react-datepicker`

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

### 1. Yêu cầu hệ thống
- Đã cài đặt **Node.js** (Khuyến nghị bản LTS - v18 hoặc v20 trở lên).
- Bạn có thể kiểm tra xem máy đã có Node.js chưa bằng lệnh `node -v` trong Terminal.

### 2. Cấu hình Môi trường
- Project kết nối với Backend thông qua Axios. Mặc định Backend được cấu hình chạy ở `http://localhost:8080/api/v1`.
- Nếu Backend của bạn chạy ở cổng khác, hãy chỉnh sửa biến môi trường trong thư mục Frontend (tìm file `.env` nếu có, hoặc vào file `src/config/axios.js` để kiểm tra `baseURL`).

### 3. Cài đặt Thư viện
Mở Terminal (hoặc Command Prompt / PowerShell) trỏ vào thư mục `TodoFrontend` và chạy lệnh sau để tải tất cả thư viện cần thiết về máy:

```bash
npm install
```
*(Bạn cũng có thể sử dụng `yarn install` hoặc `pnpm install` nếu muốn).*

### 4. Chạy ứng dụng (Development Server)
Sau khi cài đặt xong, khởi động server frontend bằng lệnh:

```bash
npm run dev
```

Vite sẽ khởi chạy rất nhanh. Bạn hãy mở link hiển thị trong terminal (thông thường là `http://localhost:5173`) trên trình duyệt để sử dụng ứng dụng TodoApp.

---
> **Lưu ý:** Vite hỗ trợ Hot-Reload (HMR), vì vậy khi bạn lưu lại bất kỳ thay đổi nào trong code React (`.jsx` / `.css`), giao diện trình duyệt sẽ lập tức cập nhật mà không cần bạn phải Refresh (F5) trang thủ công. Tuy nhiên, hãy đảm bảo Backend Server của bạn cũng đang được chạy thì mới có thể Đăng nhập và lấy được Dữ liệu nhé.

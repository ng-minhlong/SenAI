# Backend Node.js API for Next.js MySQL Auth

## Cấu trúc thư mục
- `index.js`: Khởi tạo server Express
- `db.js`: Kết nối MySQL
- `routes/`: Định nghĩa các route cho auth và users
- `controllers/`: Xử lý logic cho auth và users
- `.env`: Biến môi trường

## Cài đặt
```bash
cd backend
npm install
```

## Chạy server
```bash
npm run dev
```

## API endpoints
- `POST /api/auth/register`: Đăng ký
- `POST /api/auth/login`: Đăng nhập
- `GET /api/users`: Lấy danh sách user
- `GET /api/users/:id`: Lấy user theo id

## Tạo bảng MySQL
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

## Lưu ý
- Đổi thông tin kết nối DB trong file `.env`
- Đổi JWT_SECRET trong file `.env`

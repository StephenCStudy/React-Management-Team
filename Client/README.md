# 🚀 Project Team Manager

Hệ thống quản lý dự án nhóm (Project Team Manager) - Ứng dụng web giúp quản lý dự án, thành viên và công việc trong nhóm một cách hiệu quả.

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [Tài khoản demo](#-tài-khoản-demo)
- [Screenshots](#-screenshots)
- [Đóng góp](#-đóng-góp)
- [License](#-license)

---

## 🎯 Giới thiệu

**Project Team Manager** là một ứng dụng quản lý dự án được xây dựng với React, TypeScript và Redux Toolkit. Ứng dụng cho phép:

- **Admin**: Quản lý toàn bộ dự án, thêm/sửa/xóa dự án, quản lý thành viên trong từng dự án
- **Member**: Xem danh sách dự án mà mình tham gia

Hệ thống sử dụng **JSON Server** làm backend giả lập để demo và phát triển nhanh.

---

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền

- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với email/password
- ✅ Phân quyền Admin/Member
- ✅ Bảo vệ route theo quyền
- ✅ Tự động khôi phục session khi F5 (localStorage)

### 📊 Quản lý dự án (Admin)

- ✅ Xem danh sách tất cả dự án
- ✅ Thêm dự án mới
- ✅ Sửa thông tin dự án
- ✅ Xóa dự án
- ✅ Tìm kiếm dự án theo tên
- ✅ Phân trang danh sách dự án

### 👥 Quản lý thành viên dự án (Admin)

- ✅ Xem chi tiết thành viên trong dự án
- ✅ Thêm thành viên vào dự án
- ✅ Xóa thành viên khỏi dự án
- ✅ Phân quyền role (Project Owner/Member)

### 📱 Giao diện người dùng

- ✅ Responsive design
- ✅ Loading state với Loader component
- ✅ Toast notifications (Ant Design Message)
- ✅ Modal dialogs cho các thao tác

---

## 🛠️ Công nghệ sử dụng

### Frontend (Client)

| Công nghệ         | Phiên bản | Mục đích         |
| ----------------- | --------- | ---------------- |
| **React**         | 19.1.1    | UI Library       |
| **TypeScript**    | 5.9.3     | Type safety      |
| **Redux Toolkit** | 2.9.0     | State management |
| **React Router**  | 7.9.4     | Routing          |
| **Ant Design**    | 5.27.5    | UI Components    |
| **Axios**         | 1.12.2    | HTTP Client      |
| **Sass**          | 1.93.2    | CSS Preprocessor |
| **Vite**          | 7.1.7     | Build tool       |

### Backend (Server)

| Công nghệ       | Phiên bản    | Mục đích      |
| --------------- | ------------ | ------------- |
| **JSON Server** | 1.0.0-beta.3 | Mock REST API |

---

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm** hoặc **yarn**

### Bước 1: Clone repository

```bash
git clone https://git.rikkei.edu.vn/teammanagerment_project_react/teammanagerment_task4.git
cd ProjectTeamManager
```

### Bước 2: Cài đặt dependencies

#### Cài đặt Client

```bash
cd Client
npm install
```

#### Cài đặt Server

```bash
cd ../Server
npm install
```

---

## 🚀 Sử dụng

### Chạy Backend (JSON Server)

Mở terminal thứ nhất:

```bash
cd Server
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

### Chạy Frontend (Vite Dev Server)

Mở terminal thứ hai:

```bash
cd Client
npm run dev
```

Client sẽ chạy tại: **http://localhost:5173** (hoặc port khác nếu 5173 bị chiếm)

### Build Production

```bash
cd Client
npm run build
```

### Preview Production Build

```bash
cd Client
npm run preview
```

---

## 📁 Cấu trúc dự án

```
ProjectTeamManager/
├── Client/                        # Frontend React App
│   ├── public/                    # Static assets
│   │   └── uploads/              # Upload folder
│   ├── src/
│   │   ├── apis/                 # API & Redux
│   │   │   └── store/
│   │   │       ├── hooks.ts      # Custom hooks (useAppDispatch, useAppSelector)
│   │   │       ├── index.ts      # Store configuration
│   │   │       └── slice/
│   │   │           ├── auth/
│   │   │           │   ├── login.slice.ts       # Login logic & user state
│   │   │           │   └── register.slice.ts    # Register logic
│   │   │           └── projects/
│   │   │               ├── projects.slice.ts          # Project CRUD
│   │   │               └── managerDetail.slice.ts     # Member management
│   │   ├── assets/               # Images, fonts, etc.
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx      # Route guard
│   │   │   ├── header/
│   │   │   │   ├── HeaderManagerment.tsx
│   │   │   │   └── Header.scss
│   │   │   └── loading/
│   │   │       ├── loading.tsx
│   │   │       └── loading.scss
│   │   ├── hooks/
│   │   │   └── useFileUpload.ts        # Custom hook for file upload
│   │   ├── interfaces/                 # TypeScript interfaces
│   │   │   ├── auth/
│   │   │   └── manager/
│   │   ├── pages/
│   │   │   ├── authentication/
│   │   │   │   ├── Login/
│   │   │   │   │   ├── Login.tsx
│   │   │   │   │   └── Login.scss
│   │   │   │   └── register/
│   │   │   │       ├── register.tsx
│   │   │   │       └── register.scss
│   │   │   └── Manager/
│   │   │       ├── ManagerProject/           # Project management page
│   │   │       │   ├── ManagermentProject.tsx
│   │   │       │   ├── ManagermentProject.scss
│   │   │       │   └── Modal/
│   │   │       │       ├── Edit/             # Create/Edit modal
│   │   │       │       └── Delete/           # Delete modal
│   │   │       ├── ManagerDetail/            # Project detail & members
│   │   │       │   ├── ManagermentDetail.tsx
│   │   │       │   ├── ManagermentDetail.scss
│   │   │       │   └── Modal/
│   │   │       │       ├── Edit/
│   │   │       │       ├── Delete/
│   │   │       │       ├── initMember/       # Add member modal
│   │   │       │       └── viewMember/       # View member modal
│   │   │       └── UserProject/              # User project list
│   │   │           ├── UserProject.tsx
│   │   │           └── UserProject.scss
│   │   ├── routes/
│   │   │   └── RouterSetup.tsx              # Route configuration
│   │   ├── App.tsx                          # Root component
│   │   └── main.tsx                         # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── Server/                        # Backend JSON Server
    ├── db.json                    # Mock database
    ├── package.json
    └── README.md
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

### Users

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/users`               | Lấy danh sách users |
| GET    | `/users?email={email}` | Tìm user theo email |
| POST   | `/users`               | Tạo user mới        |
| PUT    | `/users/:id`           | Cập nhật user       |
| DELETE | `/users/:id`           | Xóa user            |

### Projects

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | `/projects`     | Lấy danh sách dự án |
| GET    | `/projects/:id` | Lấy chi tiết dự án  |
| POST   | `/projects`     | Tạo dự án mới       |
| PUT    | `/projects/:id` | Cập nhật dự án      |
| DELETE | `/projects/:id` | Xóa dự án           |

### Tasks (Dữ liệu có sẵn)

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| GET    | `/taskData`                | Lấy danh sách tasks  |
| GET    | `/taskData?projectId={id}` | Lấy tasks theo dự án |

---

## 👤 Tài khoản demo

### Admin Account

| Email                | Password | Role  |
| -------------------- | -------- | ----- |
| tranlinh@example.com | abcdef   | Admin |
| minhpham@example.com | qwerty   | Admin |
| tudang@example.com   | 654321   | Admin |

### Member Account

| Email                        | Password | Role   |
| ---------------------------- | -------- | ------ |
| tranducanh31032006@gmail.com | 12345678 | Member |

---

## 📸 Screenshots

### Trang đăng nhập

![Login Page](docs/screenshots/login.png)

### Dashboard Admin - Quản lý dự án

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Chi tiết dự án - Quản lý thành viên

![Project Detail](docs/screenshots/project-detail.png)

### Trang dự án của Member

![User Projects](docs/screenshots/user-projects.png)

_(Lưu ý: Tạo folder `docs/screenshots/` và thêm ảnh màn hình thực tế)_

---


## 🐛 Known Issues

1. **F5 reload issue (FIXED)**: Đã fix lỗi khi F5 trang, user được tự động khôi phục từ localStorage
2. **Image upload**: Hiện tại chỉ lưu URL, chưa có backend upload thực sự
3. **Token expiry**: Token không có thời gian hết hạn (cần implement JWT với expiry)

---


## 📝 License

Dự án này được phát hành dưới license [MIT License](LICENSE).

---

## 👨‍💻 Tác giả

**Trần Đức Anh**  
📧 Email: tranducanh31032006@gmail.com  
🔗 GitHub: [StephenDuc](https://git.rikkei.edu.vn/StephenDuc)

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/)
- [Vite](https://vitejs.dev/)
- [JSON Server](https://github.com/typicode/json-server)

---


⭐ **Nếu dự án này hữu ích, hãy cho một star!** ⭐

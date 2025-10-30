# 🚀 Team Management System

Hệ thống quản lý dự án và công việc nhóm (Team Management System) - Ứng dụng web toàn diện giúp quản lý dự án, thành viên và theo dõi tiến độ công việc một cách hiệu quả.

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
- [License](#-license)

---

## 🎯 Giới thiệu

**Team Management System** là một ứng dụng quản lý dự án toàn diện được xây dựng với React 19, TypeScript và Redux Toolkit. Ứng dụng hỗ trợ 2 vai trò chính:

- **Admin**: Quản lý toàn bộ dự án, CRUD dự án, quản lý thành viên dự án, quản lý nhiệm vụ (tasks) với đầy đủ chức năng sắp xếp, tìm kiếm và phân nhóm theo trạng thái
- **Member**: Xem danh sách dự án được tham gia, xem và cập nhật tiến độ các nhiệm vụ được giao

Hệ thống sử dụng **JSON Server** làm backend giả lập để demo và phát triển nhanh, với cấu trúc dữ liệu phù hợp cho việc mở rộng sang REST API thực tế.

---

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền

- ✅ Đăng ký tài khoản mới với xác thực email
- ✅ Đăng nhập với email/password
- ✅ Phân quyền rõ ràng: Admin/Member
- ✅ Protected Routes với ProtectedRoute component
- ✅ Tự động khôi phục session khi F5 (localStorage + Redux persist)
- ✅ Context API quản lý message toàn cục

### 📊 Quản lý dự án (Admin)

- ✅ Xem danh sách tất cả dự án với giao diện Table
- ✅ Thêm dự án mới (tên, hình ảnh)
- ✅ Sửa thông tin dự án
- ✅ Xóa dự án với xác nhận
- ✅ Tìm kiếm dự án theo tên (real-time search)
- ✅ Phân trang danh sách dự án (có thể tuỳ chỉnh pageSize)
- ✅ Upload hình ảnh dự án với custom hook `useFileUpload`

### 👥 Quản lý thành viên & nhiệm vụ (Admin)

- ✅ Xem chi tiết dự án với danh sách thành viên
- ✅ Thêm thành viên vào dự án từ danh sách người dùng
- ✅ Xóa thành viên khỏi dự án
- ✅ Xem thông tin chi tiết thành viên (avatar, tên, role)
- ✅ Quản lý nhiệm vụ (CRUD tasks)
- ✅ Nhóm nhiệm vụ theo trạng thái (To do, In Progress, Done)
- ✅ Sắp xếp nhiệm vụ theo: Ngày hết hạn, Độ ưu tiên
- ✅ Tìm kiếm nhiệm vụ theo tên
- ✅ Gán nhiệm vụ cho thành viên dự án
- ✅ Đặt độ ưu tiên (Low, Medium, High)

### 📋 Quản lý công việc (Member)

- ✅ Xem danh sách dự án được tham gia
- ✅ Xem nhiệm vụ được giao trong từng dự án
- ✅ Nhóm nhiệm vụ theo dự án với expand/collapse
- ✅ Cập nhật tiến độ nhiệm vụ (0-100%)
- ✅ Sắp xếp nhiệm vụ theo: Ngày hết hạn, Độ ưu tiên
- ✅ Tìm kiếm nhiệm vụ theo tên
- ✅ Xem thông tin chi tiết: Mô tả, người giao, ngày hết hạn, độ ưu tiên

### 📱 Trải nghiệm người dùng

- ✅ Responsive design (desktop & mobile)
- ✅ Loading state với Loader component tuỳ chỉnh
- ✅ Toast notifications với Context API và Ant Design Message
- ✅ Modal dialogs cho các thao tác CRUD
- ✅ Confirm dialogs cho các hành động xóa
- ✅ Avatar tự động tạo từ tên người dùng
- ✅ Styled với SCSS cho từng component

---

## 🛠️ Công nghệ sử dụng

### Frontend (Client)

| Công nghệ             | Phiên bản | Mục đích                           |
| --------------------- | --------- | ---------------------------------- |
| **React**             | 19.1.1    | UI Library (latest version)        |
| **TypeScript**        | ~5.9.3    | Type safety và IntelliSense        |
| **Redux Toolkit**     | 2.9.0     | State management (slices pattern)  |
| **React Redux**       | 9.2.0     | React bindings cho Redux           |
| **React Router DOM**  | 7.9.4     | Client-side routing                |
| **Ant Design**        | 5.27.5    | UI Component library               |
| **Axios**             | 1.12.2    | HTTP Client cho API calls          |
| **Sass**              | 1.93.2    | CSS Preprocessor                   |
| **Vite**              | 7.1.7     | Build tool & dev server (fast HMR) |
| **ESLint**            | 9.36.0    | Code linting                       |
| **TypeScript ESLint** | 8.45.0    | TypeScript linting rules           |

### Backend (Server)

| Công nghệ       | Phiên bản    | Mục đích                  |
| --------------- | ------------ | ------------------------- |
| **JSON Server** | 1.0.0-beta.3 | Mock REST API với db.json |

### Patterns & Architecture

- **Redux Toolkit Slices**: Tổ chức state theo feature (auth, projects, managerDetail)
- **Custom Hooks**: Tái sử dụng logic (useFileUpload, useProjectMembers, useTaskHandlers)
- **Context API**: Quản lý MessageContext cho thông báo toàn cục
- **Protected Routes**: HOC pattern cho route authentication
- **Component-based Architecture**: Tách biệt UI components và business logic

---

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 18.x (khuyến nghị 20.x)
- **npm**: >= 9.x hoặc **yarn**: >= 1.22.x
- **Git**: Để clone repository

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd teammanagerment_task5
```

### Bước 2: Cài đặt dependencies

#### Cài đặt Frontend (Client)

```bash
cd Client
npm install
```

#### Cài đặt Backend (Server)

```bash
cd ../Server
npm install
```

> **Lưu ý**: Nếu gặp lỗi khi cài đặt, thử xóa folder `node_modules` và file `package-lock.json`, sau đó chạy lại `npm install`

---

## 🚀 Sử dụng

### Chạy ứng dụng trong môi trường Development

#### Bước 1: Khởi động Backend (JSON Server)

Mở terminal thứ nhất và chạy:

```bash
cd Server
npm start
```

✅ Server sẽ chạy tại: **http://localhost:3000**  
✅ API endpoints có thể truy cập qua: `http://localhost:3000/users`, `http://localhost:3000/projects`, `http://localhost:3000/taskData`

#### Bước 2: Khởi động Frontend (Vite Dev Server)

Mở terminal thứ hai và chạy:

```bash
cd Client
npm run dev
```

✅ Client sẽ chạy tại: **http://localhost:5173** (hoặc port khác nếu 5173 bị chiếm)  
✅ Vite HMR (Hot Module Replacement) sẽ tự động reload khi có thay đổi code

#### Bước 3: Truy cập ứng dụng

1. Mở trình duyệt và truy cập: **http://localhost:5173**
2. Đăng nhập bằng tài khoản demo (xem phần [Tài khoản demo](#-tài-khoản-demo))
3. Trải nghiệm các tính năng theo role của bạn

### Build Production

```bash
cd Client
npm run build
```

Build output sẽ được tạo trong folder `Client/dist`

### Preview Production Build

```bash
cd Client
npm run preview
```

Xem preview production build tại: **http://localhost:4173**

### Linting

```bash
cd Client
npm run lint
```

Chạy ESLint để kiểm tra code quality

---

## 📁 Cấu trúc dự án

```
teammanagerment_task5/
├── Client/                                    # Frontend React Application
│   ├── public/                               # Static assets
│   ├── src/
│   │   ├── apis/store/                       # Redux Store Configuration
│   │   │   ├── hooks.ts                      # Typed hooks: useAppDispatch, useAppSelector
│   │   │   ├── index.ts                      # Store setup with configureStore
│   │   │   └── slice/                        # Redux Toolkit Slices
│   │   │       ├── auth/
│   │   │       │   ├── login.slice.ts        # Login state, actions & thunks
│   │   │       │   └── register.slice.ts     # Register logic
│   │   │       └── projects/
│   │   │           ├── projects.slice.ts     # Projects CRUD (fetchProjects, deleteProject)
│   │   │           └── managerDetail.slice.ts # Project detail & members management
│   │   │
│   │   ├── assets/                           # Static images, fonts, icons
│   │   │
│   │   ├── components/                       # Reusable components
│   │   │   ├── ProtectedRoute.tsx            # HOC for route authentication
│   │   │   ├── header/
│   │   │   │   ├── HeaderManagerment.tsx     # Main header with navigation
│   │   │   │   └── Header.scss               # Header styles
│   │   │   └── loading/
│   │   │       ├── loading.tsx               # Loading spinner component
│   │   │       └── loading.scss              # Loading styles
│   │   │
│   │   ├── contexts/                         # React Context API
│   │   │   └── MessageContext.tsx            # Global message context for notifications
│   │   │
│   │   ├── hooks/                            # Custom React Hooks
│   │   │   ├── useFileUpload.ts              # File upload logic
│   │   │   ├── useProjectMembers.ts          # Member management logic
│   │   │   └── useTaskHandlers.ts            # Task CRUD handlers
│   │   │
│   │   ├── interfaces/                       # TypeScript Type Definitions
│   │   │   ├── auth/
│   │   │   │   ├── Login/formDataLogin.ts
│   │   │   │   └── register/fomDataRegis.ts
│   │   │   └── manager/
│   │   │       ├── user.mamager.ts
│   │   │       ├── mamaberProject/managerProject.ts
│   │   │       ├── mamagerDetail/managerDetail.ts
│   │   │       └── userProject/userProject.ts
│   │   │
│   │   ├── pages/                            # Page Components
│   │   │   ├── authentication/
│   │   │   │   ├── Login/
│   │   │   │   │   ├── Login.tsx             # Login page
│   │   │   │   │   └── Login.scss
│   │   │   │   └── register/
│   │   │   │       ├── register.tsx          # Register page
│   │   │   │       └── register.scss
│   │   │   │
│   │   │   └── Manager/
│   │   │       ├── ManagerProject/           # Admin: Project list page
│   │   │       │   ├── ManagermentProject.tsx
│   │   │       │   ├── ManagermentProject.scss
│   │   │       │   └── Modal/
│   │   │       │       ├── Edit/ModalCreateEdit.tsx    # Create/Edit project modal
│   │   │       │       └── Delete/ModalDelete.tsx      # Delete confirmation
│   │   │       │
│   │   │       ├── ManagerDetail/            # Admin: Project detail & tasks page
│   │   │       │   ├── ManagermentDetail.tsx # Main detail page with members & tasks
│   │   │       │   ├── ManagermentDetail.scss
│   │   │       │   └── Modal/
│   │   │       │       ├── Edit/ModalCreateEdit.tsx    # Create/Edit task
│   │   │       │       ├── Delete/ModalDelete.tsx      # Delete task
│   │   │       │       ├── initMember/initmember.tsx   # Add member to project
│   │   │       │       └── viewMember/viewmember.tsx   # View member details
│   │   │       │
│   │   │       └── UserProject/              # Member: My projects & tasks
│   │   │           ├── UserProject.tsx       # User's project list with tasks
│   │   │           ├── UserProject.scss
│   │   │           └── Modal/
│   │   │               └── UpdateProgress/update.tsx   # Update task progress
│   │   │
│   │   ├── routes/
│   │   │   └── RouterSetup.tsx               # React Router configuration
│   │   │
│   │   ├── utils/
│   │   │   └── MessageService.ts             # Message utility functions
│   │   │
│   │   ├── App.tsx                           # Root component with MessageProvider
│   │   └── main.tsx                          # Entry point with Redux Provider & Router
│   │
│   ├── index.html                            # HTML template
│   ├── package.json                          # Dependencies & scripts
│   ├── vite.config.ts                        # Vite configuration
│   ├── tsconfig.json                         # TypeScript config
│   ├── tsconfig.app.json                     # App TypeScript config
│   ├── tsconfig.node.json                    # Node TypeScript config
│   └── eslint.config.js                      # ESLint configuration
│
└── Server/                                    # Backend Mock Server
    ├── db.json                                # JSON Database (users, projects, taskData)
    ├── package.json                           # JSON Server dependency
    └── README.md                              # Server documentation
```

### Giải thích cấu trúc quan trọng:

- **`apis/store/slice/`**: Redux state management theo feature
- **`contexts/`**: Global state với Context API (MessageContext)
- **`hooks/`**: Custom hooks tái sử dụng logic
- **`pages/Manager/`**: 3 trang chính:
  - `ManagerProject`: Quản lý danh sách dự án (Admin)
  - `ManagerDetail`: Chi tiết dự án + quản lý tasks & members (Admin)
  - `UserProject`: Xem dự án và tasks của member (Member)
- **`components/ProtectedRoute.tsx`**: Bảo vệ routes dựa trên authentication

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

### Authentication & Users

| Method | Endpoint               | Description                          | Body/Params                                  |
| ------ | ---------------------- | ------------------------------------ | -------------------------------------------- |
| GET    | `/users`               | Lấy danh sách tất cả users           | -                                            |
| GET    | `/users?email={email}` | Tìm user theo email (dùng cho login) | Query: `?email=admin1@example.com`           |
| GET    | `/users/:id`           | Lấy thông tin user theo ID           | Param: `id`                                  |
| POST   | `/users`               | Tạo user mới (register)              | `{fullName, email, password, isAdmin, role}` |
| PUT    | `/users/:id`           | Cập nhật thông tin user              | `{fullName, email, password, isAdmin, role}` |
| PATCH  | `/users/:id`           | Cập nhật một phần thông tin user     | `{field: value}`                             |
| DELETE | `/users/:id`           | Xóa user                             | Param: `id`                                  |

### Projects

| Method | Endpoint        | Description                          | Body/Params                         |
| ------ | --------------- | ------------------------------------ | ----------------------------------- |
| GET    | `/projects`     | Lấy danh sách tất cả dự án           | -                                   |
| GET    | `/projects/:id` | Lấy chi tiết dự án (bao gồm members) | Param: `id`                         |
| POST   | `/projects`     | Tạo dự án mới                        | `{projectName, image, members: []}` |
| PUT    | `/projects/:id` | Cập nhật toàn bộ thông tin dự án     | `{projectName, image, members}`     |
| PATCH  | `/projects/:id` | Cập nhật một phần thông tin dự án    | `{projectName}` hoặc `{members}`    |
| DELETE | `/projects/:id` | Xóa dự án                            | Param: `id`                         |

**Project Structure:**

```json
{
  "id": "string",
  "projectName": "string",
  "image": "string (URL)",
  "members": [
    {
      "userId": "string",
      "role": "Project Owner | Member"
    }
  ]
}
```

### Tasks

| Method | Endpoint                        | Description                      | Body/Params                                           |
| ------ | ------------------------------- | -------------------------------- | ----------------------------------------------------- |
| GET    | `/taskData`                     | Lấy danh sách tất cả tasks       | -                                                     |
| GET    | `/taskData?projectId={id}`      | Lấy tasks theo dự án             | Query: `?projectId=1`                                 |
| GET    | `/taskData?assignedTo={userId}` | Lấy tasks được giao cho user     | Query: `?assignedTo=4`                                |
| GET    | `/taskData/:id`                 | Lấy chi tiết task                | Param: `id`                                           |
| POST   | `/taskData`                     | Tạo task mới                     | `{taskName, description, projectId, assignedTo, ...}` |
| PUT    | `/taskData/:id`                 | Cập nhật task                    | `{taskName, description, status, progress, ...}`      |
| PATCH  | `/taskData/:id`                 | Cập nhật một phần (VD: progress) | `{progress: 75}`                                      |
| DELETE | `/taskData/:id`                 | Xóa task                         | Param: `id`                                           |

**Task Structure:**

```json
{
  "id": "string",
  "taskName": "string",
  "description": "string",
  "projectId": "string",
  "assignedTo": "string (userId)",
  "assignedBy": "string (userId)",
  "status": "To do | In Progress | Done",
  "priority": "Low | Medium | High",
  "dueDate": "YYYY-MM-DD",
  "progress": "number (0-100)"
}
```

### Query Examples

```bash
# Lấy tất cả dự án
curl http://localhost:3000/projects

# Tìm user theo email
curl http://localhost:3000/users?email=admin1@example.com

# Lấy tasks của dự án cụ thể
curl http://localhost:3000/taskData?projectId=1

# Lấy tasks được giao cho user
curl http://localhost:3000/taskData?assignedTo=4

# Cập nhật progress của task
curl -X PATCH http://localhost:3000/taskData/1 \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}'
```

---

## 👤 Tài khoản demo

### Admin Accounts

Tài khoản Admin có quyền quản lý toàn bộ dự án, thành viên và nhiệm vụ:

| Email              | Password | Họ tên         | Quyền truy cập                         |
| ------------------ | -------- | -------------- | -------------------------------------- |
| admin1@example.com | admin123 | Nguyễn Văn An  | ✅ Quản lý dự án, thành viên, nhiệm vụ |
| admin2@example.com | admin123 | Trần Thị Bình  | ✅ Quản lý dự án, thành viên, nhiệm vụ |
| admin3@example.com | admin123 | Lê Hoàng Cường | ✅ Quản lý dự án, thành viên, nhiệm vụ |

### Member Accounts

Tài khoản Member chỉ có thể xem dự án được tham gia và cập nhật tiến độ nhiệm vụ của mình:

| Email             | Password | Họ tên        | Quyền truy cập                          |
| ----------------- | -------- | ------------- | --------------------------------------- |
| user1@example.com | user123  | Phạm Minh Đức | 👁️ Xem dự án, cập nhật tiến độ nhiệm vụ |
| user2@example.com | user123  | Hoàng Thị Em  | 👁️ Xem dự án, cập nhật tiến độ nhiệm vụ |
| user3@example.com | user123  | Đỗ Văn Phong  | 👁️ Xem dự án, cập nhật tiến độ nhiệm vụ |

### Hướng dẫn đăng nhập

1. Truy cập: **http://localhost:5173**
2. Chọn một tài khoản từ bảng trên
3. Nhập email và password
4. Click "Đăng nhập"
5. Hệ thống sẽ tự động redirect về trang tương ứng với role:
   - **Admin** → `/Manager/Project` (Quản lý dự án)
   - **Member** → `/Manager/User` (Danh sách dự án của tôi)

> **💡 Tips**: Bạn có thể đăng ký tài khoản mới tại trang `/Register` và tự động trở thành Member

---

## 📸 Screenshots

### 🔐 Trang đăng nhập

Giao diện đăng nhập với form validation và thông báo lỗi real-time.

### 📊 Dashboard Admin - Quản lý dự án

Danh sách tất cả dự án với tính năng tìm kiếm, phân trang và CRUD operations.

### 👥 Chi tiết dự án - Quản lý thành viên & nhiệm vụ

- Danh sách thành viên với avatar và role
- Quản lý nhiệm vụ được nhóm theo trạng thái (To do, In Progress, Done)
- Tìm kiếm và sắp xếp nhiệm vụ

### 📋 Trang dự án của Member

Xem danh sách dự án được tham gia và cập nhật tiến độ nhiệm vụ.

---

## 🎯 Workflow cơ bản

### Admin Workflow

1. **Đăng nhập** với tài khoản Admin
2. **Tạo dự án mới** tại trang "Quản lý dự án"
3. **Click vào dự án** để xem chi tiết
4. **Thêm thành viên** vào dự án từ danh sách users
5. **Tạo nhiệm vụ** và gán cho thành viên
6. **Theo dõi tiến độ** các nhiệm vụ theo trạng thái

### Member Workflow

1. **Đăng nhập** với tài khoản Member
2. **Xem danh sách dự án** mình tham gia
3. **Mở rộng dự án** để xem các nhiệm vụ được giao
4. **Cập nhật tiến độ** nhiệm vụ (0-100%)
5. **Xem chi tiết** nhiệm vụ: mô tả, deadline, độ ưu tiên

---

## 🔧 Các tính năng nâng cao

### Redux State Management

- **Persistent state**: State được lưu trong localStorage, tự động khôi phục khi F5
- **Async thunks**: Sử dụng `createAsyncThunk` cho API calls
- **Loading states**: Quản lý loading cho từng API call
- **Error handling**: Xử lý lỗi toàn cục và hiển thị thông báo

### Custom Hooks

- **`useFileUpload`**: Quản lý upload file và preview
- **`useProjectMembers`**: Logic quản lý thành viên dự án
- **`useTaskHandlers`**: Handlers cho CRUD operations của tasks

### Message Context

- **Global notifications**: Quản lý message toàn cục với Context API
- **Tương thích React 19**: Sử dụng Context thay vì gọi trực tiếp `message` của Ant Design

### UI/UX Features

- **Expandable table rows**: Nhóm nhiệm vụ theo trạng thái với expand/collapse
- **Real-time search**: Tìm kiếm không cần reload trang
- **Sorting**: Sắp xếp theo nhiều tiêu chí (date, priority)
- **Avatar generation**: Tự động tạo avatar từ chữ cái đầu tên
- **Responsive**: Giao diện tương thích mobile

---

## 🐛 Known Issues & Limitations

### Đã giải quyết ✅

- ~~**F5 reload issue**~~: Đã fix bằng cách lưu user vào localStorage và khôi phục khi mount
- ~~**Context message in React 19**~~: Đã chuyển sang sử dụng MessageContext

### Hạn chế hiện tại ⚠️

1. **Image upload**: Hiện chỉ lưu URL, chưa có backend upload thực sự (có thể mở rộng với multer hoặc cloud storage)
2. **Authentication**: Sử dụng simple authentication, chưa có JWT token với expiry
3. **Real-time updates**: Chưa có WebSocket, cần reload để thấy thay đổi từ user khác
4. **Validation**: Validation form cơ bản, có thể mở rộng với Yup hoặc Zod
5. **Pagination API**: Chưa implement server-side pagination (đang dùng client-side)

### Roadmap 🚀

- [ ] Implement JWT authentication với refresh token
- [ ] Thêm WebSocket cho real-time updates
- [ ] Upload file với backend thực (Express + Multer)
- [ ] Server-side pagination, filtering, sorting
- [ ] Unit tests với Vitest
- [ ] E2E tests với Playwright
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 📝 License

Dự án này được phát hành dưới license **MIT License**.

---

## 👨‍💻 Tác giả

**Team Development**  
📧 Email: [Your Email]  
🔗 Repository: [Git Repository URL]

---

## 🙏 Acknowledgments

Dự án này được xây dựng với sự hỗ trợ của các thư viện và framework mã nguồn mở:

- [React 19](https://react.dev/) - The library for web and native user interfaces
- [Redux Toolkit](https://redux-toolkit.js.org/) - The official, opinionated, batteries-included toolset for efficient Redux development
- [Ant Design](https://ant.design/) - A design system for enterprise-level products
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [React Router](https://reactrouter.com/) - Declarative routing for React
- [JSON Server](https://github.com/typicode/json-server) - Get a full fake REST API with zero coding
- [Sass](https://sass-lang.com/) - CSS with superpowers

---

## 📞 Support & Feedback

Nếu bạn gặp vấn đề hoặc có góp ý, vui lòng:

- 🐛 Tạo issue tại repository
- 💬 Liên hệ qua email
- ⭐ Star project nếu thấy hữu ích!

---

**⭐ Cảm ơn bạn đã quan tâm đến dự án! ⭐**

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

**Team Management System** là một ứng dụng quản lý dự án toàn diện được xây dựng với React 19, TypeScript và Redux Toolkit. Ứng dụng hỗ trợ phân quyền dựa trên **vai trò trong từng dự án**:

- **Project Owner**: Người tạo hoặc sở hữu dự án, có toàn quyền quản lý dự án đó (CRUD dự án, thêm/xóa thành viên, quản lý nhiệm vụ)
- **Member**: Thành viên tham gia dự án, có thể xem chi tiết dự án và cập nhật tiến độ nhiệm vụ được giao

**Đặc điểm nổi bật:**

- ✅ Phân quyền linh hoạt theo từng dự án (một user có thể là Owner của dự án A và Member của dự án B)
- ✅ Tự động thêm người tạo làm Project Owner khi tạo dự án mới
- ✅ Chỉ Project Owner mới có quyền chỉnh sửa và xóa dự án
- ✅ Mọi thành viên (Owner & Member) đều có thể xem chi tiết dự án

Hệ thống sử dụng **JSON Server** làm backend giả lập để demo và phát triển nhanh, với cấu trúc dữ liệu phù hợp cho việc mở rộng sang REST API thực tế.

---

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền

- ✅ Đăng ký tài khoản mới với validation email
- ✅ Đăng nhập với email/password
- ✅ Phân quyền linh hoạt theo từng dự án (Project Owner / Member)
- ✅ Protected Routes với ProtectedRoute component
- ✅ Tự động khôi phục session khi F5 (localStorage + Redux persist)
- ✅ Context API quản lý message toàn cục
- ✅ Kiểm tra quyền truy cập dựa trên role trong project

### 📊 Quản lý dự án (Project Owner)

- ✅ Xem danh sách các dự án mà mình là Project Owner
- ✅ Tạo dự án mới (tự động trở thành Project Owner)
- ✅ Sửa thông tin dự án (chỉ Project Owner)
- ✅ Xóa dự án với xác nhận (chỉ Project Owner)
- ✅ Tìm kiếm dự án theo tên (real-time search)
- ✅ Phân trang danh sách dự án (có thể tuỳ chỉnh pageSize)
- ✅ Upload hình ảnh dự án với custom hook `useFileUpload`
- ✅ Xem tất cả dự án mà mình tham gia (Owner & Member)

### 👥 Quản lý chi tiết dự án (Project Owner & Member)

**Quyền xem (Owner & Member):**

- ✅ Xem chi tiết dự án với danh sách thành viên
- ✅ Xem thông tin thành viên (avatar, tên, role)
- ✅ Xem danh sách nhiệm vụ nhóm theo trạng thái (To do, In Progress, Done, Pending)
- ✅ Tìm kiếm nhiệm vụ theo tên hoặc người phụ trách
- ✅ Sắp xếp nhiệm vụ theo: Ngày hết hạn, Độ ưu tiên

**Quyền quản lý (chỉ Project Owner):**

- ✅ Thêm/Xóa thành viên vào dự án
- ✅ Cập nhật role của thành viên (Project Owner / Member)
- ✅ Tạo/Sửa/Xóa nhiệm vụ (CRUD tasks)
- ✅ Gán nhiệm vụ cho thành viên dự án
- ✅ Đặt độ ưu tiên cho nhiệm vụ (Cao, Trung bình, Thấp)
- ✅ Đặt tiến độ và trạng thái nhiệm vụ

### 📋 Quản lý nhiệm vụ cá nhân (Tất cả user)

- ✅ Xem tất cả nhiệm vụ được giao cho mình
- ✅ Nhóm nhiệm vụ theo dự án với expand/collapse
- ✅ Cập nhật trạng thái nhiệm vụ (Pending ↔ In progress)
- ✅ Xem tiến độ nhiệm vụ (Đúng tiến độ, Có rủi ro, Trễ hạn)
- ✅ Sắp xếp nhiệm vụ theo: Ngày hết hạn, Độ ưu tiên
- ✅ Tìm kiếm nhiệm vụ theo tên
- ✅ Xem thông tin chi tiết: Ưu tiên, ngày bắt đầu, hạn chót, tiến độ

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

### Tài khoản có sẵn

Hệ thống có sẵn một số tài khoản để test với các vai trò khác nhau trong từng dự án:

| Email                        | Password  | Họ tên         | Vai trò trong dự án                                         |
| ---------------------------- | --------- | -------------- | ----------------------------------------------------------- |
| admin1@example.com           | admin123  | Nguyễn Văn An  | **Project Owner** của 5 dự án (ID: 1, 4, 7, 10, 13, 16, 19) |
| admin2@example.com           | admin123  | Trần Thị Bình  | **Project Owner** của 5 dự án (ID: 2, 5, 8, 11, 14, 17, 20) |
| admin3@example.com           | admin123  | Lê Hoàng Cường | **Project Owner** của 5 dự án (ID: 3, 6, 9, 12, 15, 18)     |
| user1@example.com            | user123   | Phạm Minh Đức  | **Member** của nhiều dự án                                  |
| user2@example.com            | user123   | Hoàng Thị Em   | **Member** của nhiều dự án                                  |
| user3@example.com            | user123   | Đỗ Văn Phong   | **Member** của nhiều dự án                                  |
| tranducanh31032006@gmail.com | 123456789 | Trần Đức Anh   | **Project Owner** của 1 dự án, **Member** của 3 dự án       |

### Phân quyền theo dự án

**Lưu ý quan trọng:** Quyền của user phụ thuộc vào **role trong từng dự án**, không phải role chung của tài khoản:

- **Project Owner trong dự án A**: Có toàn quyền quản lý dự án A (CRUD project, members, tasks)
- **Member trong dự án B**: Chỉ xem được dự án B và cập nhật nhiệm vụ được giao
- **Một user có thể vừa là Owner của dự án này, vừa là Member của dự án khác**

### Hướng dẫn đăng nhập

1. Truy cập: **http://localhost:5173**
2. Chọn một tài khoản từ bảng trên
3. Nhập email và password
4. Click "Đăng nhập"
5. Sau khi đăng nhập, bạn sẽ thấy:
   - **Trang "Dự Án"**: Danh sách các dự án mà bạn là **Project Owner**
   - **Trang "Nhiệm vụ của tôi"**: Danh sách nhiệm vụ được giao cho bạn

### Tạo tài khoản mới

- Truy cập trang `/register` để tạo tài khoản mới
- Tài khoản mới có thể tạo dự án và tự động trở thành **Project Owner** của dự án đó
- Project Owner có thể thêm users khác vào dự án với role Member

> **💡 Tips**:
>
> - Đăng nhập với `admin1@example.com` để thấy nhiều dự án nhất
> - Đăng nhập với `user1@example.com` để trải nghiệm vai trò Member
> - Tạo tài khoản mới để test tính năng đăng ký và tạo dự án từ đầu

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

### Project Owner Workflow

1. **Đăng nhập** với tài khoản (ví dụ: admin1@example.com)
2. **Tạo dự án mới** tại trang "Quản lý dự án" → tự động trở thành Project Owner
3. **Click "Chi tiết"** để vào trang quản lý dự án
4. **Thêm thành viên** vào dự án từ danh sách users
5. **Phân công vai trò** cho thành viên (Project Owner / Member)
6. **Tạo nhiệm vụ** và gán cho thành viên
7. **Theo dõi tiến độ** các nhiệm vụ theo trạng thái (To do, In Progress, Done)
8. **Sắp xếp/Tìm kiếm** nhiệm vụ theo nhu cầu

### Member Workflow

1. **Đăng nhập** với tài khoản Member (ví dụ: user1@example.com)
2. **Xem dự án** mình tham gia (nếu được thêm vào bởi Project Owner)
   - Vào trang "Dự Án" → Không thấy dự án (vì không phải Owner)
   - Click "Chi tiết" từ link trực tiếp hoặc thông báo → Có thể xem chi tiết
3. **Xem danh sách nhiệm vụ** được giao tại trang "Nhiệm vụ của tôi"
4. **Cập nhật trạng thái** nhiệm vụ (Pending ↔ In progress)
5. **Xem chi tiết** nhiệm vụ: ưu tiên, deadline, tiến độ

### Quy trình tạo và quản lý dự án hoàn chỉnh

1. **User A** tạo dự án mới → A tự động là **Project Owner**
2. **User A** thêm **User B** vào dự án với role **Member**
3. **User A** tạo nhiệm vụ và gán cho **User B**
4. **User B** vào "Nhiệm vụ của tôi" → thấy nhiệm vụ được giao
5. **User B** cập nhật trạng thái nhiệm vụ từ Pending → In progress
6. **User A** theo dõi tiến độ tại trang chi tiết dự án
7. **User B** có thể xem chi tiết dự án (nhưng không sửa/xóa được)

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

1. **Image upload**: Hiện chỉ lưu URL/blob, chưa có backend upload thực sự (có thể mở rộng với multer hoặc cloud storage)
2. **Authentication**: Sử dụng simple authentication, chưa có JWT token với expiry
3. **Real-time updates**: Chưa có WebSocket, cần reload để thấy thay đổi từ user khác
4. **Validation**: Validation form cơ bản, có thể mở rộng với Yup hoặc Zod
5. **Pagination API**: Chưa implement server-side pagination (đang dùng client-side)
6. **Role Management UI**: Project Owner không thể thay đổi role của chính mình trong project
7. **Notification**: Chưa có hệ thống thông báo real-time khi được thêm vào dự án hoặc được gán task

### Roadmap 🚀

**Authentication & Security:**

- [ ] Implement JWT authentication với refresh token
- [ ] Password hashing với bcrypt
- [ ] Rate limiting cho API endpoints
- [ ] CORS configuration cho production

**Real-time Features:**

- [ ] WebSocket cho real-time updates (Socket.io)
- [ ] Notification system khi được thêm vào project/task
- [ ] Live collaboration trên task board

**File & Media:**

- [ ] Upload file với backend thực (Express + Multer)
- [ ] Image optimization và compression
- [ ] Cloud storage integration (AWS S3 / Cloudinary)

**Performance & Scalability:**

- [ ] Server-side pagination, filtering, sorting
- [ ] Caching với Redis
- [ ] Database migration sang PostgreSQL/MongoDB
- [ ] API versioning

**Testing & Quality:**

- [ ] Unit tests với Vitest (components, hooks, utils)
- [ ] Integration tests cho Redux slices
- [ ] E2E tests với Playwright
- [ ] Code coverage reports

**DevOps:**

- [ ] Docker containerization (Client + Server)
- [ ] Docker Compose cho development
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment variables management
- [ ] Production deployment guide (Vercel/Netlify + Railway/Render)

**UI/UX Improvements:**

- [ ] Dark mode support
- [ ] Drag & drop cho task board (Kanban style)
- [ ] Advanced filters cho tasks và projects
- [ ] Export data (PDF, Excel)
- [ ] Multilingual support (i18n)

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

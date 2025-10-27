import { configureStore } from "@reduxjs/toolkit";
import RegisterReducer from "./slice/auth/register.slice";
import authReducer from "./slice/auth/login.slice";
import projectsReducer from "./slice/projects/projects.slice";

// Cấu hình Redux store
const store = configureStore({
  reducer: {
    // quản lý đăng ký, đăng nhập
    register: RegisterReducer, // Slice quản lý đăng ký người dùng
    auth: authReducer, // Slice quản lý xác thực người dùng
    projects: projectsReducer, // Slice quản lý projects
  },
});

// Xuất kiểu RootState và AppDispatch để sử dụng trong hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

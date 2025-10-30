// File: src/store/slice/login.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import MessageService from "../../../../utils/MessageService"; // hàm gọi message thay cho import trực tiếp từ antd
import type { LoginDTO } from "../../../../interfaces/auth/Login/formDataLogin";

// Trạng thái lưu trong Redux store
interface AuthState {
  loading: boolean;
  error: string | null;
  user: any; // thông tin người dùng (tùy API trả về)
  token: string | null; // token đăng nhập
}

// Hàm lấy user từ localStorage (dùng khi F5 trang)
const getUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Trạng thái mặc định ban đầu
const initialState: AuthState = {
  loading: false,
  error: null,
  user: getUserFromStorage(), // Lấy user từ localStorage khi khởi tạo
  token: localStorage.getItem("token") || null, // Nếu đã có token từ lần trước thì giữ lại
};

/*
   Thunk: loginUser
  - Gửi yêu cầu đăng nhập đến API
  - Nếu thành công → lưu token + user
  - Nếu thất bại → hiển thị lỗi
*/
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginDTO, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${data.email}`
      );

      // Kiểm tra user tồn tại hay không
      const user = res.data[0];
      if (!user) {
        throw new Error("Người dùng không tồn tại");
      }

      // Kiểm tra mật khẩu khớp hay không
      if (user.password !== data.password) {
        throw new Error("Sai mật khẩu");
      }

      // Giả lập token chỉ để xem có token cho người dùng đăng nhập, không có kiểm tra token từ server hay gới hạn thời gian, mã hóa, ....
      const fakeToken = `${user.isAdmin}_${user.id}_${Date.now()}`;

      // Lưu vào localStorage để giữ trạng thái đăng nhập
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(user));

      MessageService.getMessageApi().success("Đăng nhập thành công ");
      return { user, token: fakeToken };
    } catch (error: any) {
      MessageService.getMessageApi().error(
        error.message || "Đăng nhập thất bại"
      );  // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
      return rejectWithValue(error.message);
    }
  }
);

// Slice quản lý trạng thái đăng nhập
const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //  Logout: xóa token và user trong localStorage + Redux
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      MessageService.getMessageApi().info("Đã đăng xuất"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
    },
    // Action để load lại user từ localStorage (dùng khi cần refresh state)
    loadUserFromStorage: (state) => {
      const user = getUserFromStorage();
      const token = localStorage.getItem("token");
      if (user && token) {
        state.user = user;
        state.token = token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, loadUserFromStorage } = loginSlice.actions;
export default loginSlice.reducer;

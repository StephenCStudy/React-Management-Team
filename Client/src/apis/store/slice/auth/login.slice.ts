// File: src/store/slice/login.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

// Kiểu dữ liệu cho form đăng nhập
export interface LoginDTO {
  email: string;
  password: string;
}

// Trạng thái lưu trong Redux store
interface AuthState {
  loading: boolean;
  error: string | null;
  user: any; // thông tin người dùng (tùy API trả về)
  token: string | null; // token đăng nhập
}

// Trạng thái mặc định ban đầu
const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
  token: localStorage.getItem("token") || null, // Nếu đã có token từ lần trước thì giữ lại
};

/*
  ✅ Thunk: loginUser
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
        throw new Error("Tài khoản không tồn tại");
      }

      // Kiểm tra mật khẩu khớp hay không
      if (user.password !== data.password) {
        throw new Error("Sai mật khẩu");
      }

      // Giả lập token 
      const fakeToken = `token_${user.id}_${Date.now()}`;

      // Lưu vào localStorage để giữ trạng thái đăng nhập
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(user));

      message.success("Đăng nhập thành công 🎉");
      return { user, token: fakeToken };
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại");
      return rejectWithValue(error.message);
    }
  }
);

// Slice quản lý trạng thái đăng nhập
const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Logout: xóa token và user trong localStorage + Redux
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      message.info("Đã đăng xuất");
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

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

// Định nghĩa kiểu dữ liệu cho đăng ký
export interface SignDTO {
  displayName: string;
  email: string;
  password: string;
}

// Hàm gọi API xử lý đăng ký người dùng
export const registerUser = createAsyncThunk(
  "user/register",
  async (data: SignDTO, { rejectWithValue }) => {
    try {
      // Kiểm tra email đã tồn tại chưa
      const check = await axios.get(
        `${import.meta.env.VITE_SV_HOST}/users?email=${data.email}`
      );

      if (check.data.length > 0) {
        throw { message: "Email đã tồn tại" };
      }

      // Nếu email chưa có → tạo user mới
      const newUser = await axios.post(
        `${import.meta.env.VITE_SV_HOST}/users`,
        {
          ...data,
          isAdmin: false, // mặc định user thường
        }
      );

      message.success("Đăng ký thành công");
      return newUser.data;
    } catch (error: any) {
      message.error(error.message || "Đăng ký thất bại");
      return rejectWithValue(error.message);
    }
  }
);

// Trạng thái lưu trong Redux store
interface UserState {
  loading: boolean;
  error: string | null;
  user: any;
}

// Giá trị mặc định ban đầu
const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
};

// Slice quản lý logic đăng ký
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        // Khi đang gửi yêu cầu đăng ký
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Khi đăng ký thành công
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        // Khi đăng ký thất bại
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;

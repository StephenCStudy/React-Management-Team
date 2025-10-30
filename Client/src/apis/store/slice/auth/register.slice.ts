import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import MessageService from "../../../../utils/MessageService";
import type { SignDTO } from "../../../../interfaces/auth/register/fomDataRegis";
// Hàm gọi API xử lý đăng ký người dùng
export const registerUser = createAsyncThunk(
  "user/register",
  async (data: SignDTO, { rejectWithValue }) => {
    try {
      // Kiểm tra email đã tồn tại chưa
      const check = await axios.get(
        `http://localhost:3000/users?email=${data.email}`
      );

      if (check.data.length > 0) {
        throw { message: "Email đã tồn tại" };
      }

      // Nếu email chưa có → tạo user mới
      const newUser = await axios.post(`http://localhost:3000/users`, {
        ...data,
      });

      MessageService.getMessageApi().success("Đăng ký thành công"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
      return newUser.data;
    } catch (error: any) {
      MessageService.getMessageApi().error(error.message || "Đăng ký thất bại"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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

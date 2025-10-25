// src/pages/auth/Login/Login.tsx
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FormData } from "../../../interfaces/auth/Login/formDataLogin";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../apis/store/hooks";
import { loginUser } from "../../../apis/store/slice/auth/login.slice";
import Loader from "../../../components/loading/loading"; // Import Loader component

export default function Login() {
  // -----------------------------
  // STATE LƯU DỮ LIỆU VÀ LỖI FORM
  // -----------------------------
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // -----------------------------
  // HOOKS HỖ TRỢ
  // -----------------------------
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Lấy token và loading từ Redux store
  const { token, loading } = useAppSelector((state) => state.auth);

  // -----------------------------
  // NẾU ĐÃ CÓ TOKEN → CHUYỂN HƯỚNG LUÔN
  // -----------------------------
  useEffect(() => {
    if (token) navigate("/Manager/Project");
  }, [token, navigate]);

  // -----------------------------
  // XỬ LÝ KHI NGƯỜI DÙNG NHẬP INPUT
  // -----------------------------
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // VALIDATE DỮ LIỆU TRƯỚC KHI GỬI
  // -----------------------------
  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.password.trim())
      newErrors.password = "Vui lòng nhập mật khẩu";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // XỬ LÝ KHI NGƯỜI DÙNG ẤN "ĐĂNG NHẬP"
  // -----------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1️⃣ Kiểm tra form hợp lệ
    if (!validate()) return;

    // 2️⃣ Giả lập delay 0.5 giây để mô phỏng quá trình xử lý / gọi API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3️⃣ Gọi thunk loginUser để xác thực người dùng
    const result = await dispatch(loginUser(formData));

    // 4️⃣ Kiểm tra kết quả đăng nhập
    console.log("Login Result:", result);
    console.log(
      "Current Token in Redux:",
      useAppSelector((state) => state.auth.token)
    );
    console.log("Token in localStorage:", localStorage.getItem("token"));
  };

  // -----------------------------
  // JSX HIỂN THỊ GIAO DIỆN FORM
  // -----------------------------
  return (
    <div className="login-container">
      <h1 className="login-title">Đăng nhập</h1>

      {loading ? (
        <Loader />
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          {/* --- Email --- */}
          <div className="form-group">
            <input
              type="email"
              placeholder="Địa chỉ email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? "input-error" : ""}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* --- Mật khẩu --- */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input ${errors.password ? "input-error" : ""}`}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* --- Nút đăng nhập --- */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* --- Chuyển hướng sang đăng ký --- */}
          <p className="login-link">
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              className="link"
              style={{ cursor: "pointer" }}
            >
              Đăng ký
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { FormData } from "../../../interfaces/auth/register/fomDataRegis";
import "./register.scss";
import { useAppDispatch } from "../../../apis/store/hooks";
import { registerUser } from "../../../apis/store/slice/auth/register.slice";

export default function Register() {
  // State lưu giá trị form
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State lưu lỗi từng trường
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Xử lý thay đổi input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm kiểm tra dữ liệu hợp lệ
  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ và tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi form đăng ký
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Gọi Thunk registerUser
    const result = await dispatch(
      registerUser({
        displayName: formData.fullname,
        email: formData.email,
        password: formData.password,
      })
    );

    // Nếu thành công → chuyển hướng sang trang projects
    if (registerUser.fulfilled.match(result)) {
      navigate("/projects");
    }
  };

  // JSX hiển thị form đăng ký
  return (
    <div className="register-container">
      <h1 className="register-title">Đăng ký</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="fullname"
            placeholder="Họ và tên"
            value={formData.fullname}
            onChange={handleChange}
            className={`input ${errors.fullname ? "input-error" : ""}`}
          />
          {errors.fullname && <p className="error-text">{errors.fullname}</p>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Địa chỉ email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? "input-error" : ""}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? "input-error" : ""}`}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input ${errors.confirmPassword ? "input-error" : ""}`}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className="btn-submit">
          Đăng ký
        </button>

        <p className="login-link">
          Đã có tài khoản?{" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}

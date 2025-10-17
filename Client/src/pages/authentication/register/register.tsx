import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FormData } from "../../../interfaces/auth/register/fomDataRegis";
import "./register.scss";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Đăng ký thành công ✅");
      console.log("Form Data:", formData);

      setFormData({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  return (
    <div>
      <div className="register-container">
      <h1 className="register-title">Đăng ký</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Họ và tên"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={`input ${errors.fullname ? "input-error" : ""}`}
            />
            {errors.fullname && <p className="error-text">{errors.fullname}</p>}
          </div>

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

          <div className="form-group">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              name="confirmPassword"
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
    </div>
  );
}

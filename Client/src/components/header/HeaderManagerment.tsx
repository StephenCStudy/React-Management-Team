
import { Outlet, useNavigate } from "react-router-dom";
import "./Header.scss";

export default function HeaderManagerment() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xoá token, dữ liệu đăng nhập nếu có
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="Header-main">
        <div className="Header-container">
          <h1 className="Header-title">Quản Lý Dự Án</h1>
          <nav className="Header-nav">
            <p className="nav-item">Dự Án</p>
            <p className="nav-item">Nhiệm vụ của tôi</p>
            <p className="nav-item" onClick={handleLogout}> Đăng xuất</p>
          </nav>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        <p className="footer-title">
          © 2025 Quản Lý Dự Án Nhóm. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

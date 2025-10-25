import { Outlet, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useAppDispatch } from "../../apis/store/hooks";
import { logout } from "../../apis/store/slice/auth/login.slice";

export default function HeaderManagerment() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Dispatch action logout để xóa token trong Redux store
    dispatch(logout());

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  const goToProjects = () => {
    navigate("/Manager/Project");
  };

  return (
    <div className="layout">
      <header className="Header-main">
        <div className="Header-container">
          <h1 className="Header-title">Quản Lý Dự Án</h1>
          <nav className="Header-nav">
            <p className="nav-item" onClick={goToProjects}>
              Dự Án
            </p>
            <p className="nav-item" onClick={() => navigate("/Manager/User")}>
              Nhiệm vụ của tôi
            </p>
            <p className="nav-item" onClick={handleLogout}>
              {" "}
              Đăng xuất
            </p>
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

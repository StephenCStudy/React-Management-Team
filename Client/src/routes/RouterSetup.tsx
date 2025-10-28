import { Route, Routes } from "react-router-dom";
import Login from "../pages/authentication/Login/Login";
import Register from "../pages/authentication/register/register";
import HeaderManagerment from "../components/header/HeaderManagerment";
import ManagermentDetail from "../pages/Manager/ManagerDetail/ManagermentDetail";
import ManagermentProject from "../pages/Manager/ManagerProject/ManagermentProject";
import UserProject from "../pages/Manager/UserProject/UserProject";
import ProtectedRoute from "../components/ProtectedRoute";

export default function RouterSetup() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Login />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route
          path="/Manager"
          element={
            <ProtectedRoute>
              <HeaderManagerment />
            </ProtectedRoute>
          }
        >
          <Route path="Detail/:id" element={<ManagermentDetail />} />
          <Route path="Project" element={<ManagermentProject />} />
          <Route path="User" element={<UserProject />} />
        </Route>
      </Routes>
    </div>
  );
}

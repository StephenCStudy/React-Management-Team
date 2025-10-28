import { Table, Button, Form } from "antd";
import { Input } from "antd";
import type { ColumnType } from "antd/es/table";
import type { AlignType } from "rc-table/lib/interface";
const { Search } = Input;
import "./ManagermentProject.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../apis/store/hooks";
import ModalCreateEdit from "./Modal/Edit/ModalCreateEdit";
import ModalDelete from "./Modal/Delete/ModalDelete";
import {
  fetchProjects,
  deleteProject,
} from "../../../apis/store/slice/projects/projects.slice";
import { loadUserFromStorage } from "../../../apis/store/slice/auth/login.slice";
import Loader from "../../../components/loading/loading";

// Định nghĩa kiểu dữ liệu cho Project và ProjectTableItem
interface Project {
  id: string | number;
  projectName: string;
  image?: string;
  members?: Array<{ userId: number; role: string }>;
}
// Kiểu dữ liệu cho từng mục trong bảng dự án
interface ProjectTableItem {
  key: string;
  id: string | number;
  name: string;
  image?: string;
}

export default function ManagermentProject() {
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  // Lấy user từ redux store
  const user = useAppSelector((state) => state.auth.user);

  const projects = useAppSelector((state) => state.projects.items);
  const isLoading = useAppSelector((state) => state.projects.loading);

  // Load user từ localStorage khi component mount (để xử lý trường hợp F5 trang)
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Lấy danh sách dự án khi component được mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Lọc dự án dựa trên từ khóa tìm kiếm
  const filteredProjects = projects.filter((project: Project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Chuyển đổi dữ liệu dự án thành định dạng phù hợp cho bảng dự án
  const dataSource: ProjectTableItem[] = filteredProjects.map(
    (project: Project) => ({
      key: project.id.toString(),
      id: project.id,
      name: project.projectName,
      image: project.image,
    })
  );

  // Định nghĩa các cột cho bảng dự án
  const columns: ColumnType<ProjectTableItem>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center" as AlignType,
      width: 80,
    },
    {
      title: "Tên Dự Án",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành Động",
      key: "action",
      align: "center" as AlignType,
      render: (_: any, record: any) => (
        <div className="action-buttons">
          <Button
            className="btn-edit"
            onClick={() => {
              const fullProject =
                projects.find((p: any) => p.id == record.id) || record;
              setSelectedProject(fullProject);
              setOpenModal(true);
            }}
          >
            Sửa
          </Button>
          <Button
            className="btn-delete"
            onClick={() => {
              setSelectedProject(record);
              setOpenDelete(true);
            }}
          >
            Xóa
          </Button>
          <Button
            className="btn-detail"
            onClick={() => navigate(`/Manager/Detail/${record.id}`)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  // Xử lý xóa dự án khi xác nhận
  const handleDelete = async () => {
    if (selectedProject) {
      try {
        await dispatch(deleteProject(selectedProject.id)).unwrap();
        setOpenDelete(false);
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  // Nếu user chưa được load (undefined hoặc null), chỉ render loading
  // Khi user được cập nhật (từ localStorage hoặc API), component sẽ tự động render lại
  // Nếu user không tự động cập nhật, cần kiểm tra lại logic lấy user ở App.tsx hoặc ProtectedRoute
  if (user === undefined || user === null) {
    return <Loader />;
  }

  return (
    <div className="Manager-container">
      {user.isAdmin ? (
        <>
          <h1 className="Manager-title">Quản lý dự án nhóm</h1>

          <div className="Manager-setting">
            {/* // Nút thêm dự án mới và thanh tìm kiếm */}
            <Button
              className="Manager-create"
              onClick={() => {
                setSelectedProject(null);
                setOpenModal(true);
              }}
            >
              + Thêm dự án
            </Button>
            {/* // Thanh tìm kiếm */}
            <Form form={form} className="search-form">
              <Form.Item name="search" style={{ marginBottom: 0 }}>
                <Search
                  placeholder="Tìm kiếm..."
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={(value: string) =>
                    form.setFieldsValue({ search: value })
                  }
                  allowClear
                />
              </Form.Item>
            </Form>
          </div>

          {/* // Bảng danh sách dự án */}
          <p className="title-table">Danh Sách Dự Án</p>
          <Table
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: dataSource.length,
              pageSizeOptions: ["5", "7", "10"],
              showSizeChanger: true,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            bordered
          />

          {/* // Modals cho tạo/sửa dự án và xóa dự án */}
          <ModalCreateEdit
            open={openModal}
            onCancel={() => {
              setOpenModal(false);
              setSelectedProject(null);
            }}
            onOk={() => {
              setOpenModal(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
          />

          {/* // Modal xác nhận xóa dự án */}
          <ModalDelete
            open={openDelete}
            onCancel={() => {
              setOpenDelete(false);
              setSelectedProject(null);
            }}
            onDelete={handleDelete}
          />
        </>
      ) : (
        // Hiển thị thông báo không có quyền truy cập nếu không phải admin
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            fontSize: "32px",
            color: "black",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Bạn không có quyền truy cập do bạn là
          <b>{user.isAdmin ? " admin" : " member"}</b>
        </div>
      )}
    </div>
  );
}

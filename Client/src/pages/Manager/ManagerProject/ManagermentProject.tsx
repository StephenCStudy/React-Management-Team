import { Table, Button, Form } from "antd";
import { Input } from "antd";
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

interface Project {
  id: number;
  projectName: string;
  image: string;
  members: Array<{ userId: number; role: string }>;
}

interface ProjectTableItem {
  key: string;
  id: number;
  name: string;
  image: string;
}

export default function ManagermentProject() {
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDeletel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // Lấy dữ liệu từ Redux store
  const projects = useAppSelector((state) => state.projects.items);
  const isLoading = useAppSelector((state) => state.projects.loading);

  // Fetch projects khi component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Filter projects based on search text
  const filteredProjects = projects.filter((project: Project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Transform data for table
  const dataSource: ProjectTableItem[] = filteredProjects.map(
    (project: Project) => ({
      key: project.id.toString(),
      id: project.id,
      name: project.projectName,
      image: project.image,
    })
  );

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
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
      align: "center",
      render: (_: any, record: any) => (
        <div className="action-buttons">
          <Button
            className="btn-edit"
            onClick={() => {
              setSelectedProject(record);
              setOpenModal(true);
            }}
          >
            Sửa
          </Button>
          <Button
            className="btn-delete"
            onClick={() => {
              setSelectedProject(record);
              setOpenDeletel(true);
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

  // Handle delete
  const handleDelete = async () => {
    if (selectedProject) {
      try {
        await dispatch(deleteProject(selectedProject.id)).unwrap();
        setOpenDeletel(false);
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  return (
    <div className="Manager-container">
      <h1 className="Manager-title">Quản lý dự án nhóm</h1>

      <div className="Manager-setting">
        <Button
          className="Manager-create"
          onClick={() => {
            setSelectedProject(null);
            setOpenModal(true);
          }}
        >
          + Thêm dự án
        </Button>
        <Form form={form} className="search-form">
          <Form.Item name="search" style={{ marginBottom: 0 }}>
            <Search
              // className="Manager-search"
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

      <p className="title-table">Danh Sách Dự Án</p>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 9,
          total: dataSource.length,
          onChange: (page) => setCurrentPage(page),
        }}
        bordered
      />

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

      <ModalDelete
        open={openDelete}
        onCancel={() => {
          setOpenDeletel(false);
          setSelectedProject(null);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

// src/components/UserProject.tsx
import { useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import "./userProject.scss";
import type {
  ProjectMember,
  TaskUser,
} from "../../../interfaces/manager/userProject/userProject";

interface Project {
  id: number;
  projectName: string;
  image: string;
  members: ProjectMember[];
}

export default function UserProject() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskData, setTaskData] = useState<TaskUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("http://localhost:3000/projects"),
          fetch("http://localhost:3000/taskData"),
        ]);

        if (!projectsRes.ok || !tasksRes.ok) {  // .ok kiểm tra phản hồi thành công
          throw new Error("Failed to fetch data");
        }

        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();

        setProjects(projectsData);
        setTaskData(tasksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Gộp nhiệm vụ theo dự án
  const groupedData: Record<string, TaskUser[]> = taskData.reduce(
    (acc, task) => {
      const projectName =
        projects.find((p) => p.id === task.projectId)?.projectName || "Khác";
      if (!acc[projectName]) acc[projectName] = [];
      acc[projectName].push(task);
      return acc;
    },
    {} as Record<string, TaskUser[]>
  );

  // Cấu hình cột bảng
  const columns: ColumnsType<any> = [
    {
      title: "Tên Nhiệm Vụ",
      dataIndex: "projectName",
      key: "projectName",
      render: (text, record) =>
        record.categoryHeader ? (
          text
        ) : (
          <span className="task-name">{record.taskName}</span>
        ),
    },
    {
      title: "Ưu Tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority, record) =>
        !record.categoryHeader ? (
          <span className={`priority ${priority?.toLowerCase()}`}>
            {priority}
          </span>
        ) : null,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        !record.categoryHeader ? (
          <span
            className={`status ${status?.toLowerCase().replace(/\s+/g, "-")}`} // replace: Thay thế khoảng trắng bằng dấu gạch ngang
            style={{ color: "black" }}
          >
            <i
              className="fa-solid fa-pen-to-square"
              style={{ marginRight: 6, cursor: "pointer" }}
            ></i>
            {status}
          </span>
        ) : null,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "assignDate",
      key: "assignDate",
      render: (text, record) =>
        !record.categoryHeader ? (
          <span style={{ color: "blue" }}>{text}</span>
        ) : null,
    },
    {
      title: "Hạn Chót",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text, record) =>
        !record.categoryHeader ? (
          <span style={{ color: "blue" }}>{text}</span>
        ) : null,
    },
    {
      title: "Tiến Độ",
      dataIndex: "progress",
      key: "progress",
      render: (progress, record) =>
        !record.categoryHeader ? (
          <span className={`status ${progress?.toLowerCase()}`}>
            {progress}
          </span>
        ) : null,
    },
    // {
    //   title: "Hành Động",
    //   key: "action",
    //   render: (_, record) =>
    //     !record.categoryHeader && (
    //       <>
    //         <Button className="btn-edit">Sửa</Button>
    //         <Button className="btn-delete">Xóa</Button>
    //       </>
    //     ),
    // },
  ];

  // Sinh hàng nhóm theo trạng thái
  const expandedData = Object.entries(groupedData).flatMap(
    ([status, tasks]) => {
      const isOpen = openCategories.includes(status);
      const headerRow: any = {
        key: `cat-${status}`,
        categoryHeader: true,
        projectName: (
          <div
            onClick={() => toggleCategory(status)}
            style={{
              fontWeight: 600,
              cursor: "pointer",
              background: "#fafafa",
              padding: "8px 12px",
            }}
          >
            {isOpen ? <DownOutlined /> : <RightOutlined />} {status}
          </div>
        ),
      };
      return [headerRow, ...(isOpen ? tasks : [])];
    }
  );

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <div className="managerDetail-container">
        <div className="title-box">
          <p className="title">Quản lý nhiệm vụ dự án</p>
        </div>

        <div className="tool-setting">
          <div className="member" style={{ marginLeft: "1000px" }}>
            <div className="member-tools">
              <select>
                <option value="">Sắp xếp theo</option>
              </select>
              <input type="text" placeholder="Tìm kiếm nhiệm vụ" />
            </div>
          </div>
        </div>

        <div className="table">
          <p className="title-table">Danh Sách Nhiệm Vụ</p>
          {error && (
            <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
          )}
          <Table
            columns={columns}
            dataSource={expandedData}
            pagination={false}
            loading={loading}
            rowClassName={(record: any) =>
              record.categoryHeader ? "category-header" : ""
            }
            className="custom-table"
            bordered
          />
        </div>
      </div>
    </ConfigProvider>
  );
}

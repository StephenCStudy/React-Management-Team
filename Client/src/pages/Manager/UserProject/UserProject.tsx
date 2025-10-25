import { useState } from "react";
import { Button, ConfigProvider, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import type { Task } from "../../../interfaces/manager/mamagerDetail/managerDetail";

interface ProjectMember {
  user: {
    id: number;
    fullName: string;
  };
  role: string;
}

export default function UserProject() {
  // === STATE ===
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  // const [openDelete, setOpenDelete] = useState(false);
  // const [openCreateEdit, setOpenCreateEdit] = useState(false);
  // const [openInitMember, setOpenInitMember] = useState(false);
  // const [openViewMember, setOpenViewMember] = useState(false);
  // const [editingTask, setEditingTask] = useState<Task | null>(null);
  // const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // === DỮ LIỆU GIẢ LẬP ===
  const projectMembers: ProjectMember[] = [
    { user: { id: 1, fullName: "Nguyễn Văn A" }, role: "Frontend Developer" },
    { user: { id: 2, fullName: "Trần Thị B" }, role: "Backend Developer" },
  ];

  const taskData: Task[] = [
    {
      key: "1",
      taskName: "Thiết kế giao diện",
      assigneeId: 1,
      priority: "Cao",
      assignDate: "2025-10-10",
      dueDate: "2025-10-25",
      progress: "Đang thực hiện",
      status: "To Do",
    },
    {
      key: "2",
      taskName: "Xây dựng API",
      assigneeId: 2,
      priority: "Trung bình",
      assignDate: "2025-10-12",
      dueDate: "2025-10-28",
      progress: "Chưa bắt đầu",
      status: "In Progress",
    },
  ];

  // === HÀM XỬ LÝ ===
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  // === TABLE COLUMNS ===
  const columns: ColumnsType<any> = [
    {
      title: "Tên Nhiệm Vụ",
      dataIndex: "taskName",
      key: "taskName",
      render: (text, record) =>
        record.categoryHeader ? (
          text
        ) : (
          <span className="task-name">{text}</span>
        ),
    },
    {
      title: "Người Phụ Trách",
      dataIndex: "assigneeId",
      key: "assigneeId",
      render: (id, record) =>
        !record.categoryHeader
          ? projectMembers.find((pm) => pm.user.id === id)?.user.fullName
          : "",
    },
    {
      title: "Ưu Tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority, record) => {
        if (record.categoryHeader) return null;
        const safeClass = priority.toLowerCase().replace(/\s/g, "-");
        return <span className={`priority ${safeClass}`}>{priority}</span>;
      },
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
      render: (progress, record) => {
        if (record.categoryHeader) return null;
        const safeClass = progress.toLowerCase().replace(/\s/g, "-");
        return <span className={`status ${safeClass}`}>{progress}</span>;
      },
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) =>
        !record.categoryHeader && (
          <>
            <Button
              className="btn-edit"
              onClick={() => {
                setEditingTask(record);
                setOpenCreateEdit(true);
              }}
            >
              Sửa
            </Button>
            <Button
              className="btn-delete"
              onClick={() => {
                setTaskToDelete(record);
                setOpenDelete(true);
              }}
            >
              Xóa
            </Button>
          </>
        ),
    },
  ];

  // === GROUP TASKS ===
  const groupedData: Record<string, Task[]> = taskData.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const expandedData = Object.entries(groupedData).flatMap(
    ([status, tasks]) => {
      const isOpen = openCategories.includes(status);
      const headerRow: any = {
        key: `cat-${status}`,
        categoryHeader: true,
        taskName: (
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

  function setOpenInitMember(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  // === RETURN JSX ===
  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <div className="managerDetail-container">
        <div className="tool-setting">
          <div className="title-section">
            <div className="title-box">
              <p className="title">Xây dựng website thương mại điện tử</p>
            </div>

            <div className="imgs">
              <div className="img">
                <img
                  src="https://thvnext.bing.com/th/id/OIP.6mIEhub14VrCFHQBNU-0XwHaE7?w=229&h=180&c=7&r=0&o=7"
                  alt="project"
                  className="project-img"
                />
              </div>
              <p className="subtitle-img">
                Dự án nhằm phát triển nền tảng thương mại điện tử với các tính
                năng như giỏ hàng, thanh toán và quản lý sản phẩm.
              </p>
            </div>

            <button
              className="btn-create-project"
              onClick={() => {
                setEditingTask(null);
                setOpenCreateEdit(true);
              }}
            >
              + Thêm nhiệm vụ
            </button>
          </div>

          {/* --- Member Section --- */}
          <div className="member">
            <div className="member-head">
              <p className="member-title">Thành viên</p>
              <button
                className="btn-create-member"
                onClick={() => setOpenInitMember(true)}
              >
                + Quản lý thành viên
              </button>
            </div>

            <div className="member-body">
              {projectMembers.map((pm) => (
                <div className="img-user" key={pm.user.id}>
                  <div className="avatar">{getInitials(pm.user.fullName)}</div>
                  <div className="info">
                    <p className="name">{pm.user.fullName}</p>
                    <p className="role">{pm.role}</p>
                  </div>
                </div>
              ))}

              <div
                className="body-icon"
                onClick={() => setOpenInitMember(true)}
              >
                <i className="fa-solid fa-ellipsis-h"></i>
              </div>
            </div>

            <div className="member-tool">
              <select>
                <option value="">Sắp xếp theo</option>
              </select>
              <input type="text" placeholder="Tìm kiếm nhiệm vụ" />
            </div>
          </div>
        </div>

        <div className="table">
          <p className="title-table">Danh Sách Nhiệm Vụ</p>
          <Table
            columns={columns}
            dataSource={expandedData}
            pagination={false}
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
function setEditingTask(record: any) {
  throw new Error("Function not implemented.");
}

function setOpenCreateEdit(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setTaskToDelete(record: any) {
  throw new Error("Function not implemented.");
}

function setOpenDelete(arg0: boolean) {
  throw new Error("Function not implemented.");
}


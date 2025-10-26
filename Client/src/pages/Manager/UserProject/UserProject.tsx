  // src/components/UserProject.tsx
  import { useState } from "react";
  import { Button, ConfigProvider, Table } from "antd";
  import type { ColumnsType } from "antd/es/table";
  import { DownOutlined, RightOutlined } from "@ant-design/icons";
  import "./userProject.scss";

  interface Task {
    id: number;
    taskName: string;
    assigneeId: number;
    projectId: number;
    assignDate: string;
    dueDate: string;
    priority: string;
    progress: string;
    status: string;
    key?: string;
    categoryHeader?: boolean;
  }

  interface ProjectMember {
    userId: number;
    role: string;
  }

  interface Project {
    id: number;
    projectName: string;
    image: string;
    members: ProjectMember[];
  }

  export default function UserProject() {
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    // =========================
    // 🔄 DỮ LIỆU GIẢ LẬP (sau này có thể lấy từ server)
    // =========================
    const projects: Project[] = [
      {
        id: 1,
        projectName: "Xây dựng website thương mại điện tử",
        image:
          "https://res.cloudinary.com/des6fqth9th/image/upload/v1758845173/cld-sample-5.jpg",
        members: [
          { userId: 1, role: "Project owner" },
          { userId: 2, role: "Frontend developer" },
        ],
      },
      {
        id: 2,
        projectName: "Ứng dụng quản lý công việc nhóm",
        image:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        members: [
          { userId: 3, role: "Project owner" },
          { userId: 4, role: "Backend developer" },
        ],
      },
      {
        id: 3,
        projectName: "Hệ thống đặt vé xem phim trực tuyến",
        image:
          "https://res.cloudinary.com/demo/image/upload/v1690811770/movie-app.jpg",
        members: [
          { userId: 5, role: "Project owner" },
          { userId: 6, role: "UI Designer" },
        ],
      },
    ];

    const projectMembers = [
      { user: { id: 1, fullName: "Nguyễn Văn A" }, role: "Project owner" },
      { user: { id: 2, fullName: "Trần Thị B" }, role: "Frontend Developer" },
      { user: { id: 3, fullName: "Phạm Văn C" }, role: "Project owner" },
      { user: { id: 4, fullName: "Lê Thị D" }, role: "Backend Developer" },
      { user: { id: 5, fullName: "Võ Minh E" }, role: "Project owner" },
      { user: { id: 6, fullName: "Bùi Kim F" }, role: "UI Designer" },
    ];

    const taskData: Task[] = [
      {
        id: 1,
        key: "1",
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        assignDate: "2025-03-24",
        dueDate: "2025-03-26",
        priority: "Thấp",
        progress: "Đúng tiến độ",
        status: "To do",
      },
      {
        id: 2,
        key: "2",
        taskName: "Thiết kế giao diện trang chủ",
        assigneeId: 2,
        projectId: 1,
        assignDate: "2025-03-27",
        dueDate: "2025-04-02",
        priority: "Cao",
        progress: "Đang thực hiện",
        status: "In progress",
      },
      {
        id: 3,
        key: "3",
        taskName: "Xây dựng API quản lý nhiệm vụ",
        assigneeId: 4,
        projectId: 2,
        assignDate: "2025-03-25",
        dueDate: "2025-03-30",
        priority: "Trung bình",
        progress: "Chưa bắt đầu",
        status: "To do",
      },
      {
        id: 4,
        key: "4",
        taskName: "Thiết kế giao diện bảng Kanban",
        assigneeId: 3,
        projectId: 2,
        assignDate: "2025-03-28",
        dueDate: "2025-04-05",
        priority: "Cao",
        progress: "Đang thực hiện",
        status: "In progress",
      },
      {
        id: 5,
        key: "5",
        taskName: "Thiết kế trang chọn ghế xem phim",
        assigneeId: 6,
        projectId: 3,
        assignDate: "2025-04-01",
        dueDate: "2025-04-10",
        priority: "Thấp",
        progress: "Đúng tiến độ",
        status: "To do",
      },
    ];

    // 🔄 Nếu sau này bạn lấy dữ liệu từ API:
    /*
    useEffect(() => {
      fetch("/api/projects")
        .then(res => res.json())
        .then(data => setProjects(data));
    }, []);
    */

    const toggleCategory = (category: string) => {
      setOpenCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    };

    // Gộp nhiệm vụ theo dự án
    const groupedData: Record<string, Task[]> = taskData.reduce((acc, task) => {
    const projectName =
      projects.find((p) => p.id === task.projectId)?.projectName || "Khác";
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

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
      // {
      //   title: "Tên Nhiệm Vụ",
      //   dataIndex: "taskName",
      //   key: "taskName",
      //   render: (text, record) =>
      //     record.categoryHeader ? "" : <span className="task-name">{text}</span>,
      // },
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
        render: (priority, record) =>
          !record.categoryHeader ? (
            <span className={`priority ${priority?.toLowerCase()}`}>
              {priority}
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

import React, { useState, useMemo } from "react";
import { Table, Button, message, ConfigProvider } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./ManagermentDetail.scss";
import ModalCreateEdit from "./Modal/Edit/ModalCreateEdit";
import ModalDelete from "./Modal/Delete/ModalDelete";
import InitMemberModal from "./Modal/initMember/initmember";
import ViewMemberModal from "./Modal/viewMember/viewmember";
import type { Task } from "../../../interfaces/manager/mamagerDetail/managerDetail";


// ==== Helper: lấy 2 ký tự đầu tên ====
const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  if (parts.length === 1 && parts[0].length > 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (first + last).toUpperCase();
};

const taskData: Task[] = [
  {
    id: 1,
    taskName: "Soạn thảo đề cương dự án",
    assigneeId: 1,
    projectId: 101,
    assignDate: "2025-02-24",
    dueDate: "2025-02-27",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 2,
    taskName: "Soạn thảo báo cáo",
    assigneeId: 1,
    projectId: 101,
    assignDate: "2025-02-24",
    dueDate: "2025-02-27",
    priority: "Trung bình",
    progress: "Có rủi ro",
    status: "To do",
  },
  {
    id: 3,
    taskName: "Lên lịch họp kickoff",
    assigneeId: 1,
    projectId: 101,
    assignDate: "2025-02-24",
    dueDate: "2025-02-27",
    priority: "Cao",
    progress: "Trễ hạn",
    status: "In progress",
  },
  {
    id: 4,
    taskName: "Phân tích yêu cầu hệ thống",
    assigneeId: 2,
    projectId: 101,
    assignDate: "2025-02-10",
    dueDate: "2025-02-15",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "Pending",
  },
  {
    id: 5,
    taskName: "Phân tích yêu cầu hệ thống",
    assigneeId: 2,
    projectId: 101,
    assignDate: "2025-02-10",
    dueDate: "2025-02-15",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "Done",
  },
];

const ManagermentDetail: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(["To do"]);
  const [openCreateEdit, setOpenCreateEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [openInitMember, setOpenInitMember] = useState(false);
  const [openViewMember, setOpenViewMember] = useState(false);

  // --- Dữ liệu thành viên gốc ---
  const [projectMembers, setProjectMembers] = useState([
    {
      user: { id: 1, fullName: "An Nguyễn", email: "an@example.com" },
      role: "Project Owner",
    },
    {
      user: { id: 2, fullName: "Bách Nguyễn", email: "bach@example.com" },
      role: "Frontend Developer",
    },
  ]);

  // --- Biến đổi dữ liệu đúng format modal cần ---
  const membersForModal = useMemo(() => {
    return projectMembers.map((pm) => ({
      id: pm.user.id,
      name: pm.user.fullName,
      email: pm.user.email,
      avatarLabel: getInitials(pm.user.fullName),
      role: pm.role,
    }));
  }, [projectMembers]);

  // --- Lưu lại thay đổi vai trò từ modal ---
  const handleSaveRoles = (updatedMembers: any[]) => {
    setProjectMembers((prevMembers) =>
      prevMembers.map((pm) => {
        const updated = updatedMembers.find((m) => m.id === pm.user.id);
        if (updated) {
          return { ...pm, role: updated.role };
        }
        return pm;
      })
    );
    message.success("Cập nhật vai trò thành công!");
    setOpenViewMember(false);
  };



  // Chuyển đổi trạng thái mở/đóng của từng nhóm
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };


  //table columns

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
        const className = `priority ${safeClass}`;
        return <span className={className}>{priority}</span>;
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
        const className = `status ${safeClass}`;
        return <span className={className}>{progress}</span>;
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

  // Nhóm dữ liệu theo trạng thái
  const groupedData: Record<string, Task[]> = taskData.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Tạo dữ liệu mở rộng với header cho từng nhóm
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

  return (
    <ConfigProvider
      getPopupContainer={() => document.body} //  fix dropdown layout
    >
      <div className="managerDetail-container">
        <div className="tool-setting">

          {/* // --- Title Section --- */}
          <div className="title-section">
            <div className="title-box">
              <p className="title">Xây dựng website thương mại điện tử</p>
            </div>
            <div className="imgs">
              <div className="img">
                <img
                  src="https://thvnext.bing.com/th/id/OIP.6mIEhub14VrCFHQBNU-0XwHaE7?w=229&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3"
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

          {/* // --- Member Section --- */}
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
                onClick={() => setOpenViewMember(true)}
              >
                <i className="fa-solid fa-ellipsis-h"></i>
              </div>
            </div>

            <div className="member-tool">
              <select>
                <option defaultValue="">Sắp xếp theo</option>
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

        {/* --- MODALS --- */}
        <ModalCreateEdit
          open={openCreateEdit}
          onCancel={() => setOpenCreateEdit(false)}
          onOk={(data) => {
            if (editingTask) {
              console.log("Cập nhật:", { ...editingTask, ...data });
            } else {
              console.log("Tạo mới:", data);
            }
            setOpenCreateEdit(false);
          }}
        />

        <ModalDelete
          open={openDelete}
          onCancel={() => setOpenDelete(false)}
          onConfirm={() => {
            if (taskToDelete) {
              message.success("Đã xóa nhiệm vụ thành công!");
            }
            setOpenDelete(false);
          }}
        />

        <InitMemberModal
          isOpen={openInitMember}
          onClose={() => setOpenInitMember(false)}
          onSave={(values) => {
            console.log("Thêm thành viên:", values);
            setOpenInitMember(false);
          }}
        />

        <ViewMemberModal
          isOpen={openViewMember}
          onClose={() => setOpenViewMember(false)}
          onSave={handleSaveRoles}
          members={membersForModal}
        />
      </div>
    </ConfigProvider>
  );
};

export default ManagermentDetail;

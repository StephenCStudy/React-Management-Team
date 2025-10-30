import React, { useState, useMemo, useEffect } from "react";
import { Table, Button, ConfigProvider, Input } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./ManagermentDetail.scss";
import ModalCreateEdit from "./Modal/Edit/ModalCreateEdit";
import ModalDelete from "./Modal/Delete/ModalDelete";
import InitMemberModal from "./Modal/initMember/initmember";
import ViewMemberModal from "./Modal/viewMember/viewmember";
import type { Task } from "../../../interfaces/manager/mamagerDetail/managerDetail";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../apis/store/hooks";
import { fetchProjectDetails } from "../../../apis/store/slice/projects/managerDetail.slice";
import { useProjectMembers } from "../../../hooks/useProjectMembers";
import { useTaskHandlers } from "../../../hooks/useTaskHandlers";
import { useMessageApi } from "../../../contexts/MessageContext"; // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19

const { Search } = Input;

// Hàm lấy chữ cái đầu từ tên đầy đủ để hiển thị avatar member
function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ManagermentDetail: React.FC = () => {
  // Lấy ID dự án từ URL
  const { id } = useParams<{ id?: string }>();

  // Khởi tạo dispatch để gửi action đến Redux store
  const dispatch = useAppDispatch();

  // Lấy messageApi từ context
  const messageApi = useMessageApi(); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19

  // Lấy state từ Redux store thông qua useSelector
  const { project, tasks } = useAppSelector((state) => state.managerDetail); // dùng state từ managerDetail slice để lấy dữ liệu dự án và nhiệm vụ

  // Các state quản lý modal và trạng thái giao diện
  const [openCreateEdit, setOpenCreateEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [openInitMember, setOpenInitMember] = useState(false);
  const [openViewMember, setOpenViewMember] = useState(false);
  const [expandedStatuses, setExpandedStatuses] = useState<
    Record<string, boolean>
  >({ "To do": true });
  const [usersMap, setUsersMap] = useState<Record<string, string>>({}); // Map userId -> userName để hiển thị tên người dùng
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]); // Danh sách tất cả người dùng trong hệ thống
  // State cho sorting
  type SortKey = "none" | "dueDate" | "priority";
  const [sortKey, setSortKey] = useState<SortKey>("none");

  // ------------------------------------------------------------------------------
  // Gọi API để lấy dữ liệu dự án khi component được tải
  useEffect(() => {
    // Chỉ gọi API khi có ID dự án
    if (id) {
      // Dispatch action để lấy dữ liệu dự án và tải dữ liệu người dùng
      dispatch(fetchProjectDetails(id));
      loadUsers();
    }
  }, [id]); // Chạy lại effect khi id thay đổi

  // Hàm tải danh sách người dùng
  const loadUsers = async () => {
    try {
      // Gọi API để lấy danh sách người dùng
      const userRes = await fetch(`http://localhost:3000/users`);
      const userJson = userRes.ok ? await userRes.json() : [];

      // Lưu trữ danh sách người dùng đầy đủ
      setAllUsers(userJson || []);

      // Tạo map cho việc hiển thị tên người dùng
      const map: Record<string, string> = {};
      userJson.forEach((u: any) => {
        map[u.id] = u.fullName || u.displayName || u.email || String(u.id);
      });
      setUsersMap(map);
    } catch (err) {
      // console.error("Lỗi khi tải dữ liệu người dùng:", err);
      messageApi.error("Không thể tải danh sách người dùng"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
    }
  };

  // Tính toán danh sách thành viên với thông tin đầy đủ, dùng để hiển thị trong bảng thành viên 
  const projectMembers = useMemo(() => {
    // Nếu không có thông tin dự án hoặc thành viên, trả về mảng rỗng
    if (!project?.members) return [];

    // Chuyển đổi dữ liệu thành viên sang định dạng hiển thị
    return project.members.map((member) => ({
      userId: member.userId,
      name: usersMap[member.userId] || String(member.userId), // Lấy tên từ usersMap hoặc dùng ID nếu không có
      role: member.role,
      // Tạo chữ cái đầu làm avatar
      avatarLabel: getInitials(
        usersMap[member.userId] || String(member.userId)
      ),
    }));
  }, [project, usersMap]); // Tính toán lại khi project hoặc usersMap thay đổi


  // ------------------------------------------------------------------------------
  // Lọc và sắp xếp danh sách nhiệm vụ dựa trên từ khóa tìm kiếm và sortKey
  // ------------------------------------------------------------------------------
  const visibleTasks = useMemo(() => {
    let filtered = tasks.filter((task: Task) => { // tìm kiếm nhiệm vụ
      const q = search.trim().toLowerCase(); // dùng trim() để loại bỏ khoảng trắng thừa, dùng toLowerCase() để không phân biệt hoa thường
      if (!q) return true; // Nếu không có từ khóa tìm kiếm, giữ lại tất cả
      const assignee = usersMap[String(task.assigneeId)] || ""; // Lấy assigneeId từ usersMap
      return (
        String(task.taskName).toLowerCase().includes(q) || // trả về chuỗi nếu taskName hoặc assignee chứa từ khóa tìm kiếm
        assignee.toLowerCase().includes(q)
      );
    });
    // Sắp xếp nếu có sortKey
    if (sortKey === "dueDate") { // sắp xếp theo hạn chót
      filtered = [...filtered].sort((a, b) => {
        const da = new Date(a.dueDate).getTime(); // Lấy thời gian hạn chót của nhiệm vụ a
        const db = new Date(b.dueDate).getTime(); // Lấy thời gian hạn chót của nhiệm vụ b
        if (da !== db) return da - db; // Sắp xếp tăng dần theo hạn chót
        // Tie-breaker: ưu tiên
        const priorityOrder = { Cao: 3, "Trung bình": 2, Thấp: 1 };
        const wa = priorityOrder[a.priority] ?? 0; // Ưu tiên của nhiệm vụ a
        const wb = priorityOrder[b.priority] ?? 0; // Ưu tiên của nhiệm vụ b
        if (wa !== wb) return wb - wa; // Ưu tiên cao hơn đứng trước
        return a.taskName.localeCompare(b.taskName, "vi"); // Cuối cùng sắp xếp theo tên nhiệm vụ, dùng localeCompare với locale "vi" để đúng thứ tự tiếng Việt
      });
    } else if (sortKey === "priority") { // sắp xếp theo ưu tiên
      const priorityOrder = { Cao: 3, "Trung bình": 2, Thấp: 1 };
      filtered = [...filtered].sort((a, b) => {
        const wa = priorityOrder[a.priority] ?? 0;
        const wb = priorityOrder[b.priority] ?? 0;
        if (wa !== wb) return wb - wa;
        // Tie-breaker: hạn chót
        const da = new Date(a.dueDate).getTime();
        const db = new Date(b.dueDate).getTime();
        if (da !== db) return da - db;
        return a.taskName.localeCompare(b.taskName, "vi");
      });
    }
    return filtered;
  }, [tasks, search, usersMap, sortKey]);

  // ------------------------------------------------------------------------------
  // Nhóm các nhiệm vụ theo trạng thái
  // ------------------------------------------------------------------------------
  const grouped = useMemo(() => {
    return visibleTasks.reduce((acc: Record<string, Task[]>, task: Task) => { // dùng reduce để nhóm các nhiệm vụ theo trạng thái
      const status = task.status || "To do"; // Nếu không có trạng thái, mặc định là "To do"
      if (!acc[status]) acc[status] = [];
      acc[status].push(task); // Thêm nhiệm vụ vào nhóm tương ứng
      return acc;
    }, {} as Record<string, Task[]>);
  }, [visibleTasks]);

  // Hàm chuyển đổi trạng thái đóng/mở của nhóm nhiệm vụ theo trạng thái
  function toggleStatus(s: string) {
    setExpandedStatuses((cur) => ({ ...cur, [s]: !cur[s] }));
  }

  // ------------------------------------------------------------------------------
  // Định nghĩa các cột cho bảng nhiệm vụ
  // ------------------------------------------------------------------------------
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
      render: (val, rec) =>
        !rec.categoryHeader ? usersMap[String(val)] || "-" : "",
    },
    {
      title: "Ưu Tiên",
      dataIndex: "priority",
      key: "priority",
      render: (p, r) =>
        r.categoryHeader ? null : (
          <span
            className={`priority ${String(p)
              .toLowerCase()
              .replace(/\s/g, "-")}`}
          >
            {p}
          </span>
        ),
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "assignDate",
      key: "assignDate",
      render: (d, r) =>
        !r.categoryHeader ? <span style={{ color: "blue" }}>{d}</span> : null,
    },
    {
      title: "Hạn Chót",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (d, r) =>
        !r.categoryHeader ? <span style={{ color: "blue" }}>{d}</span> : null,
    },
    {
      title: "Tiến Độ",
      dataIndex: "progress",
      key: "progress",
      render: (p, r) =>
        r.categoryHeader ? null : (
          <span
            className={`status ${String(p).toLowerCase().replace(/\s/g, "-")}`}
          >
            {p}
          </span>
        ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_: any, record: any) =>
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

  // ------------------------------------------------------------------------------
  // Tạo dataSource cho bảng với các nhóm trạng thái có thể đóng/mở
  // ------------------------------------------------------------------------------
  const dataSource = useMemo(() => {
    return Object.entries(grouped).flatMap(([status, items]) => {
      // flatMap để tạo mảng phẳng từ các nhóm, entries trả về mảng [key, value]
      const header = {
        key: `header-${status}`, // header là khóa duy nhất cho mỗi nhóm
        categoryHeader: true,
        taskName: (
          <div     // dùng để hiển thị tiêu đề nhóm có thể đóng/mở
            onClick={() => toggleStatus(status)}
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              background: "#fafafa",
              padding: "8px 12px",
            }}
          >
            {expandedStatuses[status] ? <DownOutlined /> : <RightOutlined />}{" "}  
            {status}
          </div> // icon chỉ trạng thái đóng/mở
        ),
      };
      return [header, ...(expandedStatuses[status] ? items : [])]; // Nếu nhóm đang mở, thêm các nhiệm vụ vào, nếu đóng thì chỉ có header
    });
  }, [grouped, expandedStatuses]);

  // Sử dụng custom hook cho logic Task ( thêm, sửa, xóa nhiệm vụ)
  const { handleSaveTask, handleConfirmDelete } = useTaskHandlers(
    tasks, // danh sách nhiệm vụ
    editingTask, // nhiệm vụ đang chỉnh sửa
    id, // ID dự án
    dispatch, // hàm dispatch từ Redux store
    messageApi // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
  );
  // Sử dụng custom hook cho logic member ( thêm, sửa, xóa thành viên)
  const { addMember, updateMemberRole, deleteMember } = useProjectMembers(
    project, // thông tin dự án
    id, // ID dự án
    allUsers, // danh sách tất cả người dùng trong hệ thống
    dispatch, // hàm dispatch từ Redux store
    messageApi // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
  );

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <div className="managerDetail-container">
        {/* // Phần cài đặt công cụ và thông tin dự án */}
        <div className="tool-setting">
          <div className="title-section">
            <div className="title-box">
              <p className="title">{project?.projectName || "Dự án"}</p>
            </div>
            <div className="imgs">
              <div className="img">
                <img
                  src={project?.image || ""}
                  alt="project"
                  className="project-img"
                />
              </div>
              <p className="subtitle-img">
                {project?.description || "Không có mô tả."}
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
              {/* Hiển thị tối đa 2 thành viên */}
              {projectMembers.slice(0, 2).map((m) => (
                <div className="img-user" key={m.userId}>
                  <div className="avatar">{m.avatarLabel}</div>
                  <div className="info">
                    <p className="name">{m.name}</p>
                    <p className="role">
                      {m.role === "Project Owner" ? "Chủ dự án" : "Thành viên"}
                    </p>
                  </div>
                </div>
              ))}
              {/* Icon mở modal quản lý thành viên */}
              <div
                className="body-icon"
                onClick={() => setOpenViewMember(true)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i className="fa-solid fa-ellipsis-h"></i>
              </div>
            </div>
            <div className="member-tool">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                style={{ padding: "6px 8px" }}
                aria-label="Chọn tiêu chí sắp xếp"
              >
                <option value="none">Sắp xếp: Mặc định</option>
                <option value="dueDate">Sắp xếp theo hạn chót</option>
                <option value="priority">Sắp xếp theo độ ưu tiên</option>
              </select>
              <Search
                placeholder="Tìm kiếm nhiệm vụ theo tên hoặc người phụ trách"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
          </div>
        </div>

        {/* // Phần bảng danh sách nhiệm vụ */}
        <div className="table">
          <p className="title-table">Danh Sách Nhiệm Vụ</p>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={(r: any) =>
              r.categoryHeader ? "category-header" : ""
            }
            className="custom-table"
            bordered
          />
        </div>

        {/* // Modals cho tạo/sửa nhiệm vụ, xóa nhiệm vụ, quản lý thành viên */}
        <ModalCreateEdit
          open={openCreateEdit}
          onCancel={() => {
            setOpenCreateEdit(false);
            setEditingTask(null);
          }}
          onOk={(data) =>
            handleSaveTask(data, setOpenCreateEdit, setEditingTask)
          }
          editingTask={editingTask}
          projectMembers={projectMembers.map((member) => ({
            userId: member.userId,
            name: member.name,
          }))}
        />

        <ModalDelete
          open={openDelete}
          onCancel={() => setOpenDelete(false)}
          onConfirm={() =>
            handleConfirmDelete(taskToDelete, setOpenDelete, setTaskToDelete)
          }
        />

        <InitMemberModal
          isOpen={openInitMember}
          onClose={() => setOpenInitMember(false)}
          onSave={addMember}
        />

        <ViewMemberModal
          isOpen={openViewMember}
          onClose={() => setOpenViewMember(false)}
          onSave={updateMemberRole}
          onDelete={deleteMember}
          members={projectMembers}
        />
      </div>
    </ConfigProvider>
  );
};

export default ManagermentDetail;

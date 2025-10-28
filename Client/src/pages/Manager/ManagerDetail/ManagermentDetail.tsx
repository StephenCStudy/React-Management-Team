import React, { useState, useMemo, useEffect } from "react";
import { Table, Button, message, ConfigProvider, Input } from "antd";
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
import {
  fetchProjectDetails,
  addTask,
  updateTask,
  deleteTask,
  sortByDueDate,
  sortByPriority,
} from "../../../apis/store/slice/projects/managerDetail.slice";
import dayjs from "dayjs";

const { Search } = Input;

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/*
 * Component quản lý chi tiết dự án
 *
 * Chức năng chính:
 * 1. Hiển thị thông tin dự án và danh sách thành viên
 * 2. Quản lý nhiệm vụ:
 *    - Thêm mới nhiệm vụ với các ràng buộc:
 *      + Dữ liệu không được trống
 *      + Tên nhiệm vụ không trùng lặp
 *      + Tên nhiệm vụ từ 5-100 ký tự
 *      + Ngày bắt đầu > ngày hiện tại
 *      + Hạn chót > ngày bắt đầu
 *    - Sửa nhiệm vụ
 *    - Xóa nhiệm vụ
 * 3. Quản lý thành viên:
 *    - Thêm thành viên mới với các ràng buộc:
 *      + Email và vai trò không được trống
 *      + Email phải đúng định dạng
 *      + Email từ 5-50 ký tự
 *      + Người dùng chưa có trong dự án
 *    - Sửa vai trò thành viên
 *    - Xóa thành viên
 * 4. Tính năng bổ sung:
 *    - Sắp xếp nhiệm vụ theo hạn chót/độ ưu tiên
 *    - Tìm kiếm nhiệm vụ theo tên
 *    - Đóng/mở danh sách nhiệm vụ theo trạng thái
 */
const ManagermentDetail: React.FC = () => {
  // Lấy ID dự án từ URL
  const { id } = useParams<{ id?: string }>();

  // Khởi tạo dispatch để gửi action đến Redux store
  const dispatch = useAppDispatch();

  // Lấy state từ Redux store thông qua useSelector
  const { project, tasks } = useAppSelector((state) => state.managerDetail);

  const [openCreateEdit, setOpenCreateEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [openInitMember, setOpenInitMember] = useState(false);
  const [openViewMember, setOpenViewMember] = useState(false);
  const [expandedStatuses, setExpandedStatuses] = useState<
    Record<string, boolean>
  >({ "To do": true });

  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Kiểm tra tính hợp lệ của thành viên
  const validateMember = (
    email: string,
    role: string
  ): { isValid: boolean; error?: string } => {
    // Kiểm tra email không được trống
    if (!email?.trim()) {
      return { isValid: false, error: "Email không được để trống" };
    }

    // Kiểm tra độ dài email (từ 5 đến 50 ký tự)
    if (email.length < 5 || email.length > 50) {
      return { isValid: false, error: "Email phải từ 5 đến 50 ký tự" };
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Email không đúng định dạng" };
    }

    // Kiểm tra email có tồn tại trong hệ thống không
    const userExists = allUsers.some((u) => u.email === email);
    if (!userExists) {
      return { isValid: false, error: "Email không tồn tại trong hệ thống" };
    }

    // Kiểm tra người dùng đã tồn tại trong dự án chưa
    const isExistingMember = project?.members?.some(
      (member) => allUsers.find((u) => u.email === email)?.id === member.userId
    );
    if (isExistingMember) {
      return { isValid: false, error: "Email này đã là thành viên của dự án" };
    }

    // Kiểm tra vai trò không được trống và phải là một trong hai giá trị cho phép
    if (!role?.trim() || !["Project Owner", "member"].includes(role)) {
      return { isValid: false, error: "Vai trò không hợp lệ" };
    }

    return { isValid: true };
  };

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
      console.error("Lỗi khi tải dữ liệu người dùng:", err);
      message.error("Không thể tải danh sách người dùng");
    }
  };

  // Tính toán danh sách thành viên với thông tin đầy đủ
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

  // Lọc danh sách nhiệm vụ dựa trên từ khóa tìm kiếm
  const visibleTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      const q = search.trim().toLowerCase(); // Chuyển từ khóa tìm kiếm về chữ thường
      if (!q) return true; // Nếu không có từ khóa, hiện tất cả

      // Lấy tên người phụ trách từ usersMap
      const assignee = usersMap[String(task.assigneeId)] || "";

      // Tìm kiếm trong tên nhiệm vụ hoặc tên người phụ trách
      return (
        String(task.taskName).toLowerCase().includes(q) ||
        assignee.toLowerCase().includes(q)
      );
    });
  }, [tasks, search, usersMap]);

  // Nhóm các nhiệm vụ theo trạng thái
  const grouped = useMemo(() => {
    return visibleTasks.reduce((acc: Record<string, Task[]>, task: Task) => {
      const status = task.status || "To do"; // Nếu không có trạng thái, mặc định là "To do"
      if (!acc[status]) acc[status] = [];
      acc[status].push(task); // Thêm nhiệm vụ vào nhóm tương ứng
      return acc;
    }, {} as Record<string, Task[]>);
  }, [visibleTasks]);

  function toggleStatus(s: string) {
    setExpandedStatuses((cur) => ({ ...cur, [s]: !cur[s] }));
  }

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

  const dataSource = useMemo(() => {
    return Object.entries(grouped).flatMap(([status, items]) => {
      const header = {
        key: `header-${status}`,
        categoryHeader: true,
        taskName: (
          <div
            onClick={() => toggleStatus(status)}
            style={{
              fontWeight: 600,
              cursor: "pointer",
              background: "#fafafa",
              padding: "8px 12px",
            }}
          >
            {expandedStatuses[status] ? <DownOutlined /> : <RightOutlined />}{" "}
            {status}
          </div>
        ),
      };
      return [header, ...(expandedStatuses[status] ? items : [])];
    });
  }, [grouped, expandedStatuses]);

  // Kiểm tra tính hợp lệ của nhiệm vụ
  const validateTask = (
    taskData: Task
  ): { isValid: boolean; error?: string } => {
    // Kiểm tra dữ liệu không được trống
    if (!taskData.taskName?.trim()) {
      return { isValid: false, error: "Tên nhiệm vụ không được để trống" };
    }

    // Kiểm tra độ dài tên nhiệm vụ (từ 5 đến 100 ký tự)
    if (taskData.taskName.length < 5 || taskData.taskName.length > 100) {
      return { isValid: false, error: "Tên nhiệm vụ phải từ 5 đến 100 ký tự" };
    }

    // Kiểm tra tên nhiệm vụ có bị trùng không
    const isDuplicateName = tasks.some(
      (task) =>
        task.taskName.toLowerCase() === taskData.taskName.toLowerCase() &&
        task.id !== taskData.id
    );
    if (isDuplicateName) {
      return { isValid: false, error: "Tên nhiệm vụ đã tồn tại trong dự án" };
    }

    // Kiểm tra ngày bắt đầu phải lớn hơn ngày hiện tại
    const today = dayjs().startOf("day");
    const assignDate = dayjs(taskData.assignDate);
    if (assignDate.isBefore(today)) {
      return {
        isValid: false,
        error: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
      };
    }

    // Kiểm tra hạn chót phải lớn hơn ngày bắt đầu
    const dueDate = dayjs(taskData.dueDate);
    if (dueDate.isBefore(assignDate)) {
      return { isValid: false, error: "Hạn chót phải lớn hơn ngày bắt đầu" };
    }

    return { isValid: true };
  };

  // Xử lý lưu task (thêm mới hoặc cập nhật)
  async function handleSaveTask(data: Task) {
    try {
      // Kiểm tra tính hợp lệ của dữ liệu
      const validation = validateTask(data);
      if (!validation.isValid) {
        message.error(validation.error);
        return;
      }

      if (editingTask) {
        // Cập nhật task
        await dispatch(
          updateTask({
            ...editingTask,
            ...data,
          })
        ).unwrap();
        message.success("Đã cập nhật nhiệm vụ thành công!");
      } else {
        // Thêm task mới
        await dispatch(
          addTask({
            ...data,
            projectId: Number(id),
          })
        ).unwrap();
        message.success("Đã thêm nhiệm vụ mới thành công!");
      }
      setOpenCreateEdit(false);
      setEditingTask(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu nhiệm vụ!");
      console.error("Lỗi:", error);
    }
  }

  // Xử lý xóa task
  async function handleConfirmDelete() {
    if (!taskToDelete) return;

    try {
      await dispatch(deleteTask(taskToDelete.id)).unwrap();
      message.success("Đã xóa nhiệm vụ thành công!");
      setOpenDelete(false);
      setTaskToDelete(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa nhiệm vụ!");
    }
  }

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <div className="managerDetail-container">
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Hạn chót") {
                    // Sắp xếp theo hạn chót
                    dispatch(sortByDueDate());
                  } else if (value === "Độ ưu tiên") {
                    // Sắp xếp theo độ ưu tiên
                    dispatch(sortByPriority());
                  }
                }}
              >
                <option value="">Sắp xếp theo</option>
                <option value="Hạn chót">Hạn chót</option>
                <option value="Độ ưu tiên">Độ ưu tiên</option>
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

        <ModalCreateEdit
          open={openCreateEdit}
          onCancel={() => setOpenCreateEdit(false)}
          onOk={handleSaveTask}
        />
        <ModalDelete
          open={openDelete}
          onCancel={() => setOpenDelete(false)}
          onConfirm={handleConfirmDelete}
        />
        <InitMemberModal
          isOpen={openInitMember}
          onClose={() => {
            setOpenInitMember(false);
          }}
          onSave={async (values, form) => {
            // Kiểm tra tính hợp lệ của thông tin thành viên
            const validation = validateMember(values.email, values.role);
            if (!validation.isValid) {
              message.error(validation.error);
              return false;
            }

            try {
              // Tìm user dựa trên email
              const user = allUsers.find((u) => u.email === values.email);
              if (!user) {
                message.error("Không tìm thấy người dùng với email này");
                return false;
              }

              // Thêm thành viên vào dự án
              const newMember = {
                userId: user.id,
                role: values.role,
              };

              // Cập nhật project
              const response = await fetch(
                `http://localhost:3000/projects/${id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    members: [...(project?.members || []), newMember],
                  }),
                }
              );

              if (response.ok) {
                message.success("Đã thêm thành viên mới thành công!");
                // Cập nhật lại dữ liệu dự án
                dispatch(fetchProjectDetails(id!));
                // Reset form
                form.resetFields();
                return true;
              } else {
                throw new Error("Lỗi khi thêm thành viên");
              }
            } catch (error) {
              console.error("Lỗi khi thêm thành viên:", error);
              message.error("Có lỗi xảy ra khi thêm thành viên");
              return false;
            }
          }}
        />
        <ViewMemberModal
          isOpen={openViewMember}
          onClose={() => setOpenViewMember(false)}
          onSave={async (updatedMember) => {
            try {
              // Kiểm tra xem có phải owner duy nhất không
              if (updatedMember.role !== "Project Owner") {
                const ownerCount =
                  project?.members?.filter(
                    (m) =>
                      m.role === "Project Owner" &&
                      m.userId !== updatedMember.userId
                  ).length || 0;
                if (ownerCount === 0) {
                  message.error(
                    "Không thể thay đổi vai trò: phải có ít nhất một owner trong dự án!"
                  );
                  return;
                }
              }

              // Cập nhật vai trò thành viên trong dự án
              const updatedMembers = project?.members?.map((m) =>
                m.userId === updatedMember.userId
                  ? { ...m, role: updatedMember.role }
                  : m
              );

              const response = await fetch(
                `http://localhost:3000/projects/${id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    members: updatedMembers,
                  }),
                }
              );

              if (response.ok) {
                message.success("Đã cập nhật vai trò thành viên thành công!");
                dispatch(fetchProjectDetails(id!));
                setOpenViewMember(false);
              } else {
                throw new Error("Lỗi khi cập nhật vai trò thành viên");
              }
            } catch (error) {
              console.error("Lỗi khi cập nhật vai trò thành viên:", error);
              message.error("Có lỗi khi cập nhật vai trò thành viên!");
            }
          }}
          onDelete={async (memberId) => {
            try {
              // Kiểm tra xem có phải owner duy nhất không
              const member = project?.members?.find(
                (m) => m.userId === memberId
              );
              if (member?.role === "Project Owner") {
                const ownerCount =
                  project?.members?.filter((m) => m.role === "Project Owner")
                    .length || 0;
                if (ownerCount <= 1) {
                  message.error("Không thể xóa owner duy nhất của dự án!");
                  return;
                }
              }

              // Xóa thành viên khỏi dự án
              const updatedMembers = project?.members?.filter(
                (m) => m.userId !== memberId
              );

              const response = await fetch(
                `http://localhost:3000/projects/${id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    members: updatedMembers,
                  }),
                }
              );

              if (response.ok) {
                message.success("Đã xóa thành viên khỏi dự án thành công!");
                dispatch(fetchProjectDetails(id!));
              } else {
                throw new Error("Lỗi khi xóa thành viên");
              }
            } catch (error) {
              console.error("Lỗi khi xóa thành viên:", error);
              message.error("Có lỗi khi xóa thành viên!");
            }
          }}
          members={projectMembers}
        />
      </div>
    </ConfigProvider>
  );
};

export default ManagermentDetail;

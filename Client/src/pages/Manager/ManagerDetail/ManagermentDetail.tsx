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
import { fetchProjects } from "../../../apis/store/slice/projects/detail.slice";

const { Search } = Input;

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ManagermentDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useAppDispatch();
  const detailState = useAppSelector((s) => s.detail);
  const project = detailState.data as any | null;

  const [openCreateEdit, setOpenCreateEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [openInitMember, setOpenInitMember] = useState(false);
  const [openViewMember, setOpenViewMember] = useState(false);
  const [expandedStatuses, setExpandedStatuses] = useState<
    Record<string, boolean>
  >({ "To do": true });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchProjects(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function loadData() {
      try {
        const [taskRes, userRes] = await Promise.all([
          fetch(`http://localhost:3000/taskData?projectId=${id}`),
          fetch(`http://localhost:3000/users`),
        ]);
        const taskJson = taskRes.ok ? await taskRes.json() : [];
        const userJson = userRes.ok ? await userRes.json() : [];
        if (!mounted) return;
        setTasks(taskJson || []);
        const map: Record<string, string> = {};
        (userJson || []).forEach((u: any) => {
          map[u.id] = u.fullName || u.displayName || u.email || String(u.id);
        });
        setUsersMap(map);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const projectMembers = useMemo(() => {
    if (!project?.members) return [];
    return project.members.map((m: any) => ({
      id: m.userId,
      name: usersMap[m.userId] || String(m.userId),
      role: m.role,
      avatarLabel: getInitials(usersMap[m.userId] || String(m.userId)),
    }));
  }, [project, usersMap]);

  const visibleTasks = tasks.filter((t: any) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const assignee = usersMap[String(t.assigneeId)] || "";
    return (
      String(t.taskName).toLowerCase().includes(q) ||
      assignee.toLowerCase().includes(q)
    );
  });

  const grouped = visibleTasks.reduce((acc: Record<string, Task[]>, t) => {
    const s = t.status || "To do";
    (acc[s] ||= []).push(t);
    return acc;
  }, {} as Record<string, Task[]>);

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

  const dataSource = Object.entries(grouped).flatMap(([status, items]) => {
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

  function handleSaveTask(_data: any) {
    if (editingTask) message.success("Cập nhật nhiệm vụ (demo)");
    else message.success("Tạo nhiệm vụ mới (demo)");
    setOpenCreateEdit(false);
  }

  function handleConfirmDelete() {
    if (taskToDelete) message.success("Đã xóa nhiệm vụ (demo)");
    setOpenDelete(false);
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
              {projectMembers.map((m: any) => (
                <div className="img-user" key={m.id}>
                  <div className="avatar">{m.avatarLabel}</div>
                  <div className="info">
                    <p className="name">{m.name}</p>
                    <p className="role">{m.role}</p>
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
                <option value="">Sắp xếp theo</option>
                <option value="Hạn chót">Hạn chót</option>
                <option value="Độ ưu tiên">Độ ưu tiên</option>
              </select>
              <Search 
                placeholder="Tìm kiếm nhiệm vụ theo tên"
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
          onClose={() => setOpenInitMember(false)}
          onSave={(v) => {
            console.log("Thêm thành viên:", v);
            setOpenInitMember(false);
          }}
        />
        <ViewMemberModal
          isOpen={openViewMember}
          onClose={() => setOpenViewMember(false)}
          onSave={() => {
            message.success("Cập nhật vai trò (demo)");
            setOpenViewMember(false);
          }}
          members={projectMembers}
        />
      </div>
    </ConfigProvider>
  );
};

export default ManagermentDetail;

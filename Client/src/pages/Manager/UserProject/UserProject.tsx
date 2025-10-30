
import { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import "./UserProject.scss";
import type { TaskUser } from "../../../interfaces/manager/userProject/userProject";
import ModalUpdate from "./Modal/UpdateProgress/update";
import { useAppSelector } from "../../../apis/store/hooks";
import { useMessageApi } from "../../../contexts/MessageContext";

const messageApi = useMessageApi();
interface Project {
  id: string;
  projectName: string;
  image: string;
  members: Array<{ userId: string; role: string }>;
}

export default function UserProject() {
  // Trạng thái điều khiển UI chung
  const [openCategories, setOpenCategories] = useState<string[]>([]); // Danh sách nhóm (theo dự án) đang mở/đóng
  const [projects, setProjects] = useState<Project[]>([]); // Dữ liệu dự án
  const [taskData, setTaskData] = useState<TaskUser[]>([]); // Dữ liệu nhiệm vụ thô từ API
  const [loading, setLoading] = useState(true); // Cờ trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Lỗi khi tải dữ liệu


  //---------------------------------------------
  // Trạng thái sắp xếp và tìm kiếm 
  //---------------------------------------------
  type SortKey = "none" | "dueDate" | "priority";
  const [sortKey, setSortKey] = useState<SortKey>("none"); // Trường sắp xếp
  const [search, setSearch] = useState(""); // Chuỗi tìm kiếm theo tên nhiệm vụ

  //---------------------------------------------
  // Trạng thái Modal xác nhận cập nhật trạng thái
  //---------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskUser | null>(null);

  //---------------------------------------------
  // Lấy người dùng hiện tại từ Redux (fallback localStorage nếu cần)
  //---------------------------------------------
  const authUser = useAppSelector((s) => s.auth.user);
  const currentUserId: string | null = useMemo(() => {
    if (authUser?.id) return String(authUser.id);
    try {
      const local = localStorage.getItem("user");
      if (!local) return null;
      const parsed = JSON.parse(local);
      return parsed?.id ? String(parsed.id) : null;
    } catch {
      return null;
    }
  }, [authUser]);

  //---------------------------------------------
  // Gọi API để lấy danh sách dự án và nhiệm vụ khi component mount
  //---------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("http://localhost:3000/projects"),
          fetch("http://localhost:3000/taskData"),
        ]);

        if (!projectsRes.ok || !tasksRes.ok) {
          // .ok kiểm tra phản hồi thành công
          throw new Error("Không thể tải dữ liệu");
        }

        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();

        setProjects(projectsData);
        setTaskData(tasksData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //---------------------------------------------
  // Đóng/mở nhóm theo tên dự án
  //---------------------------------------------
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Bảng trọng số cho mức độ ưu tiên (phục vụ sắp xếp theo ưu tiên)
  const priorityWeight: Record<string, number> = {
    Cao: 3,
    "Trung bình": 2,
    Thấp: 1,
  };

  //---------------------------------------------
  // Lọc nhiệm vụ theo người dùng hiện tại và từ khóa tìm kiếm
  //---------------------------------------------
  const personalTasks = useMemo(() => {
    let list = taskData;
    if (currentUserId) {
      list = list.filter((t) => String(t.assigneeId) === String(currentUserId));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => t.taskName.toLowerCase().includes(q));
    }
    // Không sắp xếp tại đây để giữ ổn định; sắp xếp được áp dụng trong từng nhóm theo dự án ở bước sau
    return list;
  }, [taskData, currentUserId, search]);

  //---------------------------------------------
  // Gom nhóm nhiệm vụ theo tên dự án và áp dụng sắp xếp mới (thứ tự cố định + tie-breaker rõ ràng)
  //---------------------------------------------
  const groupedData: Record<string, TaskUser[]> = useMemo(() => {

    // 1) --------- Gom nhóm theo tên dự án ---------
    const groups: Record<string, TaskUser[]> = {};
    for (const task of personalTasks) {
      const pid = task.projectId == null ? null : String(task.projectId);
      const projectName =
        projects.find((p) => String(p.id) === String(pid))?.projectName ||
        "Dự án không xác định";
      if (!groups[projectName]) groups[projectName] = [];
      groups[projectName].push(task);
    }

    // 2) --------- Hàm so sánh nhiệm vụ theo tiêu chí sắp xếp ---------
    const cmp = (a: TaskUser, b: TaskUser) => {
      // So sánh theo hạn chót
      if (sortKey === "dueDate") {
        const da = new Date(a.dueDate).getTime();
        const db = new Date(b.dueDate).getTime();
        // Cố định: hạn chót sớm trước
        if (da !== db) return da - db;
        // Tie-breaker 1: ưu tiên (Cao > Trung bình > Thấp)
        const wa = priorityWeight[a.priority] ?? 0;
        const wb = priorityWeight[b.priority] ?? 0;
        if (wa !== wb) return wb - wa; // ưu tiên luôn sắp xếp từ cao xuống thấp khi tie
        // Tie-breaker 2: tên nhiệm vụ (A-Z)
        return a.taskName.localeCompare(b.taskName, "vi");
      }

      // So sánh theo độ ưu tiên
      if (sortKey === "priority") {
        const wa = priorityWeight[a.priority] ?? 0;
        const wb = priorityWeight[b.priority] ?? 0;
        // Cố định: ưu tiên cao trước (Cao > Trung bình > Thấp)
        if (wa !== wb) return wb - wa;
        // Tie-breaker 1: hạn chót (sớm trước)
        const da = new Date(a.dueDate).getTime();
        const db = new Date(b.dueDate).getTime();
        if (da !== db) return da - db;
        // Tie-breaker 2: tên nhiệm vụ (A-Z)
        return a.taskName.localeCompare(b.taskName, "vi");
      }

      // sortKey === "none": giữ nguyên thứ tự hiện có (không can thiệp)
      return 0;
    };

    // 3) --------- Áp dụng sắp xếp trong từng nhóm ---------
    for (const key of Object.keys(groups)) {
      if (sortKey === "none") continue;
      groups[key] = [...groups[key]].sort(cmp);
    }

    return groups;
  }, [personalTasks, projects, sortKey]);

  // Cấu hình cột bảng hiển thị nhiệm vụ
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
      render: (status, record) => {
        if (record.categoryHeader) return null;
        // Quy ước: "To do" coi như "Pending" để cho phép chuyển đổi với "In progress"
        const normalized = status === "To do" ? "Pending" : status;
        const canToggle =
          normalized === "In progress" || normalized === "Pending";
        const onClick = () => {
          if (!canToggle) return;
          setSelectedTask(record);
          setIsModalOpen(true);
        };
        return (
          <span
            onClick={onClick}
            className={`Allstatus ${normalized
              ?.toLowerCase()
              .replace(/\s+/g, "-")}`}
            style={{
              color: "black",
              cursor: canToggle ? "pointer" : "default",
            }}
            title={canToggle ? "Cập nhật trạng thái" : undefined}
          >
            {canToggle && (
              <i
                className="fa-solid fa-pen-to-square"
                style={{ marginRight: 6 }}
              ></i>
            )}
            {normalized}
          </span>
        );
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

  //---------------------------------------------
  // Sinh dữ liệu hiển thị gồm hàng tiêu đề nhóm (tên dự án) và các hàng nhiệm vụ con
  //---------------------------------------------
  const expandedData = useMemo(
    () =>
      Object.entries(groupedData)
        // Sắp xếp tên dự án A-Z để hiển thị nhất quán
        .sort(([a], [b]) => a.localeCompare(b, "vi"))
        .flatMap(([projectName, tasks]) => {
          const isOpen = openCategories.includes(projectName);
          const headerRow: any = {
            key: `cat-${projectName}`,
            categoryHeader: true,
            projectName: (
              <div
                onClick={() => toggleCategory(projectName)}
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: "#fafafa",
                  padding: "8px 12px",
                }}
              >
                {isOpen ? <DownOutlined /> : <RightOutlined />} {projectName}
              </div>
            ),
          };
          return [headerRow, ...(isOpen ? tasks : [])];
        }),
    [groupedData, openCategories]
  );

  // Xử lý sự kiện của Modal cập nhật trạng thái
  const handleCancel = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedTask(null); // Xóa nhiệm vụ đã chọn
  };

  //---------------------------------------------
  // Xác nhận cập nhật trạng thái nhiệm vụ
  //---------------------------------------------
  const handleConfirm = async () => {
    if (!selectedTask) return;
    const current =
      selectedTask.status === "To do" ? "Pending" : selectedTask.status; // chỉ chỉnh trạng thái theo "Pending" và "In progress"
    const nextStatus = current === "In progress" ? "Pending" : "In progress";
    try {
      // Gọi API cập nhật trạng thái trên json-server
      const res = await fetch(
        `http://localhost:3000/taskData/${selectedTask.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      if (!res.ok) {
        messageApi.error("Cập nhật trạng thái thất bại");
        return;
      }

      // Cập nhật lại dữ liệu trên client để hiển thị ngay
      setTaskData((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, status: nextStatus } : t
        )
      );
      handleCancel();
    } catch (e) {
      messageApi.error("Có lỗi xảy ra khi cập nhật trạng thái nhiệm vụ"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
      handleCancel();
    }
  };

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <div className="managerDetail-container">
        <div className="title-box">
          <p className="title">Quản lý nhiệm vụ dự án</p>
        </div>

        <div className="tool-setting">
          <div className="member" style={{ marginLeft: "auto" }}>
            <div className="member-tools" style={{ display: "flex", gap: 12 }}>
              {/* Bộ chọn trường sắp xếp */}
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

              {/* Ô tìm kiếm theo tên nhiệm vụ */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm nhiệm vụ"
                style={{ padding: "6px 10px", minWidth: 240 }}
              />
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
      <ModalUpdate
        open={isModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </ConfigProvider>
  );
}

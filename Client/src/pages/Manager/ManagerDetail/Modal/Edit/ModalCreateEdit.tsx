import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker } from "antd";
import "./ModalCreateEdit.scss";
import type { Task } from "../../../../../interfaces/manager/mamagerDetail/managerDetail";
import dayjs from "dayjs";

interface ModalCreateEditTaskProps {
  open: boolean;
  onCancel?: () => void;
  onOk?: (data: Task) => void;
  editingTask?: Task | null;
  projectMembers?: { userId: string; name: string }[];
}

const ModalCreateEdit: React.FC<ModalCreateEditTaskProps> = ({
  open,
  onCancel,
  onOk,
  editingTask,
  projectMembers = [],
}) => {
  const [taskName, setTaskName] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [status, setStatus] = useState<Task["status"]>("To do");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [priority, setPriority] = useState<Task["priority"]>("Trung bình");
  const [progress, setProgress] = useState<Task["progress"]>("Đúng tiến độ");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && editingTask) {
      setTaskName(editingTask.taskName);
      setAssigneeId(editingTask.assigneeId);
      setStatus(editingTask.status);
      setStartDate(dayjs(editingTask.assignDate));
      setEndDate(dayjs(editingTask.dueDate));
      setPriority(editingTask.priority);
      setProgress(editingTask.progress);
    } else if (!open) {
      // Reset form khi đóng modal
      setTaskName("");
      setAssigneeId(null);
      setStatus("To do");
      setStartDate(null);
      setEndDate(null);
      setPriority("Trung bình");
      setProgress("Đúng tiến độ");
      setError("");
    }
  }, [open, editingTask]);

  const handleSave = () => {
    // Kiểm tra các trường bắt buộc
    if (!taskName.trim()) {
      setError("Tên nhiệm vụ không được để trống");
      return;
    }
    if (!assigneeId) {
      setError("Vui lòng chọn người phụ trách");
      return;
    }
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và hạn chót");
      return;
    }

    // Kiểm tra ngày tháng hợp lệ
    const now = dayjs().startOf("day");
    if (startDate.isBefore(now)) {
      setError("Ngày bắt đầu phải từ hôm nay trở đi");
      return;
    }
    if (endDate.isBefore(startDate)) {
      setError("Hạn chót phải sau ngày bắt đầu");
      return;
    }

    setError("");

    const taskData: Partial<Task> = {
      taskName,
      assigneeId,
      status,
      assignDate: startDate.format("YYYY-MM-DD"),
      dueDate: endDate.format("YYYY-MM-DD"),
      priority,
      progress,
      key: editingTask?.key,
      id: editingTask?.id,
      projectId: editingTask?.projectId,
    };

    if (onOk) {
      onOk(taskData as Task);
    }
  };

  const handleCancel = () => {
    setError("");
    if (onCancel) onCancel();
  };

  return (
    <Modal
      title={
        <h3 className="modal-title">
          {editingTask ? "Sửa nhiệm vụ" : "Thêm nhiệm vụ mới"}
        </h3>
      }
      open={open}
      centered
      width={480}
      footer={null}
      onCancel={handleCancel}
      className="modal-create-edit-task"
    >
      <div className="modal-body">
        <label>Tên nhiệm vụ *</label>
        <input
          type="text"
          placeholder="Nhập tên nhiệm vụ"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={error ? "input-error" : ""}
        />
        {error && <p className="error-text">{error}</p>}

        <label>Người phụ trách *</label>
        <Select
          placeholder="Chọn người phụ trách"
          value={assigneeId}
          onChange={(value) => setAssigneeId(value)}
          options={projectMembers.map((member) => ({
            value: member.userId,
            label: member.name,
          }))}
        />

        <label>Trạng thái</label>
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: "To do", label: "To do" },
            { value: "In progress", label: "In progress" },
            { value: "Pending", label: "Pending" },
            { value: "Done", label: "Done" },
          ]}
        />

        <label>Ngày bắt đầu *</label>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChange={(value) => setStartDate(value)}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />

        <label>Hạn cuối *</label>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChange={(value) => setEndDate(value)}
          disabledDate={(current) =>
            current && current < (startDate || dayjs().startOf("day"))
          }
        />

        <label>Độ ưu tiên</label>
        <Select
          value={priority}
          onChange={(value) => setPriority(value)}
          options={[
            { value: "Cao", label: "Cao" },
            { value: "Trung bình", label: "Trung bình" },
            { value: "Thấp", label: "Thấp" },
          ]}
        />

        <label>Tiến độ</label>
        <Select
          value={progress}
          onChange={(value) => setProgress(value)}
          options={[
            { value: "Đúng tiến độ", label: "Đúng tiến độ" },
            { value: "Có rủi ro", label: "Có rủi ro" },
            { value: "Trễ hạn", label: "Trễ hạn" },
          ]}
        />
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={handleCancel}>
          Hủy
        </button>
        <button className="btn-save" onClick={handleSave}>
          {editingTask ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </Modal>
  );
};

export default ModalCreateEdit;

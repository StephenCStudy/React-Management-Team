import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker } from "antd";
import "./ModalCreateEdit.scss";

interface ModalCreateEditTaskProps {
  open: boolean;
  onCancel?: () => void;
  onOk?: (data: any) => void;
}

const ModalCreateEdit: React.FC<ModalCreateEditTaskProps> = ({
  open,
  onCancel,
  onOk,
}) => {
  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTaskName("");
      setAssignee(null);
      setStatus(null);
      setStartDate(null);
      setEndDate(null);
      setPriority(null);
      setProgress(null);
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    if (!taskName.trim()) {
      setError("Tên nhiệm vụ không được để trống");
      return;
    }
    setError("");
    if (onOk)
      onOk({
        taskName,
        assignee,
        status,
        startDate,
        endDate,
        priority,
        progress,
      });
  };

  const handleCancel = () => {
    setError("");
    if (onCancel) onCancel();
  };

  return (
    <Modal
      title={<h3 className="modal-title">Thêm/sửa nhiệm vụ</h3>}
      open={open}
      centered
      width={480}
      footer={null}
      onCancel={handleCancel}
      className="modal-create-edit-task"
    >
      <div className="modal-body">
        <label>Tên nhiệm vụ</label>
        <input
          type="text"
          placeholder="Soạn thảo đề cương dự án"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={error ? "input-error" : ""}
        />
        {error && <p className="error-text">{error}</p>}

        <label>Người phụ trách</label>
        <Select
          placeholder="Chọn người phụ trách"
          value={assignee || undefined}
          onChange={(value) => setAssignee(value)}
          options={[
            { value: "An Nguyễn", label: "An Nguyễn" },
            { value: "Bách Nguyễn", label: "Bách Nguyễn" },
          ]}
        />

        <label>Trạng thái</label>
        <Select
          placeholder="Chọn trạng thái nhiệm vụ"
          value={status || undefined}
          onChange={(value) => setStatus(value)}
          options={[
            { value: "todo", label: "To do" },
            { value: "inprogress", label: "In progress" },
            { value: "pending", label: "Pending" },
            { value: "done", label: "Done" },
          ]}
        />

        <label>Ngày bắt đầu</label>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="mm/dd/yyyy"
          value={startDate}
          onChange={(value) => setStartDate(value)}
        />

        <label>Hạn cuối</label>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="mm/dd/yyyy"
          value={endDate}
          onChange={(value) => setEndDate(value)}
        />

        <label>Độ ưu tiên</label>
        <Select
          placeholder="Chọn độ ưu tiên"
          value={priority || undefined}
          onChange={(value) => setPriority(value)}
          options={[
            { value: "high", label: "Cao" },
            { value: "medium", label: "Trung bình" },
            { value: "low", label: "Thấp" },
          ]}
        />

        <label>Tiến độ</label>
        <Select
          placeholder="Chọn tiến độ"
          value={progress || undefined}
          onChange={(value) => setProgress(value)}
          options={[
            { value: "đúng tiến độ", label: "Đúng tiến độ" },
            { value: "có rũi ro", label: "Có rủi ro" },
            { value: "trễ hạn", label: "Trễ hạn" },
          ]}
        />
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={handleCancel}>
          Hủy
        </button>
        <button className="btn-save" onClick={handleSave}>
          Lưu
        </button>
      </div>
    </Modal>
  );
};

export default ModalCreateEdit;

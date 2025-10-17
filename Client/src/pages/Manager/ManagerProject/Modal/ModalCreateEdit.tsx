import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import "./ModalCreateEdit.scss";

interface ModalCreateEditProps {
  open: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

const ModalCreateEdit: React.FC<ModalCreateEditProps> = ({
  open,
  onCancel,
  onOk,
}) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Khi đóng modal, reset toàn bộ form
  useEffect(() => {
    if (!open) {
      setName("");
      setFile(null);
      setDescription("");
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    const trimmed = name.trim();

    if (trimmed === "") {
      setError("Tên danh mục không được rỗng");
      return;
    }

    // Giả lập kiểm tra trùng tên (ví dụ từ localStorage)
    const existingNames = ["Dự án A", "Dự án B"];
    const isDuplicate = existingNames.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setError("Tên danh mục đã tồn tại");
      return;
    }

    // Nếu hợp lệ
    setError("");
    if (onOk) onOk();
  };

  const handleCancel = () => {
    // reset input và đóng modal
    setName("");
    setFile(null);
    setDescription("");
    setError("");
    if (onCancel) onCancel();
  };

  return (
    <Modal
      title={<h3 className="modal-title">Thêm/Sửa dự án</h3>}
      open={open}
      centered
      width={480}
      footer={null}
      onCancel={handleCancel}
      className="modal-create-edit"
    >
      <div className="modal-content">
        <label>Tên dự án</label>
        <input
          type="text"
          placeholder="Nhập tên dự án"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={error ? "input-error" : ""}
        />
        {error && <p className="error-text">{error}</p>}

        <label>Hình ảnh dự án</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <label>Mô tả dự án</label>
        <textarea
          placeholder="Nhập mô tả..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

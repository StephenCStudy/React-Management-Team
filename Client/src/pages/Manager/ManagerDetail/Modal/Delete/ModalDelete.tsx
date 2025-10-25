import React from "react";
import { Modal, Button } from "antd";
import "./ModalDelete.scss";

interface ModalDeleteProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  taskName?: string;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  open,
  onCancel,
  onConfirm,
  taskName,
}) => {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={480}
      centered
      className="modal-delete"
    >
      <div className="md-card">
        {/* Header */}
        <div className="md-header">
          <h3 className="md-title">Xác nhận xoá</h3>
          <button className="md-close" onClick={onCancel} aria-label="Đóng" />
        </div>

        {/* Content */}
        <div className="md-content">
          <p>
            Bạn có chắc chắn muốn xoá{" "}
            <strong>{taskName ? `"${taskName}"` : "nhiệm vụ này"}</strong>?
          </p>
        </div>

        {/* Actions */}
        <div className="md-actions">
          <Button className="btn-cancel" onClick={onCancel}>
            Hủy
          </Button>
          <Button className="btn-delete" onClick={onConfirm}>
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;

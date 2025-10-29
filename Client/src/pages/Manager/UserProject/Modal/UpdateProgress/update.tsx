import React from "react";
import { Modal } from "antd";
import "./update.scss";

interface ModalUpdateProps {
  open: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const ModalUpdate: React.FC<ModalUpdateProps> = ({ open, onCancel, onConfirm }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      width={480}
      centered
      className="modal-delete"       
    >
      <div className="md-card">
        {/* Header 63px */}
        <div className="md-header">
          <h3 className="md-title">Cập nhật trạng thái</h3>
        </div>

        {/* Content 85px */}
        <div className="md-content">
          <p>Xác nhận cập nhật trạng thái nhiệm vụ ?</p>
        </div>

        {/* Footer/Actions 63px */}
        <div className="md-actions">
          <button className="btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="btn-delete" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdate;

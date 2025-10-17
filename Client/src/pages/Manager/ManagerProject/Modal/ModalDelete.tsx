import React from "react";
import { Modal } from "antd";
import "./ModalDelete.scss";

interface ModalDeleteProps {
  open: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ open, onCancel, onDelete }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      width={480}
      centered
      // bodyStyle={{ padding: 0 }}     // bỏ padding mặc định
      className="modal-delete"       // vỏ ngoài để set shadow, radius
    >
      <div className="md-card">
        {/* Header 63px */}
        <div className="md-header">
          <h3 className="md-title">Xác nhận xoá</h3>
          <button className="md-close" aria-label="Close" onClick={onCancel}></button>
        </div>

        {/* Content 85px */}
        <div className="md-content">
          <p>Bạn chắc chắn muốn xoá dự án này?</p>
        </div>

        {/* Footer/Actions 63px */}
        <div className="md-actions">
          <button className="btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="btn-delete" onClick={onDelete}>Xóa</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;

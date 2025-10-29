import React, { useState } from "react";
import { Button, Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  // Modal thường (mở/đóng bằng state)
  const showModal = () => setOpen(true);
  const hideModal = () => setOpen(false);

  // Modal confirm (sử dụng API của AntD)
  const showConfirm = () => {
    modal.confirm({
      title: "bla bla ....", // tiêu đề thông báo lỗi được đưa ra từ slice với mục đích yêu cầu người dùng xác nhận
      icon: <ExclamationCircleOutlined />,
      content: "bla bla ....", // thông báo lỗi được đưa ra từ slice
      okText: "Đồng ý",
      cancelText: "Hủy",
    });
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showModal}>
          Mở modal
        </Button>
        <Button onClick={showConfirm}>Xác nhận</Button>
      </Space>

      {/* Modal điều khiển bằng state */}
      <Modal
        title="Thông báo"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Đây là nội dung của modal thông thường.</p>
      </Modal>

      {/* Bắt buộc để Modal.useModal hoạt động */}
      {contextHolder}
    </>
  );
};

export default App;

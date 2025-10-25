// InitMemberModal.tsx

import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import './initmember.scss'; // Import file SCSS

const { Option } = Select;

/**
 * Định nghĩa kiểu dữ liệu cho các giá trị trong form
 */
interface AddMemberFormValues {
  email: string;
  role: string;
}

/**
 * Định nghĩa các props mà component Modal này sẽ nhận
 */
interface InitMemberModalProps {
  isOpen: boolean; // Trạng thái đóng/mở của modal
  onClose: () => void; // Hàm gọi khi nhấn "Hủy" hoặc nút X
  onSave: (values: AddMemberFormValues) => void; // Hàm gọi khi nhấn "Lưu"
  isLoading?: boolean; // (Optional) Trạng thái loading cho nút "Lưu"
}

const InitMemberModal: React.FC<InitMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  // Sử dụng Antd Form hook
  const [form] = Form.useForm<AddMemberFormValues>();

  /**
   * Xử lý khi nhấn nút "Lưu" (OK)
   * Form sẽ validate, nếu thành công thì gọi onSave
   */
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Gửi dữ liệu form về cho component cha qua prop onSave
        onSave(values);
        // Lưu ý: Việc đóng modal (gọi onClose) nên được xử lý
        // ở component cha sau khi onSave thực thi thành công (ví dụ: sau khi API call xong)
      })
      .catch((info) => {
        message.warning('Validate Failed:', info);
      });
  };

  /**
   * Xử lý khi nhấn "Hủy" hoặc nút X
   */
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Thêm thành viên"
      open={isOpen} // Điều khiển hiển thị modal
      onOk={handleOk} // Gắn hàm xử lý "Lưu"
      onCancel={handleCancel} // Gắn hàm xử lý "Hủy"
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={isLoading} // Hiển thị loading trên nút "Lưu"
      className="init-member-modal" // Class để custom SCSS
      destroyOnClose // Tự động reset form và các state con khi modal đóng
    >
      <Form
        form={form}
        layout="vertical"
        name="add_member_form"
        // Giá trị mặc định cho form, ví dụ "Thành viên"
        initialValues={{ role: 'member' }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
            {
              type: 'email',
              message: 'Email không đúng định dạng!',
            },
          ]}
        >
          <Input placeholder="Nhập email thành viên" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn vai trò!',
            },
          ]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="project-owner">project-owner</Option>
            <Option value="frontend-dev">frontend-dev</Option>
            <Option value="backend-dev">backend-dev</Option>
            <Option value="member">Member</Option>
            {/* Thêm các vai trò khác nếu cần */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InitMemberModal;
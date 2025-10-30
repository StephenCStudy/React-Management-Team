// InitMemberModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useParams } from "react-router-dom";
import "./initmember.scss"; // Import file SCSS
import { useMessageApi } from "../../../../../contexts/MessageContext"; // sử dụng messageApi từ context

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
  onSave: (values: AddMemberFormValues, form: any) => Promise<boolean>; // Hàm gọi khi nhấn "Lưu"
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
  const messageApi = useMessageApi();
  const [saving, setSaving] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const { id } = useParams<{ id?: string }>();

  // Load danh sách users và members của project khi modal mở
  useEffect(() => {
    if (isOpen && id) {
      loadData();
    }
  }, [isOpen, id]);

  /**
   * Load dữ liệu users và project members từ API
   */
  const loadData = async () => {
    try {
      // Load tất cả users
      const usersResponse = await fetch("http://localhost:3000/users");
      const usersData = await usersResponse.json();
      setAllUsers(usersData || []);

      // Load thông tin project để lấy danh sách members
      const projectResponse = await fetch(
        `http://localhost:3000/projects/${id}`
      );
      const projectData = await projectResponse.json();
      setProjectMembers(projectData?.members || []);
    } catch (error) {
      messageApi.error("Không thể tải dữ liệu người dùng và dự án"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
    }
  };

  /**
   * Kiểm tra tính hợp lệ của member trước khi lưu
   */
  const validateMemberData = (
    email: string,
    role: string
  ): { isValid: boolean; error?: string } => {
    // 1. Kiểm tra email có tồn tại trong hệ thống không
    const userExists = allUsers.find((u) => u.email === email);
    if (!userExists) {
      return {
        isValid: false,
        error: "Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại!",
      };
    }

    // 2. Kiểm tra member đã tồn tại trong project chưa
    const isMemberExist = projectMembers.some(
      (member) => member.userId === userExists.id
    );
    if (isMemberExist) {
      return {
        isValid: false,
        error: "Người dùng này đã là thành viên của dự án!",
      };
    }

    // 3. Kiểm tra role Project Owner - chỉ được có 1 owner khi thêm mới
    if (role === "project-owner") {
      const hasOwner = projectMembers.some( // some thay cho find để kiểm tra tồn tại vì chỉ cần biết có hay không
        (member) =>
          member.role === "Project Owner"
      );
      if (hasOwner) {
        return {
          isValid: false,
          error:
            "Dự án đã có Project Owner! Mỗi dự án chỉ được có 1 Project Owner.",
        };
      }
    }

    return { isValid: true };
  };

  /**
   * Xử lý khi nhấn nút "Lưu" (OK)
   * Form sẽ validate, nếu thành công thì gọi onSave
   */
  const handleOk = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      // Kiểm tra validation tùy chỉnh
      const validation = validateMemberData(values.email, values.role);
      if (!validation.isValid) {
        messageApi.error(validation.error); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
        setSaving(false);
        return;
      }

      // Chuẩn hóa role trước khi lưu
      const normalizedValues = {
        ...values,
        role: values.role === "project-owner" ? "Project Owner" : "member",
      };

      const success = await onSave(normalizedValues, form);
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (info) {
      console.error("Validate Failed:", info);
      messageApi.warning("Vui lòng kiểm tra lại thông tin!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
    } finally {
      setSaving(false);
    }
  };

  /**
   * Xử lý khi nhấn "Hủy" hoặc nút X
   */
  const handleCancel = () => {
    form.resetFields();
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
      confirmLoading={saving || isLoading} // Hiển thị loading trên nút "Lưu"
      className="init-member-modal" // Class để custom SCSS
      destroyOnClose // Tự động reset form và các state con khi modal đóng
    >
      <Form
        form={form}
        layout="vertical"
        name="add_member_form"
        // Giá trị mặc định cho form, ví dụ "Thành viên"
        initialValues={{ role: "member" }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
            {
              type: "email",
              message: "Email không đúng định dạng!",
            },
          ]}
          extra="Nhập email của người dùng đã có trong hệ thống"
        >
          <Input placeholder="Nhập email thành viên" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn vai trò!",
            },
          ]}
          extra={
            projectMembers.some(
              (m) => m.role === "Project Owner" 
            )
              ? "Dự án đã có Project Owner"
              : undefined
          }
        >
          <Select placeholder="Chọn vai trò">
            <Option
              value="project-owner"
              disabled={projectMembers.some(
                (m) => m.role === "Project Owner" 
              )}
            >
              Project Owner
              {projectMembers.some(
                (m) => m.role === "Project Owner" 
              ) && " (Đã có)"}
            </Option>
            <Option value="member">Member</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InitMemberModal;

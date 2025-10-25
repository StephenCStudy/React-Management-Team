import React, { useState, useEffect } from "react";
import { Modal, List, Avatar, Select } from "antd";
import "./viewmember.scss";

const { Option } = Select;

/**
 * Định nghĩa cấu trúc dữ liệu cho một thành viên
 */
export interface Member {
  id: string | number; // ID duy nhất
  name: string;
  email: string;
  avatarLabel: string; // Chữ cái đầu (ví dụ: AN)
  avatarColor?: string; // (Optional) Màu nền cho avatar
  role: string; // 'project-owner', 'frontend-dev', 'backend-dev'
}

/**
 * Định nghĩa các props mà component Modal này sẽ nhận
 */
interface ViewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMembers: Member[]) => void;
  members: Member[];
  isLoading?: boolean;
}

/**
 * Helper để định nghĩa các vai trò
 */
const ROLES = [
  { value: "project-owner", label: "Project owner" },
  { value: "frontend-dev", label: "Frontend developer" },
  { value: "backend-dev", label: "Backend developer" },
  { value: "member", label: "Member" },
];

const ViewMemberModal: React.FC<ViewMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  members,
  isLoading = false,
}) => {
  // State nội bộ để lưu thay đổi vai trò và xóa thành viên
  const [internalMembers, setInternalMembers] = useState<Member[]>([]);

  // Khi mở modal, đồng bộ danh sách từ props
  useEffect(() => {
    if (isOpen) {
      setInternalMembers(JSON.parse(JSON.stringify(members)));
    }
  }, [members, isOpen]);

  /**
   * Xử lý khi thay đổi vai trò của một thành viên
   */
  const handleRoleChange = (newRole: string, memberId: string | number) => {
    setInternalMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  /**
   * Xử lý khi nhấn icon thùng rác (xóa thành viên)
   */
  const handleDeleteMember = (memberId: string | number) => {
    setInternalMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
  };

  /**
   * Xử lý khi nhấn "Lưu"
   */
  const handleSave = () => {
    onSave(internalMembers);
  };

  /**
   * Xử lý khi nhấn "Đóng"
   */
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            // justifyContent: "space-between",
            gap: "350px",
            padding: "0 10px",
          }}
        >
          <span>Thành viên</span>
          <span>Vai trò</span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Đóng"
      confirmLoading={isLoading}
      className="view-member-modal"
      width={600}
      destroyOnClose
    >
      <List
        itemLayout="horizontal"
        dataSource={internalMembers}
        renderItem={(member) => (
          <List.Item
            key={member.id}
            actions={[
              // Select chọn vai trò
              <Select
                key="role-select"
                value={member.role}
                style={{ width: 170 }}
                onChange={(newValue) => handleRoleChange(newValue, member.id)}
                bordered={false}
              >
                {ROLES.map((role) => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>,

              // Icon thùng rác
              <i
                key="delete-icon"
                className="fa-solid fa-trash"
                style={{
                  cursor: "pointer",
                  color: "#d63031",
                  marginLeft: 10,
                  fontSize: 16,
                }}
                onClick={() => handleDeleteMember(member.id)}
                title="Xóa thành viên"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: member.avatarColor || "#f56a00",
                    verticalAlign: "middle",
                  }}
                >
                  {member.avatarLabel}
                </Avatar>
              }
              title={<span>{member.name}</span>}
              description={member.email}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ViewMemberModal;

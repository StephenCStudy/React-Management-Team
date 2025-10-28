import React, { useState, useEffect } from "react";
import { Modal, List, Avatar, Select } from "antd";
import "./viewmember.scss";
import type {
  Member,
  MemberRole,
} from "../../../../../interfaces/manager/mamagerDetail/managerDetail";

const { Option } = Select;

/**
 * Định nghĩa interface cho thông tin hiển thị thành viên
 */
interface MemberDisplay {
  userId: string;
  name: string;
  avatarLabel: string; // Chữ cái đầu (ví dụ: AN)
  role: MemberRole;
}

/**
 * Định nghĩa các props mà component Modal này sẽ nhận
 */
interface ViewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: Member) => void;
  onDelete: (memberId: string) => void;
  members: MemberDisplay[];
  isLoading?: boolean;
}

/**
 * Helper để định nghĩa các vai trò
 */
const ROLES = [
  { value: "owner", label: "Chủ dự án" },
  { value: "admin", label: "Quản trị viên" },
  { value: "member", label: "Thành viên" },
];

const ViewMemberModal: React.FC<ViewMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  members,
  isLoading = false,
}) => {
  // State nội bộ để lưu thay đổi vai trò và xóa thành viên
  const [internalMembers, setInternalMembers] = useState<MemberDisplay[]>([]);

  // Khi mở modal, đồng bộ danh sách từ props
  useEffect(() => {
    if (isOpen) {
      setInternalMembers(members);
    }
  }, [members, isOpen]);

  /**
   * Xử lý khi thay đổi vai trò của một thành viên
   * @param newRole - Vai trò mới được chọn
   * @param memberId - ID của thành viên cần thay đổi vai trò
   */
  const handleRoleChange = (newRole: MemberRole, memberId: string) => {
    const member = internalMembers.find((m) => m.userId === memberId);
    if (member) {
      onSave({
        userId: member.userId,
        fullName: member.name,
        role: newRole,
      });
    }
  };

  /**
   * Xử lý khi nhấn icon thùng rác để xóa thành viên
   * @param memberId - ID của thành viên cần xóa
   */
  const handleDeleteMember = (memberId: string) => {
    onDelete(memberId);
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            gap: "350px",
            padding: "0 10px",
          }}
        >
          <span>Thành viên</span>
          <span>Vai trò</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={onClose}
      okText="Đóng"
      cancelText="Hủy"
      confirmLoading={isLoading}
      className="view-member-modal"
      width={600}
      destroyOnClose
    >
      <List
        itemLayout="horizontal"
        dataSource={internalMembers}
        renderItem={(member: MemberDisplay) => (
          <List.Item
            key={member.userId}
            actions={[
              // Select để chọn vai trò cho thành viên
              <Select
                key="role-select"
                value={member.role}
                style={{ width: 170 }}
                onChange={(newValue) =>
                  handleRoleChange(newValue as MemberRole, member.userId)
                }
                bordered={false}
              >
                {ROLES.map((role) => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>,

              // Nút xóa thành viên
              <i
                key="delete-icon"
                className="fa-solid fa-trash"
                style={{
                  cursor: "pointer",
                  color: "#d63031",
                  marginLeft: 10,
                  fontSize: 16,
                }}
                onClick={() => handleDeleteMember(member.userId)}
                title="Xóa thành viên"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: "#f56a00",
                    verticalAlign: "middle",
                  }}
                >
                  {member.avatarLabel}
                </Avatar>
              }
              title={<span>{member.name}</span>}
              description={member.role}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

// Xuất component để sử dụng ở các nơi khác
export default ViewMemberModal;

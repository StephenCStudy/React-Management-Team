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
 * Helper để định nghĩa các vai trò được phép
 */
const ROLES = [
  { value: "Project Owner", label: "Chủ dự án" },
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
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<MemberRole | null>(null);

  // Xử lý khi bắt đầu chỉnh sửa role
  const handleStartEditing = (member: MemberDisplay) => {
    setEditingMemberId(member.userId);
    setEditingRole(member.role);
  };

  // Xử lý khi thay đổi vai trò của một thành viên
  const handleRoleChange = (newRole: MemberRole, userId: string) => {
    setEditingRole(newRole);
  };

  // Xử lý khi xác nhận thay đổi role
  const handleConfirmRoleChange = (memberId: string) => {
    if (!editingRole) return;

    const member = internalMembers.find((m) => m.userId === memberId);
    if (member) {
      onSave({
        userId: member.userId,
        fullName: member.name,
        role: editingRole,
      });
      setEditingMemberId(null);
      setEditingRole(null);
    }
  };

  // Xử lý khi hủy thay đổi role
  const handleCancelEditing = () => {
    setEditingMemberId(null);
    setEditingRole(null);
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
            gap: "300px",
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
              // Action chỉnh sửa role
              <div key="role-action">
                {editingMemberId === member.userId ? (
                  // Chế độ chỉnh sửa role
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      value={editingRole}
                      style={{ width: 120 }}
                      onChange={(newValue) =>
                        handleRoleChange(newValue as MemberRole, member.userId)
                      }
                    >
                      {ROLES.map((role) => (
                        <Option key={role.value} value={role.value}>
                          {role.label}
                        </Option>
                      ))}
                    </Select>
                    <button
                      onClick={() => handleConfirmRoleChange(member.userId)}
                      style={{
                        border: "none",
                        background: "#4CAF50",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      onClick={handleCancelEditing}
                      style={{
                        border: "none",
                        background: "#f44336",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                ) : (
                  // Chế độ xem role
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ width: 120 }}>
                      {member.role === "Project Owner"
                        ? "Chủ dự án"
                        : "Thành viên"}
                    </span>
                    <button
                      onClick={() => handleStartEditing(member)}
                      style={{
                        border: "none",
                        background: "#2196F3",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      title="Chỉnh sửa vai trò"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </div>
                )}
              </div>,
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
              description={
                member.role === "Project Owner" ? "Chủ dự án" : "Thành viên"
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

// Xuất component để sử dụng ở các nơi khác
export default ViewMemberModal;

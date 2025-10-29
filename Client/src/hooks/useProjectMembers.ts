// import { useState } from "react";
import { message } from "antd";
// import { useAppDispatch } from "../apis/store/hooks";

//--------------------------------------------------------------
// custom hook cho quản lý thành viên dự án Management Detail
//--------------------------------------------------------------


import { fetchProjectDetails } from "../apis/store/slice/projects/managerDetail.slice";

export function useProjectMembers(
  project: any,
  id: string | undefined,
  allUsers: any[],
  dispatch: any
) {
  // Thêm thành viên
  const addMember = async (values: any, form: any) => {
    try {
      const user = allUsers.find((u) => u.email === values.email);
      if (!user) {
        message.error("Không tìm thấy người dùng với email này");
        return false;
      }
      const newMember = { userId: user.id, role: values.role };
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: [...(project?.members || []), newMember],
        }),
      });
      if (response.ok) {
        message.success("Đã thêm thành viên mới thành công!");
        dispatch(fetchProjectDetails(id!));
        form.resetFields();
        return true;
      } else {
        throw new Error("Lỗi khi thêm thành viên");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm thành viên");
      return false;
    }
  };

  // Cập nhật vai trò thành viên
  const updateMemberRole = async (updatedMember: any) => {
    try {
      if (updatedMember.role !== "Project Owner") {
        const ownerCount =
          project?.members?.filter(
            (m: any) =>
              m.role === "Project Owner" && m.userId !== updatedMember.userId
          ).length || 0;
        if (ownerCount === 0) {
          message.error(
            "Không thể thay đổi vai trò: phải có ít nhất một owner trong dự án!"
          );
          return;
        }
      }
      const updatedMembers = project?.members?.map((m: any) =>
        m.userId === updatedMember.userId
          ? { ...m, role: updatedMember.role }
          : m
      );
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: updatedMembers }),
      });
      if (response.ok) {
        message.success("Đã cập nhật vai trò thành viên thành công!");
        dispatch(fetchProjectDetails(id!));
        return true;
      } else {
        throw new Error("Lỗi khi cập nhật vai trò thành viên");
      }
    } catch (error) {
      message.error("Có lỗi khi cập nhật vai trò thành viên!");
      return false;
    }
  };

  // Xóa thành viên
  const deleteMember = async (memberId: string) => {
    try {
      const member = project?.members?.find((m: any) => m.userId === memberId);
      if (member?.role === "Project Owner") {
        const ownerCount =
          project?.members?.filter((m: any) => m.role === "Project Owner")
            .length || 0;
        if (ownerCount <= 1) {
          message.error("Không thể xóa owner duy nhất của dự án!");
          return;
        }
      }
      const updatedMembers = project?.members?.filter(
        (m: any) => m.userId !== memberId
      );
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: updatedMembers }),
      });
      if (response.ok) {
        message.success("Đã xóa thành viên khỏi dự án thành công!");
        dispatch(fetchProjectDetails(id!));
        return true;
      } else {
        throw new Error("Lỗi khi xóa thành viên");
      }
    } catch (error) {
      message.error("Có lỗi khi xóa thành viên!");
      return false;
    }
  };

  return { addMember, updateMemberRole, deleteMember };
}

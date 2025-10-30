// import { useState } from "react";
import type { MessageInstance } from "antd/es/message/interface"; // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
// import { useAppDispatch } from "../apis/store/hooks";

//--------------------------------------------------------------
// custom hook cho quản lý thành viên dự án Management Detail
//--------------------------------------------------------------

import { fetchProjectDetails } from "../apis/store/slice/projects/managerDetail.slice";

export function useProjectMembers(
  project: any,
  id: string | undefined,
  allUsers: any[],
  dispatch: any,
  messageApi: MessageInstance // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
) {
  // Thêm thành viên
  const addMember = async (values: any, form: any) => {
    try {
      const user = allUsers.find((u) => u.email === values.email);
      if (!user) {
        messageApi.error("Không tìm thấy người dùng với email này"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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
        messageApi.success("Đã thêm thành viên mới thành công!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
        dispatch(fetchProjectDetails(id!));
        form.resetFields();
        return true;
      } else {
        throw new Error("Lỗi khi thêm thành viên");
      }
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi thêm thành viên"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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
          messageApi.error(
            "Không thể thay đổi vai trò: phải có ít nhất một owner trong dự án!"
          ); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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
        messageApi.success("Đã cập nhật vai trò thành viên thành công!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
        dispatch(fetchProjectDetails(id!));
        return true;
      } else {
        throw new Error("Lỗi khi cập nhật vai trò thành viên");
      }
    } catch (error) {
      messageApi.error("Có lỗi khi cập nhật vai trò thành viên!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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
          messageApi.error("Không thể xóa owner duy nhất của dự án!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
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
        messageApi.success("Đã xóa thành viên khỏi dự án thành công!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
        dispatch(fetchProjectDetails(id!));
        return true;
      } else {
        throw new Error("Lỗi khi xóa thành viên");
      }
    } catch (error) {
      messageApi.error("Có lỗi khi xóa thành viên!"); // thay cho import message trực tiếp từ antd vì antd v5 không hỗ trợ dùng message trong react 19
      return false;
    }
  };

  return { addMember, updateMemberRole, deleteMember };
}

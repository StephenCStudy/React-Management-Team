import { message } from "antd";
import dayjs from "dayjs";
import {
  addTask,
  updateTask,
  deleteTask,
} from "../apis/store/slice/projects/managerDetail.slice";

//--------------------------------------------------------------
// custom hook cho quản lý nhiệm vụ dự án Management Detail
//--------------------------------------------------------------


export function useTaskHandlers(
  tasks: any[],
  editingTask: any,
  id: string | undefined,
  dispatch: any
) {
  // Validate task
  const validateTask = (
    taskData: any
  ): { isValid: boolean; error?: string } => {
    if (!taskData.taskName?.trim()) {
      return { isValid: false, error: "Tên nhiệm vụ không được để trống" };
    }
    if (taskData.taskName.length < 5 || taskData.taskName.length > 100) {
      return { isValid: false, error: "Tên nhiệm vụ phải từ 5 đến 100 ký tự" };
    }
    const isDuplicateName = tasks.some(
      (task) =>
        task.taskName.toLowerCase() === taskData.taskName.toLowerCase() &&
        task.id !== taskData.id
    );
    if (isDuplicateName) {
      return { isValid: false, error: "Tên nhiệm vụ đã tồn tại trong dự án" };
    }
    const today = dayjs().startOf("day");
    const assignDate = dayjs(taskData.assignDate);
    if (assignDate.isBefore(today)) {
      return {
        isValid: false,
        error: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
      };
    }
    const dueDate = dayjs(taskData.dueDate);
    if (dueDate.isBefore(assignDate)) {
      return { isValid: false, error: "Hạn chót phải lớn hơn ngày bắt đầu" };
    }
    return { isValid: true };
  };

  // Lưu task (thêm mới hoặc cập nhật)
  const handleSaveTask = async (
    data: any,
    setOpenCreateEdit: any,
    setEditingTask: any
  ) => {
    try {
      const validation = validateTask(data);
      if (!validation.isValid) {
        message.error(validation.error);
        return;
      }
      if (editingTask) {
        await dispatch(
          updateTask({
            ...editingTask,
            ...data,
            assigneeId: String(data.assigneeId),
            projectId: String(id),
          })
        ).unwrap();
        message.success("Đã cập nhật nhiệm vụ thành công!");
      } else {
        await dispatch(
          addTask({
            ...data,
            assigneeId: String(data.assigneeId),
            projectId: String(id),
          })
        ).unwrap();
        message.success("Đã thêm nhiệm vụ mới thành công!");
      }
      setOpenCreateEdit(false);
      setEditingTask(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu nhiệm vụ!");
    }
  };

  // Xóa task
  const handleConfirmDelete = async (
    taskToDelete: any,
    setOpenDelete: any,
    setTaskToDelete: any
  ) => {
    if (!taskToDelete) return;
    try {
      await dispatch(deleteTask(taskToDelete.id)).unwrap();
      message.success("Đã xóa nhiệm vụ thành công!");
      setOpenDelete(false);
      setTaskToDelete(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa nhiệm vụ!");
    }
  };

  return { validateTask, handleSaveTask, handleConfirmDelete };
}

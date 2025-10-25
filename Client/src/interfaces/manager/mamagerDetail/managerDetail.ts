export interface Task {
  id: number;
  taskName: string;
  assigneeId: number;
  projectId: number;
  assignDate: string;
  dueDate: string;
  priority: "Thấp" | "Trung bình" | "Cao";
  progress: "Đúng tiến độ" | "Có rủi ro" | "Trễ hạn";
  status: "To do" | "In progress" | "Done" | "Pending";
}
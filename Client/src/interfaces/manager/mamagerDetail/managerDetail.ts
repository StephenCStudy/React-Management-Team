// Định nghĩa role cho member
export type MemberRole = "Project Owner" | "member";

// Interface cho thành viên trong dự án
export interface Member {
  userId: string;
  fullName: string;
  role: MemberRole;
  email?: string;
}

// Interface cho nhiệm vụ trong dự án
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
  description?: string;
}

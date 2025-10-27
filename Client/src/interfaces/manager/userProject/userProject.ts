import type { Task } from "../mamagerDetail/managerDetail";

export interface TaskUser extends Task {
  key?: string;
  categoryHeader?: boolean;
}

export interface ProjectMember {
  userId: number;
  role: string;
}

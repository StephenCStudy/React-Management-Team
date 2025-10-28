import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Task,
  Member,
  MemberRole,
} from "../../../../interfaces/manager/mamagerDetail/managerDetail";

// Định nghĩa interface cho state
interface ManagerDetailState {
  project: {
    id: string;
    projectName: string;
    description: string;
    image: string;
    members: Member[];
  } | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Khởi tạo giá trị ban đầu
const initialState: ManagerDetailState = {
  project: null,
  tasks: [],
  loading: false,
  error: null,
};

// Tạo các async actions
export const fetchProjectDetails = createAsyncThunk(
  "managerDetail/fetchProjectDetails",
  async (projectId: string) => {
    // Fetch dữ liệu dự án và tasks cùng lúc
    const [projectResponse, tasksResponse] = await Promise.all([
      fetch(`http://localhost:3000/projects/${projectId}`),
      fetch(`http://localhost:3000/taskData?projectId=${projectId}`),
    ]);

    const projectData = await projectResponse.json();
    const tasksData = await tasksResponse.json();

    return {
      project: projectData,
      tasks: tasksData,
    };
  }
);

export const addTask = createAsyncThunk(
  "managerDetail/addTask",
  async (task: Omit<Task, "id">) => {
    const response = await fetch("http://localhost:3000/taskData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return response.json();
  }
);

// Cập nhật nhiệm vụ
export const updateTask = createAsyncThunk(
  "managerDetail/updateTask",
  async (task: Task) => {
    const response = await fetch(`http://localhost:3000/taskData/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return response.json();
  }
);

// Xóa nhiệm vụ
export const deleteTask = createAsyncThunk(
  "managerDetail/deleteTask",
  async (taskId: number) => {
    await fetch(`http://localhost:3000/taskData/${taskId}`, {
      method: "DELETE",
    });
    return taskId;
  }
);

export const updateMemberRole = createAsyncThunk(
  "managerDetail/updateMemberRole",
  async ({ memberId, role }: { memberId: string; role: MemberRole }) => {
    // TODO: Thêm API call để cập nhật vai trò thành viên
    const response = await fetch(`http://localhost:3000/users/${memberId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    const data = await response.json();
    return data;
  }
);

export const removeMember = createAsyncThunk(
  "managerDetail/removeMember",
  async (memberId: string) => {
    // TODO: Thêm API call để xóa thành viên
    await fetch(`http://localhost:3000/users/${memberId}`, {
      method: "DELETE",
    });
    return memberId;
  }
);

// Tạo slice
const managerDetailSlice = createSlice({
  name: "managerDetail",
  initialState,
  reducers: {
    // Sắp xếp theo hạn chót
    sortByDueDate: (state) => {
      state.tasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    },
    // Sắp xếp theo độ ưu tiên
    sortByPriority: (state) => {
      const priorityOrder = { Cao: 3, "Trung bình": 2, Thấp: 1 };
      state.tasks.sort(
        (a, b) =>
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchProjectDetails
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.project;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Có lỗi xảy ra";
      })
      // Xử lý addTask
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Xử lý updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Xử lý deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      // Xử lý updateMemberRole
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        if (state.project?.members) {
          const index = state.project.members.findIndex(
            (m) => m.userId === action.payload.userId
          );
          if (index !== -1) {
            state.project.members[index] = action.payload;
          }
        }
      })
      // Xử lý removeMember
      .addCase(removeMember.fulfilled, (state, action) => {
        if (state.project?.members) {
          state.project.members = state.project.members.filter(
            (m) => m.userId !== action.payload
          );
        }
      });
  },
});

export const { sortByDueDate, sortByPriority } = managerDetailSlice.actions;
export default managerDetailSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Projects } from "../../../../interfaces/manager/mamaberProject/managerProject";


// Định nghĩa kiểu dữ liệu cho Project
interface Project extends Projects {
  description?: string;
}

// Định nghĩa kiểu dữ liệu cho state
interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
};

// Tạo action bất đồng bộ để lấy danh sách projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await fetch("http://localhost:3000/projects");
    const data = await response.json();
    return data;
  }
);

// Tạo action bất đồng bộ để thêm project mới
export const addProject = createAsyncThunk(
  "projects/addProject",
  async (project: Omit<Project, "id">) => {
    const response = await fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    const data = await response.json();
    return data;
  }
);

// Tạo action bất đồng bộ để cập nhật project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, ...project }: Project) => {
    const response = await fetch(`http://localhost:3000/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    const data = await response.json();
    return data;
  }
);

// Tạo action bất đồng bộ để xóa project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: number) => {
    await fetch(`http://localhost:3000/projects/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

// Tạo slice để quản lý state của projects
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Xử lý fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Có lỗi xảy ra";
      });

    // Xử lý addProject
    builder.addCase(addProject.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // Xử lý updateProject
    builder.addCase(updateProject.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (project) => project.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Xử lý deleteProject
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (project) => project.id !== action.payload
      );
    });
  },
});

export default projectsSlice.reducer;

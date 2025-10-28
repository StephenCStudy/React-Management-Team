import type { Projects } from "../../../../interfaces/manager/mamaberProject/managerProject";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Project extends Projects {
}
interface ProjectState {
  data: Project | null;
  loading: boolean;
  error: string | null;
}

export const fetchProjects = createAsyncThunk(
  "project/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
        const res = await fetch(`http://localhost:3000/projects/${id}`);
        if(!res.ok){
            throw new Error("Dữ liệu không tồn tại");
        }
        return (await res.json()) as Project;
    } catch (error) {
        return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: ProjectState = {
  data: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
    name: "projectDetail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProjects.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }); 
        builder.addCase(fetchProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export default projectSlice.reducer;
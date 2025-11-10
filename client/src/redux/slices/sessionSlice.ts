import { sessionsAPI } from "@/api/sessions";
import type { StudySession } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface SessionState {
    loading: boolean;
    error: string | null;
    success: string | null;
    sessions?: StudySession[];
}

const initialState: SessionState = {
    loading: false,
    error: null,
    success: null,
    sessions: [],
}

export const addSession = createAsyncThunk("session/addSession", async (session: Omit<StudySession, "id" | "createdAt">, {rejectWithValue}) => {
    try {
        const result = await sessionsAPI.createSession(session);
        return {
            result,
            message: 'Session added successfully'
        };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const updateSession = createAsyncThunk("session/updateSession", async ({ id, updates }: { id: string; updates: Partial<StudySession> }, {rejectWithValue}) => {
    try {
        const result = await sessionsAPI.updateSession(id, updates);
        return {
            result,
            message: 'Session updated successfully'
        };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const deleteSession = createAsyncThunk("session/deleteSession", async (id: string, {rejectWithValue}) => {
    try {
        const result = await sessionsAPI.deleteSession(id);
        return {result, message: 'Session deleted successfully' };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const getAllSessions = createAsyncThunk("session/getAllSessions", async (_, {rejectWithValue}) => {
    try {

        const result = await sessionsAPI.getAllSessions();
        return result;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const getSessionsByDateRange = createAsyncThunk("session/getSessionsByDateRange", async ({ startDate, endDate }: { startDate: string; endDate: string }, {rejectWithValue}) => {
    try {
        const result = await sessionsAPI.getSessionsByDateRange(startDate, endDate);
        return {result, message: 'Sessions retrieved successfully' };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        clearSessionState(state) {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
        clearMessages(state){
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSession.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(addSession.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.error = null;
                // state.sessions?.push(action.payload.result);
                toast.success(action.payload.message)
            })
            .addCase(addSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to add session";
                state.success = null;
                toast.error(action.error.message);
            })
            .addCase(updateSession.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateSession.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.error = null;
                // const index = state.sessions?.findIndex(s => s.id === action.payload.result.id);
                // if(index !== -1){
                //     state.sessions[index] = action.payload.result;
                // }
                toast.success(action.payload.message);
            })
            .addCase(updateSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update session";
                state.success = null;
                toast.error(action.error.message);
            })
            .addCase(deleteSession.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message || "Session deleted successfully";
                state.error = null;
                toast.success(state.success);
            })
            .addCase(deleteSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete session";
                state.success = null;
                toast.error(action.error.message);
            })
            .addCase(getAllSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getAllSessions.fulfilled, (state, action) => {
                state.loading = false;
                // state.success =  "Sessions retrieved successfully";
                state.error = null;
                state.sessions = action.payload;
                // toast.success("Sessions retrieved successfully");
            })
            .addCase(getAllSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to retrieve sessions";
                state.success = null;
                toast.error(action.error.message);
            })
            .addCase(getSessionsByDateRange.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getSessionsByDateRange.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message || "Sessions retrieved successfully";
                state.error = null;
                state.sessions = action.payload.result;
                // toast.success(state.success || "Sessions retrieved successfully");
            })
            .addCase(getSessionsByDateRange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to retrieve sessions";
                state.success = null;
                toast.error(action.error.message);
            });
    }
})

export const { clearMessages, clearSessionState } = sessionSlice.actions;

export default sessionSlice.reducer;
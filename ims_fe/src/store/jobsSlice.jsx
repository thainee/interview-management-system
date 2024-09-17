import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchJobs,
    fetchJobById,
    fetchEditJobById,
    createJob,
    updateJob,
    removeJobById
} from '../services/jobService';

export const getJobs = createAsyncThunk(
    'jobs/getJobs',
    async ({ page, size, searchTerm, status }, { rejectWithValue }) => {
        try {
            return await fetchJobs(page, size, searchTerm, status);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getJobById = createAsyncThunk(
    'jobs/getJobById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchJobById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getEditJobById = createAsyncThunk(
    'jobs/getEditJobById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchEditJobById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createNewJob = createAsyncThunk(
    'jobs/createJob',
    async (formData, { rejectWithValue }) => {
        try {
            return await createJob(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateJobById = createAsyncThunk(
    'jobs/updateJobById',
    async ({id, formData}, { rejectWithValue }) => {
        try {
            return await updateJob(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteJobById = createAsyncThunk(
    'jobs/deleteJobById',
    async (id, { rejectWithValue }) => {
        try {
            await removeJobById(id);
            return id; // Return the id of the deleted job
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState: {
        list: [],
        currentJob: null,
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number + 1;
            })
            .addCase(getJobById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentJob = action.payload;
            })
            .addCase(getEditJobById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentJob = action.payload;
            })
            .addMatcher(
                action => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                action => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload
                }
            )
    },
});

export default jobsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllInterviewers,
    getAllCandidates,
    fetchSchedules,
    fetchScheduleById,
    createSchedule,
    updateSchedule,
    sendReminderEmails,
    submitSchedule
} from '../services/scheduleService';

export const getInterviewers = createAsyncThunk(
    'schedules/getInterviewers',
    async (_, { rejectWithValue }) => {
        try {
            return await getAllInterviewers();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCandidates = createAsyncThunk(
    'schedules/getCandidates',
    async (_, { rejectWithValue }) => {
        try {
            return await getAllCandidates();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const sendReminder = createAsyncThunk(
    'schedules/sendReminder',
    async ({ emails, id }, { rejectWithValue }) => {
        try {
            return await sendReminderEmails(emails, id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const getSchedules = createAsyncThunk(
    'schedules/getSchedules',
    async ({ page, size, searchTerm, interviewer, status }, { rejectWithValue }) => {
        try {
            return await fetchSchedules(page, size, searchTerm, interviewer, status);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getScheduleById = createAsyncThunk(
    'schedules/getScheduleById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchScheduleById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createNewSchedule = createAsyncThunk(
    'schedules/createSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            return await createSchedule(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateScheduleById = createAsyncThunk(
    'schedules/updateScheduleById',
    async (scheduleData, { rejectWithValue }) => {
        try {
            const response = await updateSchedule(scheduleData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const submitScheduleById = createAsyncThunk(
    'schedules/updateScheduleById',
    async (scheduleData, { rejectWithValue }) => {
        try {
            const response = await submitSchedule(scheduleData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const scheduleSlice = createSlice({
    name: 'schedules',
    initialState: {
        list: [],
        currentSchedule: null,
        scheduleInterviewers: [],
        candidates: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSchedules.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number + 1;
            })
            .addCase(getScheduleById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentSchedule = action.payload;
            })
            .addCase(getInterviewers.fulfilled, (state, action) => {
                state.scheduleInterviewers = action.payload;
            })
            .addCase(getCandidates.fulfilled, (state, action) => {
                state.candidates = action.payload;
            })
            .addCase(sendReminder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentSchedule.status = 'INVITED';
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
                    state.error = action.payload;
                }
            )
    },
});

export default scheduleSlice.reducer;
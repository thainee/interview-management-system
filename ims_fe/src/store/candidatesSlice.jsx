import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchCandidates,
    fetchCandidateById,
    fetchEditCandidateById,
    createCandidate,
    updateCandidate,
    removeCandidateById,
    banCandidate,
    fetchRecruiters
} from '../services/candidateService';

export const getCandidates = createAsyncThunk(
    'candidates/getCandidates',
    async ({ page, size, searchTerm, status }, { rejectWithValue }) => {
        try {
            return await fetchCandidates(page, size, searchTerm, status);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCandidateById = createAsyncThunk(
    'candidates/getCandidateById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchCandidateById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getEditCandidateById = createAsyncThunk(
    'candidates/getEditCandidateById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchEditCandidateById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getRecruiters = createAsyncThunk(
    'candidates/getRecruiters',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchRecruiters();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createNewCandidate = createAsyncThunk(
    'candidates/createCandidate',
    async (formData, { rejectWithValue }) => {
        try {
            return await createCandidate(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCandidateById = createAsyncThunk(
    'candidates/updateCandidateById',
    async ({id, formData}, { rejectWithValue }) => {
        try {
            return await updateCandidate(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCandidateById = createAsyncThunk(
    'candidates/deleteCandidateById',
    async (id, { rejectWithValue }) => {
        try {
            await removeCandidateById(id);
            return id; // Return the id of the deleted candidate
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const banCandidateById = createAsyncThunk(
    'candidates/banCandidateById',
    async (id, { rejectWithValue }) => {
        try {
            return await banCandidate(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        list: [],
        recruiters: [],
        currentCandidate: null,
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCandidates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number + 1;
            })
            .addCase(getRecruiters.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recruiters = action.payload;
            })
            .addCase(getCandidateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCandidate = action.payload;
            })
            .addCase(getEditCandidateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCandidate = action.payload;
            })
            .addCase(banCandidateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCandidate = action.payload;
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

export default candidatesSlice.reducer;
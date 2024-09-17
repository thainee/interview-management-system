import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser, changeUserStatus,
} from '../services/userService'
import {banCandidateById} from "./candidatesSlice";

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async ({ page, size, searchTerm, role }, { rejectWithValue }) => {
        try {
            return await fetchUsers(page, size, searchTerm, role);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getUserById = createAsyncThunk(
    'users/getUserById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchUserById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createNewUser = createAsyncThunk(
    'users/createUser',
    async (formData, { rejectWithValue }) => {
        try {
            return await createUser(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserById = createAsyncThunk(
    'users/updateUserById',
    async (formData, { rejectWithValue }) => {
        try {
            return await updateUser(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'users/updateUserStatus',
    async ({ userId, newStatus }, { rejectWithValue }) => {
        try {
            return changeUserStatus(userId, newStatus);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        currentUser: null,
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage =action.payload.number + 1;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
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

export default usersSlice.reducer;

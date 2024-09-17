import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchOffers,
    fetchOfferById,
    createOffer,
    updateOffer,
    cancelOffer,
    fetchCandidates,
    fetchManagers,
    approveOffer,
    rejectOffer,
    acceptOffer,
    sentOffer,
    declineOffer
} from '../services/offerService';

export const getOffers = createAsyncThunk(
    'offers/getOffers',
    async ({ page, size, searchTerm, status, department }, { rejectWithValue }) => {
        try {
            return await fetchOffers(page, size, searchTerm, status, department);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getOfferById = createAsyncThunk(
    'offers/getOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchOfferById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createNewOffer = createAsyncThunk(
    'offers/createOffer',
    async (formData, { rejectWithValue }) => {
        try {
            return await createOffer(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateOfferById = createAsyncThunk(
    'offers/updateOfferById',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await updateOffer(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const approveOfferById = createAsyncThunk(
    'offers/approveOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await approveOffer(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const rejectOfferById = createAsyncThunk(
    'offers/rejectOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await rejectOffer(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const sentOfferById = createAsyncThunk(
    'offers/sentOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await sentOffer(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const acceptOfferById = createAsyncThunk(
    'offers/acceptOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await acceptOffer(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const declineOfferById = createAsyncThunk(
    'offers/declineOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await declineOffer(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const cancelOfferById = createAsyncThunk(
    'offers/cancelOfferById',
    async (id, { rejectWithValue }) => {
        try {
            return await cancelOffer(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCandidates = createAsyncThunk(
    'offers/getCandidates',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchCandidates();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getManagers = createAsyncThunk(
    'offers/getManagers',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchManagers();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const offersSlice = createSlice({
    name: 'offers',
    initialState: {
        list: [],
        currentOffer: null,
        candidates: [],
        managers: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOffers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number + 1;
            })
            .addCase(getOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(approveOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(rejectOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(sentOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(acceptOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(declineOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(cancelOfferById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOffer = action.payload;
            })
            .addCase(getCandidates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.candidates = action.payload;
            })
            .addCase(getManagers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.managers = action.payload;
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

export default offersSlice.reducer;
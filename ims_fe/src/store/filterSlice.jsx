import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',
    searchStatus: '',
    searchDepartment: '',
    searchInterviewer: '',
    searchRole: '',
};

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSearchStatus: (state, action) => {
            state.searchStatus = action.payload;
        },
        setSearchDepartment: (state, action) => {
            state.searchDepartment = action.payload;
        },
        setSearchInterviewer: (state, action) => {
            state.searchInterviewer = action.payload;
        },
        setSearchRole: (state, action) => {
            state.searchRole = action.payload;
        },
        resetFilters: () => initialState,
    },
});

export const {
    setSearchTerm,
    setSearchStatus,
    setSearchDepartment,
    setSearchInterviewer,
    setSearchRole,
    resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
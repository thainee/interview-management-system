import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        collapsedSidebarWidth: 100,
        expandedSidebarWidth: 240,
        isSidebarCollapsed: true,
        navbarHeight: 70,
        pageName: 'Homepage',
        moduleName: '',
        submoduleName: '',
        moduleLink: '',
        toast: null,
    },
    reducers: {
        setSidebarCollapsed: (state, action) => {
            state.isSidebarCollapsed = action.payload;
        },
        setPageInfo: (state, action) => {
            state.pageName = action.payload.pageName;
            state.moduleName = action.payload.moduleName;
            state.submoduleName = action.payload.submoduleName;
            state.moduleLink = action.payload.moduleLink;
        },
        setToast: (state, action) => {
            state.toast = action.payload;
        },
        clearToast: (state) => {
            state.toast = null;
        },
    },
});

export const { setPageInfo, setSidebarCollapsed, setToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
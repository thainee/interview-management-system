import { configureStore } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';
import uiReducer from './uiSlice';
import filterReducer from './filterSlice';
import schedulesReducer from './scheduleSlice';
import jobsReducer from './jobsSlice';
import userReducer from './usersSlice';
import offersReducer from './offersSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    candidates: candidatesReducer,
    filter: filterReducer,
    schedules: schedulesReducer,
    jobs: jobsReducer,
    users: userReducer,
    offers: offersReducer,
  },
});
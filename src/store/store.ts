import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/student/CourseSlice';
import classReducer from './slices/student/ClassSlice';
import studentReducer from './slices/student/studentSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        course: courseReducer,
        class: classReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GetCoursesOnSection } from '../../../api/services/student/studentProfile';
import {
    Course,
    CourseResponse,
    CourseState,
} from '../../../types/Course/course.type';

const initialState: CourseState = {
    courses: [],
    selectedCourse: null,
    loading: false,
    error: null,
};

export const fetchCoursesBySection = createAsyncThunk<
    Course[],
    number,
    { rejectValue: string }
>(
    'course/fetchCoursesBySection',
    async (sectionId: number, { rejectWithValue }) => {
        try {
            const response: CourseResponse = await GetCoursesOnSection(
                sectionId,
            );
            if (response.ResponseCode === 1) {
                return response.ResponseData;
            } else {
                return rejectWithValue(
                    response.Message || 'Failed to fetch courses',
                );
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.Message ||
                    error.message ||
                    'Failed to fetch courses',
            );
        }
    },
);

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
            state.selectedCourse = action.payload;
        },
        clearCourses: state => {
            state.courses = [];
            state.selectedCourse = null;
            state.error = null;
        },
        clearCourseError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCoursesBySection.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesBySection.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
                state.error = null;
            })
            .addCase(fetchCoursesBySection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch courses';
            });
    },
});

export const { setSelectedCourse, clearCourses, clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;

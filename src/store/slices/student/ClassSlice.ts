import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GetClassOnCourse } from '../../../api/services/student/studentProfile';
import {
    Class,
    ClassResponse,
    ClassState,
} from '../../../types/class/class.types';

const initialState: ClassState = {
    classes: [],
    selectedClass: null,
    loading: false,
    error: null,
};

export const fetchClassesByCourse = createAsyncThunk<
    Class[],
    number,
    { rejectValue: string }
>(
    'class/fetchClassesByCourse',
    async (courseId: number, { rejectWithValue }) => {
        try {
            const response: ClassResponse = await GetClassOnCourse(courseId);
            if (response.ResponseCode === 1) {
                return response.ResponseData;
            } else {
                return rejectWithValue(
                    response.Message || 'Failed to fetch classes',
                );
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.Message ||
                    error.message ||
                    'Failed to fetch classes',
            );
        }
    },
);

const classSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {
        setSelectedClass: (state, action: PayloadAction<Class | null>) => {
            state.selectedClass = action.payload;
        },
        clearClasses: state => {
            state.classes = [];
            state.selectedClass = null;
            state.error = null;
        },
        clearClassError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchClassesByCourse.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassesByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload;
                state.error = null;
            })
            .addCase(fetchClassesByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch classes';
            });
    },
});

export const { setSelectedClass, clearClasses, clearClassError } =
    classSlice.actions;
export default classSlice.reducer;

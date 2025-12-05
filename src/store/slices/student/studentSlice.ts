import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StudentState } from '../../../types/student/studentProfile.types';
import { GetStudentDetails } from '../../../api/services/student/studentProfile';

const InitailState: StudentState = {
    profile: null,
    loading: false,
    error: null,
};

export const StudentDetails = createAsyncThunk<
    any,
    { UserID: number; ApplicationToken: string },
    { rejectValue: any }
>(
    'student/fetchDetails',
    async ({ UserID, ApplicationToken }, { rejectWithValue }) => {
        try {
            const response = await GetStudentDetails(UserID, ApplicationToken);
            return response.ResponseData;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const studentSlice = createSlice({
    name: 'student',
    initialState: InitailState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(StudentDetails.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(StudentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(StudentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default studentSlice.reducer;

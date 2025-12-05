import { StudentLogin } from '../../api/services/authService';
import { AuthState, StudentLoginPayload } from '../../types/auth.types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const LoginStudent = createAsyncThunk(
    'auth/loginStudent',
    async (payload: StudentLoginPayload, { rejectWithValue }) => {
        try {
            const response = await StudentLogin(payload);
            return response.ResponseData;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers: {
        logout: state => {
            state.token = null; 
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(LoginStudent.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.UserData;
                state.token = action.payload.IdToken; 
            })
            .addCase(LoginStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;

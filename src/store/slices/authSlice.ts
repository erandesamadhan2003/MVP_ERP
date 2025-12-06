import { Login } from '../../api/services/auth/authService';
import { AuthState, LoginPayload } from '../../types/auth/auth.types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const LoginUser = createAsyncThunk(
    'auth/loginUser',
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await Login(payload);

            // Normalize response and treat non-success as failure.
            // The backend uses `ResponseCode` to indicate success (assume 1 = success).
            const code = response?.ResponseCode;
            const hasUser = !!response?.ResponseData?.UserData;

            if (code !== 1 || !hasUser) {
                const msg = response?.Message || 'Invalid credentials';
                return rejectWithValue(msg);
            }

            return response.ResponseData;
        } catch (error: any) {
            const message = error?.response?.data || error?.message || 'Login failed';
            return rejectWithValue(message);
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
        setUser: (state, action) => {
            state.user = { ...(state.user || {}), ...(action.payload || {}) } as any;
            state.isAuthenticated = !!state.user;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(LoginUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.UserData;
                state.token = action.payload.IdToken;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, setUser } = authSlice.actions;

// Thunk to clear persisted token and logout
export const LogoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
    try {
        await AsyncStorage.removeItem('IdToken');
    } catch (e) {
        // ignore
    }
    dispatch(logout());
});
export default authSlice.reducer;

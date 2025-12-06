import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
    StudentState, 
    StudentProfileResponseData,
    StudentProfileMaster,
    StudentProfileDocument 
} from '../../../types/student/studentProfile.types';
import { GetStudentDetails } from '../../../api/services/student/studentProfile';

const InitailState: StudentState = {
    profile: null,
    loading: false,
    error: null,
};

export const StudentDetails = createAsyncThunk<
    StudentProfileResponseData,
    { UserID: number; ApplicationToken: string },
    { rejectValue: string }
>(
    'student/fetchDetails',
    async ({ UserID, ApplicationToken }, { rejectWithValue }) => {
        try {
            const response = await GetStudentDetails(UserID, ApplicationToken);
            return response.ResponseData;
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch student details');
        }
    }
);

export const studentSlice = createSlice({
    name: 'student',
    initialState: InitailState,
    reducers: {
        // Update a single field in meritRegistrationMaster
        updateMasterField: (
            state, 
            action: PayloadAction<{ field: keyof StudentProfileMaster; value: any }>
        ) => {
            if (state.profile?.meritRegistrationMaster) {
                state.profile.meritRegistrationMaster[action.payload.field] = action.payload.value as never;
            }
        },
        
        // Update multiple fields in meritRegistrationMaster
        updateMasterFields: (
            state, 
            action: PayloadAction<Partial<StudentProfileMaster>>
        ) => {
            if (state.profile?.meritRegistrationMaster) {
                state.profile.meritRegistrationMaster = {
                    ...state.profile.meritRegistrationMaster,
                    ...action.payload,
                };
            }
        },
        
        // Update entire meritRegistrationMaster
        updateMaster: (
            state, 
            action: PayloadAction<StudentProfileMaster>
        ) => {
            if (state.profile) {
                state.profile.meritRegistrationMaster = action.payload;
            }
        },
        
        // Update a single document
        updateDocument: (
            state, 
            action: PayloadAction<{ index: number; document: Partial<StudentProfileDocument> }>
        ) => {
            if (state.profile?.meritRegistrationMasterDocuments[action.payload.index]) {
                state.profile.meritRegistrationMasterDocuments[action.payload.index] = {
                    ...state.profile.meritRegistrationMasterDocuments[action.payload.index],
                    ...action.payload.document,
                };
            }
        },
        
        // Update all documents
        updateDocuments: (
            state, 
            action: PayloadAction<StudentProfileDocument[]>
        ) => {
            if (state.profile) {
                state.profile.meritRegistrationMasterDocuments = action.payload;
            }
        },
        
        // Reset profile
        resetProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
        
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(StudentDetails.pending, (state) => {
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

export const { 
    updateMasterField, 
    updateMasterFields, 
    updateMaster,
    updateDocument,
    updateDocuments,
    resetProfile,
    clearError 
} = studentSlice.actions;

export default studentSlice.reducer;
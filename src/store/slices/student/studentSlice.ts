import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
    StudentState, 
    StudentProfileResponseData,
    StudentProfileMaster,
    StudentProfileDocument,
    StudentProfileSelectListData 
} from '../../../types/student/studentProfile.types';
import { GetStudentDetails, GetStudentProfileSelectList } from '../../../api/services/student/studentProfile';

const InitailState: StudentState = {
    profile: null,
    selectLists: null,
    loading: false,
    selectListsLoading: false,
    error: null,
    selectListsError: null,
};

export const StudentDetails = createAsyncThunk<
    StudentProfileResponseData,
    { UserID: number; ApplicationToken: string },
    { rejectValue: string }
>(
    'student/fetchDetails',
    async ({ UserID, ApplicationToken }, { rejectWithValue }) => {
        try {
            if (!UserID || !ApplicationToken) {
                return rejectWithValue('UserID and ApplicationToken are required');
            }
            const response = await GetStudentDetails(UserID, ApplicationToken);
            if (response?.ResponseCode === 1 && response?.ResponseData) {
                return response.ResponseData;
            }
            return rejectWithValue(response?.Message || 'Failed to fetch student details');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.Message || 
                           error?.message || 
                           'Failed to fetch student details';
            return rejectWithValue(errorMsg);
        }
    }
);

export const FetchStudentProfileSelectList = createAsyncThunk<
    StudentProfileSelectListData,
    void,
    { rejectValue: string }
>(
    'student/fetchSelectLists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetStudentProfileSelectList();
            if (response.ResponseCode === 1 && response.ResponseData) {
                return response.ResponseData;
            }
            return rejectWithValue(response.Message || 'Failed to fetch select lists');
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch select lists');
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
            })
            .addCase(FetchStudentProfileSelectList.pending, (state) => {
                state.selectListsLoading = true;
                state.selectListsError = null;
            })
            .addCase(FetchStudentProfileSelectList.fulfilled, (state, action) => {
                state.selectListsLoading = false;
                state.selectLists = action.payload;
            })
            .addCase(FetchStudentProfileSelectList.rejected, (state, action) => {
                state.selectListsLoading = false;
                state.selectListsError = action.payload as string;
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
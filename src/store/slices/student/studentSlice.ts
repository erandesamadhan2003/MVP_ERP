import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    GetStudentDetails,
    GetStudentProfileSelectList,
    UpdateStudentProfile,
    UpdateStudentPhoto,
    UpdateStudentSign,
    UpdateStudentPassCertificate,
    UpdateStudentLCTCCertificate,
    UpdateStudentCasteCertificate,
    GetStudentDocuments
} from "../../../api/services/student/studentProfile";

import {
    StudentState,
    StudentProfileResponseData,
    StudentProfileMaster,
    StudentProfileDocument,
    DocumentUploadPayload
} from "../../../types/student/studentProfile.types";

import { SelectLists } from "../../../types/student/SelectList.types";
import { extractError } from "../../../utils/constant";

const createUploadThunk = (name: string, apiCall: any, failMsg: string) =>
    createAsyncThunk<any, DocumentUploadPayload, { rejectValue: string }>(
        `student/${name}`,
        async (payload, { rejectWithValue }) => {
            try {
                const response = await apiCall(payload);
                if (response?.ResponseCode === 1) return response;
                return rejectWithValue(response?.Message || failMsg);
            } catch (error) {
                return rejectWithValue(extractError(error, failMsg));
            }
        }
    );

// =============================================================
// THUNKS — FETCH & UPDATE
// =============================================================

export const StudentDetails = createAsyncThunk<
    StudentProfileResponseData,
    { UserID: number; ApplicationToken: string },
    { rejectValue: string }
>("student/fetchDetails", async ({ UserID, ApplicationToken }, { rejectWithValue }) => {
    try {
        const res = await GetStudentDetails(UserID, ApplicationToken);
        if (res?.ResponseCode === 1) return res.ResponseData;
        return rejectWithValue(res?.Message || "Failed to fetch student details");
    } catch (error) {
        return rejectWithValue(extractError(error, "Failed to fetch student details"));
    }
});

export const FetchStudentProfileSelectList = createAsyncThunk<
    SelectLists,
    void,
    { rejectValue: string }
>("student/fetchSelectLists", async (_, { rejectWithValue }) => {
    try {
        const res = await GetStudentProfileSelectList();
        if (res.ResponseCode === 1) return res.ResponseData;
        return rejectWithValue(res.Message || "Failed to fetch select lists");
    } catch (error) {
        return rejectWithValue(extractError(error, "Failed to fetch select lists"));
    }
});

export const UpdateStudentProfileData = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>("student/updateProfile", async (payload, { rejectWithValue }) => {
    try {
        return await UpdateStudentProfile(payload);
    } catch (error) {
        return rejectWithValue(extractError(error, "Failed to update student profile"));
    }
});

// =============================================================
// DOCUMENT UPLOAD THUNKS 
// =============================================================

export const UploadStudentPhoto = createUploadThunk(
    "uploadPhoto",
    UpdateStudentPhoto,
    "Failed to upload photo"
);

export const UploadStudentSign = createUploadThunk(
    "uploadSign",
    UpdateStudentSign,
    "Failed to upload signature"
);

export const UploadPassCertificate = createUploadThunk(
    "uploadPassCert",
    UpdateStudentPassCertificate,
    "Failed to upload mark sheet"
);

export const UploadLCTCCertificate = createUploadThunk(
    "uploadLCTC",
    UpdateStudentLCTCCertificate,
    "Failed to upload LC/TC certificate"
);

export const UploadCasteCertificate = createUploadThunk(
    "uploadCaste",
    UpdateStudentCasteCertificate,
    "Failed to upload caste certificate"
);

export const FetchStudentDocuments = createAsyncThunk<
    StudentProfileResponseData,
    number,
    { rejectValue: string }
>("student/fetchDocuments", async (UserID, { rejectWithValue }) => {
    try {
        const res = await GetStudentDocuments(UserID);
        if (res.ResponseCode === 1) return res.ResponseData;
        return rejectWithValue(res.Message || "Failed to fetch documents");
    } catch (error) {
        return rejectWithValue(extractError(error, "Failed to fetch documents"));
    }
});

// =============================================================
// INITIAL STATE
// =============================================================

const initialState: StudentState = {
    profile: null,
    loading: false,
    error: null,
    selectListsLoading: false,
    selectListsError: null,
    selectLists: null,
};

// =============================================================
// SLICE
// =============================================================

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        updateMasterField: (
            state,
            action: PayloadAction<{ field: keyof StudentProfileMaster; value: any }>
        ) => {
            if (state.profile?.meritRegistrationMaster) {
                state.profile.meritRegistrationMaster[action.payload.field] =
                    action.payload.value as never;
            }
        },

        updateDocuments: (
            state,
            action: PayloadAction<StudentProfileDocument[]>
        ) => {
            if (state.profile) {
                state.profile.meritRegistrationMasterDocuments = action.payload;
            }
        },

        resetProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        const loadingThunks = [
            UpdateStudentProfileData,
            UploadStudentPhoto,
            UploadStudentSign,
            UploadPassCertificate,
            UploadLCTCCertificate,
            UploadCasteCertificate,
        ];

        loadingThunks.forEach((thunk) => {
            builder.addCase(thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(thunk.fulfilled, (state) => {
                state.loading = false;
            });
            builder.addCase(thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        });

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
            })
            .addCase(FetchStudentProfileSelectList.fulfilled, (state, action) => {
                state.selectListsLoading = false;
                state.selectLists = action.payload;
            })
            .addCase(FetchStudentProfileSelectList.rejected, (state, action) => {
                state.selectListsLoading = false;
                state.selectListsError = action.payload as string;
            })
            .addCase(FetchStudentDocuments.fulfilled, (state, action) => {
                if (state.profile) {
                    state.profile.meritRegistrationMasterDocuments =
                        action.payload.meritRegistrationMasterDocuments;
                }
            });
    }
});

// Export reducers
export const {
    updateMasterField,
    updateDocuments,
    resetProfile
} = studentSlice.actions;

export default studentSlice.reducer;

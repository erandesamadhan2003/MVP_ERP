import { api } from '../../api';
import { DocumentUploadPayload } from '../../../types/student/studentProfile.types';
import { buildDocumentFormData } from '../../../utils/constant';

// =============================
// SIMPLE GET APIs
// =============================

export const GetStudentDetails = async (
    UserID: number,
    ApplicationToken: string,
) => {
    try {
        const response = await api.get(
            '/Admission/Registration/GetStudentDetails',
            {
                params: { UserID, ApplicationToken },
            },
        );
        return response.data;
    } catch (error) {
        console.error('GetStudentDetails error:', error);
        throw error;
    }
};

export const GetCoursesOnSection = async (SectionID: number) => {
    try {
        const response = await api.get(
            '/Admission/Registration/GetCourseOnSection',
            {
                params: { SectionID },
            },
        );
        return response.data;
    } catch (error) {
        console.error('GetCoursesOnSection error:', error);
        throw error;
    }
};

export const GetClassOnCourse = async (CourseID: number) => {
    try {
        const response = await api.get(
            '/Admission/Registration/GetClassOnCourse',
            {
                params: { CourseID },
            },
        );
        return response.data;
    } catch (error) {
        console.error('GetClassOnCourse error:', error);
        throw error;
    }
};

export const GetStudentProfileSelectList = async () => {
    try {
        const response = await api.get(
            '/Admission/Registration/GetStudentProfileSelectList',
        );
        return response.data;
    } catch (error) {
        console.error('GetStudentProfileSelectList error:', error);
        throw error;
    }
};

export const UpdateStudentProfile = async (payload: any) => {
    try {
        const response = await api.post(
            '/Admission/Registration/AddMeritRegistrations',
            payload,
        );
        return response.data;
    } catch (error) {
        console.error('UpdateStudentProfile error:', error);
        throw error;
    }
};

export const GetStudentDocuments = async (UserID: number) => {
    try {
        const response = await api.get(
            '/Admission/Registration/GetStudentDocuments',
            {
                params: { UserID },
            },
        );
        return response.data;
    } catch (error) {
        console.error('GetStudentDocuments error:', error);
        throw error;
    }
};

// =============================
// DOCUMENT UPLOAD APIS
// =============================

export const UpdateStudentPhoto = async (payload: DocumentUploadPayload) => {
    try {
        const formData = buildDocumentFormData(
            payload,
            'student_photo.jpg',
            'image/jpeg',
        );

        const response = await api.post(
            '/Admission/Registration/UpdateStudentPhoto',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    } catch (error) {
        console.error('UpdateStudentPhoto error:', error);
        throw error;
    }
};

export const UpdateStudentSign = async (payload: DocumentUploadPayload) => {
    try {
        const formData = buildDocumentFormData(
            payload,
            'signature.jpg',
            'image/jpeg',
        );

        const response = await api.post(
            '/Admission/Registration/UpdateStudentSign',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    } catch (error) {
        console.error('UpdateStudentSign error:', error);
        throw error;
    }
};

export const UpdateStudentPassCertificate = async (
    payload: DocumentUploadPayload,
) => {
    try {
        const formData = buildDocumentFormData(
            payload,
            'marksheet.pdf',
            'application/pdf',
        );

        const response = await api.post(
            '/Admission/Registration/UpdateStudentPassCertificate',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    } catch (error) {
        console.error('UpdateStudentPassCertificate error:', error);
        throw error;
    }
};

export const UpdateStudentLCTCCertificate = async (
    payload: DocumentUploadPayload,
) => {
    try {
        const formData = buildDocumentFormData(
            payload,
            'lc_cert.pdf',
            'application/pdf',
        );

        const response = await api.post(
            '/Admission/Registration/UpdateStudentLCTCCertificate',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    } catch (error) {
        console.error('UpdateStudentLCTCCertificate error:', error);
        throw error;
    }
};

export const UpdateStudentCasteCertificate = async (payload: DocumentUploadPayload) => {
    const formData = new FormData();
    
    // Add common fields
    formData.append("MeritStudentMasterID", payload.MeritStudentMasterID.toString());
    formData.append("ApplicationToken", payload.ApplicationToken);
    formData.append("AddBy", payload.AddBy.toString());
    formData.append("AddByTime", payload.AddByTime);
    formData.append("EditBy", payload.EditBy.toString());
    formData.append("EditByTime", payload.EditByTime);
    
    // Add file
    formData.append("file", {
        uri: payload.file.uri,
        type: payload.file.type || "application/pdf",
        name: payload.file.name || "caste_cert.pdf",
    } as any);

        const response = await api.post(
            '/Admission/Registration/UpdateStudentCasteCertificate',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    } catch (error) {
        console.error('UpdateStudentCasteCertificate error:', error);
        throw error;
    }
};

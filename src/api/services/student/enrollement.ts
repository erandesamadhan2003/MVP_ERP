import { api } from '../../api';
import { StudentEnrollmentInfo } from '../../../types/student/Enrollment.types';
import base64 from 'react-native-base64';

export const getInstituteOnTaluka = async (taluka: string) => {
    try {
        const response = await api.get(`/Admission/Registration/GetInstituteOnTaluka`, { params: { Taluka: taluka }, });
        return response.data;
    } catch (error) {
        console.error('getInstituteOnTaluka error:', error);
        throw error;
    }
};

export const GetSectionOnInstituteCode = async (CCode: number) => {
    try {
        const response = await api.get(`/Admission/Registration/GetSectionOnInstitute`, { params: { CCode },});
        return response.data;
    } catch (error) {
        console.error('GetSectionOnInstituteCode error:', error);
        throw error;
    }
};

export const GetCourseListOnSection = async ( SectionID: number, CCode: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetCourseListOnSection`, { params: { SectionID, CCode },});
        return response.data;
    } catch (error) {
        console.error('GetCourseListOnSection error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetClassListOnCourse?CourseID=307&CCode=106015&RoleID=12
export const GetClassListOnCourse = async (
    CourseID: number,
    CCode: number,
    RoleID: number,
) => {
    try {
        const response = await api.get(
            `/Admission/Registration/GetClassListOnCourse`,
            { params: { CourseID, CCode, RoleID } },
        );
        return response.data;
    } catch (error) {
        console.error('GetClassListOnCourse error:', error);
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/Registration/GetClassMediumTypeList?ClassID=1510702&CCode=109003
export const GetClassMediumTypeList = async ( ClassID: number, CCode: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetClassMediumTypeList`, { params: { ClassID, CCode },});
        return response.data;
    } catch (error) {
        console.error('GetClassMediumTypeList error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetEnrolledCourse?MeritStudentInfoID=555876&ClassID=1510702&CCode=109003
export const GetEnrolledCourse = async ( MeritStudentInfoID: number, ClassID: number, CCode: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetEnrolledCourse`, { params: { MeritStudentInfoID, ClassID, CCode },});
        return response.data;
    } catch (error) {
        console.error('GetEnrolledCourse error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetDirectAdmissionClass?CCode=109003&ClassID=1510702
export const GetDirectAdmissionClass = async ( CCode: number, ClassID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetDirectAdmissionClass`, { params: { CCode, ClassID },});
        return response.data;
    } catch (error) {
        console.error('GetDirectAdmissionClass error:', error);
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/Registration/GetAdmissionClassSubjectPaperList?ClassID=1510702&CCode=109003&MeritEnrollMentID=0&PaperLanguageMediumID=2
export const GetAdmissionClassSubjectPaperList = async ( ClassID: number, CCode: number, MeritEnrollMentID: number, PaperLanguageMediumID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetAdmissionClassSubjectPaperList`, { params: { ClassID, CCode, MeritEnrollMentID, PaperLanguageMediumID },});
        return response.data;
    } catch (error) {
        console.error('GetAdmissionClassSubjectPaperList error:', error);
        throw error;
    }
};



// http://mvperp.org:82/api/Admission/Registration/SaveMeritAdmissionEnrollMent
export const SaveMeritAdmissionEnrollMent = async (payload: {
    MeritAdmissionEnrollment: {
        MeritStudentInfoID: number;
        EnrollMentDate: string;
        CCode: string;
        SectionID: string;
        CourseID: string;
        ClassID: string;
        MeritFormStatusId: number;
        Taluka: string;
    };
}) => {
    try {
        const response = await api.post(
            `/Admission/Registration/SaveMeritAdmissionEnrollMent`,
            payload,
        );
        return response.data;
    } catch (error) {
        console.error('SaveMeritAdmissionEnrollMent error:', error);
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/Registration/GetEnrollmentList?registrationId=654125&ApplicationToken=AdmissionStudent
export const GetEnrollmentList = async ( registrationId: number, ApplicationToken: string,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetEnrollmentList`, { params: { registrationId, ApplicationToken },});
        return response.data;
    } catch (error) {
        console.error('GetEnrollmentList error:', error);
        throw error;
    }
};



// http://mvperp.org:82/api/Admission/Registration/GetFileForStudentPassCertificate?MeritStudentMasterID=null&MeritStudentInfoID=555876&ApplicationToken=AdmissionStudent
export const GetFileForStudentPassCertificate = async ( MeritStudentMasterID: number | null, MeritStudentInfoID: number, ApplicationToken: string,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetFileForStudentPassCertificate`, { params: { MeritStudentMasterID, MeritStudentInfoID, ApplicationToken },});
        return response.data;
    } catch (error) {
        console.error('GetFileForStudentPassCertificate error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetFileForStudentLCTCCertificate?MeritStudentMasterID=null&MeritStudentInfoID=555876&ApplicationToken=AdmissionStudent
export const GetFileForStudentLCTCCertificate = async ( MeritStudentMasterID: number | null, MeritStudentInfoID: number, ApplicationToken: string,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetFileForStudentLCTCCertificate`, { params: { MeritStudentMasterID, MeritStudentInfoID, ApplicationToken },});
        return response.data;
    } catch (error) {
        console.error('GetFileForStudentLCTCCertificate error:', error);
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/Registration/GetFileForStudentCasteCertificate?MeritStudentMasterID=null&ApplicationToken=AdmissionStudent
export const GetFileForStudentCasteCertificate = async ( MeritStudentMasterID: number | null, ApplicationToken: string,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetFileForStudentCasteCertificate`, { params: { MeritStudentMasterID, ApplicationToken },});
        return response.data;
    } catch (error) {
        console.error('GetFileForStudentCasteCertificate error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetStudentEnrollmentInfo?MeritEnrollMentID=535903
export const GetStudentEnrollmentInfo = async ( MeritEnrollMentID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetStudentEnrollmentInfo`, { params: { MeritEnrollMentID },});
        return response.data;
    } catch (error) {
        console.error('GetStudentEnrollmentInfo error:', error);
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/Registration/GetMeritEnrollmentSelectList?IsFromMeritEnrollmentEdit=true
export const GetMeritEnrollmentSelectList = async ( IsFromMeritEnrollmentEdit: boolean,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetMeritEnrollmentSelectList`, { params: { IsFromMeritEnrollmentEdit },});
        return response.data;
    } catch (error) {
        console.error('GetMeritEnrollmentSelectList error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetAdmissionClassSubjectPaperList?ClassID=831717&CCode=109003&MeritEnrollMentID=535903&PaperLanguageMediumID=2
export const GetEnrollmentSubjectPaperMarks = async ( ClassID: number, CCode: number, MeritEnrollMentID: number, PaperLanguageMediumID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetAdmissionClassSubjectPaperList`, { params: { ClassID, CCode, MeritEnrollMentID, PaperLanguageMediumID },});
        return response.data;
    } catch (error) {
        console.error('GetEnrollmentSubjectPaperMarks error:', error);
        throw error;
    }
};  


// http://mvperp.org:82/api/Admission/Registration/GetClassMediumTypeList?ClassID=831717&CCode=10900
export const GetEnrollmentClassMediumTypeList = async ( ClassID: number, CCode: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetClassMediumTypeList`, { params: { ClassID, CCode },});
        return response.data;
    } catch (error) {
        console.error('GetEnrollmentClassMediumTypeList error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/GetAdmissionClassSubjectPaperList?ClassID=831717&CCode=109003&MeritEnrollMentID=535903&PaperLanguageMediumID=2
export const GetEnrollmentSubjectPaperMarksForEdit = async ( ClassID: number, CCode: number, MeritEnrollMentID: number, PaperLanguageMediumID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetAdmissionClassSubjectPaperList`, { params: { ClassID, CCode, MeritEnrollMentID, PaperLanguageMediumID },});
        return response.data;
    } catch (error) {
        console.error('GetEnrollmentSubjectPaperMarksForEdit error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Registration/PrintStudentMeritForm
export const PrintStudentMeritForm = async (payload: any) => {
    try {
        const response = await api.post(
            `/Admission/Registration/PrintStudentMeritForm`,
            payload,
            {
                responseType: 'arraybuffer',
            }
        );
        
        // Convert arraybuffer to base64
        const bytes = new Uint8Array(response.data);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        return base64.encode(binary);
    } catch (error) {
        console.error('PrintStudentMeritForm error:', error);
        throw error;
    }
};

export const RemoveEnrollmentForm = async (
    MeritEnrollMentID: number,
    MeritFormStatusID: number
) => {
    try {
        const response = await api.get(
            `/Admission/Registration/RemoveEnrollmentForm`,
            {
                params: {
                    MeritEnrollMentID,
                    MeritFormStatusID,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('RemoveEnrollmentForm error:', error);
        throw error;
    }
};

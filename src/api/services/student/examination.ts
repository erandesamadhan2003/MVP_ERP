import { api } from "../../api";
import { ExamFormPayload } from "../../../types/student/ExamForm.types";

// http://mvperp.org:82/api/Admission/TimeTable/GetInstituteSectionList?CCode=109003
export const GetInstituteSectionList = async ( CCode: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetInstituteSectionList`, { params: { CCode },});
        return response.data;
    } catch (error) {
        console.error('GetInstituteSectionList error:', error); 
        throw error;
    }
};

// http://mvperp.org:82/api/Admission/Certificate/GetInstituteClassList?CCode=109003
export const GetInstituteClassList = async ( CCode: number,) => {
    try {
        const response = await api.get(`/Admission/Certificate/GetInstituteClassList`, { params: { CCode },});
        return response.data;
    } catch (error) {
        console.error('GetInstituteClassList error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Institute/ExamForm/GetURNNOAdmission?URNNO=654125
export const GetURNNOAdmission = async ( URNNO: number,) => {
    try {
        const response = await api.get(`/Institute/ExamForm/GetURNNOAdmission`, { params: { URNNO },});
        return response.data;
    } catch (error) {
        console.error('GetURNNOAdmission error:', error);   
        throw error;
    }
};

// http://mvperp.org:82/api/Institute/ExamForm/GetClassOnExamList?ClassID=831717
export const GetClassOnExamList = async ( ClassID: number,) => {
    try {
        const response = await api.get(`/Institute/ExamForm/GetClassOnExamList`, { params: { ClassID },});
        return response.data;
    } catch (error) {
        console.error('GetClassOnExamList error:', error);  
        throw error;
    }
};

// POST /api/Institute/UniversityStudentInfo/GetClassSubjectPaperList
// Request Payload:
// {
//   "CCode": number,
//   "URNNO": number,
//   "AceYear": string,
//   "ClassID": number,
//   "Syllabus": string,
//   "Status": "StudentSubject"
// }
export const GetClassSubjectPaperList = async ( 
    AceYear: string, 
    CCode: number, 
    ClassID: number, 
    Status: string, 
    Syllabus: string, 
    URNNO: number,
) => {
    try {
        const response = await api.post(`/Institute/UniversityStudentInfo/GetClassSubjectPaperList`, {
            CCode,
            URNNO,
            AceYear,
            ClassID,
            Syllabus,
            Status,
        });
        return response.data;
    } catch (error) {
        console.error('GetClassSubjectPaperList error:', error);  
        throw error;
    }
};

// POST /api/Institute/ExamFormTimeTable/GetExamFormTimeTableList
// Request Payload:
// {
//   "ClassID": number,
//   "CCode": number
// }
export const GetExamFormTimeTableList = async ( CCode: number, ClassID: number,) => {
    try {
        const response = await api.post(`/Institute/ExamFormTimeTable/GetExamFormTimeTableList`, {
            ClassID,
            CCode,
        });
        return response.data;
    } catch (error) {
        console.error('GetExamFormTimeTableList error:', error);  
        throw error;
    }
};

// POST /ExamForm/AddUpdateExamForm
export const SaveExamForm = async (payload: ExamFormPayload) => {
    try {
        const response = await api.post(`/ExamForm/AddUpdateExamForm`, payload);
        return response.data;
    } catch (error) {
        console.error('SaveExamForm error:', error);
        throw error;
    }
};
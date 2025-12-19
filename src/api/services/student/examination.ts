import { api } from "../../api";

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
        const response = await api.get(`/Admission/Registration/GetInstituteClassList`, { params: { CCode },});
        return response.data;
    } catch (error) {
        console.error('GetInstituteClassList error:', error);
        throw error;
    }
};

// http://mvperp.org:82/api/Institute/ExamForm/GetURNNOAdmission?URNNO=654125
export const GetURNNOAdmission = async ( URNNO: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetURNNOAdmission`, { params: { URNNO },});
        return response.data;
    } catch (error) {
        console.error('GetURNNOAdmission error:', error);   
        throw error;
    }
};

// http://mvperp.org:82/api/Institute/ExamForm/GetClassOnExamList?ClassID=831717
export const GetClassOnExamList = async ( ClassID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetClassOnExamList`, { params: { ClassID },});
        return response.data;
    } catch (error) {
        console.error('GetClassOnExamList error:', error);  
        throw error;
    }
};

// http://mvperp.org:82/api/Institute/UniversityStudentInfo/GetClassSubjectPaperList
// parameters:
// AceYear: '2025';
// CCode: 109003;
// ClassID: 831717;
// Status: 'StudentSubject';
// Syllabus: '2019';
// URNNO: 654125;
export const GetClassSubjectPaperList = async ( AceYear: string, CCode: number, ClassID: number, Status: string, Syllabus: string, URNNO: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetClassSubjectPaperList`, { params: { AceYear, CCode, ClassID, Status, Syllabus, URNNO },});
        return response.data;
    } catch (error) {
        console.error('GetClassSubjectPaperList error:', error);  
        throw error;
    }
};

// http://mvperp.org:82/api/Institute/ExamFormTimeTable/GetExamFormTimeTableList
// CCode: 109003;
// ClassID: 831717;
export const GetExamFormTimeTableList = async ( CCode: number, ClassID: number,) => {
    try {
        const response = await api.get(`/Admission/Registration/GetExamFormTimeTableList`, { params: { CCode, ClassID },});
        return response.data;
    } catch (error) {
        console.error('GetExamFormTimeTableList error:', error);  
        throw error;
    }
};






import { StudentPaymentPreview } from '../../../types/student/studentPaymentPreview.types';
import { api } from '../../api';

// http://mvperp.org:82/api/Admission/Admission/GetURNDuesForPayment?URNNO=654125
export const getURNDuesForPayment = async (urnNo: string) => {
    try {
        const response = await api.get(`/Admission/Admission/GetURNDuesForPayment?URNNO=${urnNo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/AdmissionPaymentGateway/GetPaymentBankInfomation?CCode=109003&AidedTypeId=2&SectionID=8
export const getPaymentBankInformation = async (cCode: string, aidedTypeId: number, sectionId: number) => {
    try {
        const response = await api.get(`/Admission/AdmissionPaymentGateway/GetPaymentBankInfomation`, {
            params: {
                CCode: cCode,
                AidedTypeId: aidedTypeId,
                SectionID: sectionId
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// http://mvperp.org:82/api/Payment/StudentPaymentPreview
export const getStudentPaymentPreview = async (payload: StudentPaymentPreview) => {
    try {
        const response = await api.post(`/Payment/StudentPaymentPreview`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//localhost:53414/Admission/AdmissionPaymentGateway/GetStudentPaymentGateway?registrationId=500195&ApplicationToken=MeritStudent
export const getStudentPaymentGateway = async (registrationId: string, applicationToken: string) => {
    try {
        const response = await api.get(`/Admission/AdmissionPaymentGateway/GetStudentPaymentGateway`, {
            params: {
                registrationId: registrationId,
                ApplicationToken: applicationToken
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// http://localhost:53414/Admission/Exam/GetExamFeePayment?URNNO=632903
export const getExamFeePayment = async (urnNo: string) => {
    try {
        const response = await api.get(`/Admission/Exam/GetExamFeePayment`, {
            params: {
                URNNO: urnNo
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//localhost:53414/Admission/StudentPaymentGateway/GetStudentPaymentDetails?UserId=403500&ApplicationToken=MeritStudent
export const getStudentPaymentDetails = async (userId: string, applicationToken: string) => {
    try {
        const response = await api.get(`/Admission/StudentPaymentGateway/GetStudentPaymentDetails`, {
            params: {
                UserId: userId,
                ApplicationToken: applicationToken
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};



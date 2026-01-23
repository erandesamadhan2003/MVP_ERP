import { api } from '../../api';


// http://mvperp.org:82/api/Institute/Member/GetAllLibraryMember
export const getMemberInformation = async (payload: any) => {
    try {
        const response = await api.post(
            '/Institute/Member/GetAllLibraryMember',
            payload
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Institute/CirculationMaster/GetStudentIdentityImg?URNNO=654125
export const getStudentIdentityImage = async (URNNO: number) => {
    try {
        const response = await api.get(
            '/Institute/CirculationMaster/GetStudentIdentityImg',
            {
                params: {
                    URNNO: URNNO
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Institute/BookReadingRoom/GetAllBookReadingRoomStatusList
export const getBookReadingRoomStatus = async (payload: any) => {
    try {
        const response = await api.post(
            '/Institute/BookReadingRoom/GetAllBookReadingRoomStatusList',
            payload
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Institute/CirculationMaster/GetMemberBookDetails
export const getMemberBookDetails = async (payload: any) => {
    try {
        const response = await api.post(
            '/Institute/CirculationMaster/GetMemberBookDetails',
            payload
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Institute/CirculationMaster/GetURNNOAdmission?URNNO=654125
export const getURNAdmissionDetails = async (URNNO: number | string) => {
    try {
        const response = await api.get(
            '/Institute/CirculationMaster/GetURNNOAdmission',
            {
                params: {
                    URNNO: URNNO
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Admission/Admission/GetURNDues?URNNO=654125
export const getURNDues = async (URNNO: number | string) => {
    try {
        const response = await api.get(
            '/Admission/Admission/GetURNDues',
            {
                params: {
                    URNNO: URNNO
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// http://mvperp.org:82/api/Institute/Member/GetMemberClearanceCertificate
export const getMemberClearanceCertificate = async (payload: any) => {
    try {
        const response = await api.post(
            '/Institute/Member/GetMemberClearanceCertificate',
            payload
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

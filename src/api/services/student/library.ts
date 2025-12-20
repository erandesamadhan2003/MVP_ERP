// services/library/library.ts

import { api } from '../../api';
import {
    ApiResponse,
    MemberInformation,
    GetMemberInformationPayload,
    StudentIdentityImage,
    BookReadingRoomStatus,
    GetBookReadingRoomStatusPayload,
} from '../../../types/student/Library.types';

/* =====================================================
   1. GET MEMBER INFORMATION
===================================================== */
export const getMemberInformation = async (
    payload: GetMemberInformationPayload,
): Promise<ApiResponse<MemberInformation[]>> => {
    try {
        const response = await api.post(
            `/Institute/CirculationMaster/GetMemberInformation`,
            payload,
        );
        return response.data;
    } catch (error) {
        console.error('getMemberInformation error:', error);
        throw error;
    }
};

/* =====================================================
   2. GET STUDENT IDENTITY IMAGE
===================================================== */
export const getStudentIdentityImage = async (
    URNNO: number,
): Promise<ApiResponse<StudentIdentityImage>> => {
    try {
        const response = await api.get(
            `/Institute/CirculationMaster/GetStudentIdentityImg`,
            {
                params: { URNNO },
            },
        );
        return response.data;
    } catch (error) {
        console.error('getStudentIdentityImage error:', error);
        throw error;
    }
};

/* =====================================================
   3. GET BOOK READING ROOM STATUS
===================================================== */
export const getBookReadingRoomStatus = async (
    payload: GetBookReadingRoomStatusPayload,
): Promise<ApiResponse<BookReadingRoomStatus>> => {
    try {
        const response = await api.post(
            `/Institute/BookReadingRoom/GetAllBookReadingRoomStatusList`,
            payload,
        );
        return response.data;
    } catch (error) {
        console.error('getBookReadingRoomStatus error:', error);
        throw error;
    }
};

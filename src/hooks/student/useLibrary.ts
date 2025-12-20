// hooks/library/useLibrary.ts

import { useCallback, useState } from 'react';
import {
    getMemberInformation,
    getStudentIdentityImage,
    getBookReadingRoomStatus,
} from '../../api/services/student/library';

import {
    MemberInformation,
    StudentIdentityImage,
    BookReadingRoomStatus,
    GetMemberInformationPayload,
    GetBookReadingRoomStatusPayload,
} from '../../types/student/Library.types';

/* =====================================================
   useLibrary Hook
===================================================== */

export const useLibrary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [memberInfo, setMemberInfo] = useState<MemberInformation | null>(null);
    const [identityImage, setIdentityImage] = useState<StudentIdentityImage | null>(null);
    const [readingRoomStatus, setReadingRoomStatus] =
        useState<BookReadingRoomStatus | null>(null);

    /* ===============================
       1. FETCH MEMBER INFORMATION
    =============================== */
    const fetchMemberInformation = useCallback(
        async (payload: GetMemberInformationPayload) => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await getMemberInformation(payload);

                if (response.ResponseCode === 1 && response.ResponseData?.length) {
                    setMemberInfo(response.ResponseData[0]);
                } else {
                    setMemberInfo(null);
                }

                return response;
            } catch (error) {
                console.error('fetchMemberInformation error:', error);
                setErrorMessage('Failed to fetch member information');
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    /* ===============================
       2. FETCH STUDENT IDENTITY IMAGE
    =============================== */
    const fetchStudentIdentityImage = useCallback(
        async (URNNO: number) => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await getStudentIdentityImage(URNNO);

                if (response.ResponseCode === 1 && response.ResponseData) {
                    setIdentityImage(response.ResponseData);
                } else {
                    setIdentityImage(null);
                }

                return response;
            } catch (error) {
                console.error('fetchStudentIdentityImage error:', error);
                setErrorMessage('Failed to fetch student identity image');
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    /* ===============================
       3. FETCH BOOK READING ROOM STATUS
    =============================== */
    const fetchBookReadingRoomStatus = useCallback(
        async (payload: GetBookReadingRoomStatusPayload) => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await getBookReadingRoomStatus(payload);

                if (response.ResponseCode === 1 && response.ResponseData) {
                    setReadingRoomStatus(response.ResponseData);
                } else {
                    setReadingRoomStatus(null);
                }

                return response;
            } catch (error) {
                console.error('fetchBookReadingRoomStatus error:', error);
                setErrorMessage('Failed to fetch reading room status');
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    /* ===============================
       RESET (OPTIONAL)
    =============================== */
    const resetLibraryState = useCallback(() => {
        setMemberInfo(null);
        setIdentityImage(null);
        setReadingRoomStatus(null);
        setErrorMessage(null);
    }, []);

    return {
        // state
        isLoading,
        errorMessage,

        memberInfo,
        identityImage,
        readingRoomStatus,

        // actions
        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchBookReadingRoomStatus,
        resetLibraryState,
    };
};

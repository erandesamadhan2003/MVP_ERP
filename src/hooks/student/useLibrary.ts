// hooks/student/useLibrary.ts
import { useCallback, useState } from 'react';
import {
    getMemberInformation,
    getStudentIdentityImage,
    getBookReadingRoomStatus,
    getMemberBookDetails,
    getURNAdmissionDetails,
    getURNDues,
    getMemberClearanceCertificate,
} from '../../api/services/student/library';

export const useLibrary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [memberInfo, setMemberInfo] = useState<any>(null);
    const [identityImage, setIdentityImage] = useState<any>(null);
    const [readingRoomStatus, setReadingRoomStatus] = useState<any>(null);

    const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
    const [admissionInfo, setAdmissionInfo] = useState<any[]>([]);
    const [feeDues, setFeeDues] = useState<any>(null);
    const [clearancePdfBase64, setClearancePdfBase64] = useState<string | null>(
        null,
    );

    /* ---------- MEMBER INFO ---------- */
    const fetchMemberInformation = useCallback(async (payload: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const res = await getMemberInformation(payload);
            setMemberInfo(res?.ResponseData?.[0] ?? null);
            return res;
        } catch (e: any) {
            setErrorMessage(e?.message ?? 'Failed to fetch member information');
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /* ---------- IDENTITY IMAGE ---------- */
    const fetchStudentIdentityImage = useCallback(async (URNNO: number) => {
        try {
            const res = await getStudentIdentityImage(URNNO);
            setIdentityImage(res?.ResponseData ?? null);
            return res;
        } catch (e) {
            return null;
        }
    }, []);

    /* ---------- READING ROOM STATUS ---------- */
    const fetchBookReadingRoomStatus = useCallback(async (payload: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const res = await getBookReadingRoomStatus(payload);
            setReadingRoomStatus(res?.ResponseData ?? null);
            return res;
        } catch (e: any) {
            setErrorMessage(e?.message ?? 'Failed to fetch reading attendance');
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchClearanceCertificate = useCallback(async (payload: any) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const res = await getMemberClearanceCertificate(payload);

            if (
                res?.ResponseCode === 1 &&
                typeof res.ResponseData === 'string'
            ) {
                return res.ResponseData; // ✅ RETURN BASE64
            }

            throw new Error('Invalid certificate response');
        } catch (e: any) {
            setErrorMessage(e?.message ?? 'Failed to fetch certificate');
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /* ---------- LIBRARY CLEARANCE (BOOKS + ADMISSION + FEES) ---------- */
    const fetchLibraryClearance = useCallback(
        async (URNNO: number | string, CCode: number | string) => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [booksRes, admissionRes, duesRes] = await Promise.all([
                    getMemberBookDetails({
                        URNNO,
                        MEMBERNO: null,
                        CCode,
                        MemberTypeID: 1,
                        Status: 'GetLibraryMemberDetails',
                    }),
                    getURNAdmissionDetails(URNNO),
                    getURNDues(URNNO),
                ]);

                // Log response structure for debugging
                console.log('Library Clearance Data:', {
                    books: {
                        hasData: !!booksRes?.ResponseData,
                        count: Array.isArray(booksRes?.ResponseData) ? booksRes.ResponseData.length : 'not array',
                        type: typeof booksRes?.ResponseData,
                    },
                    admission: {
                        hasData: !!admissionRes?.ResponseData,
                        count: Array.isArray(admissionRes?.ResponseData) ? admissionRes.ResponseData.length : 'not array',
                        type: typeof admissionRes?.ResponseData,
                    },
                    dues: {
                        hasData: !!duesRes?.ResponseData,
                        isArray: Array.isArray(duesRes?.ResponseData),
                        type: typeof duesRes?.ResponseData,
                    },
                });

                setIssuedBooks(booksRes?.ResponseData ?? []);
                setAdmissionInfo(admissionRes?.ResponseData ?? []);

                // 🔑 FIX: array → object
                const duesObj = Array.isArray(duesRes?.ResponseData)
                    ? duesRes.ResponseData[0]
                    : duesRes?.ResponseData;

                setFeeDues(duesObj ?? null);

                // Log final state
                console.log('Library Clearance State Set:', {
                    issuedBooksCount: booksRes?.ResponseData?.length ?? 0,
                    admissionInfoCount: admissionRes?.ResponseData?.length ?? 0,
                    feeDues: duesObj,
                });

                return { booksRes, admissionRes, duesRes };
            } catch (e: any) {
                const errorMsg = e?.code === 'ERR_NETWORK' || e?.message === 'Network Error'
                    ? 'Network connection failed. Please check your internet connection.'
                    : e?.message ?? 'Failed to load library clearance';
                
                console.error('Library Clearance Error:', {
                    message: errorMsg,
                    code: e?.code,
                    type: e?.name,
                    fullError: e,
                });
                
                setErrorMessage(errorMsg);
                throw e;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    /* ---------- RESET ---------- */
    const resetLibraryState = useCallback(() => {
        setMemberInfo(null);
        setIdentityImage(null);
        setReadingRoomStatus(null);
        setIssuedBooks([]);
        setAdmissionInfo([]);
        setFeeDues(null);
        setErrorMessage(null);
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        errorMessage,

        memberInfo,
        identityImage,
        readingRoomStatus,

        issuedBooks,
        admissionInfo,
        feeDues,

        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchBookReadingRoomStatus,
        fetchLibraryClearance,
        fetchClearanceCertificate,
        resetLibraryState,
    };
};

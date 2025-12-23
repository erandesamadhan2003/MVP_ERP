// hooks/student/useLibrary.ts
import { useCallback, useState } from 'react';
import {
  getMemberInformation,
  getStudentIdentityImage,
  getBookReadingRoomStatus,
  getMemberBookDetails,
  getURNAdmissionDetails,
  getURNDues,
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

        setIssuedBooks(booksRes?.ResponseData ?? []);
        setAdmissionInfo(admissionRes?.ResponseData ?? []);

        // 🔑 FIX: array → object
        const duesObj = Array.isArray(duesRes?.ResponseData)
          ? duesRes.ResponseData[0]
          : duesRes?.ResponseData;

        setFeeDues(duesObj ?? null);

        return { booksRes, admissionRes, duesRes };
      } catch (e: any) {
        setErrorMessage(e?.message ?? 'Failed to load library clearance');
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
    resetLibraryState,
  };
};

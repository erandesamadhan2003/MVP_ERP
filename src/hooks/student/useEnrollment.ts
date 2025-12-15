import { useState, useEffect, useCallback } from 'react';
import {
    GetStudentEnrollmentInfo,
    GetEnrollmentClassMediumTypeList,
    GetMeritEnrollmentSelectList,
    GetEnrollmentSubjectPaperMarks,
    SaveMeritAdmissionEnrollMent,
    GetFileForStudentPassCertificate,
    GetFileForStudentLCTCCertificate,
    GetFileForStudentCasteCertificate,
    GetEnrollmentList,
} from '../../api/services/student/enrollement';
import { StudentEnrollmentInfo } from '../../types/student/Enrollment.types';

// Hook for fetching enrollment list
export const useEnrollmentList = (
    registrationId?: number,
    applicationToken?: string,
) => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEnrollmentList = useCallback(
        async (regId: number, token: string) => {
            try {
                setLoading(true);
                setError(null);
                const response = await GetEnrollmentList(regId, token);

                if (response.ResponseCode === 1) {
                    setEnrollments(response.ResponseData || []);
                } else {
                    setError(
                        response.Message || 'Failed to fetch enrollment list',
                    );
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (registrationId && applicationToken) {
            fetchEnrollmentList(registrationId, applicationToken);
        }
    }, [registrationId, applicationToken, fetchEnrollmentList]);

    return {
        enrollments,
        loading,
        error,
        refetch: fetchEnrollmentList,
    };
};

// Hook for fetching student enrollment info
export const useStudentEnrollmentInfo = (meritEnrollmentId?: number) => {
    const [enrollmentInfo, setEnrollmentInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEnrollmentInfo = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetStudentEnrollmentInfo(id);

            if (
                response.ResponseCode === 1 &&
                response.ResponseData?.length > 0
            ) {
                setEnrollmentInfo(response.ResponseData[0]);
            } else {
                setError(response.Message || 'Failed to fetch enrollment info');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (meritEnrollmentId) {
            fetchEnrollmentInfo(meritEnrollmentId);
        }
    }, [meritEnrollmentId, fetchEnrollmentInfo]);

    return {
        enrollmentInfo,
        loading,
        error,
        refetch: fetchEnrollmentInfo,
    };
};

// Hook for fetching class medium type list
export const useClassMediumTypeList = (classId?: number, cCode?: number) => {
    const [mediumList, setMediumList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMediumList = useCallback(async (clsId: number, code: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetEnrollmentClassMediumTypeList(
                clsId,
                code,
            );

            if (response.ResponseCode === 1) {
                setMediumList(response.ResponseData || []);
            } else {
                setError(response.Message || 'Failed to fetch medium list');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (classId && cCode) {
            fetchMediumList(classId, cCode);
        }
    }, [classId, cCode, fetchMediumList]);

    return {
        mediumList,
        loading,
        error,
        refetch: fetchMediumList,
    };
};

// Hook for fetching enrollment select lists (dropdowns)
export const useEnrollmentSelectLists = (isFromEdit: boolean = true) => {
    const [selectLists, setSelectLists] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSelectLists = useCallback(async (fromEdit: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetMeritEnrollmentSelectList(fromEdit);

            if (response.ResponseCode === 1) {
                setSelectLists(response.ResponseData);
            } else {
                setError(response.Message || 'Failed to fetch select lists');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSelectLists(isFromEdit);
    }, [isFromEdit, fetchSelectLists]);

    return {
        selectLists,
        languageMediumList: selectLists?.LanguageMediumList || [],
        talukaList: selectLists?.TalukaList || [],
        loading,
        error,
        refetch: fetchSelectLists,
    };
};

// Hook for fetching subject paper marks
export const useSubjectPaperMarks = (
    classId?: number,
    cCode?: number,
    meritEnrollmentId?: number,
    paperLanguageMediumId?: number,
) => {
    const [subjectData, setSubjectData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjectPaperMarks = useCallback(
        async (
            clsId: number,
            code: number,
            enrollId: number,
            mediumId: number,
        ) => {
            try {
                setLoading(true);
                setError(null);
                const response = await GetEnrollmentSubjectPaperMarks(
                    clsId,
                    code,
                    enrollId,
                    mediumId,
                );

                if (response.ResponseCode === 1) {
                    setSubjectData(response.ResponseData);
                } else {
                    setError(
                        response.Message ||
                            'Failed to fetch subject paper marks',
                    );
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (
            classId &&
            cCode &&
            meritEnrollmentId !== undefined &&
            paperLanguageMediumId
        ) {
            fetchSubjectPaperMarks(
                classId,
                cCode,
                meritEnrollmentId,
                paperLanguageMediumId,
            );
        }
    }, [
        classId,
        cCode,
        meritEnrollmentId,
        paperLanguageMediumId,
        fetchSubjectPaperMarks,
    ]);

    return {
        subjectData,
        instituteClass: subjectData?.instituteClass || null,
        subjectGroups: subjectData?.subjectGroups || [],
        subjectGroupsDetails: subjectData?.subjectGroupsDetails || [],
        loading,
        error,
        refetch: fetchSubjectPaperMarks,
    };
};

// Hook for saving enrollment
export const useSaveEnrollment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const saveEnrollment = useCallback(
        async (enrollmentInfo: StudentEnrollmentInfo) => {
            try {
                setLoading(true);
                setError(null);
                setSuccess(false);

                const response = await SaveMeritAdmissionEnrollMent(
                    enrollmentInfo,
                );

                if (response.ResponseCode === 1) {
                    setSuccess(true);
                    return response.ResponseData;
                } else {
                    setError(response.Message || 'Failed to save enrollment');
                    return null;
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
                return null;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return {
        saveEnrollment,
        loading,
        error,
        success,
        reset,
    };
};

// Hook for fetching student certificates
export const useStudentCertificates = (
    meritStudentMasterId: number | null,
    meritStudentInfoId?: number,
    applicationToken?: string,
) => {
    const [certificates, setCertificates] = useState({
        passCertificate: null,
        lctcCertificate: null,
        casteCertificate: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCertificates = useCallback(
        async (masterId: number | null, infoId: number, token: string) => {
            try {
                setLoading(true);
                setError(null);

                const [passRes, lctcRes, casteRes] = await Promise.all([
                    GetFileForStudentPassCertificate(masterId, infoId, token),
                    GetFileForStudentLCTCCertificate(masterId, infoId, token),
                    GetFileForStudentCasteCertificate(masterId, token),
                ]);

                setCertificates({
                    passCertificate:
                        passRes.ResponseCode === 1
                            ? passRes.ResponseData
                            : null,
                    lctcCertificate:
                        lctcRes.ResponseCode === 1
                            ? lctcRes.ResponseData
                            : null,
                    casteCertificate:
                        casteRes.ResponseCode === 1
                            ? casteRes.ResponseData
                            : null,
                });
            } catch (err: any) {
                setError(err.message || 'Failed to fetch certificates');
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (meritStudentInfoId && applicationToken) {
            fetchCertificates(
                meritStudentMasterId,
                meritStudentInfoId,
                applicationToken,
            );
        }
    }, [
        meritStudentMasterId,
        meritStudentInfoId,
        applicationToken,
        fetchCertificates,
    ]);

    return {
        certificates,
        loading,
        error,
        refetch: fetchCertificates,
    };
};

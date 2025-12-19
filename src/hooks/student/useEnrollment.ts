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
    getInstituteOnTaluka,
    GetSectionOnInstituteCode,
    GetCourseListOnSection,
    GetClassListOnCourse,
    GetClassMediumTypeList,
    GetEnrolledCourse,
    GetDirectAdmissionClass,
    GetAdmissionClassSubjectPaperList,
} from '../../api/services/student/enrollement';
import { StudentEnrollmentInfo, Institute, Section, Course, Class, LanguageMedium } from '../../types/student/Enrollment.types';

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
        async (payload: {
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
                setLoading(true);
                setError(null);
                setSuccess(false);

                const response = await SaveMeritAdmissionEnrollMent(payload);

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

// NEW: Hook for course enrollment flow
export const useCourseEnrollmentFlow = () => {
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [mediums, setMediums] = useState<LanguageMedium[]>([]);
    const [classIsDirect, setClassIsDirect] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInstitutes = useCallback(async (taluka: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getInstituteOnTaluka(taluka);
            if (response?.ResponseCode === 1) {
                setInstitutes(response.ResponseData || []);
                return response.ResponseData || [];
            } else {
                throw new Error(response?.Message || 'Failed to load institutes');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSections = useCallback(async (cCode: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetSectionOnInstituteCode(cCode);
            if (response?.ResponseCode === 1) {
                setSections(response.ResponseData || []);
                return response.ResponseData || [];
            } else {
                throw new Error(response?.Message || 'Failed to load sections');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourses = useCallback(async (sectionId: number, cCode: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetCourseListOnSection(sectionId, cCode);
            if (response?.ResponseCode === 1) {
                setCourses(response.ResponseData || []);
                return response.ResponseData || [];
            } else {
                throw new Error(response?.Message || 'Failed to load courses');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchClasses = useCallback(async (courseId: number, cCode: number, roleId: number = 12) => {
        try {
            setLoading(true);
            setError(null);
            const response = await GetClassListOnCourse(courseId, cCode, roleId);
            if (response?.ResponseCode === 1) {
                setClasses(response.ResponseData || []);
                return response.ResponseData || [];
            } else {
                throw new Error(response?.Message || 'Failed to load classes');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchClassDetails = useCallback(async (
        classId: number, 
        cCode: number, 
        meritStudentInfoId?: number
    ) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch medium list
            const mediumRes = await GetClassMediumTypeList(classId, cCode);
            if (mediumRes?.ResponseCode === 1) {
                setMediums(mediumRes.ResponseData || []);
            }

            // Check if class has direct admission
            const directRes = await GetDirectAdmissionClass(cCode, classId);
            
            // Console log the entire response for debugging
            console.log('GetDirectAdmissionClass Response:', JSON.stringify(directRes, null, 2));
            console.log('GetDirectAdmissionClass ResponseCode:', directRes?.ResponseCode);
            console.log('GetDirectAdmissionClass ResponseData:', directRes?.ResponseData);
            console.log('GetDirectAdmissionClass ResponseData type:', typeof directRes?.ResponseData);
            
            if (directRes?.ResponseCode === 1) {
                // If ResponseData is true, show payment details (NOT direct admission)
                // If ResponseData is false, hide payment details (IS direct admission)
                const showPaymentDetails = directRes.ResponseData === true;
                console.log('Setting classIsDirect to:', !showPaymentDetails);
                console.log('Should show payment details:', showPaymentDetails);
                // Store opposite: classIsDirect = false means show payment details
                setClassIsDirect(!showPaymentDetails);
            } else {
                console.log('GetDirectAdmissionClass failed or ResponseCode !== 1');
                setClassIsDirect(null);
            }

            // If meritStudentInfoId provided, check enrolled course
            if (meritStudentInfoId) {
                await GetEnrolledCourse(meritStudentInfoId, classId, cCode);
            }

            return {
                mediums: mediumRes?.ResponseData || [],
                isDirect: directRes?.ResponseData !== true,
            };
        } catch (err: any) {
            console.error('fetchClassDetails error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        institutes,
        sections,
        courses,
        classes,
        mediums,
        classIsDirect,
        loading,
        error,
        fetchInstitutes,
        fetchSections,
        fetchCourses,
        fetchClasses,
        fetchClassDetails,
        clearError,
    };
};
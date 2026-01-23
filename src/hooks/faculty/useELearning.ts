import { useCallback, useEffect, useState } from 'react';
import {
    getTeacherScheduleList,
    getSectionList,
    getStudentAttendanceList,
    saveStudentAttendance,
} from '../../api/services/faculty/eLearning';
import {
    TeacherScheduleListRequest,
    StudentAttendanceListRequest,
    SaveStudentAttendanceRequest,
} from '../../types/faculty/eLearning.types';

// Hook: Teacher schedule list
export const useTeacherScheduleList = (
    initialParams?: TeacherScheduleListRequest,
) => {
    const [schedule, setSchedule] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSchedule = useCallback(
        async (params: TeacherScheduleListRequest) => {
            try {
                setLoading(true);
                setError(null);
                const res = await getTeacherScheduleList(params);
                // If API uses ResponseCode pattern, handle it; otherwise set raw
                if (res?.ResponseCode !== undefined) {
                    if (res.ResponseCode === 1) {
                        setSchedule(res.ResponseData ?? res);
                    } else {
                        setError(
                            res?.Message || 'Failed to load teacher schedule',
                        );
                    }
                } else {
                    setSchedule(res);
                }
            } catch (err: any) {
                setError(
                    err?.message || 'An error occurred while loading schedule',
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (initialParams) {
            fetchSchedule(initialParams);
        }
    }, [initialParams, fetchSchedule]);

    return { schedule, loading, error, refetch: fetchSchedule };
};

// Hook: Section list for a CCode
export const useSectionList = (initialCCode?: string) => {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSections = useCallback(async (cCode: string) => {
        try {
            setLoading(true);
            setError(null);
            const res = await getSectionList(cCode);
            if (res?.ResponseCode !== undefined) {
                if (res.ResponseCode === 1) {
                    setSections(res.ResponseData || []);
                } else {
                    setError(res?.Message || 'Failed to load sections');
                }
            } else {
                // If raw array
                setSections(Array.isArray(res) ? res : res?.ResponseData || []);
            }
        } catch (err: any) {
            setError(
                err?.message || 'An error occurred while loading sections',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialCCode) {
            fetchSections(initialCCode);
        }
    }, [initialCCode, fetchSections]);

    return { sections, loading, error, refetch: fetchSections };
};

// Hook: Student attendance list
export const useStudentAttendanceList = (
    initialParams?: StudentAttendanceListRequest,
) => {
    const [attendance, setAttendance] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendance = useCallback(
        async (params: StudentAttendanceListRequest) => {
            try {
                setLoading(true);
                setError(null);
                const res = await getStudentAttendanceList(params);
                if (res?.ResponseCode !== undefined) {
                    if (res.ResponseCode === 1) {
                        setAttendance(res.ResponseData ?? res);
                    } else {
                        setError(
                            res?.Message || 'Failed to load attendance list',
                        );
                    }
                } else {
                    setAttendance(res);
                }
            } catch (err: any) {
                setError(
                    err?.message ||
                        'An error occurred while loading attendance',
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (initialParams) {
            fetchAttendance(initialParams);
        }
    }, [initialParams, fetchAttendance]);

    return { attendance, loading, error, refetch: fetchAttendance };
};

// Hook: Save student attendance
export const useSaveStudentAttendance = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const save = useCallback(async (payload: SaveStudentAttendanceRequest) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const res = await saveStudentAttendance(payload);
            if (res?.ResponseCode !== undefined) {
                if (res.ResponseCode === 1) {
                    setSuccess(true);
                    return res.ResponseData ?? res;
                } else {
                    setError(res?.Message || 'Failed to save attendance');
                    return null;
                }
            }
            // If no ResponseCode convention, assume success
            setSuccess(true);
            return res;
        } catch (err: any) {
            setError(
                err?.message || 'An error occurred while saving attendance',
            );
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return { saveAttendance: save, loading, error, success, reset };
};

import { useState, useEffect, useCallback } from 'react';
import {
    GetInstituteSectionList,
    GetInstituteClassList,
    GetURNNOAdmission,
    GetClassOnExamList,
    GetClassSubjectPaperList,
    GetExamFormTimeTableList,
    SaveExamForm,
} from '../../api/services/student/examination.ts';
import { ExamFormPayload } from '../../types/student/ExamForm.types';

// Generic hook state interface
interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

// Hook for GetInstituteSectionList
export const useInstituteSectionList = (CCode: number): UseApiState<any> => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!CCode) return;

        setLoading(true);
        setError(null);
        try {
            const result = await GetInstituteSectionList(CCode);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [CCode]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Hook for GetInstituteClassList
export const useInstituteClassList = (CCode: number): UseApiState<any> => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!CCode) return;

        setLoading(true);
        setError(null);
        try {
            const result = await GetInstituteClassList(CCode);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [CCode]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Hook for GetURNNOAdmission
export const useURNNOAdmission = (URNNO: number): UseApiState<any> => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!URNNO) return;

        setLoading(true);
        setError(null);
        try {
            const result = await GetURNNOAdmission(URNNO);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [URNNO]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Hook for GetClassOnExamList - refetches when ClassID changes
export const useClassOnExamList = (ClassID: number): UseApiState<any> => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!ClassID) return;

        setLoading(true);
        setError(null);
        try {
            const result = await GetClassOnExamList(ClassID);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [ClassID]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Hook for GetClassSubjectPaperList - refetches when ClassID changes
export const useClassSubjectPaperList = (
    AceYear: string,
    CCode: number,
    ClassID: number,
    Status: string,
    Syllabus: string,
    URNNO: number,
): UseApiState<any> => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!ClassID || !CCode || !URNNO) return;

        setLoading(true);
        setError(null);
        try {
            const result = await GetClassSubjectPaperList(
                AceYear,
                CCode,
                ClassID,
                Status,
                Syllabus,
                URNNO,
            );
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [AceYear, CCode, ClassID, Status, Syllabus, URNNO]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Hook for GetExamFormTimeTableList - refetches when ClassID changes
export const useExamFormTimeTableList = (
    CCode: number,
    ClassID: number,
): UseApiState<any> => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!CCode || !ClassID) return;

        setLoading(true);
        setError(null);
        try {
            const result = await GetExamFormTimeTableList(CCode, ClassID);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [CCode, ClassID]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Combined hook that refetches all ClassID-dependent APIs when ClassID changes
export const useClassDependentData = (
    CCode: number,
    ClassID: number,
    AceYear: string,
    Status: string,
    Syllabus: string,
    URNNO: number,
) => {
    const examList = useClassOnExamList(ClassID);
    const subjectPaperList = useClassSubjectPaperList(
        AceYear,
        CCode,
        ClassID,
        Status,
        Syllabus,
        URNNO,
    );
    const timeTableList = useExamFormTimeTableList(CCode, ClassID);

    const refetchAll = useCallback(async () => {
        await Promise.all([
            examList.refetch(),
            subjectPaperList.refetch(),
            timeTableList.refetch(),
        ]);
    }, [examList, subjectPaperList, timeTableList]);

    return {
        examList,
        subjectPaperList,
        timeTableList,
        loading:
            examList.loading ||
            subjectPaperList.loading ||
            timeTableList.loading,
        error: examList.error || subjectPaperList.error || timeTableList.error,
        refetchAll,
    };
};

// Hook for SaveExamForm
export const useSaveExamForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const saveExamForm = useCallback(async (payload: ExamFormPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await SaveExamForm(payload);
            if (response?.Value?.ResponseCode === 1) {
                return { success: true, message: response.Value.Message };
            } else {
                throw new Error(response?.Value?.Message || 'Failed to save exam form');
            }
        } catch (err) {
            const error = err as Error;
            setError(error);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return { saveExamForm, loading, error };
};

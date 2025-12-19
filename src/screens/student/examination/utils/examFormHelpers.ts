import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import {
    useURNNOAdmission,
    useInstituteClassList,
    useClassDependentData,
    useSaveExamForm,
} from '../../../../hooks/student/useExamForm';
import {
    ExamFormState,
    ExamFormHandlers,
    InstituteClass,
    StudentAdmissionInfo,
    GroupedSubjects,
    SubjectPaper,
    ExamType,
} from '../../../../types/student/ExamForm.types';

interface UseExamFormResult {
    state: ExamFormState;
    handlers: ExamFormHandlers;
}

// Helper function to group subjects by exam name
const groupSubjectsByExam = (subjects: SubjectPaper[]): GroupedSubjects => {
    return subjects.reduce((acc, subject) => {
        const examName = subject.NameOfExam || 'Other';
        if (!acc[examName]) {
            acc[examName] = [];
        }
        acc[examName].push(subject);
        return acc;
    }, {} as GroupedSubjects);
};

export const useExamForm = (urnno: number): UseExamFormResult => {
    const authUser = useSelector((state: RootState) => state.auth.user);
    const CCode = authUser?.CCode || 0;

    // Use hooks for data fetching
    const { data: studentData, loading: studentLoading, error: studentError } = useURNNOAdmission(urnno);
    const { data: classData, loading: classLoading } = useInstituteClassList(CCode);
    
    // Local state
    const [studentInfo, setStudentInfo] = useState<StudentAdmissionInfo | null>(null);
    const [selectedClass, setSelectedClass] = useState<InstituteClass | null>(null);
    const [selectedExams, setSelectedExams] = useState<number[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [examYear, setExamYear] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [expandedExams, setExpandedExams] = useState<string[]>([]);

    // Process student info
    useEffect(() => {
        if (studentData?.ResponseCode === 1 && studentData.ResponseData?.length > 0) {
            const info = studentData.ResponseData[0] as StudentAdmissionInfo;
            setStudentInfo(info);
            setExamYear(info.AceYear || '');
        } else if (studentData?.Message) {
            setError(studentData.Message);
        } else if (studentError) {
            setError(studentError.message || 'Failed to fetch student information');
        }
    }, [studentData, studentError]);

    // Process class list and auto-select student's class
    const classList = useMemo(() => {
        if (classData?.ResponseCode === 1) {
            return (classData.ResponseData || []) as InstituteClass[];
        }
        return [];
    }, [classData]);

    useEffect(() => {
        if (studentInfo?.ClassID && classList.length > 0 && !selectedClass) {
            const studentClass = classList.find(
                (c: InstituteClass) => c.ClassID === studentInfo.ClassID
            );
            if (studentClass) {
                setSelectedClass(studentClass);
            }
        }
    }, [studentInfo, classList, selectedClass]);

    // Use class-dependent data hook
    const classDependentData = useClassDependentData(
        CCode,
        selectedClass?.ClassID || 0,
        studentInfo?.AceYear || '',
        'StudentSubject',
        studentInfo?.Syllabus || '',
        urnno
    );

    // Process exam list
    const examList = useMemo<ExamType[]>(() => {
        if (classDependentData.examList?.data?.ResponseCode === 1) {
            return (classDependentData.examList.data.ResponseData || []) as ExamType[];
        }
        return [];
    }, [classDependentData.examList?.data]);

    // Process subject list
    const subjectList = useMemo(() => {
        if (classDependentData.subjectPaperList?.data?.ResponseCode === 1) {
            return classDependentData.subjectPaperList.data.ResponseData || [];
        }
        return [];
    }, [classDependentData.subjectPaperList?.data]);

    // Auto-expand first exam when subjects are loaded
    useEffect(() => {
        if (subjectList.length > 0) {
            const firstExam = subjectList[0].NameOfExam;
            if (firstExam && !expandedExams.includes(firstExam)) {
                setExpandedExams([firstExam]);
            }
        }
    }, [subjectList, expandedExams]);

    // Process timetable list
    const timeTableList = useMemo(() => {
        if (classDependentData.timeTableList?.data?.ResponseCode === 1) {
            return classDependentData.timeTableList.data.ResponseData || [];
        }
        return [];
    }, [classDependentData.timeTableList?.data]);

    // Combined loading state
    const isLoading = studentLoading || classLoading || classDependentData.loading;

    // Save exam form hook
    const { saveExamForm, loading: savingLoading } = useSaveExamForm();

    // Grouped subjects
    const groupedSubjects = useMemo(() => {
        return groupSubjectsByExam(subjectList);
    }, [subjectList]);

    // Handlers
    const onClassChange = useCallback((classItem: InstituteClass) => {
        setSelectedClass(classItem);
        setSelectedExams([]);
        setSelectedSubjects([]);
    }, []);

    const onExamYearChange = useCallback((date: string) => {
        setExamYear(date);
    }, []);

    const onExamToggle = useCallback((examId: number) => {
        setSelectedExams(prev => {
            if (prev.includes(examId)) {
                return prev.filter(id => id !== examId);
            }
            return [...prev, examId];
        });
    }, []);

    const onSubjectToggle = useCallback((subjectCode: number) => {
        setSelectedSubjects(prev => {
            if (prev.includes(subjectCode)) {
                return prev.filter(code => code !== subjectCode);
            }
            return [...prev, subjectCode];
        });
    }, []);

    const onExamSectionToggle = useCallback((examName: string) => {
        setExpandedExams(prev => {
            if (prev.includes(examName)) {
                return prev.filter(name => name !== examName);
            }
            return [...prev, examName];
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!studentInfo || !selectedClass || selectedExams.length === 0) {
            setError('Please select class and at least one exam');
            return;
        }

        setError(null);

        const selectedExamNames = examList
            .filter((exam) => selectedExams.includes(exam.ExamNameID))
            .map((exam) => exam.NameOfExam)
            .join('; ') + ';';

        const payload = {
            ExamFormID: 0,
            URNNO: urnno,
            ClassID: selectedClass.ClassID,
            TName: studentInfo.FullName,
            ExamTypeID: selectedExams[0],
            ExamDetails: selectedExamNames,
            ExamFormDate: new Date().toISOString(),
            ExamYear: new Date(examYear).toISOString(),
            AddBy: authUser?.UserID || 0,
            AddByTime: new Date().toISOString(),
            CCode: CCode,
        };

        const result = await saveExamForm(payload);
        if (result && !result.success) {
            setError(result.message);
        }
        return result;
    }, [studentInfo, selectedClass, selectedExams, examList, examYear, urnno, CCode, authUser, saveExamForm]);

    const handlePrint = useCallback(() => {
        // TODO: Implement print functionality
        console.log('Print exam form');
        Alert.alert('Print', 'Print functionality coming soon!');
    }, []);

    const state: ExamFormState = {
        studentInfo,
        classList,
        selectedClass,
        examList,
        selectedExams,
        subjectList,
        groupedSubjects,
        selectedSubjects,
        timeTableList,
        examYear,
        isLoading: isLoading || savingLoading,
        error,
        expandedExams,
    };

    const handlers: ExamFormHandlers = {
        onClassChange,
        onExamYearChange,
        onExamToggle,
        onSubjectToggle,
        onExamSectionToggle,
        handleSave,
        handlePrint,
    };

    return { state, handlers };
};
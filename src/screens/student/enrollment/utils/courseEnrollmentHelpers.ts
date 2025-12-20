import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import { Taluka, BankAccountDetails } from '../../../../types/student/Enrollment.types';
import {
    FetchStudentProfileSelectList,
    StudentDetails,
} from '../../../../store/slices/student/studentSlice';
import { 
    useSaveEnrollment, 
    useCourseEnrollmentFlow 
} from '../../../../hooks/student/useEnrollment';

export interface CourseEnrollmentSelectors {
    talukaOptions: { label: string; value: string }[];
    instituteOptions: { label: string; value: number }[];
    sectionOptions: { label: string; value: number }[];
    courseOptions: { label: string; value: number }[];
    classOptions: { label: string; value: number }[];
    mediumOptions: { label: string; value: number }[];
}

export interface CourseEnrollmentState extends CourseEnrollmentSelectors {
    selectedTaluka: string;
    selectedInstituteCCode: number | null;
    selectedSectionId: number | null;
    selectedCourseId: number | null;
    selectedClassId: number | null;
    selectedMediumId: number | null;

    classIsDirect: boolean | null;
    bankDetails: BankAccountDetails;
    canSave: boolean;
    isBusy: boolean;
    error: string | null;

    hasAuthUser: boolean;
}

export interface CourseEnrollmentHandlers {
    onTalukaChange: (taluka: string) => Promise<void>;
    onInstituteChange: (cCode: number) => Promise<void>;
    onSectionChange: (sectionId: number) => Promise<void>;
    onCourseChange: (courseId: number) => Promise<void>;
    onClassChange: (classId: number) => Promise<void>;
    onMediumChange: (mediumId: number) => void;
    onBankDetailChange: (field: keyof BankAccountDetails, value: string) => void;
    handleSave: () => Promise<void>;
    clearError: () => void;
}

export interface UseCourseEnrollmentResult {
    state: CourseEnrollmentState;
    handlers: CourseEnrollmentHandlers;
    saveSuccess: boolean;
    saveError: string | null;
    resetSaveState: () => void;
}

const buildEnrollmentPayload = (
    meritMaster: any,
    selections: {
        selectedInstituteCCode: number | null;
        selectedSectionId: number | null;
        selectedCourseId: number | null;
        selectedClassId: number | null;
        selectedMediumId: number | null;
        selectedTaluka: string;
        bankDetails: BankAccountDetails;
        classIsDirect: boolean | null;
    },
) => {
    const {
        selectedInstituteCCode,
        selectedSectionId,
        selectedCourseId,
        selectedClassId,
        selectedMediumId,
        selectedTaluka,
        bankDetails,
        classIsDirect,
    } = selections;

    const basePayload = {
        MeritEnrollMentID: 0,
        MeritStudentInfoID: meritMaster.MeritStudentInfoID,
        EnrollMentDate: new Date().toISOString(),
        CCode: String(selectedInstituteCCode || meritMaster.CCode || ''),
        SectionID: String(selectedSectionId),
        CourseID: String(selectedCourseId),
        ClassID: String(selectedClassId),
        MeritFormStatusId: meritMaster.MeritFormStatusId || 7,
        PaperLanguageMediumID: selectedMediumId || undefined,
        Taluka: selectedTaluka,
    };

    // Add bank details only if class is not direct admission
    if (classIsDirect === false) {
        return {
            MeritAdmissionEnrollment: {
                ...basePayload,
                UDISE: bankDetails.UDISE || undefined,
                AnnualIncome: bankDetails.AnnualIncome ? Number(bankDetails.AnnualIncome) : undefined,
                NoOfSibling: bankDetails.NoOfSibling || undefined,
                SiblingWardNo: bankDetails.SiblingWardNo || undefined,
                ABCID: bankDetails.ABCID || undefined,
                IFSCODE: bankDetails.IFSCODE || undefined,
                PANNO: bankDetails.PANNO || undefined,
                BankAccountNo: bankDetails.BankAccountNo || undefined,
                BankName: bankDetails.BankName || undefined,
                BankBranchName: bankDetails.BankBranchName || undefined,
                FatherDoB: bankDetails.FatherDoB || undefined,
                MotherDoB: bankDetails.MotherDoB || undefined,
            },
            SubjectPaperMarks: [],
        };
    }

    return {
        MeritAdmissionEnrollment: basePayload,
        SubjectPaperMarks: [],
    };
};

export const useCourseEnrollment = (): UseCourseEnrollmentResult => {
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useSelector((state: RootState) => state.auth.user);
    const {
        profile,
        selectLists,
        selectListsLoading,
        error: studentError,
    } = useSelector((state: RootState) => state.student);

    const meritMaster = profile?.meritRegistrationMaster;
    const talukaList = (selectLists?.TalukaList || []) as Taluka[];

    // Use the course enrollment flow hook
    const {
        institutes,
        sections,
        courses,
        classes,
        mediums,
        classIsDirect,
        loading: flowLoading,
        error: flowError,
        fetchInstitutes,
        fetchSections,
        fetchCourses,
        fetchClasses,
        fetchClassDetails,
        clearError: clearFlowError,
    } = useCourseEnrollmentFlow();

    // Use the save enrollment hook
    const {
        saveEnrollment,
        loading: savingEnrollment,
        error: saveError,
        success: saveSuccess,
        reset: resetSaveState,
    } = useSaveEnrollment();

    // Local state for selections
    const [selectedTaluka, setSelectedTaluka] = useState<string>('');
    const [selectedInstituteCCode, setSelectedInstituteCCode] = useState<number | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedMediumId, setSelectedMediumId] = useState<number | null>(null);

    // Bank details state
    const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
        BankName: '',
        BankBranchName: '',
        BankAccountNo: '',
        IFSCODE: '',
        ABCID: '',
        AnnualIncome: '',
        NoOfSibling: '',
        SiblingWardNo: '',
        PANNO: '',
        FatherDoB: '',
        MotherDoB: '',
        UDISE: '',
    });

    const [localError, setLocalError] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        if (!selectLists && !selectListsLoading) {
            dispatch(FetchStudentProfileSelectList());
        }
    }, [dispatch, selectLists, selectListsLoading]);

    useEffect(() => {
        if (!meritMaster && authUser?.UserID && authUser?.ApplicationToken) {
            dispatch(
                StudentDetails({
                    UserID: authUser.UserID,
                    ApplicationToken: authUser.ApplicationToken,
                }),
            );
        }
    }, [dispatch, meritMaster, authUser]);

    // Auto-select first medium when mediums are loaded
    useEffect(() => {
        if (mediums.length > 0 && !selectedMediumId) {
            setSelectedMediumId(mediums[0].PaperLanguageMediumID);
        }
    }, [mediums, selectedMediumId]);

    const showError = useCallback((message: string) => {
        setLocalError(message);
    }, []);

    const clearError = useCallback(() => {
        setLocalError(null);
        clearFlowError();
    }, [clearFlowError]);

    // Computed options for dropdowns
    const talukaOptions = useMemo(
        () =>
            talukaList.map(t => ({
                label: t.Taluka,
                value: t.Taluka,
            })),
        [talukaList],
    );

    const instituteOptions = useMemo(
        () =>
            institutes.map(i => ({
                label: i.InstituteName,
                value: i.CCode,
            })),
        [institutes],
    );

    const sectionOptions = useMemo(
        () =>
            sections.map(s => ({
                label: s.SectionName,
                value: s.SectionID,
            })),
        [sections],
    );

    const courseOptions = useMemo(
        () =>
            courses.map(c => ({
                label: c.CourseName ?? c.Course ?? 'Unknown Course',
                value: c.CourseID,
            })),
        [courses],
    );

    const classOptions = useMemo(
        () =>
            classes.map(c => ({
                label: c.ClassName,
                value: c.ClassID,
            })),
        [classes],
    );

    const mediumOptions = useMemo(
        () =>
            mediums.map(m => ({
                label: m.Medium,
                value: m.PaperLanguageMediumID,
            })),
        [mediums],
    );

    // Handlers
    const onTalukaChange = useCallback(
        async (taluka: string) => {
            setSelectedTaluka(taluka);
            setSelectedInstituteCCode(null);
            setSelectedSectionId(null);
            setSelectedCourseId(null);
            setSelectedClassId(null);
            setSelectedMediumId(null);
            
            if (!taluka) return;

            try {
                await fetchInstitutes(taluka);
            } catch (e: any) {
                showError(e?.message || 'Failed to load institutes');
            }
        },
        [fetchInstitutes, showError],
    );

    const onInstituteChange = useCallback(
        async (cCode: number) => {
            setSelectedInstituteCCode(cCode);
            setSelectedSectionId(null);
            setSelectedCourseId(null);
            setSelectedClassId(null);
            setSelectedMediumId(null);
            
            if (!cCode) return;

            try {
                await fetchSections(cCode);
            } catch (e: any) {
                showError(e?.message || 'Failed to load sections');
            }
        },
        [fetchSections, showError],
    );

    const onSectionChange = useCallback(
        async (sectionId: number) => {
            setSelectedSectionId(sectionId);
            setSelectedCourseId(null);
            setSelectedClassId(null);
            setSelectedMediumId(null);
            
            if (!sectionId || !selectedInstituteCCode) return;

            try {
                await fetchCourses(sectionId, selectedInstituteCCode);
            } catch (e: any) {
                showError(e?.message || 'Failed to load courses');
            }
        },
        [fetchCourses, selectedInstituteCCode, showError],
    );

    const onCourseChange = useCallback(
        async (courseId: number) => {
            setSelectedCourseId(courseId);
            setSelectedClassId(null);
            setSelectedMediumId(null);
            
            if (!courseId || !selectedInstituteCCode) return;

            const roleId = (authUser && authUser.RoleId) || 12;

            try {
                await fetchClasses(courseId, selectedInstituteCCode, roleId);
            } catch (e: any) {
                showError(e?.message || 'Failed to load classes');
            }
        },
        [authUser, fetchClasses, selectedInstituteCCode, showError],
    );

    const onClassChange = useCallback(
        async (classId: number) => {
            setSelectedClassId(classId);
            setSelectedMediumId(null);
            
            if (!classId || !selectedInstituteCCode) return;

            try {
                await fetchClassDetails(
                    classId, 
                    selectedInstituteCCode, 
                    meritMaster?.MeritStudentInfoID
                );
            } catch (e: any) {
                showError(e?.message || 'Failed to load class details');
            }
        },
        [fetchClassDetails, selectedInstituteCCode, meritMaster, showError],
    );

    const onMediumChange = useCallback((mediumId: number) => {
        setSelectedMediumId(mediumId);
    }, []);

    const onBankDetailChange = useCallback((field: keyof BankAccountDetails, value: string) => {
        setBankDetails(prev => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const canSave = useMemo(() => {
        const baseRequirements = 
            !!meritMaster &&
            !!selectedTaluka &&
            !!selectedInstituteCCode &&
            !!selectedSectionId &&
            !!selectedCourseId &&
            !!selectedClassId &&
            !!selectedMediumId;

        // If class is not direct admission, validate bank details
        if (classIsDirect === false) {
            const bankDetailsValid = 
                !!bankDetails.BankName &&
                !!bankDetails.BankBranchName &&
                !!bankDetails.BankAccountNo &&
                !!bankDetails.IFSCODE &&
                !!bankDetails.ABCID &&
                !!bankDetails.AnnualIncome &&
                !!bankDetails.PANNO &&
                !!bankDetails.FatherDoB &&
                !!bankDetails.MotherDoB &&
                !!bankDetails.UDISE;
            
            return baseRequirements && bankDetailsValid;
        }

        return baseRequirements;
    }, [
        meritMaster,
        selectedTaluka,
        selectedInstituteCCode,
        selectedSectionId,
        selectedCourseId,
        selectedClassId,
        selectedMediumId,
        classIsDirect,
        bankDetails,
    ]);

    const handleSave = useCallback(async () => {
        if (!meritMaster || !canSave) {
            showError('Please complete all selections before saving.');
            return;
        }

        const payload = buildEnrollmentPayload(meritMaster, {
            selectedInstituteCCode,
            selectedSectionId,
            selectedCourseId,
            selectedClassId,
            selectedMediumId,
            selectedTaluka,
            bankDetails,
            classIsDirect,
        });

        try {
            await saveEnrollment(payload);
        } catch (e: any) {
            showError(e?.message || 'Failed to save enrollment');
        }
    }, [
        meritMaster,
        canSave,
        selectedInstituteCCode,
        selectedClassId,
        selectedCourseId,
        selectedSectionId,
        selectedMediumId,
        selectedTaluka,
        bankDetails,
        classIsDirect,
        saveEnrollment,
        showError,
    ]);

    const isBusy = flowLoading || selectListsLoading || savingEnrollment;

    const state: CourseEnrollmentState = {
        talukaOptions,
        instituteOptions,
        sectionOptions,
        courseOptions,
        classOptions,
        mediumOptions,
        selectedTaluka,
        selectedInstituteCCode,
        selectedSectionId,
        selectedCourseId,
        selectedClassId,
        selectedMediumId,
        classIsDirect,
        bankDetails,
        canSave,
        isBusy,
        error: localError || flowError || saveError || studentError,
        hasAuthUser: !!authUser,
    };

    const handlers: CourseEnrollmentHandlers = {
        onTalukaChange,
        onInstituteChange,
        onSectionChange,
        onCourseChange,
        onClassChange,
        onMediumChange,
        onBankDetailChange,
        handleSave,
        clearError,
    };

    return {
        state,
        handlers,
        saveSuccess,
        saveError: saveError || null,
        resetSaveState,
    };
};


export interface StudentAdmissionInfo {
    CCODE: number;
    URNNO: number;
    ClassID: number;
    AceYear: string;
    Syllabus: string;
    SectionName: string;
    ClassName: string;
    CourseName: string;
    FacultyName: string;
    FullName: string;
    Email: string;
}

export interface InstituteSection {
    SectionID: number;
    SectionName: string;
    IsSelected: boolean;
    CCode: number;
}

export interface InstituteClass {
    ClassName: string;
    SectionName: string;
    FacultyName: string;
    InstituteClassID: number;
    CCode: number;
    ClassID: number;
    SectionID: number;
    CourseID: number;
    FacultyID: number;
}

export interface ExamType {
    ExamNameID: number;
    NameOfExam: string;
}

export interface SubjectPaper {
    Paper: string;
    SubjectDetails: string;
    SubjectCode: number;
    NameOfExam: string;
    IsSelected: boolean;
    Marks: boolean;
}

export interface ExamFormTimeTable {
    SectionName: string;
    ExamYear: string;
    ClassName: string;
    StartDate: string;
    EndDate: string;
}

export interface ExamFormPayload {
    ExamFormID: number;
    URNNO: number;
    ClassID: number;
    TName: string;
    ExamTypeID: number;
    ExamDetails: string;
    ExamFormDate: string;
    ExamYear: string;
    AddBy: number;
    AddByTime: string;
    CCode: number;
}

export interface GroupedSubjects {
    [examName: string]: SubjectPaper[];
}

export interface ExamFormState {
    // Student Info
    studentInfo: StudentAdmissionInfo | null;
    
    // Dropdowns
    classList: InstituteClass[];
    selectedClass: InstituteClass | null;
    
    examList: ExamType[];
    selectedExams: number[];
    
    // Subjects
    subjectList: SubjectPaper[];
    groupedSubjects: GroupedSubjects;
    selectedSubjects: number[];
    
    // Time Table
    timeTableList: ExamFormTimeTable[];
    
    // Exam Year
    examYear: string;
    
    // UI State
    isLoading: boolean;
    error: string | null;
    
    // Expanded sections
    expandedExams: string[];
}

export interface ExamFormHandlers {
    onClassChange: (classItem: InstituteClass) => void;
    onExamYearChange: (date: string) => void;
    onExamToggle: (examId: number) => void;
    onSubjectToggle: (subjectCode: number) => void;
    onExamSectionToggle: (examName: string) => void;
    handleSave: () => Promise<{ success: boolean; message: string } | undefined>;
    handlePrint: () => void;
}
export interface StudentEnrollmentInfo {
    ABCID: string;
    AnnualIncome: number;
    BankAccountNo: string;
    BankBranchName: string;
    BankName: string;
    CCode: string;
    ClassID: string;
    CourseID: string;
    EnrollMentDate: string; // ISO date string
    FatherDoB: string; // ISO date string
    IFSCODE: string;
    MeritEnrollMentID: number;
    MeritFormStatusId: number;
    MeritStudentInfoID: number;
    MotherDoB: string; // ISO date string
    NoOfSibling: string;
    PaperLanguageMediumID: number;
    SectionID: string;
    SiblingWardNo: string;
    Taluka: string;
    UDISE: string;
    SubjectPaperMarks: SubjectPaperMark[];
}

export interface SubjectPaperMark {
    // AdmissionClassSubjectPaperID: number;
    // MarksObtained: number;
}
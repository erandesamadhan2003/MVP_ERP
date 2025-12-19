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

export interface PrintStudentMeritFormPayload {
    MeritEnrollMentID: number;
    MeritStudentInfoID: number;
    EnrollMentNo: string;
    URNNO: number;

    SectionID: number;
    CourseID: number;
    ClassID: number;

    InstituteName: string;
    SectionName: string;
    ClassName: string;

    // Optional — send only if available
    FirstName?: string;
    LastName?: string;
    FatherName?: string;
    MotherName?: string;

    MobileNo?: string;
    Email1?: string;

    DateOfBirth?: string;
    Gender?: string;

    CategoryCode?: string;
    ReligionCast?: string;

    PANNO?: string;

    // flags
    FormSubmission?: boolean;
}

// Additional types for enrollment flow
export interface Institute {
    CCode: number;
    InstituteName: string;
    Address?: string;
    Taluka?: string;
    District?: string;
    States?: string;
    PinCode?: string;
    Email?: string;
    WebSite?: string;
    EstablishYear?: number;
    OCode: number;
    InstituteTypeID: number;
}

export interface Section {
    SectionID: number;
    SectionName: string;
    IsSelected: boolean;
    CCode: number;
}

export interface Course {
    Selected: boolean;
    CCode: number;
    CourseID: number;
    SectionID: number;
    FacultyID: number;
    Course?: string;
    CourseName: string;
    CourseDuration?: string;
    ClassLock: boolean;
}

export interface Class {
    Selected: boolean;
    CCode: number;
    CourseID: number;
    ClassID: number;
    SectionID: number;
    FacultyID: number;
    TypeOfMarksID?: number;
    ClassName: string;
    ClassLock: boolean;
}

export interface LanguageMedium {
    PaperLanguageMediumID: number;
    Medium: string;
    AddBy?: string;
    AddByTime?: string;
    EditBy?: string;
    EditByTime?: string;
}

export interface Taluka {
    Taluka: string;
}

export interface SaveEnrollmentPayload {
    MeritAdmissionEnrollment: {
        MeritEnrollMentID?: number;
        MeritStudentInfoID: number;
        EnrollMentDate: string;
        CCode: string;
        SectionID: string;
        CourseID: string;
        ClassID: string;
        MeritFormStatusId: number;
        PaperLanguageMediumID?: number;
        UDISE?: string;
        AnnualIncome?: number;
        NoOfSibling?: string;
        SiblingWardNo?: string;
        ABCID?: string;
        IFSCODE?: string;
        PANNO?: string;
        BankAccountNo?: string;
        BankName?: string;
        BankBranchName?: string;
        FatherDoB?: string;
        MotherDoB?: string;
        Taluka: string;
    };
    SubjectPaperMarks?: any[];
}

export interface BankAccountDetails {
    BankName: string;
    BankBranchName: string;
    BankAccountNo: string;
    IFSCODE: string;
    ABCID: string;
    AnnualIncome: string;
    NoOfSibling: string;
    SiblingWardNo: string;
    PANNO: string;
    FatherDoB: string;
    MotherDoB: string;
    UDISE: string;
}
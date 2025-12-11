import { SelectLists } from "./SelectList.types";

export interface StudentProfileMaster {
    MeritStudentInfoID: number;
    MeritStudentMasterID: number | null;
    CCode: number;
    URNNO: number;
    CRNNO: string;
    ABCID: string | null;
    AdharID: string | null;
    AllowEdit: boolean;
    AnnualIncome: number | null;
    ApplicationToken: string | null;
    BankAccountNo: string | null;
    BankBranchName: string | null;
    BankName: string | null;
    BirthCity: string | null;
    BirthPlace: string | null;
    BloodTypeID: number;
    CAddress: string | null;
    CDistrict: string | null;
    CPinCode: string | null;
    CState: string | null;
    CTaluka: string | null;
    CastCertificate: boolean;
    CategoryCode: number;
    DateOfBirth: string;
    Email1: string | null;
    Email2: string | null;
    FatherDoB: string | null;
    FatherName: string | null;
    FirstName: string;
    Gender: string;
    GrandFatherName: string | null;
    HandicapCertificate: boolean;
    HandicapId: number;
    IFSCODE: string | null;
    ISHandicap: boolean;
    ISSpCategory: boolean;
    ISSport: boolean;
    LCTCCertificate: boolean;
    LastName: string;
    MICRCODE: string | null;
    MSIGN: string | null;
    MarkSheetCertificate: boolean;
    MeritFormStatusId: number | null;
    MinorityID: number;
    MobileNo: string | null;
    MotherDoB: string | null;
    MotherInstitute: boolean;
    MotherName: string | null;
    NoOfSibling: number;
    PAddress: string | null;
    PDistrict: string | null;
    PHOTO: string | null;
    PPinCode: string | null;
    PState: string | null;
    PTaluka: string | null;
    PasswordHash: string | null;
    PhoneNo: string | null;
    PrevBoardUniversityName: string | null;
    PrevClassID: number | null;
    PrevCollegeName: string | null;
    PrevCourseID: number | null;
    PrevGrade: string | null;
    PrevGroupSubjectMarks: number | null;
    PrevGroupSubjectPerc: number | null;
    PrevMarks: number;
    PrevOutOfGroupSubjectMarks: number | null;
    PrevOutOfMarks: number | null;
    PrevPassingYear: string | null;
    PrevPercentage: number;
    PrevSeatNumber: string | null;
    PrevSectionID: number;
    PrincipalSubjectID: number | null;
    RegistrationDate: string | null;
    ReligionCast: string | null;
    ReligionID: number;
    SiblingWardNo: number;
    SpcategoryCertificate: boolean;
    SpecialCategoryId: number;
    SportCertificate: boolean;
    SportId: number;
    SubjectTypeID: number | null;
    UDISE: string;
    UserLogin: string | null;
}

export interface StudentProfileDocument {
    MeritStudentInfoID: number | null;
    MeritStudentMasterID: number | null;
    StudentName: string;
    ApplicationToken: string | null;
    CasteCert: string | null;
    LCTCCert: string | null;
    PassCert: string | null;
}

export interface StudentProfileResponseData {
    meritRegistrationMaster: StudentProfileMaster;
    meritRegistrationMasterDocuments: StudentProfileDocument[];
}

export interface StudentProfileApiResponse {
    ResponseCode: number;
    Message: string | null;
    ResponseData: StudentProfileResponseData;
}


// // Select List Types
// export interface TalukaItem {
//     Taluka: string;
// }

// export interface BloodTypeItem {
//     BloodTypeID: number;
//     BloodGroup: string;
// }

// export interface CategoryItem {
//     // Add category properties based on actual response
//     [key: string]: any;
// }

// export interface GenderItem {
//     Gender: string;
//     GenderName: string;
//     AddBy: string | null;
//     AddByTime: string | null;
//     EditBy: string | null;
//     EditByTime: string | null;
// }

// export interface HandicapTypeItem {
//     // Add handicap type properties
//     [key: string]: any;
// }

// export interface InstituteItem {
//     CCode: number;
//     InstituteName: string;
//     Address: string | null;
// }

// export interface LanguageMediumItem {
//     PaperLanguageMediumID: number;
//     Medium: string;
//     AddBy: string | null;
//     AddByTime: string | null;
//     EditBy: string | null;
//     EditByTime: string | null;
// }

// export interface MeritPrincipalSubjectItem {
//     PrincipalSubjectID: number;
//     PrincipalSubject: string;
// }

// export interface MeritSubjectTypeItem {
//     SubjectTypeID: number;
//     SubjectType: string;
// }

// export interface MinorityItem {
//     MinorityID: number;
//     Minority: string;
// }

// export interface PrevSectionItem {
//     SectionID: number;
//     SectionName: string;
//     IsSelected: boolean;
// }

// export interface ReligionItem {
//     ReligionID: number;
//     ReligionName: string;
//     AddBy: string | null;
//     AddByTime: string | null;
//     EditBy: string | null;
//     EditByTime: string | null;
// }

// export interface SpecialCategoryTypeItem {
//     SpecialCategoryID: number;
//     SpecialCategory: string;
//     AddBy: string | null;
//     AddByTime: string | null;
//     EditBy: string | null;
//     EditByTime: string | null;
// }

// export interface SportsItem {
//     SportsID: number;
//     SportName: string;
//     AddBy: string | null;
//     AddByTime: string | null;
//     EditBy: string | null;
//     EditByTime: string | null;
// }

// export interface StudentProfileSelectListData {
//     TalukaList: TalukaItem[];
//     BloodTypeList: BloodTypeItem[];
//     CategoryList: CategoryItem[];
//     GenderList: GenderItem[];
//     HandiCapTypeList: HandicapTypeItem[];
//     InstituteList: InstituteItem[];
//     LanguageMediumList: LanguageMediumItem[];
//     MeritPrincipalSubjectList: MeritPrincipalSubjectItem[];
//     MeritSubjectTypeList: MeritSubjectTypeItem[];
//     MinorityList: MinorityItem[];
//     PrevClassList: any[] | null;
//     PrevCourseList: any[] | null;
//     PrevSectionList: PrevSectionItem[];
//     ReligionList: ReligionItem[];
//     SpecialCategoryTypeList: SpecialCategoryTypeItem[];
//     SportsList: SportsItem[];
// }

// export interface StudentProfileSelectListResponse {
//     ResponseCode: number;
//     Message: string | null;
//     ResponseData: StudentProfileSelectListData;
// }

export interface StudentState {
    profile: StudentProfileResponseData | null;
    selectLists: SelectLists | null;
    loading: boolean;
    selectListsLoading: boolean;
    error: string | null;
    selectListsError: string | null;
}
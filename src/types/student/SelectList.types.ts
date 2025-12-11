export interface BloodGroup {
    BloodGroup: string;
    BloodTypeID: number;
}

export interface Category {
    AddBy: string | null;
    AddByTime: string | null;
    Board: number;
    Category: string;
    CategoryCode: number;
    CategoryDetails: string | null;
    EditBy: string | null;
    EditByTime: string | null;
    University: number;
}

export interface Gender {
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
    Gender: string;
    GenderName: string;
    URID: number | null;
}

export interface HandiCapped {
    HandicapID: number;
    HandicapDescription: string;
    Status: boolean;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

export interface Institute {
    CCode: number;
    OCode: number;
    InstituteTypeID: number;
    InstituteName: string;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
    Email: string | null;
    WebSite: string | null;
    EstablishYear: string | null;
    InstituteInitialName: string | null;
    InstituteInNativeLanguage: string | null;
    NameOfInstitute: string | null;
    Address: string | null;
    States: string | null;
    District: string | null;
    Taluka: string | null;
    PinCode: string | null;
}

export interface LanguageMedium {
    PaperLanguageMediumID: number;
    Medium: string;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

export interface MeritPrincipalSubject {
    PrincipalSubjectID: number;
    PrincipalSubject: string;
}

export interface MeritSubjectType {
    SubjectTypeID: number;
    SubjectType: string;
}

export interface Minority {
    MinorityID: number;
    Minority: string;
}

export interface PrevSection {
    SectionID: number;
    SectionName: string;
    IsSelected: boolean;
}

export interface Religion {
    ReligionID: number;
    ReligionName: string;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

export interface SpecialCategory {
    SpecialCategoryID: number;
    SpecialCategory: string;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

export interface Sports {
    SportsID: number;
    SportName: string;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

export interface Taluka {
    Taluka: string;
}

export interface SelectLists {
    BloodTypeList: BloodGroup[];
    CategoryList: Category[];
    GenderList: Gender[];
    HandiCapTypeList: HandiCapped[];
    InstituteList: Institute[];
    LanguageMediumList: LanguageMedium[];
    MeritPrincipalSubjectList: MeritPrincipalSubject[];
    MeritSubjectTypeList: MeritSubjectType[];
    MinorityList: Minority[];
    PrevClassList: null;
    PrevCourseList: null;
    PrevSectionList: PrevSection[];
    ReligionList: Religion[];
    SpecialCategoryTypeList: SpecialCategory[];
    SportsList: Sports[];
    TalukaList: Taluka[];
}

export interface ApiResponse {
    ResponseCode: number;
    Message: string | null;
    ResponseData: SelectLists;
}

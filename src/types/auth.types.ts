// ! ========================= Payload and Response interfaces for authentication of Student ===========================
export interface StudentLoginPayload {
    CCode?: string;
    UserName: string;
    Password: string;
    AceYear: string; 
    UserAccessAddress: string;
    UserType: number;
}

export interface StudentLoginResponse {
    ResponseCode: number;
    Message: string | null;
    ResponseData: {
        IdToken: string;
        ExpiresIn: number;
        UserData: UserData;
    };
}

export interface StudentRegisterPayload {
    AdharID: string;
    ConfirmPassword: string;
    FormNo: string;
    MobileNo: string;
    PasswordHash: string;
    UserLogin: string;
}

export interface StudentRegisterResponse {
    ResponseCode: number;
    Message: string | null;
    ResponseData: {
        RCNO: number | null;
        CirculationID: number | null;
        BookID: number | null;
        AccessionNo: string | null;
        RUserID: number | null;
        GenRegisterID: number | null;
        ClassLectureId: number | null;
        v_Return: number;
    };
}

// ! ========================= User Data and Menu Item interfaces ===========================
export interface UserData {
    ApplicationToken: string;
    Email: string;
    Password: string | null;
    CCode: number;
    OCode: number;
    RoleId: number;
    SID: number;
    ReturnUrl: string | null;
    RememberMe: boolean;
    UserID: number;
    UserName: string;
    MobileNo: string;
    PhoneNo: string | null;
    NewPassword: string | null;
    UserAccessAddress: string;
    InitialName: string | null;
    FullName: string;
    StudentName: string;
    ProfilePhoto: string | null;
    EmpPhoto: string | null;
    PosDeviceID: string | null;
    ClassID: number;
    DepartmentID: number | null;
    SectionID: number | null;
    PosDeviceUserID: string | null;
    PosDevicePassword: string | null;
    UserType: number;
    OrganizationLogo: string;
    OrganizationName: string;
    InstituteName: string;
    Menu: MenuItem[];
    IsEmployee: boolean;
    URNNO: number;
}

export interface MenuItem {
    MenuIdentity: number;
    MenuId: number;
    ParentMenuId: number | null;
    HasChildren: boolean;
    ModuleId: number;
    MenuNumber: number;
    MenuName: string;
    CSSClass: string;
    NgClass: string;
    FormLink: string;
    IsActive: boolean | null;
    Childrens: MenuItem[] | null; // Recursive type for nested menus
}

// ! ========================= State interface for authentication ==========================
export interface AuthState {
    user: UserData | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

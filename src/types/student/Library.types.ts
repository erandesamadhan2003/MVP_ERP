export interface ApiResponse<T> {
    ResponseCode: number;
    Message: string | null;
    ResponseData: T;
}

/* =======================
   MEMBER INFORMATION
======================= */

export interface MemberInformation {
    ClassName: string;
    URNNO: number;
    MEMBERNO: string | null;
    FName: string;
    MName: string;
    LName: string;
    FullName: string;
    GENDER: string;
    DoB: string;
    CONTACT: string;
    EMail: string;
    Village: string;
    Taluka: string;
    District: string;
    Pincode: string;
    ClassID: number;
    SectionID: number;
    DepartmentID: number;
    Admission: string;
    BloodTypeID: number;
    iCardIssue: boolean;
    MemberTypeID: number;
    MemberActive: boolean;
    AdharID: string;
    CancelMemberShip: boolean;
    DuplicateIcard: boolean;
    PHOTO: string | null;
    MSIGN: string | null;
    AddBy?: string | null;
    AddByTime?: string | null;
    EditBy?: string | null;
    EditByTime?: string | null;

}

/* =======================
   MEMBER INFO REQUEST
======================= */
export interface GetMemberInformationPayload {
    URNNO: string;
    CCode: string;
    MemberTypeID: number;
    Status: string;
    BDate: string;
    EDate: string;
}

/* =======================
   STUDENT IDENTITY IMAGE
======================= */
export interface StudentIdentityImage {
    URNNO: number;
    CRNNO: string;
    PHOTO: string;
    MSIGN: string;
    UStatus: string | null;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

/* =======================
   BOOK READING ROOM
======================= */

export interface BookReadingAttendance {
    ClassName: string | null;
    Students: number;
    BookReadingRoomID: number;
    URNNO: number;
    ClassID: number;
    ReadingDate: string;
    InTime: string | null;
    OutTime: string | null;
}

export interface BookReadingRoomStatus {
    GetToDayReadingAttendentList: BookReadingAttendance[];
    GetClassReadingAttendent: BookReadingAttendance[];
    GetPresentStatus: BookReadingAttendance[];
}

/* =======================
   BOOK READING REQUEST
======================= */
export interface GetBookReadingRoomStatusPayload {
    URNNO: string;
    CCode: string;
    Status: string;
    BDate: string;
    EDate: string;
}
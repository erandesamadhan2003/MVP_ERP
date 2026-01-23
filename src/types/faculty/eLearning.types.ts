export interface TeacherScheduleListRequest {
    CCode: string;
    AceYear: string;
    UserID: string;
    BDate: string;
    EDate: string;
}

export interface StudentAttendanceListRequest {
    AceYear: string;
    AttendanceDate: string;
    CCode: string;
    ClassId: number;
    ClassLectureScheduleDetailId: number;
    InstituteClassDivID: number;
    SubjectCode: number;
    UserId: string;
}

export interface SaveStudentAttendanceRequest {
    AceYear: number;
    AddBy: string;
    AddByTime: string;
    AttendanceDate: string | null;
    AttendanceDetailsId: number;
    AttendanceHeaderId: number | null;
    CCode: string;
    ClassId: number;
    ClassLectureScheduleDetailId: number;
    EditBy: string;
    EditByTime: string;
    EmployeeID: number;
    InTime: string;
    InstituteClassDivID: number;
    IsPresent: boolean;
    OutTime: string;
    Remark: string | null;
    SectionId: number;
    SubjectCode: number;
    URNNO: number;
    UserId: string;
}

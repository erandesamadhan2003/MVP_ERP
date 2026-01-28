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

export interface TeacherScheduleItem {
    ClassLectureScheduleDetailId: number;
    LectureNo: number | null;
    Paper: string;
    EmployeeName: string | null;
    SectionName: string | null;
    FacultyName: string | null;
    CourseName: string | null;
    ClassName: string | null;
    DivisionNo: number | null;
    DivisionName: string | null;
    DaysName: string | null;
    ClassLectureScheduleId: number;
    CCode: number;
    SectionID: number;
    FacultyID: number;
    CourseID: number;
    ClassID: number;
    InstituteClassDivID: number;
    LectureDate: string;
    SubjectCode: number;
    EmployeeID: number;
    ExpectedStartTime: string;
    ExpectedEndTime: string;
    ActualStartTime: string | null;
    AceYear: number;
    AddBy: number;
    AddByTime: string;
    EditBy: number;
    EditByTime: string;
    BDate: string | null;
    EDate: string | null;
}

export interface SubjectTimeTableListRequest {
    CCode: string;
    SectionID: number;
    ClassID: number;
    SubjectCode: number;
    InstituteClassDivID: number;
    ClassLectureScheduleDetailId: number;
    LectureDate: string;
    UserID: string;
    AceYear: string;
}

export interface StudentAttendanceItem {
    URNNO: number;
    Division: string;
    RollNo: string | null;
    StudentName: string;
    Gender: string;
    Contact: string;
    PContact: string | null;
    Email: string;
    SubjectName: string;
    SectionName: string | null;
    ClassName: string;
    EmployeeName: string;
    AttendanceDetailsId: number;
    AttendanceHeaderId: number | null;
    SectionId: number;
    ClassId: number;
    IsPresent: boolean;
    AttendanceDate: string | null;
    InstituteClassDivID: number;
    ClassLectureScheduleDetailId: number;
    EmployeeID: number;
    UserId: string | null;
    SubjectCode: number;
    InTime: string;
    OutTime: string;
    Remark: string | null;
    CCode: number;
    AceYear: number;
    AddBy: string | null;
    AddByTime: string | null;
    EditBy: string | null;
    EditByTime: string | null;
}

export interface Class {
    AddBy: string | null;
    AddByTime: string | null;
    ClassDetails: string | null;
    ClassID: number;
    ClassName: string;
    ClassNo: number | null;
    ClassOutOfMarks: number | null;
    CourseID: number;
    CourseYear: number | null;
    EditBy: string | null;
    EditByTime: string | null;
    ExamTypeID: number | null;
    FacultyID: number;
    IsAdditionalCourse: boolean;
    IsEligibility: boolean;
    NoOfSubject: number | null;
    OCode: number | null;
    SectionID: number;
    TypeOfMarksID: number | null;
}

export interface ClassResponse {
    ResponseCode: number;
    Message: string | null;
    ResponseData: Class[];
}
export interface Course {
    AddBy: string | null;
    AddByTime: string | null;
    Course: string;
    CourseDuration: number;
    CourseID: number;
    CourseName: string | null;
    EditBy: string | null;
    EditByTime: string | null;
    FacultyID: number;
    IsShikshanShulk: boolean;
    OCode: number | null;
    SectionID: number;
}

export interface CourseResponse {
    ResponseCode: number;
    Message: string | null;
    ResponseData: Course[];
}
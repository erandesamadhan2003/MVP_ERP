import { api } from '../../api';

export const GetStudentDetails = async ( UserID: number, ApplicationToken: string) => {
    try {
        const response = await api.get(`/Student/StudentProfile/GetStudentProfileDetails`,{
            params: { UserID, ApplicationToken},
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetCoursesOnSection = async ( SectionID: number) => {
    try {
        const response = await api.get(`/Admission/Registration/GetCourseOnSection`,{
            params: { SectionID },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetClassOnCourse = async ( CourseID: number) => {
    try {
        const response = await api.get(`/Admission/Registration/GetClassOnCourse`,{
            params: { CourseID },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetStudentProfileSelectList = async () => {
    try {
        const response = await api.get(`/Admission/Registration/GetStudentProfileSelectList`);
        return response.data;
    } catch (error) {
        throw error;
    }
};          

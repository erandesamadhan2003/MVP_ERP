import { StudentProfileMaster } from '../../../types/student/studentProfile.types';
import { api } from '../../api';

export const GetStudentDetails = async ( UserID: number, ApplicationToken: string) => {
    if (!UserID || !ApplicationToken) {
        throw new Error('UserID and ApplicationToken are required');
    }

    // Correct endpoint: /Admission/Registration/GetStudentDetails
    const url = '/Admission/Registration/GetStudentDetails';
    const params = { UserID, ApplicationToken };
    
    const response = await api.get(url, { params });
    return response.data;
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

export const UpdateStudentProfile = async (payload: StudentProfileMaster) => {
    try {
        const response = await api.post('/Admission/Registration/AddMeritRegistrations', 
            payload
        );
    } catch (error) {
        throw error;
    }
}


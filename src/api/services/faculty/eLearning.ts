import { api } from '../../api';
import { TeacherScheduleListRequest, StudentAttendanceListRequest, SaveStudentAttendanceRequest } from '../../../types/faculty/eLearning.types';

// POST http://mvperp.org:82/api/TimeTable/TeacherTimeTable/GetTeacherScheduleList
export const getTeacherScheduleList = async (
    data: TeacherScheduleListRequest,
) => {
    const response = await api.post(
        '/TimeTable/TeacherTimeTable/GetTeacherScheduleList',
        data,
    );
    return response.data;
};

// http://mvperp.org:82/api/TimeTable/ClassTimeTableMaster/GetSectionList?CCode=116001
export const getSectionList = async (CCode: string) => {
    const response = await api.get(
        '/TimeTable/ClassTimeTableMaster/GetSectionList',
        { params: { CCode } },
    );
    return response.data;
};

// http://mvperp.org:82/api/TimeTable/StudentAttendance/StudentAttendanceList


export const getStudentAttendanceList = async (
    data: StudentAttendanceListRequest,
) => {
    const response = await api.post(
        '/TimeTable/StudentAttendance/StudentAttendanceList',
        data,
    );
    return response.data;
};

// http://mvperp.org:82/api/TimeTable/StudentAttendance/Save
export const saveStudentAttendance = async (
    data: SaveStudentAttendanceRequest,
) => {
    const response = await api.post('/TimeTable/StudentAttendance/Save', data);
    return response.data;
};

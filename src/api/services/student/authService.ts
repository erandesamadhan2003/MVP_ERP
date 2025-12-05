import { api } from '../../api';
import {
    StudentLoginPayload,
    StudentRegisterPayload,
} from '../../../types/auth.types';

export const StudentLogin = async (payload: StudentLoginPayload) => {
    try {
        // const response = await api.post('/Account/Login', payload);
        const response = await api.post('/Account/GetLoginDetails', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const StudentRegister = async (payload: StudentRegisterPayload) => {
    try {
        const response = await api.post(
            'Admission/Registration/StudentPreRegistrations',
            payload,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

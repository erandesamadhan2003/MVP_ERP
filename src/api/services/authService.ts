import { api } from "../api";
import { StudentLoginPayload } from "../../types/auth.types";

export const Login = async (payload: StudentLoginPayload) => {
    try {
        const response = await api.post('/Account/Login', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}


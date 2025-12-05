import { NewsAnnouncementResponse } from "../../../types/newsAndAnnouncements.types";
import { api } from "../../api";

export const NewsAndAnnouncementsService = async () => {
    try {
        const response = await api.get("/Home/GetNewsAndAnnouncements");
        return response.data;
    } catch (error) {
        throw error;
    }
}
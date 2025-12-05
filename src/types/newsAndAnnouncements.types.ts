export interface NewsAnnouncement {
    ID: number;
    SRNO: number;
    MessageHeader: string;
    Details: string;
    RefURL: string | null;
    AttachmentFile: string | null;
    IsActive: boolean;
    AddBy: number | null;
    AddByTime: string | null;
    EditBy: number | null;
    EditByTime: string | null;
}

export interface NewsAnnouncementResponse {
    ResponseCode: number;
    Message: string;
    ResponseData: NewsAnnouncement[];
}
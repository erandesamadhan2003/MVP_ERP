import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { UploadFileType } from "../../types/student/studentProfile.types";

interface UploadArgs {
    thunk: any;
    file: UploadFileType;
    profileData?: { MeritStudentInfoID?: number | null };
    user: { UserID: number; ApplicationToken?: string };
    isCaste?: boolean;
}

export const useUploader = () => {
    const dispatch = useDispatch<AppDispatch>();

    const uploadFile = async ({ thunk, file, profileData, user, isCaste }: UploadArgs) => {
        if (!file || !user) throw "Select a file first";

        const timestamp = new Date().toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        const payload: any = {
            MeritStudentMasterID: user.UserID,
            ApplicationToken: user.ApplicationToken || "AdmissionStudent",
            AddBy: user.UserID,
            AddByTime: timestamp,
            EditBy: user.UserID,
            EditByTime: timestamp,
            file,
        };

        if (!isCaste) payload.MeritStudentInfoID = profileData?.MeritStudentInfoID;

        await dispatch(thunk(payload)).unwrap();
        console.log(`[upload] success for ${thunk.typePrefix}`);
        return true;
    };

    return { uploadFile };
};

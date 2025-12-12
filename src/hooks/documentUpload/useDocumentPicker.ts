import { pick, types, isCancel } from "@react-native-documents/picker";
import { UploadFileType } from "../../types/student/studentProfile.types";

export const useDocumentPicker = () => {
    const pickDocument = async (): Promise<UploadFileType | null> => {
        try {
            const [res] = await pick({
                // restrict to pdf as requested
                type: [types.pdf],
            });

            if (!res) return null;

            return {
                uri: res.uri,
                name: res.name || res.fileName || "document.pdf",
                type: res.type || "application/pdf",
            };
        } catch (err: any) {
            if (isCancel?.(err)) return null;
            throw "Failed to pick document";
        }
    };

    return { pickDocument };
};

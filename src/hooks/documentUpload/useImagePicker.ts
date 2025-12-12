import { launchImageLibrary } from "react-native-image-picker";
import { UploadFileType } from "../../types/student/studentProfile.types";

export const useImagePicker = () => {
    const pickImage = async (): Promise<UploadFileType | null> => {
        const result = await launchImageLibrary({
            mediaType: "photo", // images only
            includeBase64: false,
            quality: 0.8,
        });

        if (result.didCancel || !result.assets?.length) return null;

        const asset = result.assets[0];
        if (!asset?.uri) throw "Failed to pick image";

        return {
            uri: asset.uri,
            name: asset.fileName || "image.jpg",
            type: asset.type || "image/jpeg",
        };
    };

    return { pickImage };
};

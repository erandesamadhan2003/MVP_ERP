import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { UploadFileType } from "../../../types/student/studentProfile.types";

interface DocumentUploadCardProps {
    label: string;
    file?: UploadFileType | null;
    onChoose: () => void;
    onUpload: () => void;
    uploading?: boolean;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
    label,
    file,
    onChoose,
    onUpload,
    uploading = false
}) => (
    <View style={{ marginBottom: 20 }}>
        <Text>{label}</Text>

        <Button mode="outlined" onPress={onChoose}>Choose File</Button>
        <Text>{file?.name || "No File Selected"}</Text>

        <Button
            mode="contained"
            onPress={onUpload}
            loading={uploading}
            disabled={!file || uploading}
        >
            Upload
        </Button>
    </View>
);

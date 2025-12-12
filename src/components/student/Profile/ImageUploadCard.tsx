import React from "react";
import { View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { UploadFileType } from "../../../types/student/studentProfile.types";

interface ImageUploadCardProps {
    title: string;
    file?: UploadFileType | null;
    uploaded?: boolean;
    onChoose: () => void;
    onUpload: () => void;
    uploading?: boolean;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
    title,
    file,
    uploaded,
    onChoose,
    onUpload,
    uploading = false,
}) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold" }}>{title}</Text>

            {file ? (
                <Image source={{ uri: file.uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            ) : uploaded ? (
                <Text>Uploaded</Text>
            ) : (
                <Text>No File</Text>
            )}

            <View style={{ flexDirection: "row", gap: 10 }}>
                <Button mode="outlined" onPress={onChoose}>Choose File</Button>

                {file && (
                    <Button
                        mode="contained"
                        onPress={onUpload}
                        loading={uploading}
                        disabled={uploading}
                    >
                        Upload
                    </Button>
                )}
            </View>
        </View>
    );
};

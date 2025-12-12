import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateMasterField } from '../../store/slices/student/studentSlice';
import { profileStyles } from '../../screens/student/profile/profileStyles';
import { StudentProfileMaster } from '../../types/student/studentProfile.types';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    editable?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    secureTextEntry?: boolean;
    icon?: string;
    field?: keyof StudentProfileMaster;
}

export const InputField = ({
    label,
    value,
    onChangeText,
    editable = true,
    multiline = false,
    numberOfLines = 1,
    keyboardType = 'default',
    secureTextEntry = false,
    icon,
    field,
}: InputFieldProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleTextChange = (text: string) => {
        // If custom handler provided, use it
        if (onChangeText) {
            onChangeText(text);
        }
        // Otherwise, dispatch to Redux automatically if field is provided
        else if (field && editable) {
            dispatch(updateMasterField({ field, value: text }));
        }
    };

    return (
        <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>{label}</Text>
            <TextInput
                mode="outlined"
                value={value}
                onChangeText={handleTextChange}
                editable={editable}
                multiline={multiline}
                numberOfLines={numberOfLines}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={[
                    profileStyles.input,
                    !editable && profileStyles.disabledInput,
                ]}
                right={icon ? <TextInput.Icon icon={icon} /> : undefined}
            />
        </View>
    );
};
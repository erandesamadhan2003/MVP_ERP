import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { profileStyles } from '../../screens/student/profile/profileStyles';

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
}: InputFieldProps) => {
    return (
        <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>{label}</Text>
            <TextInput
                mode="outlined"
                value={value}
                onChangeText={onChangeText}
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

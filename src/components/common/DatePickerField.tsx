import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { profileStyles } from '../../screens/student/profile/profileStyles';

interface DatePickerFieldProps {
    label: string;
    value: string; // ISO date string or empty
    onDateChange: (date: string) => void;
    editable?: boolean;
}

export const DatePickerField = ({
    label,
    value,
    onDateChange,
    editable = true,
}: DatePickerFieldProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(value ? new Date(value) : new Date());

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (selectedDate) {
            setDate(selectedDate);
            onDateChange(selectedDate.toISOString());
        }
    };

    const handlePress = () => {
        if (editable) {
            setShowPicker(true);
        }
    };

    const handleConfirm = () => {
        setShowPicker(false);
    };

    return (
        <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>{label}</Text>
            <TouchableOpacity onPress={handlePress} disabled={!editable}>
                <TextInput
                    mode="outlined"
                    value={formatDate(value)}
                    editable={false}
                    style={[
                        profileStyles.input,
                        !editable && profileStyles.disabledInput,
                    ]}
                    right={<TextInput.Icon icon="calendar" />}
                    placeholder="DD/MM/YYYY"
                />
            </TouchableOpacity>

            {showPicker && (
                <>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={{
                                padding: 10,
                                backgroundColor: '#1649b2',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
};
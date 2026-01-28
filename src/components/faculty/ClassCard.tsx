import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

interface ClassCardProps {
    classItem: any;
    onPress: (classItem: any) => void;
    color: string;
}

export default function ClassCard({ classItem, onPress, color }: ClassCardProps) {
    const formatTime = (isoString: string): string => {
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const startTime = formatTime(classItem.ExpectedStartTime);
    const endTime = formatTime(classItem.ExpectedEndTime);

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: color }]}
            onPress={() => onPress(classItem)}
            activeOpacity={0.7}
        >
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{startTime}</Text>
                <Text style={styles.timeSeparator}>-</Text>
                <Text style={styles.timeText}>{endTime}</Text>
            </View>
            <Text style={styles.subjectText} numberOfLines={2}>
                {classItem.Paper}
            </Text>
            {classItem.SectionName && (
                <Text style={styles.sectionText}>
                    Section: {classItem.SectionName}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    timeText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#666',
    },
    timeSeparator: {
        fontSize: 13,
        color: '#999',
        marginHorizontal: 4,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#08306b',
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 12,
        color: '#999',
    },
});

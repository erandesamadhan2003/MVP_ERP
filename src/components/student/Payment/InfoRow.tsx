import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface Props {
    label: string;
    value: string | number;
    highlight?: boolean;
}

export default function InfoRow({ label, value, highlight }: Props) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, highlight && styles.highlight]}>
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: 120,
        fontSize: 13,
        color: '#555',
        fontWeight: '600',
    },
    value: {
        flex: 1,
        fontSize: 13,
        color: '#111',
    },
    highlight: {
        fontWeight: '700',
        color: '#d32f2f',
    },
});

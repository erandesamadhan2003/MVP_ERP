import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface Props {
    title: string;
    onBack: () => void;
    rightAction?: React.ReactNode;
}

export default function ScreenHeader({ title, onBack, rightAction }: Props) {
    return (
        <View style={styles.header}>
            <View style={styles.left}>
                <IconButton icon="arrow-left" size={22} onPress={onBack} />
                <Text style={styles.title}>{title}</Text>
            </View>
            {rightAction}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#08306b',
    },
});

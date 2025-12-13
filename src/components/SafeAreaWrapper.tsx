import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
    children: React.ReactNode;
    style?: any;
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * SafeAreaWrapper - A reusable component that handles safe areas for all screens
 * - Prevents header overlap with status bar (top)
 * - Prevents content overlap with navigation bar (bottom)
 * - Works consistently across all Android devices
 */
export default function SafeAreaWrapper({ 
    children, 
    style,
    edges = ['top', 'bottom'] 
}: SafeAreaWrapperProps) {
    return (
        <>
            <StatusBar 
                barStyle="dark-content" 
                backgroundColor="#fff" 
                translucent={false}
            />
            <SafeAreaView 
                edges={edges} 
                style={[styles.safeArea, style]}
            >
                {children}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
});


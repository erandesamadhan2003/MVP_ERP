import React, { useEffect, useRef, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';

interface DateStripProps {
    currentDate: Date;
    onDateSelected: (date: Date) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 60;
const ITEM_SPACING = 8;
const FULL_ITEM_WIDTH = ITEM_WIDTH + ITEM_SPACING;

export default function DateStrip({ currentDate, onDateSelected }: DateStripProps) {
    const flatListRef = useRef<FlatList>(null);

    // Generate a large range of dates (e.g., +/- 1 year from today)
    // We center the list so "today" is roughly in the middle if we generate 365 days back and forth.
    const dates = useMemo(() => {
        const today = new Date(); // Use actual today as anchor
        const range = 180; // Days before and after
        const d: Date[] = [];

        // Start from -range days
        for (let i = -range; i <= range; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            d.push(date);
        }
        return d;
    }, []);

    // Find index of current selected date to scroll to it
    const selectedIndex = useMemo(() => {
        // We compare by string key for safety (YYYY-MM-DD)
        const currentStr = currentDate.toDateString();
        return dates.findIndex(d => d.toDateString() === currentStr);
    }, [dates, currentDate]);

    useEffect(() => {
        if (selectedIndex !== -1 && flatListRef.current) {
            // Scroll to center the selected date
            flatListRef.current.scrollToIndex({
                index: selectedIndex,
                animated: true,
                viewOffset: width / 2 - FULL_ITEM_WIDTH / 2
            });
        }
    }, [selectedIndex]);

    const getItemLayout = (data: any, index: number) => ({
        length: FULL_ITEM_WIDTH,
        offset: FULL_ITEM_WIDTH * index,
        index,
    });

    const renderItem = ({ item, index }: { item: Date; index: number }) => {
        const isSelected = item.toDateString() === currentDate.toDateString();
        const isToday = item.toDateString() === new Date().toDateString();

        const dayName = item.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = item.getDate();

        return (
            <TouchableOpacity
                style={[
                    styles.itemContainer,
                    isSelected && styles.selectedItemContainer,
                    // Optional: Highlight today slightly different if not selected? 
                    // But strict selection matches user expectation.
                ]}
                onPress={() => onDateSelected(item)}
            >
                <Text
                    style={[
                        styles.dayName,
                        isSelected && styles.selectedText,
                        isToday && !isSelected && styles.todayText
                    ]}
                >
                    {dayName}
                </Text>
                <View style={[styles.dateCircle, isSelected && styles.selectedDateCircle]}>
                    <Text
                        style={[
                            styles.dayNumber,
                            isSelected && styles.selectedText,
                            isToday && !isSelected && styles.todayText
                        ]}
                    >
                        {dayNumber}
                    </Text>
                </View>

            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.monthYearText}>
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={dates}
                renderItem={renderItem}
                keyExtractor={(item) => item.toDateString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                contentContainerStyle={styles.contentContainer}
                initialScrollIndex={selectedIndex > -1 ? selectedIndex : undefined}
                onScrollToIndexFailed={(info) => {
                    // Needed if initial scroll fails (e.g. layout not ready)
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({
                            index: info.index,
                            animated: false,
                            viewOffset: width / 2 - FULL_ITEM_WIDTH / 2
                        });
                    }, 500);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    monthYearText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: 70,
        marginRight: ITEM_SPACING,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedItemContainer: {
        backgroundColor: '#1649b2', // Primary color from user's app
        borderColor: '#1649b2',
        transform: [{ scale: 1.05 }],
    },
    dayName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    dateCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDateCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    selectedText: {
        color: '#fff',
    },
    todayText: {
        color: '#1649b2',
        fontWeight: 'bold',
    },
});

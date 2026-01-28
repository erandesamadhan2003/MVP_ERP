import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import ClassCard from './ClassCard';
import { formatDayHeader, isToday, getClassesForDate } from '../../screens/faculty/eLearning/timetable/utils';

const { width } = Dimensions.get('window');
const DAY_WIDTH = width * 0.85;

interface WeekTimelineProps {
    weekDates: Date[];
    scheduleData: any[];
    onClassPress: (classItem: any) => void;
    getClassColor: (subject: string) => string;
    currentDate: Date;
    onDateSwitch: (date: Date) => void;
}

export default function WeekTimeline({
    weekDates,
    scheduleData,
    onClassPress,
    getClassColor,
    currentDate,
    onDateSwitch,
}: WeekTimelineProps) {
    const scrollRef = useRef<ScrollView>(null);

    // Scroll to current date when it changes
    useEffect(() => {
        if (currentDate && weekDates.length > 0) {
            const index = weekDates.findIndex(
                date => date.toDateString() === currentDate.toDateString()
            );

            if (index !== -1 && scrollRef.current) {
                scrollRef.current.scrollTo({
                    x: index * (DAY_WIDTH + 16), // 16 is gap
                    animated: true,
                });
            }
        }
    }, [currentDate, weekDates]);

    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (DAY_WIDTH + 16));

        if (index >= 0 && index < weekDates.length) {
            const newDate = weekDates[index];
            if (newDate.toDateString() !== currentDate.toDateString()) {
                onDateSwitch(newDate);
            }
        }
    };


    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={DAY_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.scrollContent}
            onMomentumScrollEnd={handleScrollEnd}
        >
            {weekDates.map((date, index) => {
                const classes = getClassesForDate(scheduleData, date);
                const isTodayDate = isToday(date);
                const header = formatDayHeader(date);

                return (
                    <View key={index} style={[styles.dayCard, { width: DAY_WIDTH }]}>
                        <View style={[styles.dayHeader, isTodayDate && styles.todayHeader]}>
                            <Text style={[styles.dayName, isTodayDate && styles.todayText]}>
                                {header.dayName}
                            </Text>
                            <Text style={[styles.dateNumber, isTodayDate && styles.todayText]}>
                                {header.date}
                            </Text>
                            <Text style={[styles.monthText, isTodayDate && styles.todayText]}>
                                {header.month}
                            </Text>
                        </View>
                        <ScrollView
                            style={styles.classesContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            {classes.length > 0 ? (
                                classes.map((classItem, idx) => (
                                    <ClassCard
                                        key={idx}
                                        classItem={classItem}
                                        onPress={onClassPress}
                                        color={getClassColor(classItem.Paper)}
                                    />
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No classes scheduled</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    dayCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    dayHeader: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#e0e0e0',
    },
    todayHeader: {
        backgroundColor: '#ff9f1a',
        borderBottomColor: '#ff9f1a',
    },
    dayName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    dateNumber: {
        fontSize: 32,
        fontWeight: '800',
        color: '#08306b',
        marginBottom: 2,
    },
    monthText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
    },
    todayText: {
        color: '#fff',
    },
    classesContainer: {
        flex: 1,
        padding: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
});

import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import {
    Text,
    IconButton,
    ActivityIndicator,
    Button,
    Card,
    Divider,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useTeacherScheduleList } from '../../../../hooks/faculty/useELearning';
import SafeAreaWrapper from '../../../../components/SafeAreaWrapper';
import ScreenHeader from '../../../../components/common/ScreenHeader';
import WeekTimeline from '../../../../components/faculty/WeekTimeline';
import DateStrip from '../../../../components/faculty/DateStrip';
import { getClassColor, formatTime } from './utils';

export default function TimeTable({ navigation }: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState<any | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);

    // Get week dates
    const weekDates = useMemo(() => {
        const dates: Date[] = [];
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, [currentDate]);

    // Get date range for API
    const dateRange = useMemo(() => {
        const startDate = new Date(weekDates[0]);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(weekDates[6]);
        endDate.setHours(23, 59, 59, 999);

        return {
            BDate: startDate.toISOString(),
            EDate: endDate.toISOString(),
        };
    }, [weekDates]);

    // API request
    const requestParams = useMemo(() => {
        if (!user) return null;
        const params = {
            CCode: String(user.CCode || ''),
            AceYear: '2025', // Changed from 2026 to 2025 to match database
            UserID: String(user.UserID || ''),
            BDate: dateRange.BDate,
            EDate: dateRange.EDate,
        };
        console.log('=== API REQUEST PARAMS ===');
        console.log(JSON.stringify(params, null, 2));
        return params;
    }, [user, dateRange]);

    const { schedule, loading, error, refetch } = useTeacherScheduleList(
        requestParams || undefined
    );

    const scheduleList = useMemo(() => {
        if (!schedule || !Array.isArray(schedule)) {
            console.log('No schedule received from API');
            return [];
        }
        console.log('=== SCHEDULE DATA ===');
        console.log('Total classes:', schedule.length);
        if (schedule.length > 0) {
            console.log('Sample class:', {
                date: schedule[0]?.LectureDate,
                paper: schedule[0]?.Paper,
                time: schedule[0]?.ExpectedStartTime
            });
            const uniqueDates = [...new Set(schedule.map(s => s.LectureDate?.split('T')[0]))];
            console.log('Dates with classes:', uniqueDates);
        }
        return schedule;
    }, [schedule]);

    const handleClassPress = useCallback((classItem: any) => {
        setSelectedClass(classItem);
        setShowActionModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowActionModal(false);
        setSelectedClass(null);
    }, []);

    return (
        <SafeAreaWrapper>
            <ScreenHeader
                title="Time Table"
                onBack={() => navigation.goBack()}
            />

            {/* Date Strip Navigation */}
            <DateStrip
                currentDate={currentDate}
                onDateSelected={setCurrentDate}
            />

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1649b2" />
                    <Text style={styles.loadingText}>Loading schedule...</Text>
                </View>
            ) : error ? (
                <Card style={styles.errorCard}>
                    <Card.Content>
                        <Text style={styles.errorText}>{error}</Text>
                        <Button
                            mode="contained"
                            onPress={() => refetch(requestParams!)}
                            style={styles.retryButton}
                        >
                            Retry
                        </Button>
                    </Card.Content>
                </Card>
            ) : (
                <WeekTimeline
                    weekDates={weekDates}
                    scheduleData={scheduleList}
                    onClassPress={handleClassPress}
                    getClassColor={getClassColor}
                    currentDate={currentDate}
                    onDateSwitch={setCurrentDate}
                />
            )}

            {/* Action Modal */}
            <Modal
                visible={showActionModal}
                transparent
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={handleCloseModal}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalHeader}>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.modalTitle} numberOfLines={1}>{selectedClass?.Paper}</Text>
                                <Text style={styles.modalSubtitle}>
                                    {selectedClass?.SectionName ? `Section: ${selectedClass.SectionName} • ` : ''}
                                    {selectedClass && formatTime(selectedClass.ExpectedStartTime)}
                                </Text>
                            </View>
                            <IconButton
                                icon="close"
                                size={24}
                                onPress={handleCloseModal}
                                iconColor="#666"
                                style={styles.closeButton}
                            />
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.modalBody}>
                            <View style={styles.actionGrid}>
                                <TouchableOpacity
                                    style={styles.gridButton}
                                    onPress={() => {
                                        handleCloseModal();
                                        navigation.navigate('Attendance', {
                                            classDetails: selectedClass,
                                        });
                                    }}
                                >
                                    <View style={styles.iconBox}>
                                        <IconButton icon="account-check-outline" size={26} iconColor="#1649b2" />
                                    </View>
                                    <Text style={styles.gridButtonText}>Attendance</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridButton}
                                    onPress={() => {
                                        handleCloseModal();
                                        console.log('Navigate to Home Work');
                                    }}
                                >
                                    <View style={styles.iconBox}>
                                        <IconButton icon="book-open-page-variant-outline" size={26} iconColor="#1649b2" />
                                    </View>
                                    <Text style={styles.gridButtonText}>Home Work</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridButton}
                                    onPress={() => {
                                        handleCloseModal();
                                        console.log('Navigate to Submission');
                                    }}
                                >
                                    <View style={styles.iconBox}>
                                        <IconButton icon="file-document-outline" size={26} iconColor="#1649b2" />
                                    </View>
                                    <Text style={styles.gridButtonText}>Submissions</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridButton}
                                    onPress={() => {
                                        handleCloseModal();
                                        console.log('Navigate to Upload Lecture');
                                    }}
                                >
                                    <View style={styles.iconBox}>
                                        <IconButton icon="video-outline" size={26} iconColor="#1649b2" />
                                    </View>
                                    <Text style={styles.gridButtonText}>Upload Lecture</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    errorCard: {
        margin: 16,
        backgroundColor: '#ffebee',
    },
    errorText: {
        color: '#d32f2f',
        marginBottom: 12,
    },
    retryButton: {
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 380,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    closeButton: {
        margin: 0,
        marginRight: -8,
        backgroundColor: '#f5f5f5',
    },
    divider: {
        backgroundColor: '#f0f0f0',
        height: 1,
    },
    modalBody: {
        padding: 24,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    gridButton: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    gridButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
    },
});

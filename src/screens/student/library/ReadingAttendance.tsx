// screens/student/library/ReadingAttendance.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import {
    ActivityIndicator,
    Card,
    IconButton,
    Text,
    Searchbar,
    Snackbar,
    Divider,
} from 'react-native-paper';

import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import { RootState } from '../../../store/store';
import { useLibrary } from '../../../hooks/student/useLibrary';
import { BookReadingAttendance } from '../../../types/student/Library.types';

/* ---------- Helpers ---------- */
const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : '-';

const buildAttendanceKey = (item: BookReadingAttendance, idx: number) =>
    [
        item.BookReadingRoomID ?? 'noRoom',
        item.URNNO ?? 'noUrn',
        item.ReadingDate ?? 'noDate',
        item.InTime ?? 'noIn',
        item.OutTime ?? 'noOut',
        idx,
    ].join('_');

/* ---------- Screen ---------- */
function ReadingAttendance({ navigation, route }: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const urnno = route?.params?.urnno ?? user?.URNNO;

    const {
        isLoading,
        errorMessage,
        readingRoomStatus,
        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchBookReadingRoomStatus,
        resetLibraryState,
    } = useLibrary();

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    /* ---------- Date range ---------- */
    const BDate = useMemo(
        () => new Date(new Date().getFullYear(), 0, 1).toISOString(),
        [],
    );
    const EDate = useMemo(() => new Date().toISOString(), []);

    /* ---------- Load data ---------- */
    const loadData = useCallback(async () => {
        if (!urnno) return;

        try {
            await fetchMemberInformation({
                URNNO: String(urnno),
                CCode: String(user?.CCode ?? ''),
                MemberTypeID: 1,
                Status: 'GetMemberDetails',
                BDate,
                EDate,
            });

            await fetchStudentIdentityImage(Number(urnno));

            await fetchBookReadingRoomStatus({
                URNNO: String(urnno),
                CCode: String(user?.CCode ?? ''),
                Status: 'GetMemeberBookReadingAttendance',
                BDate,
                EDate,
            });
        } catch {
            setSnackbarVisible(true);
        }
    }, [
        urnno,
        user?.CCode,
        BDate,
        EDate,
        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchBookReadingRoomStatus,
    ]);

    useEffect(() => {
        loadData();
        return () => resetLibraryState();
    }, [loadData, resetLibraryState]);

    /* ---------- Pull to refresh ---------- */
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    /* ---------- Merge & dedupe attendance ---------- */
    const attendanceList = useMemo<BookReadingAttendance[]>(() => {
        if (!readingRoomStatus) return [];

        const all = [
            ...(readingRoomStatus.GetClassReadingAttendent ?? []),
            ...(readingRoomStatus.GetToDayReadingAttendentList ?? []),
            ...(readingRoomStatus.GetPresentStatus ?? []),
        ];

        const map = new Map<string, BookReadingAttendance>();

        all.forEach(item => {
            const key = [
                item.BookReadingRoomID ?? 'noRoom',
                item.URNNO ?? 'noUrn',
                item.ReadingDate ?? 'noDate',
                item.InTime ?? 'noIn',
                item.OutTime ?? 'noOut',
            ].join('_');

            if (!map.has(key)) {
                map.set(key, item);
            }
        });

        return Array.from(map.values());
    }, [readingRoomStatus]);

    /* ---------- Search ---------- */
    const filteredAttendance = useMemo(() => {
        if (!searchQuery) return attendanceList;

        const q = searchQuery.toLowerCase();
        return attendanceList.filter(item =>
            `${item.ClassName ?? ''} ${item.ReadingDate ?? ''} ${
                item.URNNO ?? ''
            }`
                .toLowerCase()
                .includes(q),
        );
    }, [attendanceList, searchQuery]);

    const totalRecords = attendanceList.length;

    /* ---------- Guard ---------- */
    if (!urnno) {
        return (
            <SafeAreaWrapper>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>
                        URNNO not found. Please login again.
                    </Text>
                </View>
            </SafeAreaWrapper>
        );
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        size={22}
                        onPress={navigation.goBack}
                    />
                    <Text style={styles.headerTitle}>Reading Attendance</Text>
                </View>

                {(isLoading || refreshing) && (
                    <View style={styles.loading}>
                        <ActivityIndicator />
                        <Text style={styles.loadingText}>
                            Loading attendance…
                        </Text>
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {/* ================= HERO ================= */}
                    <View style={styles.hero}>
                        <IconButton icon="library" size={36} />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.heroTitle}>
                                Reading Hall Activity
                            </Text>
                            <Text style={styles.heroSub}>
                                Total records: {totalRecords}
                            </Text>
                        </View>
                    </View>

                    {/* ================= SEARCH ================= */}
                    <Searchbar
                        placeholder="Search by class / date / URN"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchBar}
                    />

                    {/* ================= ATTENDANCE LIST ================= */}
                    <Card style={styles.sectionCard}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>
                                Attendance Records
                            </Text>
                            <Divider style={styles.divider} />

                            {filteredAttendance.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    No records to display
                                </Text>
                            ) : (
                                filteredAttendance.map((item, idx) => (
                                    <View
                                        key={buildAttendanceKey(item, idx)}
                                        style={styles.recordBlock}
                                    >
                                        <View style={styles.recordHeader}>
                                            <Text style={styles.recordTitle}>
                                                {item.ClassName ?? '-'}
                                            </Text>
                                            <Text style={styles.recordDate}>
                                                {formatDate(item.ReadingDate)}
                                            </Text>
                                        </View>

                                        <View style={styles.recordRow}>
                                            <Text>
                                                In: {item.InTime ?? '-'}
                                            </Text>
                                            <Text>
                                                Out: {item.OutTime ?? '-'}
                                            </Text>
                                        </View>

                                        <Text style={styles.roomText}>
                                            Room ID:{' '}
                                            {item.BookReadingRoomID ?? '-'}
                                        </Text>

                                        {idx !==
                                            filteredAttendance.length - 1 && (
                                            <Divider
                                                style={styles.subDivider}
                                            />
                                        )}
                                    </View>
                                ))
                            )}
                        </Card.Content>
                    </Card>
                </ScrollView>

                <Snackbar
                    visible={snackbarVisible || !!errorMessage}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3500}
                >
                    {errorMessage || 'Something went wrong'}
                </Snackbar>
            </View>
        </SafeAreaWrapper>
    );
}

export default ReadingAttendance;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#08306b',
    },

    loading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
    },
    loadingText: { fontSize: 13, color: '#555' },

    content: { padding: 12 },

    /* Hero */
    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        elevation: 2,
        marginBottom: 14,
    },
    heroTitle: { fontSize: 17, fontWeight: '700' },
    heroSub: { fontSize: 13, color: '#555', marginTop: 2 },

    /* Search */
    searchBar: {
        marginBottom: 12,
        elevation: 0,
    },

    /* Section */
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    divider: { marginVertical: 8 },
    subDivider: { marginVertical: 12 },

    /* Records */
    recordBlock: { paddingVertical: 8 },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    recordTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0d47a1',
    },
    recordDate: { fontSize: 13, color: '#555' },

    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    roomText: {
        marginTop: 4,
        fontSize: 13,
        color: '#555',
    },

    emptyText: { fontSize: 13, color: '#777' },

    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorText: { color: '#d32f2f' },
});

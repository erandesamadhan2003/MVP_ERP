// screens/student/library/ReadingAttendance.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Image,
} from 'react-native';
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
const toBase64Image = (b64?: string | null) =>
    b64 ? `data:image/jpeg;base64,${b64}` : undefined;

const buildAttendanceKey = (item: BookReadingAttendance, idx: number) =>
    [
        item.BookReadingRoomID ?? 'noRoom',
        item.URNNO ?? 'noUrn',
        item.ReadingDate ?? 'noDate',
        item.InTime ?? 'noIn',
        item.OutTime ?? 'noOut',
        idx,
    ].join('_');

/* ---------- Small reusable row ---------- */
const InfoRow = ({ label, value }: { label: string; value?: any }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value ?? '-'}</Text>
    </View>
);

/* ---------- Screen ---------- */
function ReadingAttendance({ navigation, route }: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const urnno = route?.params?.urnno || user?.URNNO;

    const {
        isLoading,
        errorMessage,
        memberInfo,
        identityImage,
        readingRoomStatus,
        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchBookReadingRoomStatus,
        resetLibraryState,
    } = useLibrary();

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    /* ---------- Date range (API requirement) ---------- */
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

    /* ---------- Merge & deduplicate attendance ---------- */
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
            `${item.ClassName ?? ''} ${item.ReadingDate ?? ''} ${item.URNNO ?? ''}`
                .toLowerCase()
                .includes(q),
        );
    }, [attendanceList, searchQuery]);

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
                    <View style={styles.headerLeft}>
                        <IconButton
                            icon="arrow-left"
                            size={22}
                            onPress={() => navigation.goBack()}
                        />
                        <Text style={styles.title}>Reading Hall</Text>
                    </View>
                    <IconButton
                        icon="refresh"
                        size={22}
                        onPress={onRefresh}
                        disabled={isLoading}
                    />
                </View>

                {(isLoading || refreshing) && (
                    <View style={styles.loading}>
                        <ActivityIndicator />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {/* ================= STUDENT PROFILE ================= */}
                    <Card style={[styles.card, styles.profileCard]}>
                        <Card.Content style={styles.profileContent}>
                            {identityImage?.PHOTO ? (
                                <Image
                                    source={{
                                        uri: toBase64Image(
                                            identityImage.PHOTO,
                                        ),
                                    }}
                                    style={styles.profilePhoto}
                                />
                            ) : (
                                <View style={styles.profilePhotoPlaceholder}>
                                    <Text style={styles.photoPlaceholderText}>
                                        {memberInfo?.FullName?.[0] ?? 'S'}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.profileDetails}>
                                <Text style={styles.profileName}>
                                    {memberInfo?.FullName ??
                                        'Student Name'}
                                </Text>
                                <Text style={styles.profileMeta}>
                                    URNNO: {memberInfo?.URNNO ?? urnno}
                                </Text>
                                <Text style={styles.profileMeta}>
                                    {memberInfo?.ClassName ??
                                        'Course / Class'}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* ================= ATTENDANCE ================= */}
                    <Card style={[styles.card, styles.cardSpacing]}>
                        <Card.Content>
                            <Text style={styles.sectionTitleAlt}>
                                Reading Attendance
                            </Text>

                            <Searchbar
                                placeholder="Search by class / date / URN"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchBar}
                            />

                            {filteredAttendance.length === 0 ? (
                                <View style={styles.empty}>
                                    <Text>No records to display</Text>
                                </View>
                            ) : (
                                filteredAttendance.map((item, idx) => {
                                    const key = buildAttendanceKey(
                                        item,
                                        idx,
                                    );
                                    const isSelected =
                                        selectedId === key;

                                    return (
                                        <Card
                                            key={key}
                                            style={[
                                                styles.recordCard,
                                                isSelected &&
                                                    styles.selectedCard,
                                            ]}
                                            onPress={() =>
                                                setSelectedId(key)
                                            }
                                        >
                                            <Card.Content>
                                                <View
                                                    style={
                                                        styles.cardHeader
                                                    }
                                                >
                                                    <View>
                                                        <Text
                                                            style={
                                                                styles.recordTitle
                                                            }
                                                        >
                                                            {item.URNNO} –{' '}
                                                            {item.ClassName ??
                                                                '-'}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.recordSub
                                                            }
                                                        >
                                                            {item.ReadingDate
                                                                ? new Date(
                                                                      item.ReadingDate,
                                                                  ).toLocaleDateString()
                                                                : '-'}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={{
                                                            alignItems:
                                                                'flex-end',
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.timeText
                                                            }
                                                        >
                                                            In:{' '}
                                                            {item.InTime ??
                                                                '-'}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.timeText
                                                            }
                                                        >
                                                            Out:{' '}
                                                            {item.OutTime ??
                                                                '-'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Divider
                                                    style={
                                                        styles.divider
                                                    }
                                                />

                                                <InfoRow
                                                    label="Room ID"
                                                    value={
                                                        item.BookReadingRoomID ??
                                                        '-'
                                                    }
                                                />
                                            </Card.Content>
                                        </Card>
                                    );
                                })
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

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: '700', color: '#08306b' },

    loading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    loadingText: { fontSize: 13, color: '#555' },

    card: { backgroundColor: '#fff', elevation: 2 },
    cardSpacing: { marginTop: 16 },

    /* Profile */
    profileCard: { borderRadius: 12, marginBottom: 12 },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePhoto: {
        width: 72,
        height: 96,
        borderRadius: 8,
        marginRight: 14,
    },
    profilePhotoPlaceholder: {
        width: 72,
        height: 96,
        borderRadius: 8,
        backgroundColor: '#5e35b1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    photoPlaceholderText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '700',
    },
    profileDetails: { flex: 1 },
    profileName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#08306b',
        marginBottom: 4,
    },
    profileMeta: {
        fontSize: 13,
        color: '#555',
        marginBottom: 2,
    },

    /* Attendance */
    sectionTitleAlt: {
        fontSize: 15,
        fontWeight: '700',
        color: '#8B0000',
        marginBottom: 12,
    },
    searchBar: { marginBottom: 12, elevation: 0 },

    recordCard: {
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#1976d2',
        backgroundColor: '#e3f2fd',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    recordTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0d47a1',
    },
    recordSub: { fontSize: 13, color: '#555' },
    timeText: { fontSize: 13, color: '#333' },

    divider: { marginVertical: 8 },

    infoRow: { flexDirection: 'row', marginBottom: 4 },
    label: {
        width: 80,
        fontSize: 13,
        color: '#555',
        fontWeight: '600',
    },
    value: { flex: 1, fontSize: 13, color: '#111' },

    empty: { padding: 16, alignItems: 'center' },

    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorText: { color: '#d32f2f' },
});

export default ReadingAttendance;

// screens/student/library/LibraryClearance.tsx
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import {
    ActivityIndicator,
    IconButton,
    Text,
    Divider,
    Card,
} from 'react-native-paper';

import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import { RootState } from '../../../store/store';
import { useLibrary } from '../../../hooks/student/useLibrary';

/* ---------- Helpers ---------- */
const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : '-';

function LibraryClearance({ navigation, route }: any) {
    const user = useSelector((state: RootState) => state.auth.user);

    const urnno = route?.params?.urnno ?? user?.URNNO;
    const ccode = route?.params?.CCode ?? user?.CCode ?? '';

    const {
        isLoading,
        errorMessage,
        issuedBooks,
        admissionInfo,
        feeDues,
        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchLibraryClearance,
        resetLibraryState,
    } = useLibrary();

    const loadData = useCallback(async () => {
        if (!urnno) return;

        await Promise.all([
            fetchMemberInformation({
                URNNO: String(urnno),
                CCode: String(ccode),
                MemberTypeID: 1,
                Status: 'GetMemberDetails',
                BDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
                EDate: new Date().toISOString(),
            }).catch(() => null),

            fetchStudentIdentityImage(Number(urnno)).catch(() => null),

            fetchLibraryClearance(urnno, ccode).catch(() => null),
        ]);
    }, [
        urnno,
        ccode,
        fetchMemberInformation,
        fetchStudentIdentityImage,
        fetchLibraryClearance,
    ]);

    useEffect(() => {
        loadData();
        return () => resetLibraryState();
    }, [loadData, resetLibraryState]);

    /* ---------- Derived state ---------- */
    const dues = Number(feeDues?.Dues ?? 0);
    const paid = Number(feeDues?.PaidFee ?? 0);
    const total = Number(feeDues?.Fees ?? 0);

    const issuedCount = issuedBooks?.length ?? 0;
    const hasIssues = dues > 0 || issuedCount > 0;

    const admission = admissionInfo?.[0];

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
                    <Text style={styles.headerTitle}>Library Clearance</Text>
                </View>

                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator />
                        <Text style={styles.loadingText}>
                            Loading clearance...
                        </Text>
                    </View>
                )}

                <ScrollView contentContainerStyle={styles.content}>
                    {/* ================= HERO STATUS ================= */}
                    <View
                        style={[
                            styles.hero,
                            hasIssues ? styles.heroWarn : styles.heroOk,
                        ]}
                    >
                        <IconButton
                            icon={
                                hasIssues
                                    ? 'alert-circle-outline'
                                    : 'check-circle-outline'
                            }
                            size={36}
                            iconColor={hasIssues ? '#ef6c00' : '#2e7d32'}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroTitle}>
                                {hasIssues
                                    ? 'Clearance Pending'
                                    : 'Clearance Completed'}
                            </Text>
                            <Text style={styles.heroSub}>
                                {hasIssues
                                    ? 'Action required before library clearance'
                                    : 'No pending library obligations'}
                            </Text>
                        </View>
                    </View>

                    {/* ================= SIGNAL CARDS ================= */}
                    <View style={styles.signalRow}>
                        <View style={styles.signalCard}>
                            <IconButton
                                icon="currency-inr"
                                size={24}
                                iconColor="#c62828"
                            />
                            <Text style={styles.signalLabel}>Outstanding</Text>
                            <Text style={styles.signalValue}>₹ {dues}</Text>
                        </View>

                        <View style={styles.signalCard}>
                            <IconButton
                                icon="book-open-page-variant"
                                size={24}
                                iconColor="#1565c0"
                            />
                            <Text style={styles.signalLabel}>Issued Books</Text>
                            <Text style={styles.signalValue}>
                                {issuedCount}
                            </Text>
                        </View>
                    </View>

                    {/* ================= ISSUED BOOKS ================= */}
                    <Card style={styles.sectionCard}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>
                                Issued Books
                            </Text>
                            <Divider style={styles.divider} />

                            {issuedCount > 0 ? (
                                issuedBooks.map((b, i) => (
                                    <View key={i} style={styles.bookBlock}>
                                        <Text style={styles.bookTitle}>
                                            {b.BTitle}
                                        </Text>

                                        <Text style={styles.bookDue}>
                                            Due on {formatDate(b.ExpDOR)}
                                        </Text>

                                        <View style={styles.bookMetaRow}>
                                            <Text>
                                                Register: {b.CatlogName}
                                            </Text>
                                            <Text>
                                                Accession: {b.AccessionNo}
                                            </Text>
                                        </View>

                                        <View style={styles.bookMetaRow}>
                                            <Text>Author: {b.Author}</Text>
                                            <Text>Price: ₹ {b.Price}</Text>
                                        </View>

                                        {i !== issuedCount - 1 && (
                                            <Divider
                                                style={styles.subDivider}
                                            />
                                        )}
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>
                                    No issued books
                                </Text>
                            )}
                        </Card.Content>
                    </Card>

                    {/* ================= FEE SUMMARY ================= */}
                    <Card style={styles.sectionCard}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>Fee Summary</Text>
                            <Divider style={styles.divider} />

                            <View style={styles.feeHero}>
                                <Text style={styles.feeHeroLabel}>
                                    Outstanding Amount
                                </Text>
                                <Text style={styles.feeHeroValue}>
                                    ₹ {dues}
                                </Text>
                            </View>

                            <View style={styles.feeRow}>
                                <Text>Paid</Text>
                                <Text>₹ {paid}</Text>
                            </View>

                            <View style={styles.feeRow}>
                                <Text>Total</Text>
                                <Text>₹ {total}</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* ================= ADMISSION ================= */}
                    <Card style={styles.sectionCard}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>
                                Academic Context
                            </Text>
                            <Divider style={styles.divider} />

                            <Text>Class: {admission?.ClassName ?? '-'}</Text>
                            <Text>
                                Registration Date:{' '}
                                {formatDate(admission?.TDATE)}
                            </Text>
                        </Card.Content>
                    </Card>

                    {errorMessage && (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaWrapper>
    );
}

export default LibraryClearance;

/* ================= STYLES ================= */
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

    loading: { flexDirection: 'row', gap: 8, padding: 12 },
    loadingText: { fontSize: 13 },

    content: { padding: 12 },

    /* Hero */
    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        elevation: 2,
    },
    heroWarn: {
        backgroundColor: '#fff3e0',
    },
    heroOk: {
        backgroundColor: '#e8f5e9',
    },
    heroTitle: { fontSize: 17, fontWeight: '700' },
    heroSub: { fontSize: 13, color: '#555', marginTop: 2 },

    /* Signals */
    signalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    signalCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 4,
    },
    signalLabel: { fontSize: 13, color: '#555' },
    signalValue: { fontSize: 18, fontWeight: '700' },

    /* Sections */
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    divider: { marginVertical: 8 },
    subDivider: { marginVertical: 12 },

    /* Books */
    bookBlock: { paddingVertical: 8 },
    bookTitle: { fontSize: 15, fontWeight: '600' },
    bookDue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#c62828',
        marginTop: 2,
    },
    bookMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },

    /* Fees */
    feeHero: {
        alignItems: 'center',
        marginVertical: 10,
    },
    feeHeroLabel: { fontSize: 13, color: '#555' },
    feeHeroValue: { fontSize: 22, fontWeight: '700' },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },

    emptyText: { fontSize: 13, color: '#777' },
    errorText: { color: '#d32f2f', padding: 8 },
});

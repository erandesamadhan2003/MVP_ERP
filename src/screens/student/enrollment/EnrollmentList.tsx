import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    IconButton,
    Snackbar,
    Text,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import { useEnrollmentList } from '../../../hooks/student/useEnrollment';
import {
    PrintStudentMeritForm,
    RemoveEnrollmentForm,
} from '../../../api/services/student/enrollement';
import {
    openPdfFromBlob,
    buildPrintPayload,
    requestStoragePermission,
} from './utils/enrollmentListHelpers';

function EnrollmentList({ navigation }: any) {
    const user = useSelector((state: RootState) => state.auth.user);

    const registrationId = user?.URNNO;
    const applicationToken = 'AdmissionStudent';

    const { enrollments, loading, error, refetch } = useEnrollmentList(
        registrationId,
        applicationToken,
    );

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const selectedEnrollment = useMemo(
        () => enrollments.find((e: any) => e.MeritEnrollMentID === selectedId),
        [enrollments, selectedId],
    );

    const showMessage = useCallback((msg: string) => {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
    }, []);

    const handleRefresh = useCallback(() => {
        if (registrationId && applicationToken) {
            refetch(registrationId, applicationToken);
        }
    }, [refetch, registrationId, applicationToken]);

    const handlePrint = useCallback(async () => {
        if (!selectedEnrollment) {
            showMessage('Please select an enrollment to print.');
            return;
        }

        try {
            setActionLoading(true);

            // Request storage permission
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                showMessage('Storage permission is required to save PDF');
                return;
            }

            // Build payload and get PDF
            const payload = buildPrintPayload(selectedEnrollment);
            const base64Pdf = await PrintStudentMeritForm(payload);

            // Save PDF to device
            await openPdfFromBlob(base64Pdf);

            showMessage('PDF saved successfully to Downloads folder');
        } catch (err: any) {
            showMessage(err?.message || 'Failed to save merit form');
        } finally {
            setActionLoading(false);
        }
    }, [selectedEnrollment, showMessage]);

    const confirmDelete = useCallback(() => {
        if (!selectedEnrollment) {
            showMessage('Please select an enrollment to remove.');
            return;
        }

        Alert.alert(
            'Confirm Removal',
            'Are you sure you want to remove this enrollment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            const res = await RemoveEnrollmentForm(
                                selectedEnrollment.MeritEnrollMentID,
                                selectedEnrollment.MeritFormStatusId,
                            );

                            if (res?.ResponseCode === 1) {
                                showMessage('Enrollment removed successfully');
                                setSelectedId(null);
                                handleRefresh();
                            } else {
                                showMessage(
                                    res?.Message ||
                                        'Failed to remove enrollment',
                                );
                            }
                        } catch (err: any) {
                            showMessage(
                                err?.message || 'Failed to remove enrollment',
                            );
                        } finally {
                            setActionLoading(false);
                        }
                    },
                },
            ],
        );
    }, [selectedEnrollment, handleRefresh, showMessage]);

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
                        <Text style={styles.title}>Enrollment List</Text>
                    </View>
                    <IconButton
                        icon="refresh"
                        size={22}
                        onPress={handleRefresh}
                        disabled={loading || actionLoading}
                    />
                </View>

                {(loading || actionLoading) && (
                    <View style={styles.loading}>
                        <ActivityIndicator />
                    </View>
                )}

                {/* Enrollment Cards */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {enrollments.map((item: any) => {
                        const isSelected =
                            item.MeritEnrollMentID === selectedId;

                        return (
                            <Card
                                key={item.MeritEnrollMentID}
                                style={[
                                    styles.card,
                                    isSelected && styles.selectedCard,
                                ]}
                                onPress={() =>
                                    setSelectedId(item.MeritEnrollMentID)
                                }
                            >
                                <Card.Content>
                                    {/* Top row */}
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.enrollNo}>
                                            {item.EnrollMentNo}
                                        </Text>
                                        <Text style={styles.date}>
                                            {item.EnrollMentDate
                                                ? new Date(
                                                      item.EnrollMentDate,
                                                  ).toLocaleDateString()
                                                : ''}
                                        </Text>
                                    </View>

                                    <Divider style={styles.divider} />

                                    <InfoRow
                                        label="Institute"
                                        value={item.InstituteName}
                                    />
                                    <InfoRow
                                        label="Section"
                                        value={item.SectionName}
                                    />
                                    <InfoRow
                                        label="Class"
                                        value={item.ClassName}
                                    />
                                    <InfoRow
                                        label="Status"
                                        value={item.MeritFormStatus}
                                    />

                                    {item.Remark ? (
                                        <InfoRow
                                            label="Remark"
                                            value={item.Remark}
                                        />
                                    ) : null}
                                </Card.Content>
                            </Card>
                        );
                    })}
                </ScrollView>

                {/* Action Buttons - visible only when one is selected */}
                {selectedEnrollment && (
                    <View style={styles.actions}>
                        <Button
                            mode="contained"
                            icon="printer"
                            onPress={handlePrint}
                            disabled={actionLoading}
                            style={styles.printBtn}
                        >
                            Print
                        </Button>

                        <Button
                            mode="outlined"
                            icon="delete"
                            onPress={confirmDelete}
                            disabled={actionLoading}
                            textColor="#e53935"
                        >
                            Delete
                        </Button>
                    </View>
                )}

                <Snackbar
                    visible={snackbarVisible || !!error}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={4000}
                >
                    {snackbarMessage || error}
                </Snackbar>
            </View>
        </SafeAreaWrapper>
    );
}

/* ---------- Small reusable row ---------- */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export default EnrollmentList;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#08306b',
    },
    loading: {
        paddingVertical: 8,
    },
    card: {
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
    },
    enrollNo: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0d47a1',
    },
    date: {
        fontSize: 13,
        color: '#555',
    },
    divider: {
        marginVertical: 6,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: 80,
        fontSize: 13,
        color: '#555',
        fontWeight: '600',
    },
    value: {
        flex: 1,
        fontSize: 13,
        color: '#111',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
    },
    printBtn: {
        backgroundColor: '#5e35b1',
    },
});

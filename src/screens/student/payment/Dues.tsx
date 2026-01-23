import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    Snackbar,
    Text,
} from 'react-native-paper';
import { useSelector } from 'react-redux';

import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import InfoRow from '../../../components/student/Payment/InfoRow';
import { RootState } from '../../../store/store';
import { useURNDuesForPayment } from '../../../hooks/student/usePayment';

function Dues({ navigation }: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    const urnNo = user?.URNNO ? String(user.URNNO) : '';

    const { data, loading, error } = useURNDuesForPayment(urnNo);

    const duesList = useMemo(() => data?.ResponseData || [], [data]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectedDues =
        selectedIndex !== null ? duesList[selectedIndex] : null;

    const handleProceed = useCallback(() => {
        if (!selectedDues) return;
        navigation.navigate('PaymentConfirmation', { dues: selectedDues });
    }, [selectedDues, navigation]);

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <ScreenHeader
                    title="Dues Payment"
                    onBack={() => navigation.goBack()}
                />

                {loading && <ActivityIndicator />}

                <ScrollView>
                    {duesList.length === 0 && !loading ? (
                        <Text style={styles.empty}>No dues found.</Text>
                    ) : (
                        duesList.map((item: any, idx: number) => (
                            <Card
                                key={idx}
                                style={[
                                    styles.card,
                                    idx === selectedIndex &&
                                        styles.selectedCard,
                                ]}
                                onPress={() => setSelectedIndex(idx)}
                            >
                                <Card.Content>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.urn}>
                                            URN: {item.URNNO}
                                        </Text>
                                        <Text>{item.AceYear}</Text>
                                    </View>

                                    <Divider style={styles.divider} />

                                    <InfoRow
                                        label="Student"
                                        value={item.TName}
                                    />
                                    <InfoRow
                                        label="Class"
                                        value={item.ClassName}
                                    />
                                    <InfoRow
                                        label="Gender"
                                        value={item.Gender}
                                    />
                                    <InfoRow
                                        label="Total Fee"
                                        value={`₹ ${item.Fees}`}
                                    />
                                    <InfoRow
                                        label="Paid"
                                        value={`₹ ${item.PaidFee}`}
                                    />
                                    <InfoRow
                                        label="Dues"
                                        value={`₹ ${item.Dues}`}
                                        highlight
                                    />
                                </Card.Content>
                            </Card>
                        ))
                    )}
                </ScrollView>

                {selectedDues && (
                    <View style={styles.actions}>
                        <Button mode="contained" onPress={handleProceed}>
                            Proceed
                        </Button>
                    </View>
                )}

                <Snackbar visible={!!error} onDismiss={() => {}}>
                    {error}
                </Snackbar>
            </View>
        </SafeAreaWrapper>
    );
}

export default Dues;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
    card: { marginBottom: 10, borderRadius: 10 },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#1976d2',
        backgroundColor: '#e3f2fd',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    urn: { fontWeight: '700', color: '#0d47a1' },
    divider: { marginVertical: 6 },
    actions: { alignItems: 'flex-end', marginTop: 8 },
    empty: { textAlign: 'center', marginTop: 20 },
});

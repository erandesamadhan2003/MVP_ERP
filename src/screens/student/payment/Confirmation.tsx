import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Linking,
    Alert,
    Text,
} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Checkbox,
    Divider,
    Snackbar,
} from 'react-native-paper';

import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import InfoRow from '../../../components/student/Payment/InfoRow';
import {
    useStudentPaymentPreview,
    useBankIAgreeFiles,
} from '../../../hooks/student/usePayment';
import {
    getPaymentBankInformation,
} from '../../../api/services/student/payment';
import { openPdfViewer } from '../../../utils/constant';
import {
    buildPaymentPreviewPayload,
    getDuesSummaryRows,
    getFeeRows,
} from './utils/paymentHelpers';

function Confirmation({ route, navigation }: any) {
    const { dues } = route.params;

    const [initializing, setInitializing] = useState(true);
    const [agree, setAgree] = useState(false);
    const [bankInfo, setBankInfo] = useState<any>(null);
    const [snackbar, setSnackbar] = useState('');

    const { fetchPreview, data: previewData } = useStudentPaymentPreview();
    const { fetchIAgreePdf } = useBankIAgreeFiles();

    const previewPayload = useMemo(
        () => buildPaymentPreviewPayload(dues),
        [dues],
    );

    const openTerms = async () => {
        try {
            await openPdfViewer(
                navigation,
                {
                    type: 'api',
                    endpoint: '/Admission/AdmissionPaymentGateway/GetbankIAgreeFiles',
                    method: 'POST',
                    payload: { MerchentPaymentSettingsID: bankInfo.MerchentPaymentSettingsID },
                },
                'Terms & Conditions'
            );
        } catch (e: any) {
            setSnackbar(e?.message || 'Unable to load Terms & Conditions');
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                await fetchPreview(previewPayload);
                const bankRes = await getPaymentBankInformation(
                    String(dues.CCODE),
                    dues.AidedTypeID,
                    dues.SectionID,
                );
                setBankInfo(bankRes?.ResponseData);
            } catch (err: any) {
                setSnackbar(err?.message || 'Payment init failed');
            } finally {
                setInitializing(false);
            }
        };

        init();
    }, [fetchPreview, previewPayload, dues]);

    // inside Confirmation.tsx

    const proceed = async () => {
        if (!agree) {
            setSnackbar('Please agree to Terms & Conditions.');
            return;
        }

        const enc = previewData?.ResponseData?.EncryptionRequest;
        const access = previewData?.ResponseData?.AccessCode;
        const checkoutUrl = previewData?.ResponseData?.CheckoutUrl;

        if (!enc || !access || !checkoutUrl) {
            setSnackbar('Payment initialization incomplete.');
            return;
        }

        // bankInfo contains success/failure URLs
        const successUrl = bankInfo?.PaymentSucessfullURL ?? null;
        const failureUrl = bankInfo?.PaymentFailedURL ?? null;
        console.log('Props passed to PaymentWebView:', {
            encRequest: enc,
            accessCode: access,
            checkoutUrl,
            successUrl,
            failureUrl,
        });
        navigation.navigate('PaymentWebView', {
            encRequest: enc,
            accessCode: access,
            checkoutUrl,
            successUrl,
            failureUrl,
        });
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <ScreenHeader
                    title="Payment Confirmation"
                    onBack={() => navigation.goBack()}
                />

                {initializing && <ActivityIndicator />}

                <ScrollView>
                    <Card style={styles.card}>
                        <Card.Content>
                            {getDuesSummaryRows(dues).map(([label, value]) => (
                                <InfoRow
                                    key={label}
                                    label={label}
                                    value={String(value)}
                                />
                            ))}

                            <Divider style={styles.divider} />

                            {getFeeRows(dues).map(([label, value, h]) => (
                                <InfoRow
                                    key={label}
                                    label={label}
                                    value={value as string}
                                    highlight={!!h}
                                />
                            ))}
                        </Card.Content>
                    </Card>

                    {bankInfo && (
                        <Card style={styles.card}>
                            <Card.Content>
                                <InfoRow
                                    label="Payment Gateway"
                                    value={bankInfo.PaymentGatewayName}
                                />
                                <InfoRow
                                    label="Bank"
                                    value={bankInfo.BankName || '—'}
                                />
                            </Card.Content>
                        </Card>
                    )}

                    <View style={styles.agree}>
                        <Checkbox
                            status={agree ? 'checked' : 'unchecked'}
                            onPress={() => setAgree(!agree)}
                        />
                        <Text>
                            I agree to{' '}
                            <Text style={styles.link} onPress={openTerms}>
                                Terms & Conditions
                            </Text>
                        </Text>
                    </View>

                    <Button mode="contained" onPress={proceed}>
                        Proceed to Payment
                    </Button>
                </ScrollView>

                <Snackbar
                    visible={!!snackbar}
                    onDismiss={() => setSnackbar('')}
                >
                    {snackbar}
                </Snackbar>
            </View>
        </SafeAreaWrapper>
    );
}

export default Confirmation;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
    card: { marginBottom: 10, borderRadius: 10 },
    divider: { marginVertical: 6 },
    agree: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    link: {
        color: '#1e88e5',
        textDecorationLine: 'underline',
    },
});

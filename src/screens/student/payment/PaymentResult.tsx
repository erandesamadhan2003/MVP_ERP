// screens/student/payment/PaymentResult.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';

function PaymentResult({ route, navigation }: any) {
    const { status, url } = route.params;

    const isSuccess = status === 'success';

    useEffect(() => {
        // OPTIONAL:
        // Call backend to confirm transaction status using url / query params
        // This is where real verification happens in production
    }, [status, url]);

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {isSuccess ? 'Payment Successful 🎉' : 'Payment Failed ❌'}
                </Text>

                <Text style={styles.message}>
                    {isSuccess
                        ? 'Your payment has been completed successfully.'
                        : 'Your payment could not be completed.'}
                </Text>

                <Button
                    mode="contained"
                    onPress={() => navigation.popToTop()}
                >
                    Go to Dashboard
                </Button>
            </View>
        </SafeAreaWrapper>
    );
}

export default PaymentResult;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
    },
    message: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
});

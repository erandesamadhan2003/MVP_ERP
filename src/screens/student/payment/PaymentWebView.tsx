// screens/student/payment/PaymentWebView.tsx
import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { IconButton, Text } from 'react-native-paper';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';

/** Escape string for safe insertion into HTML attribute / JS string */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function PaymentWebView({ route, navigation }: any) {
  // required params passed from Confirmation screen
  // encRequest: string, accessCode: string, checkoutUrl: string,
  // successUrl?: string, failureUrl?: string
  const { encRequest, accessCode, checkoutUrl, successUrl, failureUrl } = route.params ?? {};

  const html = useMemo(() => {
    // escape values to avoid breaking the html string
    const encEsc = escapeHtml(String(encRequest ?? ''));
    const accessEsc = escapeHtml(String(accessCode ?? ''));

    // form posts encRequest & access_code to CheckoutUrl and auto-submits
    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
        </head>
        <body>
          <form id="payform" method="post" action="${checkoutUrl}">
            <input type="hidden" name="encRequest" value="${encEsc}" />
            <input type="hidden" name="access_code" value="${accessEsc}" />
          </form>
          <script>
            // Auto-submit the form right away
            (function(){
              try {
                document.getElementById('payform').submit();
              } catch(e){
                // in case something goes wrong, send message to RN wrapper
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: e && e.toString() }));
              }
            })();
          </script>
        </body>
      </html>
    `;
  }, [encRequest, accessCode, checkoutUrl]);

  const onNavigationStateChange = useCallback(
    (navState: any) => {
      const { url } = navState;

      if (!url) return;

      // if gateway redirects to successUrl or failureUrl, handle it
      if (successUrl && url.startsWith(successUrl)) {
        // optionally extract query/body from url
        navigation.replace('PaymentResult', { status: 'success', url });
        return;
      }
      if (failureUrl && url.startsWith(failureUrl)) {
        navigation.replace('PaymentResult', { status: 'failure', url });
        return;
      }
      // Some gateways send callback to your backend - you may want to detect that too.
    },
    [navigation, successUrl, failureUrl],
  );

  const onMessage = useCallback((event: any) => {
    // messages from the page (rare)
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'error') {
        Alert.alert('Payment Error', data?.message || 'Unknown error from payment page');
      }
    } catch (e) {
      // ignore non-json messages
    }
  }, []);

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={22} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Secure Payment</Text>
      </View>

      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
        // optional: allow mixed-content for some gateways
        mixedContentMode="always"
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 },
});

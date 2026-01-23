// screens/common/PdfViewer.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

function PdfViewer({ navigation, route }: any) {
  const { base64, title } = route.params ?? {};
  const [fileUri, setFileUri] = useState<string | null>(null);

  useEffect(() => {
    if (!base64 || base64.length < 1000) {
      Alert.alert('Error', 'Invalid PDF data');
      navigation.goBack();
      return;
    }

    (async () => {
      try {
        const path = `${RNFS.CachesDirectoryPath}/library_clearance.pdf`;
        await RNFS.writeFile(path, base64, 'base64');
        setFileUri(`file://${path}`);
      } catch {
        Alert.alert('Error', 'Failed to load PDF');
        navigation.goBack();
      }
    })();
  }, [base64, navigation]);

  const openExternally = async () => {
    if (!fileUri) return;

    try {
      await Share.open({
        url: fileUri,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch {
      Alert.alert(
        'PDF Error',
        'No PDF viewer found. Please install Google PDF Viewer or Adobe Reader.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={title ?? 'PDF'} />
        <Appbar.Action icon="share-variant" onPress={openExternally} />
      </Appbar.Header>

      {!fileUri ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <WebView
          source={{ uri: fileUri }}
          originWhitelist={['*']}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator />
            </View>
          )}
          onError={openExternally}
        />
      )}
    </View>
  );
}

export default PdfViewer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

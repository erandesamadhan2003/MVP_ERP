import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { IconButton, Text, ActivityIndicator } from 'react-native-paper';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import SafeAreaWrapper from '../SafeAreaWrapper';
import { generatePdfViewerHtml } from '../../utils/constant';

export default function PdfWebView({ route, navigation }: any) {
  const { pdfBase64, title = 'PDF Viewer' } = route.params || {};
  const [sharing, setSharing] = useState(false);
  
  const htmlContent = useMemo(() => {
    if (!pdfBase64) {
      return `
        <html>
          <body style="background: #525252; color: white; padding: 20px; text-align: center;">
            <p>No PDF data provided. Please use the openPdfViewer utility function.</p>
          </body>
        </html>
      `;
    }
    return generatePdfViewerHtml(pdfBase64);
  }, [pdfBase64]);

  const handleShare = async () => {
    if (!pdfBase64) {
      Alert.alert('Error', 'No PDF data available to share');
      return;
    }

    try {
      setSharing(true);
      
      // Generate filename from title or use default
      const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document';
      const timestamp = Date.now();
      const fileName = `${sanitizedTitle}_${timestamp}.pdf`;
      
      // Save to cache directory first
      const cachePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      await RNFS.writeFile(cachePath, pdfBase64, 'base64');
      
      const fileUri = `file://${cachePath}`;

      await Share.open({
        url: fileUri,
        type: 'application/pdf',
        filename: fileName,
        title: `Share ${title}`,
        subject: title,
        failOnCancel: false,
      });
    } catch (error: any) {
      // Share.open throws an error if user cancels, which is fine
      if (error?.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert(
          'Share Failed',
          error?.message || 'Failed to share PDF. Please try again.'
        );
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {sharing ? (
          <ActivityIndicator size="small" style={styles.actionButton} />
        ) : (
          <IconButton
            icon="share-variant"
            iconColor="#000000"
            size={24}
            onPress={handleShare}
            style={styles.actionButton}
          />
        )}
      </View>
      <WebView
        source={{ html: htmlContent }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
        }}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    flex: 1,
  },
  actionButton: {
    margin: 0,
  },
  webview: {
    flex: 1,
    backgroundColor: '#525252',
  },
});


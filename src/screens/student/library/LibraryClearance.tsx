// screens/student/library/LibraryClearance.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ActivityIndicator,
  IconButton,
  Text,
  Divider,
  Card,
  Button,
} from 'react-native-paper';

import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import { RootState } from '../../../store/store';
import { useLibrary } from '../../../hooks/student/useLibrary';
import { openPdfViewer } from '../../../utils/constant';

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
    fetchClearanceCertificate,
    resetLibraryState,
  } = useLibrary();

  const [printing, setPrinting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  /* ---------- Load data ---------- */
  const loadData = useCallback(async (isRetry = false) => {
    if (!urnno) {
      setLoadError('URNNO is missing. Please login again.');
      return;
    }

    if (isRetry) {
      setRetrying(true);
    }
    setLoadError(null);

    try {
      const results = await Promise.allSettled([
        fetchMemberInformation({
          URNNO: String(urnno),
          CCode: String(ccode),
          MemberTypeID: 1,
          Status: 'GetMemberDetails',
          BDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
          EDate: new Date().toISOString(),
        }),

        fetchStudentIdentityImage(Number(urnno)),

        fetchLibraryClearance(urnno, ccode),
      ]);

      // Check for errors and log them
      const errors: string[] = [];
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const error = result.reason;
          const errorName = ['Member Information', 'Identity Image', 'Library Clearance'][index];
          console.warn(`Failed to load ${errorName}:`, {
            error: error?.message || error,
            code: error?.code,
            type: error?.name,
          });
          
          if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
            errors.push(`Network error loading ${errorName.toLowerCase()}`);
          } else {
            errors.push(`Failed to load ${errorName.toLowerCase()}`);
          }
        }
      });

      // If all requests failed, show error
      if (errors.length === results.length) {
        setLoadError(
          errors.length > 1
            ? 'Failed to load library data. Please check your connection and try again.'
            : errors[0]
        );
      } else if (errors.length > 0) {
        // Some succeeded, some failed - log but don't block UI
        console.warn('Partial data loaded. Some requests failed:', errors);
      }
    } catch (error: any) {
      console.error('Unexpected error loading library data:', error);
      setLoadError(
        error?.code === 'ERR_NETWORK' || error?.message === 'Network Error'
          ? 'Network connection failed. Please check your internet connection.'
          : 'Failed to load library data. Please try again.'
      );
    } finally {
      setRetrying(false);
    }
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

  /* ---------- Derived ---------- */
  const dues = Number(feeDues?.Dues ?? 0);
  const paid = Number(feeDues?.PaidFee ?? 0);
  const total = Number(feeDues?.Fees ?? 0);

  const issuedCount = issuedBooks?.length ?? 0;
  const hasIssues = dues > 0 || issuedCount > 0;
  const admission = admissionInfo?.[0];
  
  // Check if data has been loaded (not just empty, but actually loaded)
  const dataLoaded = !isLoading && (feeDues !== null || issuedBooks.length > 0 || admissionInfo.length > 0 || loadError !== null);

  /* ---------- Print ---------- */
  const onPrint = async () => {
    if (!urnno) return;

    try {
      setPrinting(true);

      const base64Pdf = await fetchClearanceCertificate({
        URNNO: urnno,
        MEMBERNO: urnno,
        CCode: ccode,
        MemberTypeID: 1,
        Status: 'GetLibraryMemberDetails',
        BDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
        EDate: new Date().toISOString(),
      });

      if (!base64Pdf || base64Pdf.length < 1000) {
        throw new Error('Invalid PDF data received');
      }

      await openPdfViewer(
        navigation,
        {
          type: 'base64',
          base64: base64Pdf,
        },
        'Library Clearance Certificate'
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to load clearance certificate. Please try again.',
      );
    } finally {
      setPrinting(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={22} onPress={navigation.goBack} />
          <Text style={styles.headerTitle}>Library Clearance</Text>
        </View>

        {(isLoading || retrying) && (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>
              {retrying ? 'Retrying…' : 'Loading clearance…'}
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.content}>
          {/* Error Message */}
          {(loadError || errorMessage) && (
            <Card style={[styles.sectionCard, styles.errorCard]}>
              <Card.Content>
                <Text style={styles.errorTitle}>⚠️ Error Loading Data</Text>
                <Text style={styles.errorMessageText}>
                  {loadError || errorMessage}
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => loadData(true)}
                  style={styles.retryButton}
                  disabled={isLoading || retrying}
                >
                  {retrying ? 'Retrying...' : 'Retry'}
                </Button>
              </Card.Content>
            </Card>
          )}
          {/* Status */}
          {dataLoaded && (
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
                  {hasIssues ? 'Clearance Pending' : 'Clearance Completed'}
                </Text>
                <Text style={styles.heroSub}>
                  {hasIssues
                    ? 'Resolve pending dues or return books'
                    : 'No pending library obligations'}
                </Text>
              </View>
            </View>
          )}

          {/* Highlights */}
          <View style={styles.signalRow}>
            <View style={styles.signalCard}>
              <Text style={styles.signalLabel}>Outstanding</Text>
              <Text style={[styles.signalValue, { color: '#c62828' }]}>
                ₹ {dues}
              </Text>
            </View>

            <View style={styles.signalCard}>
              <Text style={styles.signalLabel}>Issued Books</Text>
              <Text style={styles.signalValue}>{issuedCount}</Text>
            </View>
          </View>

          {/* Issued Books */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Issued Books</Text>
              <Divider style={styles.divider} />

              {issuedCount > 0 ? (
                issuedBooks.map((b, i) => (
                  <View key={i} style={styles.bookBlock}>
                    <Text style={styles.bookTitle}>{b.BTitle}</Text>
                    <Text style={styles.bookDue}>
                      Due on {formatDate(b.ExpDOR)}
                    </Text>

                    <View style={styles.bookMetaRow}>
                      <Text>Register: {b.CatlogName}</Text>
                      <Text>Accession: {b.AccessionNo}</Text>
                    </View>

                    <View style={styles.bookMetaRow}>
                      <Text>Author: {b.Author}</Text>
                      <Text>₹ {b.Price}</Text>
                    </View>

                    <View style={styles.bookMetaRow}>
                      <Text>Issued: {formatDate(b.DOI)}</Text>
                    </View>

                    {i !== issuedCount - 1 && (
                      <Divider style={styles.subDivider} />
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No issued books</Text>
              )}
            </Card.Content>
          </Card>

          {/* Fees */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Fee Summary</Text>
              <Divider style={styles.divider} />

              <View style={styles.feeHero}>
                <Text style={styles.feeHeroLabel}>
                  Outstanding Amount
                </Text>
                <Text style={styles.feeHeroValue}>₹ {dues}</Text>
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

          {/* Academic */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Academic Context</Text>
              <Divider style={styles.divider} />
              <Text>Class: {admission?.ClassName ?? '-'}</Text>
              <Text>
                Registration Date: {formatDate(admission?.TDATE)}
              </Text>
            </Card.Content>
          </Card>

          {/* Print */}
          <Button
            mode="contained"
            loading={printing}
            disabled={printing}
            onPress={onPrint}
            style={styles.printBtn}
          >
            Print Clearance Certificate
          </Button>

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
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#08306b' },

    loading: { flexDirection: 'row', gap: 8, padding: 12 },
    loadingText: { fontSize: 13 },

    content: { padding: 12 },

    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        elevation: 2,
    },
    heroWarn: { backgroundColor: '#fff3e0' },
    heroOk: { backgroundColor: '#e8f5e9' },
    heroTitle: { fontSize: 17, fontWeight: '700' },
    heroSub: { fontSize: 13, color: '#555', marginTop: 2 },

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

    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    divider: { marginVertical: 8 },
    subDivider: { marginVertical: 12 },

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

    feeHero: { alignItems: 'center', marginVertical: 10 },
    feeHeroLabel: { fontSize: 13, color: '#555' },
    feeHeroValue: { fontSize: 22, fontWeight: '700' },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },

    printBtn: { marginTop: 8, marginBottom: 20 },

    emptyText: { fontSize: 13, color: '#777' },
    errorCard: { backgroundColor: '#ffebee', borderColor: '#d32f2f', borderWidth: 1 },
    errorTitle: { fontSize: 16, fontWeight: '700', color: '#d32f2f', marginBottom: 8 },
    errorMessageText: { fontSize: 14, color: '#c62828', marginBottom: 12 },
    retryButton: { marginTop: 8 },
});

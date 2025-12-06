import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function DebugScreen({ navigation }: any) {
  const authState = useSelector((state: RootState) => state.auth);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Redux Auth State (Debug)</Text>

      <View style={styles.section}>
        <Text style={styles.label}>isAuthenticated:</Text>
        <Text style={styles.value}>{authState.isAuthenticated ? 'true' : 'false'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>loading:</Text>
        <Text style={styles.value}>{authState.loading ? 'true' : 'false'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>error:</Text>
        <Text style={styles.value}>{authState.error || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>token:</Text>
        <Text style={styles.value}>{authState.token ? authState.token.substring(0, 50) + '...' : 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (UserID):</Text>
        <Text style={styles.value}>{authState.user?.UserID ? authState.user.UserID.toString() : 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (UserName):</Text>
        <Text style={styles.value}>{authState.user?.UserName || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (FullName):</Text>
        <Text style={styles.value}>{authState.user?.FullName || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (UserType):</Text>
        <Text style={styles.value}>{authState.user?.UserType || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (RoleId):</Text>
        <Text style={styles.value}>{authState.user?.RoleId || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (OrganizationName):</Text>
        <Text style={styles.value}>{authState.user?.OrganizationName || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (InstituteName):</Text>
        <Text style={styles.value}>{authState.user?.InstituteName || 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>user (Menu items):</Text>
        <Text style={styles.value}>{authState.user?.Menu ? `${authState.user.Menu.length} items` : 'null'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Full user object (JSON):</Text>
        <Text style={styles.valueJson}>{JSON.stringify(authState.user, null, 2) || 'null'}</Text>
      </View>

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Go Back
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1649b2',
  },
  section: {
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1649b2',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  valueJson: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
});

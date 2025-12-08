import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Divider, Card, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function StudentProfile({ navigation }: any) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found. Please log in again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor="#1649b2"
        />
        <Text style={styles.headerTitle}>Student Profile</Text>
      </View>

      <Divider />

      {/* Personal Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <Text style={styles.fieldValue}>{user.FullName || user.StudentName || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user.Email || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <Text style={styles.fieldValue}>{user.MobileNo || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <Text style={styles.fieldValue}>{user.PhoneNo || 'N/A'}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Academic Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Student ID</Text>
            <Text style={styles.fieldValue}>{user.SID || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>URN Number</Text>
            <Text style={styles.fieldValue}>{user.URNNO || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Class ID</Text>
            <Text style={styles.fieldValue}>{user.ClassID || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Department ID</Text>
            <Text style={styles.fieldValue}>{user.DepartmentID || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Section ID</Text>
            <Text style={styles.fieldValue}>{user.SectionID || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>User Type</Text>
            <Text style={styles.fieldValue}>{user.UserType === 12 ? 'Student' : 'Other'}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Organization Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Organization Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Organization Name</Text>
            <Text style={styles.fieldValue}>{user.OrganizationName || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Institute Name</Text>
            <Text style={styles.fieldValue}>{user.InstituteName || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Role ID</Text>
            <Text style={styles.fieldValue}>{user.RoleId || 'N/A'}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Access Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Access Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>User ID</Text>
            <Text style={styles.fieldValue}>{user.UserID || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>User Name</Text>
            <Text style={styles.fieldValue}>{user.UserName || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Access Address</Text>
            <Text style={styles.fieldValue}>{user.UserAccessAddress || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>CCode</Text>
            <Text style={styles.fieldValue}>{user.CCode || 'N/A'}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>OCode</Text>
            <Text style={styles.fieldValue}>{user.OCode || 'N/A'}</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#08306b',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    margin: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1649b2',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 10,
    height: 1,
  },
  fieldRow: {
    marginVertical: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#08306b',
    fontWeight: '500',
  },
});

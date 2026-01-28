import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Divider, Button, Icon } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { MenuItem } from '../../types/auth/auth.types';
import DashboardLayout from '../../components/DashboardLayout';

export default function FacultyDashboard({ navigation }: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    
    // Dashboard stats (placeholders - replace with real data when available)
    const [classesCount] = useState<number>(0);
    const [studentsCount] = useState<number>(0);
    const [assignmentsCount] = useState<number>(0);

    const handleMenuItemPress = (item: MenuItem) => {
        const name = (item.MenuName || '').toLowerCase().trim();

        // Map menu items to navigation routes
        if (name === 'employee profile' || name === 'employeeprofile') {
            navigation.navigate('EmployeeProfile');
        } else if (name === 'time table' || name === 'timetable') {
            navigation.navigate('TimeTable');
        } else if (name === 'home work summary' || name === 'homeworksummary') {
            navigation.navigate('HomeWorkSummary');
        } else if (name === 'class lecture summary' || name === 'classlecturesummary') {
            navigation.navigate('ClassLectureSummary');
        } else if (name === 'student attendance' || name === 'studentattendance') {
            navigation.navigate('StudentAttendance');
        } else if (name === 'marks information' || name === 'marksinfo') {
            navigation.navigate('MarksInfo');
        } else if (name === 'library clearance' || name === 'libraryclearance') {
            navigation.navigate('LibraryClearance');
        } else if (name === 'opac' || name === 'opac-search') {
            navigation.navigate('OPACSearch');
        }
        // Add more mappings as needed
    };

    const dashboardContent = (
        <>
            {/* Dashboard Section */}
            <Card style={styles.dashboardCard}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <Divider style={{ marginVertical: 12 }} />

                    {/* Faculty Stats Grid */}
                    <View style={styles.statsGrid}>
                        {/* Classes Card */}
                        <View style={styles.statGridItem}>
                            <View
                                style={[
                                    styles.statGridCard,
                                    {
                                        backgroundColor: '#fff0f2',
                                        borderLeftColor: '#ff4d6d',
                                    },
                                ]}
                            >
                                <Icon
                                    source="book-open-page-variant"
                                    size={40}
                                    color="#ff4d6d"
                                />
                                <Text style={styles.statGridCount}>
                                    {classesCount}
                                </Text>
                                <Text
                                    style={styles.statGridLabel}
                                    numberOfLines={1}
                                >
                                    Classes
                                </Text>
                                <Button
                                    mode="contained"
                                    compact
                                    onPress={() =>
                                        navigation.navigate('Classes')
                                    }
                                    style={styles.statGridButton}
                                    labelStyle={{ fontSize: 9 }}
                                >
                                    View
                                </Button>
                            </View>
                        </View>

                        {/* Students Card */}
                        <View style={styles.statGridItem}>
                            <View
                                style={[
                                    styles.statGridCard,
                                    {
                                        backgroundColor: '#f0f4ff',
                                        borderLeftColor: '#4d79ff',
                                    },
                                ]}
                            >
                                <Icon
                                    source="account-group"
                                    size={40}
                                    color="#4d79ff"
                                />
                                <Text style={styles.statGridCount}>
                                    {studentsCount}
                                </Text>
                                <Text
                                    style={styles.statGridLabel}
                                    numberOfLines={1}
                                >
                                    Students
                                </Text>
                                <Button
                                    mode="contained"
                                    compact
                                    onPress={() =>
                                        navigation.navigate('Students')
                                    }
                                    style={styles.statGridButton}
                                    labelStyle={{ fontSize: 9 }}
                                >
                                    View
                                </Button>
                            </View>
                        </View>

                        {/* Assignments Card */}
                        <View style={styles.statGridItem}>
                            <View
                                style={[
                                    styles.statGridCard,
                                    {
                                        backgroundColor: '#fff7ed',
                                        borderLeftColor: '#ff9f1a',
                                    },
                                ]}
                            >
                                <Icon
                                    source="clipboard-text"
                                    size={40}
                                    color="#ff9f1a"
                                />
                                <Text style={styles.statGridCount}>
                                    {assignmentsCount}
                                </Text>
                                <Text
                                    style={styles.statGridLabel}
                                    numberOfLines={1}
                                >
                                    Assignments
                                </Text>
                                <Button
                                    mode="contained"
                                    compact
                                    onPress={() =>
                                        navigation.navigate('Assignments')
                                    }
                                    style={styles.statGridButton}
                                    labelStyle={{ fontSize: 9 }}
                                >
                                    View
                                </Button>
                            </View>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 16 }} />

                    {/* Faculty Info Section */}
                    <Text style={styles.infoSectionTitle}>
                        Faculty Information
                    </Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Icon
                                source="briefcase"
                                size={20}
                                color="#1649b2"
                            />
                            <Text style={styles.infoLabel}>Department</Text>
                            <Text style={styles.infoValue}>
                                {user?.DepartmentID || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon
                                source="identifier"
                                size={20}
                                color="#4d79ff"
                            />
                            <Text style={styles.infoLabel}>User ID</Text>
                            <Text style={styles.infoValue}>
                                {user?.UserID || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon
                                source="account-star"
                                size={20}
                                color="#ff9f1a"
                            />
                            <Text style={styles.infoLabel}>Role ID</Text>
                            <Text style={styles.infoValue}>
                                {user?.RoleId || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon
                                source="domain"
                                size={20}
                                color="#ff4d6d"
                            />
                            <Text style={styles.infoLabel}>College Code</Text>
                            <Text style={styles.infoValue}>
                                {user?.CCode || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 16 }} />

                    {/* Organization Info Section */}
                    <Text style={styles.infoSectionTitle}>
                        Organization Information
                    </Text>
                    <View style={styles.contactCard}>
                        <View style={styles.contactRow}>
                            <Icon
                                source="office-building"
                                size={18}
                                color="#1649b2"
                            />
                            <Text style={styles.contactLabel}>Organization:</Text>
                            <Text style={styles.contactValue}>
                                {user?.OrganizationName || 'N/A'}
                            </Text>
                        </View>
                        <Divider style={{ marginVertical: 8 }} />
                        <View style={styles.contactRow}>
                            <Icon
                                source="school"
                                size={18}
                                color="#4d79ff"
                            />
                            <Text style={styles.contactLabel}>Institute:</Text>
                            <Text style={styles.contactValue}>
                                {user?.InstituteName || 'N/A'}
                            </Text>
                        </View>
                        <Divider style={{ marginVertical: 8 }} />
                        <View style={styles.contactRow}>
                            <Icon
                                source="email"
                                size={18}
                                color="#1649b2"
                            />
                            <Text style={styles.contactLabel}>Email:</Text>
                            <Text style={styles.contactValue}>
                                {user?.Email || 'N/A'}
                            </Text>
                        </View>
                        <Divider style={{ marginVertical: 8 }} />
                        <View style={styles.contactRow}>
                            <Icon
                                source="phone"
                                size={18}
                                color="#4d79ff"
                            />
                            <Text style={styles.contactLabel}>Mobile:</Text>
                            <Text style={styles.contactValue}>
                                {user?.MobileNo || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </>
    );

    return (
        <DashboardLayout
            navigation={navigation}
            onMenuItemPress={handleMenuItemPress}
            dashboardContent={dashboardContent}
            userType="faculty"
        />
    );
}

const styles = StyleSheet.create({
    dashboardCard: {
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#08306b',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 8,
        justifyContent: 'space-between',
        marginVertical: 50,
        paddingHorizontal: 4,
    },
    statGridItem: {
        flex: 1,
        minWidth: 0,
        maxWidth: '33.33%',
    },
    statGridCard: {
        flex: 1,
        borderRadius: 12,
        borderLeftWidth: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        minHeight: 160,
    },
    statGridCount: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111',
        marginTop: 6,
    },
    statGridLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#555',
        marginTop: 4,
        textAlign: 'center',
    },
    statGridButton: {
        marginTop: 6,
        alignSelf: 'stretch',
        minHeight: 30,
    },
    infoSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#08306b',
        marginBottom: 12,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
    },
    infoItem: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        elevation: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 6,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#08306b',
        marginTop: 2,
        textAlign: 'center',
    },
    contactCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 12,
        elevation: 1,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    contactLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        minWidth: 90,
    },
    contactValue: {
        fontSize: 12,
        color: '#08306b',
        flex: 1,
        fontWeight: '500',
    },
});

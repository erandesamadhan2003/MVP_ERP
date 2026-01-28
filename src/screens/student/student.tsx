import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Divider, Button, Icon, Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { MenuItem } from '../../types/auth/auth.types';
import DashboardLayout from '../../components/DashboardLayout';

export default function StudentScreen({ navigation }: any) {
    const user = useSelector((state: RootState) => state.auth.user);
    
    // Dashboard stats (example placeholders — replace with real counts when available)
    const [lecturesCount] = useState<number>(0);
    const [homeworkCount] = useState<number>(0);
    const [examCount] = useState<number>(0);

    const handleMenuItemPress = (item: MenuItem) => {
        const name = (item.MenuName || '').toLowerCase().trim();

        if (name === 'profile') {
            navigation.navigate('StudentProfile');
        } else if (
            name === 'course enrollment' ||
            name === 'courseenrollment'
        ) {
            navigation.navigate('StudentCourseEnrollment');
        } else if (name === 'enrollment list' || name === 'enrollmentlist') {
            navigation.navigate('EnrollmentList');
        } else if (name === 'exam form' || name === 'examform') {
            navigation.navigate('ExamForm');
        } else if (
            name === 'reading attendance' ||
            name === 'readingattendance'
        ) {
            navigation.navigate('ReadingAttendance');
        } else if (
            name === 'library clearance' ||
            name === 'libraryclearance' ||
            name === 'member clearance' ||
            name === 'memberclearance'
        ) {
            navigation.navigate('LibraryClearance');
        } else if (
            name === 'dues payment' ||
            name === 'duespayment' ||
            name === 'dues'
        ) {
            navigation.navigate('DuesPayment');
        }

        // Add more mappings as needed
    };

    const dashboardContent = (
        <>
            {/* Dashboard Section (Sassy stats + Info) */}
            <Card style={styles.dashboardCard}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <Divider style={{ marginVertical: 12 }} />

                        {/* Academic Stats Grid */}
                        <View style={styles.statsGrid}>
                            {/* Lectures Card */}
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
                                    <Avatar.Icon
                                        size={40}
                                        icon="book-open-page-variant"
                                        style={{ backgroundColor: '#ffe0e6' }}
                                        color="#ff4d6d"
                                    />
                                    <Text style={styles.statGridCount}>
                                        {lecturesCount}
                                    </Text>
                                    <Text
                                        style={styles.statGridLabel}
                                        numberOfLines={1}
                                    >
                                        Lectures
                                    </Text>
                                    <Button
                                        mode="contained"
                                        compact
                                        onPress={() =>
                                            navigation.navigate('Lectures')
                                        }
                                        style={styles.statGridButton}
                                        labelStyle={{ fontSize: 9 }}
                                    >
                                        View
                                    </Button>
                                </View>
                            </View>

                            {/* Homework Card */}
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
                                    <Avatar.Icon
                                        size={40}
                                        icon="clipboard-text"
                                        style={{ backgroundColor: '#d9e4ff' }}
                                        color="#4d79ff"
                                    />
                                    <Text style={styles.statGridCount}>
                                        {homeworkCount}
                                    </Text>
                                    <Text
                                        style={styles.statGridLabel}
                                        numberOfLines={1}
                                    >
                                        Homework
                                    </Text>
                                    <Button
                                        mode="contained"
                                        compact
                                        onPress={() =>
                                            navigation.navigate('Homework')
                                        }
                                        style={styles.statGridButton}
                                        labelStyle={{ fontSize: 9 }}
                                    >
                                        View
                                    </Button>
                                </View>
                            </View>

                            {/* Exams Card */}
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
                                    <Avatar.Icon
                                        size={40}
                                        icon="clipboard-check-outline"
                                        style={{ backgroundColor: '#ffe8c2' }}
                                        color="#ff9f1a"
                                    />
                                    <Text style={styles.statGridCount}>
                                        {examCount}
                                    </Text>
                                    <Text
                                        style={styles.statGridLabel}
                                        numberOfLines={1}
                                    >
                                        Exams
                                    </Text>
                                    <Button
                                        mode="contained"
                                        compact
                                        onPress={() =>
                                            navigation.navigate('Exams')
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

                        {/* Academic Info Section */}
                        <Text style={styles.infoSectionTitle}>
                            Academic Information
                        </Text>
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Icon
                                    source="school"
                                    size={20}
                                    color="#1649b2"
                                />
                                <Text style={styles.infoLabel}>Class ID</Text>
                                <Text style={styles.infoValue}>
                                    {user?.ClassID || 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Icon
                                    source="identifier"
                                    size={20}
                                    color="#4d79ff"
                                />
                                <Text style={styles.infoLabel}>URN No</Text>
                                <Text style={styles.infoValue}>
                                    {user?.URNNO || 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Icon
                                    source="briefcase"
                                    size={20}
                                    color="#ff9f1a"
                                />
                                <Text style={styles.infoLabel}>SID</Text>
                                <Text style={styles.infoValue}>
                                    {user?.SID || 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Icon
                                    source="domain"
                                    size={20}
                                    color="#ff4d6d"
                                />
                                <Text style={styles.infoLabel}>Org Code</Text>
                                <Text style={styles.infoValue}>
                                    {user?.OCode || 'N/A'}
                                </Text>
                            </View>
                        </View>

                        <Divider style={{ marginVertical: 16 }} />

                        {/* Contact Info Section */}
                        <Text style={styles.infoSectionTitle}>
                            Contact Information
                        </Text>
                        <View style={styles.contactCard}>
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
            userType="student"
        />
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#08306b',
    },
    dashboardCard: {
        backgroundColor: '#fff',
        marginBottom: 12,
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
        minWidth: 70,
    },
    contactValue: {
        fontSize: 12,
        color: '#08306b',
        flex: 1,
        fontWeight: '500',
    },
});

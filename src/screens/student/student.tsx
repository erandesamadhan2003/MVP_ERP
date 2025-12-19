import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Divider, Button, Icon } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout, LogoutUser } from '../../store/slices/auth/authSlice';
import { MenuItem } from '../../types/auth/auth.types';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

export default function StudentScreen({ navigation }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const menu = useSelector((state: RootState) => state.auth.user?.Menu || []);
    const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(
        new Set(),
    );
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);
    // Dashboard stats (example placeholders — replace with real counts when available)
    const [lecturesCount] = useState<number>(0);
    const [homeworkCount] = useState<number>(0);
    const [examCount] = useState<number>(0);

    React.useEffect(() => {
        if (!user) {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
    }, [user]);

    if (!user) {
        return <Text>Loading...</Text>;
    }

    const handleLogout = () => {
        dispatch(LogoutUser());
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    };

    // Get top-level menu items (ParentMenuId: null)
    const topLevelMenus = menu.filter(
        (item: MenuItem) => item.ParentMenuId === null,
    );

    // Get children of a specific menu item
    const getChildren = (menuIdentity: number): MenuItem[] => {
        return menu.filter(
            (item: MenuItem) => item.ParentMenuId === menuIdentity,
        );
    };

    const handleMenuItemPress = (item: MenuItem) => {
        const name = (item.MenuName || '').toLowerCase();

        if (name === 'profile') {
            navigation.navigate('StudentProfile');
        } else if (name === 'course enrollment' || name === 'courseenrollment') {
            navigation.navigate('StudentCourseEnrollment');
        } else if (name === 'enrollment list' || name === 'enrollmentlist') {
            navigation.navigate('EnrollmentList');
        }
        // Add more mappings as needed
    };

    const toggleMenuExpansion = (menuId: number) => {
        setExpandedMenuIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(menuId)) {
                newSet.delete(menuId);
            } else {
                newSet.add(menuId);
            }
            return newSet;
        });
    };

    const MenuItem = ({
        item,
        level = 0,
    }: {
        item: MenuItem;
        level?: number;
    }) => {
        const children = getChildren(item.MenuIdentity);
        const isExpanded = expandedMenuIds.has(item.MenuIdentity);
        const hasChildren = children.length > 0;

        return (
            <View key={item.MenuIdentity}>
                <TouchableOpacity
                    style={[
                        styles.menuItemButton,
                        level === 0 && styles.topLevelMenuItem,
                        level > 0 && styles.subMenuItem,
                        { paddingLeft: 12 + level * 12 },
                    ]}
                    onPress={() => {
                        if (hasChildren) {
                            toggleMenuExpansion(item.MenuIdentity);
                        } else {
                            handleMenuItemPress(item);
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <Icon
                        source="folder-outline"
                        size={20}
                        color={level === 0 ? '#1649b2' : '#666'}
                    />
                    <Text
                        style={[
                            styles.menuItemText,
                            level > 0 && styles.subMenuItemText,
                        ]}
                    >
                        {item.MenuName}
                    </Text>
                    {hasChildren && (
                        <Icon
                            source={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={level === 0 ? '#1649b2' : '#666'}
                        />
                    )}
                </TouchableOpacity>

                {/* Render children if expanded */}
                {isExpanded && hasChildren && (
                    <View style={styles.submenuContainer}>
                        {children.map((child: MenuItem) => (
                            <MenuItem
                                key={child.MenuIdentity}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaWrapper style={styles.container}>
            {/* Header with User Info and Logout */}
            <View style={styles.headerCard}>
                <View style={styles.headerTop}>
                    <View style={styles.userInfo}>
                        <Avatar.Text
                            size={50}
                            label={(user?.FullName || 'U').slice(0, 1)}
                            style={styles.avatar}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.userName}>
                                {user?.FullName || user?.StudentName}
                            </Text>
                            <Text style={styles.userEmail}>{user?.Email}</Text>
                        </View>
                    </View>
                    <Button
                        icon="logout"
                        mode="contained-tonal"
                        compact
                        onPress={handleLogout}
                        style={{ backgroundColor: '#e53935' }}
                        labelStyle={[
                            styles.logoutButtonLabel,
                            { color: '#fff' },
                        ]}
                    >
                        Logout
                    </Button>
                </View>
            </View>

            {/* Navigation Menu */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <Card style={styles.menuCard}>
                    <Card.Content style={styles.menuCardContent}>
                        <TouchableOpacity
                            style={styles.menuHeaderTouchable}
                            onPress={() => setIsMenuExpanded(!isMenuExpanded)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.menuTitle}>Menu</Text>
                            <Icon
                                source={
                                    isMenuExpanded
                                        ? 'chevron-up'
                                        : 'chevron-down'
                                }
                                size={24}
                                color="#08306b"
                            />
                        </TouchableOpacity>

                        {isMenuExpanded && (
                            <>
                                <Divider style={{ marginVertical: 12 }} />
                                {topLevelMenus.length > 0 ? (
                                    topLevelMenus.map((item: MenuItem) => (
                                        <MenuItem
                                            key={item.MenuIdentity}
                                            item={item}
                                            level={0}
                                        />
                                    ))
                                ) : (
                                    <Text style={styles.noMenuText}>
                                        No menu items available
                                    </Text>
                                )}
                            </>
                        )}
                    </Card.Content>
                </Card>

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
                                    <Text style={styles.statGridLabel} numberOfLines={1}>
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
                                    <Text style={styles.statGridLabel} numberOfLines={1}>
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
                                    <Text style={styles.statGridLabel} numberOfLines={1}>
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

                {/* Debug Button */}
                {/* <Button
          mode="outlined"
          onPress={() => navigation.navigate('Debug')}
          style={styles.debugButton}
        >
          View Redux State (Debug)
        </Button> */}
             </ScrollView>
        </SafeAreaWrapper>
     );
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerCard: {
        marginHorizontal: 12,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#1649b2',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#08306b',
    },
    userEmail: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    logoutButtonLabel: {
        fontSize: 11,
    },
    quickInfoChips: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 0,
    },
    quickInfoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#f0f4ff',
        borderRadius: 6,
    },
    quickInfoText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#08306b',
        marginLeft: 6,
    },
    chip: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 12,
        marginTop: 6,
    },
    menuCard: {
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        elevation: 1,
    },
    menuCardContent: {
        paddingVertical: 8,
    },
    menuHeaderTouchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#08306b',
    },
    menuItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    topLevelMenuItem: {
        backgroundColor: '#f9f9f9',
        fontWeight: '600',
    },
    subMenuItem: {
        backgroundColor: '#fff',
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#08306b',
        flex: 1,
        marginLeft: 12,
    },
    subMenuItemText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#555',
    },
    submenuContainer: {
        backgroundColor: '#f9f9f9',
    },
    noMenuText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        marginVertical: 12,
    },
    settingsCard: {
        marginVertical: 12,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#08306b',
    },
    settingsButton: {
        marginVertical: 6,
        justifyContent: 'flex-start',
    },
    debugButton: {
        marginVertical: 16,
        marginHorizontal: 0,
    },
    /* Dashboard / Stats */
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
    /* Info Section Styles */
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
    /* Contact Info Styles */
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

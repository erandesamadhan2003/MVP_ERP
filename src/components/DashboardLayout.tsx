import React, { useState, ReactNode } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Divider, Button, Icon } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { LogoutUser } from '../store/slices/auth/authSlice';
import { MenuItem } from '../types/auth/auth.types';
import SafeAreaWrapper from './SafeAreaWrapper';

interface DashboardLayoutProps {
    navigation: any;
    onMenuItemPress?: (item: MenuItem) => void;
    dashboardContent?: ReactNode;
    userType?: 'student' | 'faculty';
}

export default function DashboardLayout({
    navigation,
    onMenuItemPress,
    dashboardContent,
    userType = 'student',
}: DashboardLayoutProps) {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const menu = useSelector((state: RootState) => state.auth.user?.Menu || []);
    const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(
        new Set(),
    );
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);

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
        if (onMenuItemPress) {
            onMenuItemPress(item);
        }
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

    const MenuItemComponent = ({
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
                            <MenuItemComponent
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
                                {user?.FullName || user?.StudentName || user?.UserName}
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
                        labelStyle={[styles.logoutButtonLabel, { color: '#fff' }]}
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
                                        <MenuItemComponent
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

                {/* Dashboard Content */}
                {dashboardContent}
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
});

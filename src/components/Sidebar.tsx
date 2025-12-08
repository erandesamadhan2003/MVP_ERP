import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Divider, Icon } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { MenuItem } from '../types/auth/auth.types';

export default function Sidebar({ navigation, onMenuItemPress }: any) {
  const menu = useSelector((state: RootState) => state.auth.user?.Menu || []);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

  // Filter top-level menu items (ParentMenuId: null)
  const topLevelMenus = menu.filter((item: MenuItem) => item.ParentMenuId === null);

  // Get children of a specific menu item
  const getChildren = (menuIdentity: number): MenuItem[] => {
    return menu.filter((item: MenuItem) => item.ParentMenuId === menuIdentity);
  };

  // Extract Font Awesome icon from CSSClass
  const getIconName = (cssClass: string): string => {
    if (!cssClass) return 'folder';
    // Extract icon name from "fa fa-icon-name"
    const matches = cssClass.match(/fa\s+fa-([a-z-]+)/);
    return matches ? matches[1] : 'folder';
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.HasChildren) {
      // Toggle expansion if it has children
      setExpandedMenuId(expandedMenuId === item.MenuIdentity ? null : item.MenuIdentity);
    } else {
      // Navigate based on FormLink
      if (item.FormLink && item.FormLink !== '#') {
        // For now, navigate to a generic screen; later map FormLink to actual screens
        onMenuItemPress?.(item);
      }
    }
  };

  const MenuItemComponent = ({ item, level = 0 }: { item: MenuItem; level?: number }) => {
    const children = getChildren(item.MenuIdentity);
    const isExpanded = expandedMenuId === item.MenuIdentity;
    const hasChildren = children.length > 0;

    return (
      <View key={item.MenuIdentity}>
        <TouchableOpacity
          style={[
            styles.menuItemContainer,
            level > 0 && { paddingLeft: 10 + level * 15, backgroundColor: '#f9f9f9' },
          ]}
          onPress={() => handleMenuPress(item)}
          activeOpacity={0.7}
        >
          <Icon source="folder" size={20} color="#1649b2" />
          <Text style={[styles.menuItemText, level > 0 && styles.subMenuText]}>
            {item.MenuName}
          </Text>
          {hasChildren && (
            <Icon
              source={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#1649b2"
            />
          )}
        </TouchableOpacity>

        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <>
            {children.map((child: MenuItem) => (
              <MenuItemComponent key={child.MenuIdentity} item={child} level={level + 1} />
            ))}
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Navigation</Text>
      </View>
      <Divider />

      {topLevelMenus.length > 0 ? (
        topLevelMenus.map((item: MenuItem) => (
          <MenuItemComponent key={item.MenuIdentity} item={item} level={0} />
        ))
      ) : (
        <Text style={styles.noMenuText}>No menu items available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#08306b',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#08306b',
    flex: 1,
    marginLeft: 12,
  },
  subMenuText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  noMenuText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

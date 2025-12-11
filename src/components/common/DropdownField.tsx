import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateMasterField } from '../../store/slices/student/studentSlice';
import { profileStyles } from '../../screens/student/profile/profileStyles';
import { StudentProfileMaster } from '../../types/student/studentProfile.types';

interface DropdownOption {
    label: string;
    value: any;
}

interface DropdownProps {
    label: string;
    value: string;      
    options?: DropdownOption[];
    onSelect?: (value: any) => void;
    disabled?: boolean;
    // New props for automatic handling
    field?: keyof StudentProfileMaster;
    listKey?:
        | 'TalukaList'
        | 'ReligionList'
        | 'CategoryList'
        | 'MinorityList'
        | 'GenderList'
        | 'BloodTypeList'
        | 'HandiCapTypeList'
        | 'SportsList'
        | 'SpecialCategoryTypeList'
        | 'PrevSectionList';
    selectLists?: any;
    profileData?: any;
    mapFunc?: (item: any) => DropdownOption;
    additionalFields?: Array<{ field: keyof StudentProfileMaster; value: any }>;
}

// Default mapping functions for common list types
const defaultMappers = {
    TalukaList: (t: any) => ({ label: t.Taluka, value: t.Taluka }),
    ReligionList: (r: any) => ({ label: r.ReligionName, value: r.ReligionID }),
    CategoryList: (c: any) => ({
        label: c.CategoryName,
        value: c.CategoryCode,
    }),
    MinorityList: (m: any) => ({ label: m.Minority, value: m.MinorityID }),
    GenderList: (g: any) => ({ label: g.GenderName, value: g.Gender }),
    BloodTypeList: (b: any) => ({ label: b.BloodGroup, value: b.BloodTypeID }),
    HandiCapTypeList: (h: any) => ({
        label: h.HandicapType || 'YES',
        value: h.HandicapId,
    }),
    SportsList: (s: any) => ({ label: s.SportName, value: s.SportsID }),
    SpecialCategoryTypeList: (s: any) => ({
        label: s.SpecialCategory,
        value: s.SpecialCategoryID,
    }),
    PrevSectionList: (s: any) => ({ label: s.SectionName, value: s.SectionID }),
};

export const DropdownField = ({
    label,
    value,
    options,
    onSelect,
    disabled = false,
    field,
    listKey,
    selectLists,
    profileData,
    mapFunc,
    additionalFields,
}: DropdownProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [visible, setVisible] = useState(false);
    const [anchorLayout, setAnchorLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    // Auto-generate options from selectLists if provided
    const dropdownOptions = React.useMemo(() => {
        if (options) return options;

        if (listKey && selectLists?.[listKey]) {
            const mapper = mapFunc || defaultMappers[listKey];
            const list = selectLists[listKey];

            // Filter out items without required fields
            const filteredList = list.filter((item: any) => {
                if (listKey === 'ReligionList') return item.ReligionName;
                if (listKey === 'CategoryList') return item.CategoryName;
                return true;
            });

            return filteredList.map(mapper);
        }

        return [];
    }, [options, listKey, selectLists, mapFunc]);

    const handleSelect = (selectedValue: any) => {
        // Use custom onSelect if provided
        if (onSelect) {
            onSelect(selectedValue);
        }
        // Otherwise, dispatch to Redux automatically
        else if (field) {
            dispatch(updateMasterField({ field, value: selectedValue }));

            // Handle additional fields (e.g., IS flags)
            if (additionalFields) {
                additionalFields.forEach(
                    ({ field: additionalField, value: additionalValue }) => {
                        const computedValue =
                            typeof additionalValue === 'function'
                                ? additionalValue(selectedValue)
                                : additionalValue;
                        dispatch(
                            updateMasterField({
                                field: additionalField,
                                value: computedValue,
                            }),
                        );
                    },
                );
            }
        }

        setVisible(false);
    };

    const handleAnchorLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setAnchorLayout({ x, y, width, height });
    };

    const renderMenuItem = ({ item }: { item: DropdownOption }) => (
        <TouchableOpacity
            style={profileStyles.dropdownMenuItem}
            onPress={() => handleSelect(item.value)}
        >
            <Text style={profileStyles.dropdownMenuItemText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>{label}</Text>
            <TouchableOpacity
                onPress={() => !disabled && setVisible(true)}
                disabled={disabled}
                style={[
                    profileStyles.dropdownButton,
                    disabled && profileStyles.dropdownButtonDisabled,
                ]}
                onLayout={handleAnchorLayout}
            >
                <TextInput
                    mode="outlined"
                    value={value || 'Select...'}
                    editable={false}
                    style={profileStyles.input}
                    right={
                        <TextInput.Icon
                            icon={disabled ? 'lock' : 'chevron-down'}
                        />
                    }
                />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={profileStyles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View
                        style={[
                            profileStyles.dropdownModal,
                            {
                                top: anchorLayout.y + anchorLayout.height + 5,
                                left: anchorLayout.x,
                                width: anchorLayout.width,
                            },
                        ]}
                    >
                        <FlatList
                            data={
                                dropdownOptions.length > 0
                                    ? dropdownOptions
                                    : [
                                          {
                                              label: 'No options available',
                                              value: null,
                                          },
                                      ]
                            }
                            renderItem={renderMenuItem}
                            keyExtractor={(item, index) =>
                                `${item.value}-${index}`
                            }
                            style={profileStyles.dropdownList}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

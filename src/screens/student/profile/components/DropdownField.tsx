import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { profileStyles } from '../profileStyles';

interface DropdownProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: any }>;
  onSelect: (value: any) => void;
  disabled?: boolean;
}

export const DropdownField = ({ label, value, options, onSelect, disabled = false }: DropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleAnchorLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setAnchorLayout({ x, y, width, height });
  };

  const renderMenuItem = ({ item }: { item: { label: string; value: any } }) => (
    <TouchableOpacity
      style={profileStyles.dropdownMenuItem}
      onPress={() => {
        onSelect(item.value);
        setVisible(false);
      }}
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
        style={[profileStyles.dropdownButton, disabled && profileStyles.dropdownButtonDisabled]}
        onLayout={handleAnchorLayout}
      >
        <TextInput
          mode="outlined"
          value={value || 'Select...'}
          editable={false}
          style={profileStyles.input}
          right={<TextInput.Icon icon={disabled ? 'lock' : 'chevron-down'} />}
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
              data={options.length > 0 ? options : [{ label: 'No options available', value: null }]}
              renderItem={renderMenuItem}
              keyExtractor={(item, index) => `${item.value}-${index}`}
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


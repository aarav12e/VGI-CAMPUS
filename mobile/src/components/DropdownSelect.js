import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function DropdownSelect({
  label,
  value,
  options = [],
  onSelect,
  placeholder = 'Select option...',
  icon,
  style,
  disabled = false
}) {
  const [modalVisible, setModalVisible] = useState(false);

  // Normalize options to { label, value, subtitle }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt };
    }
    return opt;
  });

  const selectedItem = normalizedOptions.find(o => String(o.value) === String(value));
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (itemValue) => {
    onSelect(itemValue);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {Boolean(label && label.trim()) ? (
        <Text style={styles.fieldLabel}>{label}</Text>
      ) : null}

      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.triggerBox, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerLeft}>
          {Boolean(icon) ? (
            <Ionicons
              name={icon}
              size={15}
              color={selectedItem ? '#059669' : '#64748B'}
              style={{ marginRight: 6 }}
            />
          ) : null}
          <Text
            style={[
              styles.triggerText,
              !selectedItem && styles.triggerPlaceholder
            ]}
            numberOfLines={1}
          >
            {displayLabel}
          </Text>
        </View>

        <Ionicons name="chevron-down" size={16} color="#64748B" />
      </TouchableOpacity>

      {/* Modal Picker */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{label || 'Select Option'}</Text>
                <Text style={styles.sheetSubtitle}>Tap an option to select</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={normalizedOptions}
              keyExtractor={(item) => String(item.value)}
              contentContainerStyle={{ paddingVertical: 6 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = String(item.value) === String(value);
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {item.label}
                      </Text>
                      {Boolean(item.subtitle) ? (
                        <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                      ) : null}
                    </View>

                    {Boolean(isSelected) ? (
                      <Ionicons name="checkmark-circle" size={18} color="#059669" />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8
  },
  fieldLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.4
  },
  triggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  triggerDisabled: {
    opacity: 0.6,
    backgroundColor: '#F1F5F9'
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6
  },
  triggerText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1
  },
  triggerPlaceholder: {
    color: '#94A3B8',
    fontWeight: '500'
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '65%',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 6
  },
  sheetTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  closeBtn: {
    padding: 4
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2
  },
  optionItemSelected: {
    backgroundColor: '#ECFDF5'
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B'
  },
  optionLabelSelected: {
    color: '#047857',
    fontWeight: '800'
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  }
});

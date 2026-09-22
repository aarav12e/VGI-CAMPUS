import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALL_STUDENT_TILES } from '../../constants/tilesData';
import { modalStyles } from './modalStyles';
import { COLORS } from '../../theme/colors';

export function CustomizeTilesModal({ activeTileIds, onToggleTile, onClose }) {
  const currentTileIds = activeTileIds || [];
  return (
    <View>
      <Text style={modalStyles.sectionHelperText}>
        Toggle dashboard grid cards to customize your daily workspace.
      </Text>
      {ALL_STUDENT_TILES.map(tile => {
        const isSelected = currentTileIds.includes(tile.id);
        return (
          <TouchableOpacity
            key={tile.id}
            style={[styles.tileRow, isSelected ? styles.tileRowActive : styles.tileRowInactive]}
            onPress={() => onToggleTile && onToggleTile(tile.id)}
          >
            <View style={styles.tileInfo}>
              <View style={[styles.tileIconBox, isSelected && styles.tileIconBoxActive]}>
                <Ionicons name={tile.iconName || 'apps-outline'} size={18} color={isSelected ? COLORS.primary : COLORS.textMuted} />
              </View>
              <View>
                <Text style={styles.tileLabel}>{tile.label.replace('\n', ' ')}</Text>
                <Text style={styles.tileCategory}>{tile.category || 'General'}</Text>
              </View>
            </View>
            <Ionicons
              name={isSelected ? 'checkbox' : 'square-outline'}
              size={22}
              color={isSelected ? COLORS.primary : COLORS.textLight}
            />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={modalStyles.submitActionBtn} onPress={onClose}>
        <Text style={modalStyles.submitActionBtnText}>Done Customizing</Text>
      </TouchableOpacity>
    </View>
  );
}

export function FallbackModal({ activeModal, onClose }) {
  return (
    <View style={modalStyles.fallbackContainer}>
      <View style={modalStyles.fallbackIconCircle}>
        <Ionicons name="school" size={36} color={COLORS.primary} />
      </View>
      <Text style={modalStyles.fallbackTitle}>
        {activeModal ? activeModal.replace(/_/g, ' ').toUpperCase() : 'VGI PORTAL MODULE'}
      </Text>
      <Text style={modalStyles.fallbackSubtitle}>
        Integrated ERP Module for Vidya Knowledge Park (VGI Campus).
        All 4 academic years and university degree programs (B.Tech, BCA, MCA, M.Tech, MBA, LLB, BBA, BFD, B.Pharma) are synchronized.
      </Text>
      <View style={modalStyles.fallbackBadge}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        <Text style={modalStyles.fallbackBadgeText}>Module Active & Cloud Synced</Text>
      </View>
      <TouchableOpacity style={modalStyles.submitActionBtn} onPress={onClose}>
        <Text style={modalStyles.submitActionBtnText}>Close Window</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    backgroundColor: COLORS.cardBg
  },
  tileRowActive: {
    borderColor: COLORS.primaryBorder,
    backgroundColor: COLORS.primaryLight
  },
  tileRowInactive: {
    opacity: 0.8
  },
  tileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  tileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileIconBoxActive: {
    backgroundColor: '#DBEAFE'
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  tileCategory: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  }
});

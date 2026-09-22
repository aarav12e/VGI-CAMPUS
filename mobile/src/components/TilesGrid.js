import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALL_STUDENT_TILES } from '../constants/tilesData';

export default function TilesGrid({
  tiles,
  activeTileIds,
  catalog = ALL_STUDENT_TILES,
  editMode = false,
  editTilesMode,
  onToggleEditMode,
  onToggleEditTiles,
  onOpenAddTilesModal,
  onAddTilesPress,
  onTilePress,
  onRemoveTile,
  heading = 'Add More Tiles',
  subheading = 'Click on the plus button to add menu grids.',
  accentColor = '#E07A2B',
  pillBgColor = '#FFE8DF'
}) {
  const isEditing = editTilesMode !== undefined ? editTilesMode : editMode;
  const handleToggle = onToggleEditTiles || onToggleEditMode;
  const handleAddPress = onAddTilesPress || onOpenAddTilesModal;

  // Resolve display tiles
  let displayTiles = tiles;
  if (!displayTiles) {
    if (activeTileIds) {
      displayTiles = activeTileIds
        .map(id => catalog.find(t => t.id === id))
        .filter(Boolean);
    } else {
      displayTiles = catalog.slice(0, 9);
    }
  }

  return (
    <View style={styles.dashboardContainer}>
      {/* "Add More Tiles" Section (Inspiration Image 1) */}
      <View style={styles.addTilesSection}>
        <View style={styles.addTilesTextCol}>
          <Text style={styles.addTilesHeading}>{heading}</Text>
          <Text style={styles.addTilesSubheading}>{subheading}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addTilesBlackCircle}
          activeOpacity={0.8}
          onPress={handleAddPress}
        >
          <Ionicons name={isEditing ? "checkmark" : "add"} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Edit Mode Notice Banner */}
      {isEditing && (
        <View style={styles.editModeNoticeBar}>
          <Text style={styles.editModeNoticeText}>
            🛠️ Edit Mode Active: Tap 'X' to remove tiles or '+' above to add new ones.
          </Text>
          <TouchableOpacity onPress={() => handleToggle && handleToggle(false)}>
            <Text style={styles.editModeDoneBtn}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 3-Column Customizable Grid of Tiles (Image 1) */}
      <View style={styles.studentTilesGrid}>
        {displayTiles.map(tile => (
          <TouchableOpacity
            key={tile.id}
            style={[
              styles.studentTileCard,
              tile.highlight && [styles.studentTileCardHighlight, { borderColor: accentColor }]
            ]}
            activeOpacity={0.82}
            onPress={() => {
              if (isEditing) {
                onRemoveTile && onRemoveTile(tile.id);
              } else {
                onTilePress && onTilePress(tile.id);
              }
            }}
          >
            {/* Badge or Remove 'X' */}
            {isEditing ? (
              <View style={styles.tileRemovePill}>
                <Text style={styles.tileRemoveX}>✕</Text>
              </View>
            ) : tile.badge ? (
              <View style={styles.tileBadgePill}>
                <Text style={styles.tileBadgePillText}>{tile.badge}</Text>
              </View>
            ) : null}

            {/* Icon */}
            <View style={styles.tileIconArea}>
              <Ionicons 
                name={tile.iconName} 
                size={32} 
                color={tile.highlight ? accentColor : '#334155'} 
              />
            </View>

            {/* Bottom Peach/Color Label Pill */}
            <View style={[styles.tilePeachPill, { backgroundColor: pillBgColor }]}>
              <Text style={styles.tilePeachLabel} numberOfLines={2}>
                {tile.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customizable Footer Quick Links */}
      <View style={styles.customGridFooter}>
        <TouchableOpacity 
          style={styles.toggleEditModeLink}
          onPress={() => handleToggle && handleToggle(!isEditing)}
        >
          <Ionicons name={isEditing ? "checkmark-circle-outline" : "options-outline"} size={16} color={accentColor} />
          <Text style={[styles.toggleEditModeText, { color: accentColor }]}>
            {isEditing ? 'Done Customizing' : 'Customize Dashboard Grids'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    paddingBottom: 20
  },
  addTilesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 6
  },
  addTilesTextCol: {
    flex: 1
  },
  addTilesHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B'
  },
  addTilesSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  addTilesBlackCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3
  },
  editModeNoticeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12
  },
  editModeNoticeText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700',
    flex: 1
  },
  editModeDoneBtn: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '900',
    paddingLeft: 8
  },
  studentTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  studentTileCard: {
    width: '30.5%',
    aspectRatio: 0.95,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 0,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  studentTileCardHighlight: {
    borderWidth: 1.5,
    borderColor: '#FA7268'
  },
  tileBadgePill: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    zIndex: 2
  },
  tileBadgePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569'
  },
  tileRemovePill: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  tileRemoveX: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  tileIconArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4
  },
  tilePeachPill: {
    width: '100%',
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  tilePeachLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 14
  },
  customGridFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 8
  },
  toggleEditModeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  toggleEditModeText: {
    fontSize: 12,
    fontWeight: '700'
  }
});

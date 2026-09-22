import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export const modalStyles = StyleSheet.create({
  featureModalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlayBg,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  featureModalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20
  },
  featureModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#F8FAFC'
  },
  featureModalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.primaryDark,
    flex: 1,
    letterSpacing: 0.3
  },
  featureModalCloseBtn: {
    padding: 4,
    marginLeft: 8
  },
  featureModalBody: {
    padding: 16
  },
  sectionHelperText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
    lineHeight: 18
  },

  // Form Controls
  formContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 10
  },
  formSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 12
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 5,
    letterSpacing: 0.5
  },
  inputBox: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.textMain,
    marginBottom: 10
  },

  // Pills and Selectors
  tabSelectorRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16
  },
  tabSelectorBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8
  },
  tabSelectorBtnActive: {
    backgroundColor: COLORS.primary
  },
  tabSelectorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textMuted
  },
  tabSelectorTextActive: {
    color: COLORS.white,
    fontWeight: '700'
  },
  pillScroll: {
    flexDirection: 'row',
    marginBottom: 12
  },
  pillBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  pillBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  pillBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  pillBtnTextActive: {
    color: COLORS.white,
    fontWeight: '700'
  },
  yearGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  yearGridPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  yearGridPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  yearGridPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  yearGridPillTextActive: {
    color: COLORS.white,
    fontWeight: '700'
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap'
  },
  smallPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  smallPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  smallPillText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  smallPillTextActive: {
    color: COLORS.white,
    fontWeight: '700'
  },

  // Action Buttons
  submitActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  submitActionBtnText: {
    color: COLORS.white,
    fontSize: 13.5,
    fontWeight: '700'
  },
  outlineActionBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    backgroundColor: COLORS.cardBg
  },
  outlineActionBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700'
  },

  // Banners & Cards
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.successBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: 12
  },
  successBannerText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    flex: 1
  },
  facultyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  facultyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  facultyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  facultyAvatarText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13
  },
  facultyName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  facultyDesignation: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 1
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap'
  },
  deptBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder
  },
  deptBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  courseBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.successBorder
  },
  courseBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857'
  },
  facultyCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  facultyPhone: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  quickActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary
  },

  // Fallback Module View
  fallbackContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12
  },
  fallbackIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  fallbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textAlign: 'center',
    letterSpacing: 0.5
  },
  fallbackSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18
  },
  fallbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
    marginBottom: 8
  },
  fallbackBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#047857'
  }
});

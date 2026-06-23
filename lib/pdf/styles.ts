import { StyleSheet } from '@react-pdf/renderer';

export const colors = {
  primary: '#6366f1', // Matches app indigo/primary theme
  primaryLight: '#e0e7ff',
  text: '#1f2937', // gray-800
  textLight: '#6b7280', // gray-500
  border: '#e5e7eb', // gray-200
  background: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  cardBg: '#f9fafb', // gray-50
};

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: colors.background,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoSubtext: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: colors.textLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 15,
    borderRadius: 8,
    width: '48%',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 12,
    marginTop: 5,
    color: colors.text,
    fontWeight: 'bold',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  breakdownLabel: {
    fontSize: 11,
  },
  breakdownScore: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textNormal: {
    fontSize: 11,
    lineHeight: 1.5,
    color: colors.text,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 10,
    fontSize: 11,
    color: colors.primary,
  },
  listItemContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    color: colors.primary,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    color: colors.warning,
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
    color: colors.success,
  },
});

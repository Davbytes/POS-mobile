import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

/** A single row card replacing an HTML table row on mobile */
export default function TableCard({ children, style }) {
  return (
    <View style={[s.card, style]}>
      {children}
    </View>
  );
}

export function Row({ label, value, valueColor, right }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      {right
        ? right
        : <Text style={[s.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      }
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: { fontSize: font.sm, color: colors.gray600, flex: 1 },
  value: { fontSize: font.sm, fontWeight: '600', color: colors.gray800, textAlign: 'right', flex: 1 },
});

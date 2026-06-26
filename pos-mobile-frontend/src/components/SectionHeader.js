import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing } from '../theme';

export default function SectionHeader({ title, badge, badgeVariant = 'blue' }) {
  const badgeBg   = badgeVariant === 'red' ? colors.redLight  : colors.blueLight;
  const badgeText = badgeVariant === 'red' ? colors.red       : colors.blue;
  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      {badge != null && (
        <View style={[s.badge, { backgroundColor: badgeBg }]}>
          <Text style={[s.badgeText, { color: badgeText }]}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  title:     { fontSize: font.base, fontWeight: '700', color: colors.gray800 },
  badge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: font.sm, fontWeight: '600' },
});

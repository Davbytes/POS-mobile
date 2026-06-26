import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

const iconBg = {
  blue:   colors.blueLight,
  green:  colors.greenLight,
  amber:  colors.amberLight,
  purple: colors.purpleLight,
};

const iconColor = {
  blue:   colors.blue,
  green:  colors.green,
  amber:  colors.amber,
  purple: colors.purple,
};

export default function StatCard({ label, value, sub, variant = 'blue', icon }) {
  return (
    <View style={s.card}>
      <View style={[s.iconBox, { backgroundColor: iconBg[variant] }]}>
        <Text style={[s.iconText, { color: iconColor[variant] }]}>{icon}</Text>
      </View>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
      {sub && <Text style={s.sub}>{sub}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gray200,
    flex: 1,
    minWidth: 150,
  },
  iconBox: {
    width: 40, height: 40,
    borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconText: { fontSize: 18 },
  label: { fontSize: font.sm, fontWeight: '600', color: colors.gray400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  value: { fontSize: font.xxl, fontWeight: '800', color: colors.gray800, marginBottom: 2 },
  sub:   { fontSize: font.sm, color: colors.gray400 },
});

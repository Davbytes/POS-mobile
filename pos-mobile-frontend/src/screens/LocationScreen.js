import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { LOCATIONS } from '../data/mockData';
import { colors, spacing, radius, font } from '../theme';

export default function LocationScreen() {
  const [selected, setSelected] = useState(null);
  const { setLocation } = useLocation();

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.blue} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        <View style={s.logoRow}>
          <View style={s.logoBox}>
            <Text style={s.logoIcon}>🏪</Text>
          </View>
          <Text style={s.logoText}>POS Manager</Text>
        </View>

        <Text style={s.title}>Select your branch</Text>
        <Text style={s.sub}>Choose the location you're operating from today.</Text>

        <Text style={s.sectionLabel}>Available Branches</Text>

        {LOCATIONS.map(l => (
          <TouchableOpacity
            key={l.id}
            style={[s.branch, selected?.id === l.id && s.branchActive]}
            onPress={() => setSelected(l)}
            activeOpacity={0.7}
          >
            <View style={[s.dot, selected?.id === l.id && s.dotActive]} />
            <Text style={[s.branchText, selected?.id === l.id && s.branchTextActive]}>
              {l.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[s.btn, !selected && s.btnDisabled]}
          onPress={() => selected && setLocation(selected)}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={s.btnText}>Continue to Dashboard →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.blue },
  scroll: { flexGrow: 1, padding: spacing.xxl, justifyContent: 'center' },

  logoRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.xxl },
  logoBox:   { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  logoIcon:  { fontSize: 22 },
  logoText:  { fontSize: font.xl, fontWeight: '700', color: colors.white },

  title:        { fontSize: font.title, fontWeight: '800', color: colors.white, marginBottom: 6 },
  sub:          { fontSize: font.base, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.xxl },
  sectionLabel: { fontSize: font.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },

  branch: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: spacing.lg, borderRadius: radius.md,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.sm,
  },
  branchActive:     { borderColor: colors.white, backgroundColor: 'rgba(255,255,255,0.2)' },
  dot:              { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive:        { backgroundColor: colors.white },
  branchText:       { fontSize: font.base, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  branchTextActive: { color: colors.white, fontWeight: '700' },

  btn:         { marginTop: spacing.xxl, backgroundColor: colors.white, padding: spacing.lg, borderRadius: radius.md, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText:     { fontSize: font.base, fontWeight: '700', color: colors.blue },
});

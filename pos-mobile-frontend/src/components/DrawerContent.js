import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useLocation } from '../context/LocationContext';
import { colors, spacing, font, radius } from '../theme';

const NAV = [
  { name: 'Dashboard',  icon: '🏠' },
  { name: 'Products',   icon: '📦' },
  { name: 'Production', icon: '🏭' },
  { name: 'Purchases',  icon: '🛒' },
  { name: 'Reports',    icon: '📊' },
];

export default function DrawerContent({ state, navigation }) {
  const { location, setLocation } = useLocation();
  const activeRoute = state.routes[state.index].name;

  return (
    <DrawerContentScrollView style={s.drawer} contentContainerStyle={s.content}>

      {/* Header */}
      <View style={s.header}>
        <View style={s.logoBox}>
          <Text style={{ fontSize: 18 }}>🏪</Text>
        </View>
        <View>
          <Text style={s.appName}>POS Manager</Text>
          <Text style={s.locationName}>{location?.name?.split('–')[0]?.trim()}</Text>
        </View>
      </View>

      {/* Nav items */}
      <View style={s.nav}>
        {NAV.map(item => {
          const active = activeRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[s.navItem, active && s.navItemActive]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <Text style={s.navIcon}>{item.icon}</Text>
              <Text style={[s.navLabel, active && s.navLabelActive]}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <TouchableOpacity style={s.changeBranch} onPress={() => { navigation.closeDrawer(); setLocation(null); }}>
        <Text style={s.changeBranchText}>📍  Change Branch</Text>
      </TouchableOpacity>

    </DrawerContentScrollView>
  );
}

const s = StyleSheet.create({
  drawer:           { backgroundColor: colors.blue },
  content:          { flex: 1, paddingTop: 0 },
  header:           { flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.xl, paddingTop: spacing.xxl, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)', marginBottom: spacing.sm },
  logoBox:          { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  appName:          { fontSize: font.lg, fontWeight: '700', color: colors.white },
  locationName:     { fontSize: font.sm, color: 'rgba(255,255,255,0.7)' },
  nav:              { padding: spacing.sm },
  navItem:          { flexDirection: 'row', alignItems: 'center', gap: 12, padding: spacing.md, borderRadius: radius.sm, marginBottom: 2 },
  navItemActive:    { backgroundColor: 'rgba(255,255,255,0.2)' },
  navIcon:          { fontSize: 16 },
  navLabel:         { fontSize: font.base, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  navLabelActive:   { color: colors.white, fontWeight: '700' },
  changeBranch:     { margin: spacing.sm, padding: spacing.md, borderRadius: radius.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', marginTop: 'auto' },
  changeBranchText: { fontSize: font.sm, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
});

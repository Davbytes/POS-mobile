import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '@clerk/clerk-expo';
import { colors, spacing, font, radius } from '../theme';

const NAV = [
  { name: 'Dashboard',  icon: '🏠' },
  { name: 'Products',   icon: '📦' },
  { name: 'Production', icon: '🏭' },
  { name: 'Purchases',  icon: '🛒' },
  { name: 'Reports',    icon: '📊' },
];

export default function DrawerContent({ state, navigation, devBypass, setDevBypass }) {
  const locationCtx = useLocation();
  const { signOut, isSignedIn } = useAuth();

  // Guard: context or navigation state not ready yet
  if (!locationCtx || !state) return null;

  const { location, setLocation } = locationCtx;
  const activeRoute = state.routes[state.index]?.name ?? 'Dashboard';

  const handleSignOut = async () => {
    navigation.closeDrawer();
    if (devBypass) {
      // Dev bypass — just reset the flag, no Clerk session to clear
      setDevBypass(false);
    } else {
      await signOut();
    }
  };

  return (
    <DrawerContentScrollView style={s.drawer} contentContainerStyle={s.content}>

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View style={s.logoBox}>
          <Text style={{ fontSize: 18 }}>🏪</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.appName}>POS Manager</Text>
          <Text style={s.locationName}>{location?.name?.split('–')[0]?.trim()}</Text>
        </View>
      </View>

      {/* ── DEV BADGE ── */}
      {devBypass && (
        <View style={s.devBadge}>
          <Text style={s.devBadgeText}>⚡ DEV MODE — No Auth</Text>
        </View>
      )}

      {/* ── USER PILL ── */}
      {isSignedIn && !devBypass && (
        <View style={s.userPill}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>👤</Text>
          </View>
          <Text style={s.username} numberOfLines={1}>Signed In</Text>
        </View>
      )}

      {/* ── NAV ── */}
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

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.footerBtn}
          onPress={() => { navigation.closeDrawer(); setLocation(null); }}
        >
          <Text style={s.footerBtnText}>📍  Change Branch</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.footerBtn, s.logoutBtn]} onPress={handleSignOut}>
          <Text style={s.logoutText}>🚪  {devBypass ? 'Exit Dev Mode' : 'Sign Out'}</Text>
        </TouchableOpacity>
      </View>

    </DrawerContentScrollView>
  );
}

const s = StyleSheet.create({
  drawer:  { backgroundColor: colors.blue },
  content: { flex: 1 },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.xl, paddingTop: spacing.xxl, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)', marginBottom: spacing.sm },
  logoBox:      { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  appName:      { fontSize: font.lg, fontWeight: '700', color: colors.white },
  locationName: { fontSize: font.sm, color: 'rgba(255,255,255,0.7)' },

  devBadge:     { marginHorizontal: spacing.sm, marginBottom: spacing.sm, backgroundColor: 'rgba(251,191,36,0.15)', borderWidth: 1, borderColor: '#f59e0b', borderRadius: radius.sm, padding: spacing.sm, alignItems: 'center' },
  devBadgeText: { color: '#fbbf24', fontSize: font.sm, fontWeight: '700' },

  userPill:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: spacing.sm, marginBottom: spacing.sm, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.sm, padding: spacing.md },
  avatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: font.base },
  username:   { color: colors.white, fontWeight: '600', fontSize: font.sm, flex: 1 },

  nav:            { padding: spacing.sm, flex: 1 },
  navItem:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: spacing.md, borderRadius: radius.sm, marginBottom: 2 },
  navItemActive:  { backgroundColor: 'rgba(255,255,255,0.2)' },
  navIcon:        { fontSize: 16 },
  navLabel:       { fontSize: font.base, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  navLabelActive: { color: colors.white, fontWeight: '700' },

  footer:        { padding: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', marginTop: spacing.md },
  footerBtn:     { padding: spacing.md, borderRadius: radius.sm, marginBottom: 2 },
  footerBtnText: { fontSize: font.sm, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  logoutBtn:     { marginTop: 2 },
  logoutText:    { fontSize: font.sm, color: '#fca5a5', fontWeight: '600' },
});

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { LocationProvider, useLocation } from './src/context/LocationContext';
import LocationScreen    from './src/screens/LocationScreen';
import DashboardScreen   from './src/screens/DashboardScreen';
import ProductsScreen    from './src/screens/ProductsScreen';
import ProductionScreen  from './src/screens/ProductionScreen';
import PurchasesScreen   from './src/screens/PurchasesScreen';
import ReportsScreen     from './src/screens/ReportsScreen';
import DrawerContent     from './src/components/DrawerContent';
import { colors, font }  from './src/theme';

const Drawer = createDrawerNavigator();

function Header({ navigation, route }) {
  const hour    = new Date().getHours();
  const inShift = hour >= 8 && hour < 20;
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={s.menuBtn}>
        <Text style={s.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={s.headerTitle}>{route.name}</Text>
      <View style={s.shiftPill}>
        <View style={[s.dot, { backgroundColor: inShift ? colors.green : colors.gray400 }]} />
        <Text style={s.shiftText}>{inShift ? 'Shift On' : 'No Shift'}</Text>
      </View>
    </View>
  );
}

function MainApp() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={({ navigation, route }) => ({
          header: () => <Header navigation={navigation} route={route} />,
          drawerStyle: { width: 260 },
        })}
      >
        <Drawer.Screen name="Dashboard"  component={DashboardScreen}  />
        <Drawer.Screen name="Products"   component={ProductsScreen}   />
        <Drawer.Screen name="Production" component={ProductionScreen} />
        <Drawer.Screen name="Purchases"  component={PurchasesScreen}  />
        <Drawer.Screen name="Reports"    component={ReportsScreen}    />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function AppRouter() {
  const { location } = useLocation();
  return location ? <MainApp /> : <LocationScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <AppRouter />
      </LocationProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  header:      { backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  menuBtn:     { marginRight: 12 },
  menuIcon:    { fontSize: 22, color: colors.gray800 },
  headerTitle: { fontSize: font.lg, fontWeight: '700', color: colors.gray800, flex: 1 },
  shiftPill:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.gray100, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  dot:         { width: 7, height: 7, borderRadius: 4 },
  shiftText:   { fontSize: 11, color: colors.gray600, fontWeight: '600' },
});

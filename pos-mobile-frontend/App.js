import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import { tokenCache } from './src/api/tokenCache';

import LoginScreen      from './src/screens/LoginScreen';
import DashboardScreen  from './src/screens/DashboardScreen';
import ProductsScreen   from './src/screens/ProductsScreen';
import ProductionScreen from './src/screens/ProductionScreen';
import PurchasesScreen  from './src/screens/PurchasesScreen';
import ReportsScreen    from './src/screens/ReportsScreen';
import DrawerContent    from './src/components/DrawerContent';

const Drawer = createDrawerNavigator();

function RootNavigator({ devBypass, setDevBypass }) {
  const { isLoaded, isSignedIn } = useAuth();

  // Register the bypass function globally so LoginScreen button can call it
  global.__devBypass = () => setDevBypass(true);

  // Show spinner while Clerk loads session from SecureStore
  if (!isLoaded && !devBypass) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1161ee" />
      </View>
    );
  }

  // Not signed in and no dev bypass → show Login only
  if (!isSignedIn && !devBypass) {
    return (
      <Drawer.Navigator screenOptions={{ headerShown: false, swipeEnabled: false }}>
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
      </Drawer.Navigator>
    );
  }

  // Signed in OR dev bypass → show full app
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} devBypass={devBypass} setDevBypass={setDevBypass} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Dashboard"  component={DashboardScreen}  />
      <Drawer.Screen name="Products"   component={ProductsScreen}   />
      <Drawer.Screen name="Production" component={ProductionScreen} />
      <Drawer.Screen name="Purchases"  component={PurchasesScreen}  />
      <Drawer.Screen name="Reports"    component={ReportsScreen}    />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [devBypass, setDevBypass] = useState(false);

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <NavigationContainer>
        <RootNavigator devBypass={devBypass} setDevBypass={setDevBypass} />
      </NavigationContainer>
    </ClerkProvider>
  );
}

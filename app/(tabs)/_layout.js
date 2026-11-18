import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniPlayer from '../../src/components/MiniPlayer';
import { colors, TAB_HEIGHT } from '../../src/theme';

const icon = (on, off) => ({ color, focused }) => <Ionicons name={focused ? on : off} size={24} color={color} />;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const barH = TAB_HEIGHT + insets.bottom;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.line, height: barH, paddingTop: 6, paddingBottom: insets.bottom + 4 },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
        <Tabs.Screen name="home" options={{ title: 'Inicio', tabBarIcon: icon('home', 'home-outline') }} />
        <Tabs.Screen name="explore" options={{ title: 'Explorar', tabBarIcon: icon('compass', 'compass-outline') }} />
        <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: icon('heart', 'heart-outline') }} />
        <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: icon('person', 'person-outline') }} />
      </Tabs>
      <MiniPlayer bottom={barH + 8} />
    </View>
  );
}

import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, TAB_HEIGHT } from '../../src/theme';

// Interfaz de banda: distinta a la del oyente (panel de gestión, demos y cuenta de la banda).
const icon = (on, off) => ({ color, focused }) => <Ionicons name={focused ? on : off} size={24} color={color} />;

export default function BandLayout() {
  const insets = useSafeAreaInsets();
  const barH = TAB_HEIGHT + insets.bottom;
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.line, borderTopWidth: StyleSheet.hairlineWidth, height: barH, paddingTop: 6, paddingBottom: insets.bottom + 2 },
      sceneStyle: { backgroundColor: colors.bg },
    }}>
      <Tabs.Screen name="panel" options={{ title: 'Panel', tabBarIcon: icon('grid', 'grid-outline') }} />
      <Tabs.Screen name="demos" options={{ title: 'Demos', tabBarIcon: icon('musical-notes', 'musical-notes-outline') }} />
      <Tabs.Screen name="cuenta" options={{ title: 'Cuenta', tabBarIcon: icon('person-circle', 'person-circle-outline') }} />
    </Tabs>
  );
}

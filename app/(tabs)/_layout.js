import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniPlayer from '../../src/components/MiniPlayer';
import { TAB_HEIGHT, MINI_HEIGHT, useTheme } from '../../src/theme';

const icon = (on, off) => ({ color, focused }) => <Ionicons name={focused ? on : off} size={25} color={color} />;

export default function TabsLayout() {
  const { colors, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const barH = TAB_HEIGHT + insets.bottom;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarStyle: { position: 'absolute', backgroundColor: 'transparent', borderTopColor: colors.line, borderTopWidth: StyleSheet.hairlineWidth, height: barH, paddingTop: 6, paddingBottom: insets.bottom + 2, elevation: 0 },
        tabBarBackground: () => (
          <BlurView tint={dark ? 'dark' : 'light'} intensity={90} style={StyleSheet.absoluteFill}>
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.glass }} />
          </BlurView>
        ),
        sceneStyle: { backgroundColor: colors.bg },
      }}>
        <Tabs.Screen name="home" options={{ title: 'Escuchar', tabBarIcon: icon('play-circle', 'play-circle-outline') }} />
        <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: icon('albums', 'albums-outline') }} />
        <Tabs.Screen name="explore" options={{ title: 'Buscar', tabBarIcon: icon('search', 'search-outline') }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
      <MiniPlayer bottom={barH + 6} />
    </View>
  );
}

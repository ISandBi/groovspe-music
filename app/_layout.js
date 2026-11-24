import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store';
import Toast from '../src/components/Toast';
import SongSheet from '../src/components/SongSheet';
import YouTubeEngine from '../src/components/YouTubeEngine';
import { useTheme } from '../src/theme';

function Shell() {
  const { colors, dark } = useTheme();
  return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <StatusBar style={dark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
            <Stack.Screen name="queue" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="playlist/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="player" options={{ animation: 'slide_from_bottom', gestureEnabled: true, gestureDirection: 'vertical' }} />
            <Stack.Screen name="(band)" options={{ animation: 'fade' }} />
            <Stack.Screen name="learn/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="premium" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="band/[id]" options={{ animation: 'slide_from_right' }} />
          </Stack>
          <YouTubeEngine />
          <SongSheet />
          <Toast />
        </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Shell />
      </AppProvider>
    </SafeAreaProvider>
  );
}

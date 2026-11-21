import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store';
import Toast from '../src/components/Toast';
import SongSheet from '../src/components/SongSheet';
import YouTubeEngine from '../src/components/YouTubeEngine';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }}>
            <Stack.Screen name="queue" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="playlist/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="player" options={{ animation: 'slide_from_bottom', gestureEnabled: true, gestureDirection: 'vertical' }} />
            <Stack.Screen name="(band)" options={{ animation: 'fade' }} />
            <Stack.Screen name="band/[id]" options={{ animation: 'slide_from_right' }} />
          </Stack>
          <YouTubeEngine />
          <SongSheet />
          <Toast />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
